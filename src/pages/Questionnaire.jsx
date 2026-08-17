import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { createTranslator } from '../i18n/translations.js';
import { trackQuestionAnswered, trackQuestionSkipped, trackConceptOpened } from '../lib/analytics.js';
import QuestionCard from '../components/QuestionCard.jsx';
import PreQuizModal from '../components/PreQuizModal.jsx';
import DataControlsModal from '../components/DataControlsModal.jsx';
import VoteInfluencePrompt from '../components/VoteInfluencePrompt.jsx';
import { canLeaveQuestion, shouldOpenInfluencePrompt, resolveOpenPrompt } from '../engine/influenceGate.js';
import ConceptModal from '../components/ConceptModal.jsx';
import { questionHints } from '../data/questionHints.js';
import { QUESTION_EXPLANATIONS } from '../data/questionExplanations.js';
import { QUESTION_CONCEPTS, THEME_INTROS } from '../data/conceptMap.js';
import { THEME_COLORS } from '../data/questions.js';
import { NO_OPINION, isScorable } from '../engine/scorer.js';
import { QUESTIONNAIRE_VERSION } from '../engine/versions.js';
import { activeScoringVersion } from '../engine/scoringVersion.js';
import { attemptSession } from '../lib/attemptSession.js';
import { PURPOSES, needsCollectionDecision } from '../lib/consent.js';

export default function Questionnaire() {
  const language             = useStore(s => s.language);
  const recordCollectionConsent = useStore(s => s.recordCollectionConsent);
  const collectionConsent    = useStore(s => s.collectionConsent);
  const voteInfluence        = useStore(s => s.voteInfluence);
  const setVoteInfluence     = useStore(s => s.setVoteInfluence);
  const setVoteInfluenceDeclined = useStore(s => s.setVoteInfluenceDeclined);
  const questionsQueue       = useStore(s => s.questionsQueue);
  const currentIndex         = useStore(s => s.currentQuestionIndex);
  const answers              = useStore(s => s.answers);
  const answerQuestion       = useStore(s => s.answerQuestion);
  const nextQuestion         = useStore(s => s.nextQuestion);
  const prevQuestion         = useStore(s => s.prevQuestion);
  const finishQuestionnaire  = useStore(s => s.finishQuestionnaire);
  const navigate             = useStore(s => s.navigate);
  const improveMode          = useStore(s => s.improveMode);
  const stopImproveMode      = useStore(s => s.stopImproveMode);
  const nextImproveQuestion  = useStore(s => s.nextImproveQuestion);
  const resumeQuestionnaire  = useStore(s => s.resumeQuestionnaire);
  const discardQueue         = useStore(s => s.discardQueue);
  // Ne compte que les réponses exploitables : un « sans opinion » ne doit pas gonfler la progression affichée.
  const totalAnswered        = Object.keys(answers).filter(id => isScorable(answers[id])).length;
  const t = createTranslator(language);

  // Les CONSEILS d'usage sont propres à la session : les revoir ne coûte rien.
  const [showDataControls, setShowDataControls] = useState(false);
  const [tipsSeen, setTipsSeen] = useState(() => {
    try { return sessionStorage.getItem('prequiz_seen') === '1'; } catch { return false; }
  });

  // ⚠ La DÉCISION de collecte, elle, est persistée et ne se redemande que si elle n'existe
  // pas ou si le texte a changé. La brancher sur `sessionStorage` faisait redemander à chaque
  // session et réécrivait une décision déjà prise à chaque clic.
  const askConsent = needsCollectionDecision(collectionConsent, { language });
  const introSeen = tipsSeen && !askConsent;

  /**
   * État de la PREUVE de consentement — distinct du choix local et de l'autorisation d'émettre.
   *
   *   `idle`        — aucune décision prise dans cette session ;
   *   `sending`     — la preuve part, on attend la réponse ;
   *   `confirmed`   — le serveur a accusé réception ; la collecte peut commencer ;
   *   `pending`     — hors ligne : la preuve est en file durable, elle repartira seule ;
   *   `unpersisted` — hors ligne ET stockage indisponible : elle ne survivra pas à l'onglet ;
   *   `none`        — rien à transmettre (refus sans corpus, ou finalité sans flux serveur).
   *
   * ⚠ Dans TOUS ces cas le questionnaire fonctionne. C'est la transmission qui attend, jamais
   * le produit — et l'écran le dit, au lieu de laisser croire que tout est parti.
   */
  const [proofState, setProofState] = useState('idle');

  // ── Question slide direction (1 = forward, -1 = backward) ──
  const directionRef = useRef(1);

  // ── Auto-advance timer ──
  const autoAdvanceTimer = useRef(null);

  // Question dont la demande d'influence est OUVERTE. Tant qu'elle l'est, l'auto-avance est
  // suspendue : sinon la demande disparaîtrait avant d'avoir été lue, ce qui reviendrait à ne
  // pas la poser du tout.
  const [influencePromptFor, setInfluencePromptFor] = useState(null);

  // ── Concept modal ──
  const [activeConceptKey, setActiveConceptKey] = useState(null);

  // ── Theme transition banner ──
  const prevThemeRef = useRef(null);
  const [themeIntro, setThemeIntro] = useState(null); // { theme, icon, text }

  // ── Dérivations UNIQUES, avant tout hook qui les consomme ─────────────────
  //
  // ⚠ Ces trois valeurs étaient déclarées APRÈS le `return` conditionnel de la file vide, et
  // l'effet ci-dessous les lisait depuis le haut du composant. Le tableau de dépendances
  // étant évalué à chaque rendu, toute ouverture du quiz levait « Cannot access 'question'
  // before initialization » : le questionnaire était entièrement cassé, sans que la
  // compilation ni la suite ne le voient.
  //
  // Elles doivent rester ici : tous les hooks précèdent le premier `return` conditionnel, et
  // les redéclarer plus bas recréerait la même zone temporelle morte.
  const queueLength   = questionsQueue?.length ?? 0;
  const question      = (queueLength > 0 && currentIndex >= 0)
    ? (questionsQueue[currentIndex] ?? null)
    : null;
  const currentAnswer = question ? (answers[question.id] ?? null) : null;

  // La demande est RECALÉE sur la question réellement affichée. Sans cela, un rechargement
  // sur une question marquée déjà répondue n'affichait plus rien, et un `influencePromptFor`
  // laissé sur une question précédente pouvait geler la navigation ailleurs.
  useEffect(() => {
    setInfluencePromptFor(resolveOpenPrompt({ question, currentAnswer, voteInfluence }));
  }, [question?.id, currentAnswer, voteInfluence]);

  /**
   * Décision de collecte prise à l'entrée du questionnaire.
   *
   * ⚠ `accepted` est TOUJOURS un booléen explicite : l'écran n'offre pas de sortie neutre.
   * Enregistrer un refus est aussi important qu'enregistrer un accord — sans lui, on ne
   * saurait pas distinguer « a refusé » de « n'a pas encore été interrogé », et l'écran
   * réapparaîtrait indéfiniment.
   *
   * Seules les finalités réellement décrites par cet écran sont enregistrées.
   * `cloud_save` en est absente : elle transporte un identifiant de compte et se demande
   * ailleurs. L'inclure ici fabriquerait un accord à un texte jamais présenté.
   */
  const handleIntroStart = async (accepted) => {
    // Le questionnaire démarre TOUT DE SUITE : la preuve de consentement se règle en
    // arrière-plan, elle ne doit jamais faire attendre la personne.
    try { sessionStorage.setItem('prequiz_seen', '1'); } catch {}
    setTipsSeen(true);

    // `null` = la question n'était pas posée (décision déjà en cours de validité). On
    // n'écrit RIEN : réenregistrer effacerait la date et la provenance de la décision réelle.
    if (accepted !== true && accepted !== false) return;

    // ⚠ LA PROMESSE EST ATTENDUE, ET SON ÉTAT EST TENU (P0-2 du contre-audit du 2026-08-14).
    // Elle était auparavant lancée et abandonnée : personne ne savait si la preuve était
    // partie, et l'interface se comportait comme si oui.
    setProofState(accepted ? 'sending' : 'none');
    try {
      const issue = await recordCollectionConsent({ [PURPOSES.POLITICAL_ANALYTICS]: accepted }, { language });
      setProofState(accepted ? (issue?.proof?.state ?? 'pending') : 'none');
    } catch {
      // Le questionnaire reste utilisable ; seule la TRANSMISSION est suspendue.
      setProofState(accepted ? 'pending' : 'none');
    }
  };

  // ── Reprise après rechargement ──
  // `onRehydrateStorage` tente déjà la reprise ; cet effet couvre l'accès direct à /quiz
  // avant que la réhydratation n'ait eu lieu, et fournit le motif à afficher en cas d'échec.
  const [resumeState, setResumeState] = useState(null);
  useEffect(() => {
    if (questionsQueue && questionsQueue.length > 0) { setResumeState({ resumed: true }); return; }
    setResumeState(resumeQuestionnaire());
  }, [questionsQueue, resumeQuestionnaire]);

  // ⚠ TOUS les hooks doivent être appelés AVANT le `return` conditionnel plus bas.
  //
  // `useEffect(cleanup)` et `useStore(s => s.testMode)` vivaient APRÈS ce return : quand la
  // file était vide au premier rendu (accès direct à /quiz, avant réhydratation), React
  // enregistrait moins de hooks, puis un de plus au rendu suivant. L'indexation des hooks se
  // décalait et l'abonnement au store se figeait : `question` restait bloqué sur la première
  // question de la file. Symptôme observé en navigateur — à l'index 4, répondre écrivait la
  // réponse sur `ECO_8`, la question 1.
  const testMode = useStore(s => s.testMode);

  // Purge le minuteur d'auto-avance quand la question change (navigation manuelle).
  useEffect(() => {
    return () => clearTimeout(autoAdvanceTimer.current);
  }, [currentIndex]);

  // ── Mesure du temps par question ─────────────────────────────────────────
  //
  // Branche la pause automatique sur la visibilité de l'onglet et la reprise de la file
  // au retour du réseau. Le désabonnement est indispensable : sans lui, deux passations
  // successives empileraient deux jeux d'écouteurs et chaque question serait comptée deux
  // fois.
  useEffect(() => attemptSession.attach(), []);

  // Ouvre (ou reprend) la passation dès que la file est connue. Rien n'est TRANSMIS ici :
  // `attemptSession` n'émet qu'une fois `political_analytics` accordé.
  useEffect(() => {
    if (queueLength === 0 || !testMode) return;
    attemptSession.begin({
      mode: testMode,
      questionnaireVersion: QUESTIONNAIRE_VERSION,
      scoringVersion: activeScoringVersion(),
      language,
    });
  }, [queueLength, testMode, language]);

  // La question devient visible ⇒ le chronomètre démarre. Au démontage (changement de
  // question, sortie de page), il s'arrête et le cumul est soldé.
  const currentQuestionId = (questionsQueue && questionsQueue.length > 0)
    ? questionsQueue[currentIndex]?.id
    : null;
  useEffect(() => {
    if (!currentQuestionId) return undefined;
    attemptSession.showQuestion(currentQuestionId, currentIndex);
    return () => { attemptSession.timer.hide(); };
  }, [currentQuestionId, currentIndex]);

  // Une modale COUVRE réellement la question : le temps passé dessus n'est pas du temps de
  // réflexion sur l'énoncé, il ne doit pas être compté.
  useEffect(() => {
    if (activeConceptKey) attemptSession.block('modal:concept');
    else attemptSession.unblock('modal:concept');
  }, [activeConceptKey]);

  useEffect(() => {
    if (!introSeen) attemptSession.block('modal:prequiz');
    else attemptSession.unblock('modal:prequiz');
  }, [introSeen]);

  useEffect(() => {
    if (themeIntro) attemptSession.block('banner:theme');
    else attemptSession.unblock('banner:theme');
  }, [themeIntro]);

  // Detect theme change and show chapter transition banner.
  // V4: removed 3-second auto-timeout. Banner now stays visible until:
  //   (1) user answers the first question of the new theme, or
  //   (2) user manually clicks ✕.
  // Must be before early return to satisfy Rules of Hooks.
  const currentQuestion = (questionsQueue && questionsQueue.length > 0) ? questionsQueue[currentIndex] : null;
  useEffect(() => {
    if (!currentQuestion) return;
    const currentTheme = currentQuestion.theme;
    if (prevThemeRef.current !== null && prevThemeRef.current !== currentTheme) {
      const intro = THEME_INTROS[currentTheme];
      if (intro) {
        setThemeIntro({
          theme:   currentTheme,
          icon:    intro.icon,
          chapter: intro.chapter?.[language] ?? intro.chapter?.fr ?? currentTheme,
          text:    intro[language] ?? intro.fr,
        });
        prevThemeRef.current = currentTheme;
        return; // no timer — banner persists until first answer or manual close
      }
    }
    prevThemeRef.current = currentTheme;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestion?.id]);

  if (!questionsQueue || questionsQueue.length === 0) {
    // La reprise elle-même est tentée dans l'effet ci-dessus (jamais pendant le rendu :
    // muter le store depuis le corps d'un composant provoquerait une boucle de rendu).
    // Tant qu'elle n'a pas répondu, on n'affiche rien plutôt qu'un message erroné.
    if (!resumeState) return null;
    if (resumeState.resumed) return null;

    const REASONS = {
      fr: {
        no_queue: 'Aucun questionnaire en cours sur cet appareil.',
        questionnaire_version_changed: 'Le questionnaire a été mis à jour depuis votre dernière session : la file précédente ne peut pas être reprise à l’identique. Vos réponses déjà données sont conservées.',
        queue_algorithm_changed: 'La façon de composer le questionnaire a changé depuis votre dernière session : la file précédente ne peut pas être reprise à l’identique. Vos réponses déjà données sont conservées.',
        questions_missing: 'Certaines questions de votre session n’existent plus dans le questionnaire actuel. Vos réponses déjà données sont conservées.',
      },
      en: {
        no_queue: 'No questionnaire in progress on this device.',
        questionnaire_version_changed: 'The questionnaire has been updated since your last session, so the previous queue cannot be resumed exactly. Your existing answers are kept.',
        queue_algorithm_changed: 'The way the questionnaire is assembled has changed since your last session, so the previous queue cannot be resumed exactly. Your existing answers are kept.',
        questions_missing: 'Some questions from your session no longer exist in the current questionnaire. Your existing answers are kept.',
      },
    };
    const dict = REASONS[language] ?? REASONS.en;

    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <p className="text-slate-600 mb-6 leading-relaxed">
          {dict[resumeState.reason] ?? dict.no_queue}
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => { discardQueue(); navigate('selectTest'); }}
            className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm hover:bg-blue-700 transition-colors"
          >
            {language === 'fr' ? 'Recommencer un questionnaire' : 'Start a new questionnaire'}
          </button>
          <button
            onClick={() => navigate('landing')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 transition-colors"
          >
            ← {t('back')}
          </button>
        </div>
      </div>
    );
  }

  const total    = queueLength;
  const isLast   = currentIndex === total - 1;
  const hasAnswer = currentAnswer != null;

  /* Progression en segments (inspired by 21st.dev segmented steps) */
  const progressPct = total > 0
    ? Math.round(((currentIndex + (hasAnswer ? 1 : 0)) / total) * 100)
    : 0;

  const handleAnswer = (val) => {
    if (!question) return;
    const wasAnswered = currentAnswer != null;
    answerQuestion(question.id, val);
    // Chronométrage + mise en file. La MESURE est toujours faite ; seule la TRANSMISSION
    // dépend du consentement, et c'est `attemptSession` qui l'arbitre.
    attemptSession.recordAnswer(question.id, 'answered', val);
    // Dismiss chapter banner on first answer of the new theme (V4)
    if (themeIntro && !wasAnswered) setThemeIntro(null);
    // Auto-advance 600ms after first answer — don't fire if already answered (re-selection)
    // Question marquée : on ouvre la demande d'influence et on NE lance pas l'auto-avance.
    // La navigation reprendra à la réponse, ou au « je préfère ne pas répondre ».
    if (shouldOpenInfluencePrompt({ question, currentAnswer: val, voteInfluence })) {
      setInfluencePromptFor(question.id);
    }
    if (!wasAnswered) {
      trackQuestionAnswered({
        questionId:    question.id,
        theme:         question.theme,
        value:         val,
        questionIndex: currentIndex,
        mode:          testMode,
        isImprove:     improveMode,
      });
      clearTimeout(autoAdvanceTimer.current);
      // ⚠ Aucune auto-avance sur une question marquée tant que la demande n'est pas traitée.
      if (shouldOpenInfluencePrompt({ question, currentAnswer: val, voteInfluence })) return;
      autoAdvanceTimer.current = setTimeout(() => {
        directionRef.current = 1;
        if (improveMode) nextImproveQuestion();
        else if (isLast) finishQuestionnaire();
        else nextQuestion();
      }, 600);
    }
  };

  /** Vrai quand la demande d'influence bloque la sortie de la question courante. */
  const influenceBlocks = !canLeaveQuestion({ question, currentAnswer, voteInfluence });

  const handleNext = () => {
    // ⚠ Garde OBLIGATOIRE dans le gestionnaire : `disabled` ne protège pas d'un double clic,
    // d'un minuteur d'auto-avance périmé ni d'un appel déclenché pendant l'animation.
    if (influenceBlocks) return;
    clearTimeout(autoAdvanceTimer.current);
    directionRef.current = 1;
    if (improveMode) {
      nextImproveQuestion();
    } else if (isLast) {
      finishQuestionnaire();
    } else {
      nextQuestion();
    }
  };

  const handleSkip = () => {
    clearTimeout(autoAdvanceTimer.current);
    directionRef.current = 1;
    if (question) {
      // « Je ne sais pas » est désormais ENREGISTRÉ comme tel (NO_OPINION), au lieu de
      // laisser simplement la question sans réponse. Deux raisons :
      //   • la couverture peut distinguer « posée, sans opinion » de « jamais posée » ;
      //   • la question n'est pas resservie indéfiniment en mode approfondissement.
      // Cette valeur n'entre dans AUCUNE moyenne (voir isScorable dans engine/scorer.js) :
      // elle n'est pas convertie en position centrale, contrairement au bouton « 3 ».
      // Un seul état d'inconnu est conservé — « passer » et « sans opinion » ne sont pas
      // distingués, par minimisation des données.
      answerQuestion(question.id, NO_OPINION);
      // « Sans opinion » est un ÉTAT transmis comme tel (`response_state = 'no_opinion'`,
      // `answer_value` nul), pas une suppression de ligne. C'est la correction de fond du
      // modèle historique, où « sans opinion » était indiscernable de « jamais posée ».
      attemptSession.recordAnswer(question.id, 'no_opinion', null);
      trackQuestionSkipped({
        questionId:    question.id,
        theme:         question.theme,
        questionIndex: currentIndex,
        mode:          testMode,
      });
    }
    if (isLast) finishQuestionnaire();
    else nextQuestion();
  };

  /** Avance après traitement de la demande d'influence. */
  const advanceAfterPrompt = () => {
    setInfluencePromptFor(null);
    clearTimeout(autoAdvanceTimer.current);
    autoAdvanceTimer.current = setTimeout(() => {
      directionRef.current = 1;
      if (improveMode) nextImproveQuestion();
      else if (isLast) finishQuestionnaire();
      else nextQuestion();
    }, 400);
  };

  // ⚠ La cible est la question pour laquelle la demande a été OUVERTE, pas `question.id` lu au
  // moment du clic. Vérification navigateur du 2026-08-11 : pendant la transition vers la
  // question suivante, un clic écrivait l'influence sur la question PRÉCÉDENTE. Lier le
  // gestionnaire à `influencePromptFor` supprime toute la classe de bug.
  const handleInfluenceChoice = (level) => {
    const target = influencePromptFor ?? question?.id;
    if (!target) return;
    setVoteInfluence(target, level);
    advanceAfterPrompt();
  };

  /** « Je préfère ne pas répondre » : influence NON RENSEIGNÉE, pas `none`. */
  const handleInfluenceSkip = () => {
    const target = influencePromptFor ?? question?.id;
    if (!target) return;
    setVoteInfluenceDeclined(target);
    advanceAfterPrompt();
  };

  const handlePrev = () => {
    clearTimeout(autoAdvanceTimer.current);
    directionRef.current = -1;
    prevQuestion();
  };

  return (
    <>
      <AnimatePresence>
        {!introSeen && !improveMode && (
          <PreQuizModal language={language} onStart={handleIntroStart} askConsent={askConsent} />
        )}
      </AnimatePresence>

      {/* ── Concept modal ── */}
      {/* Note: onGoToArticle intentionally omitted — navigating away would exit the quiz */}
      <AnimatePresence>
        {activeConceptKey && (
          <ConceptModal
            key={activeConceptKey}
            conceptKey={activeConceptKey}
            language={language}
            onClose={() => setActiveConceptKey(null)}
          />
        )}
      </AnimatePresence>

      <div className="min-h-[calc(100vh-56px)] bg-slate-50 flex flex-col">

        {/* ── Barre de progression sticky ── */}
        <div className="bg-white border-b border-slate-200 px-4 py-3 sticky top-14 z-30">
          <div className="max-w-2xl mx-auto">
            {improveMode ? (
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-semibold text-blue-600 shrink-0">{t('improve_title')}</span>
                </div>
                <span className="text-xs text-slate-400 tabular-nums shrink-0">
                  {language === 'fr'
                    ? `${totalAnswered} réponse${totalAnswered > 1 ? 's' : ''}`
                    : `${totalAnswered} answer${totalAnswered !== 1 ? 's' : ''}`}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                {/* Numéro question */}
                <span className="text-xs font-semibold text-slate-500 tabular-nums w-16 shrink-0">
                  {currentIndex + 1} / {total}
                </span>

                {/* Barre segmentée — 10 segments visuels */}
                <div className="flex-1 flex gap-0.5 h-1.5">
                  {Array.from({ length: 10 }).map((_, i) => {
                    const segThreshold = ((i + 1) / 10) * 100;
                    const isFilled = progressPct >= segThreshold;
                    const isCurrent = !isFilled && progressPct >= (i / 10) * 100;
                    return (
                      <div
                        key={i}
                        className="flex-1 rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: isFilled
                            ? '#2563EB'
                            : isCurrent
                            ? '#BFDBFE'
                            : '#E2E8F0',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Pourcentage */}
                <span className="text-xs font-medium text-slate-400 tabular-nums w-9 text-right shrink-0">
                  {progressPct}%
                </span>
              </div>
            )}

            {/* ── État de la PREUVE de consentement ──────────────────────────
                ⚠ Ni « envoyé », ni silence. Tant que le serveur n'a pas accusé réception,
                les réponses restent sur l'appareil — et on le dit, plutôt que de laisser
                croire que la collecte a commencé. */}
            {(proofState === 'pending' || proofState === 'unpersisted') && (
              <p
                data-testid="consent-proof-state"
                data-proof-state={proofState}
                className="text-[11px] leading-snug text-amber-700 mt-1.5"
              >
                {proofState === 'pending'
                  ? (language === 'fr'
                    ? 'Votre accord n’a pas encore pu être enregistré sur nos serveurs. Vos réponses restent sur cet appareil ; l’envoi reprendra seul au retour du réseau.'
                    : 'Your consent could not be recorded on our servers yet. Your answers stay on this device; sending resumes on its own when the network returns.')
                  : (language === 'fr'
                    ? 'Votre accord n’a pas pu être enregistré, et cet appareil ne peut pas le conserver : il ne survivra pas à la fermeture de l’onglet. Vos réponses restent locales.'
                    : 'Your consent could not be recorded, and this device cannot store it: it will not survive closing this tab. Your answers stay local.')}
              </p>
            )}
          </div>
        </div>

        {/* ── Chapter transition banner ─────────────────────────────────────────
            V4: redesigned from notification toast to chapter-opening card.
            - Left accent border in theme color (chapter marker)
            - Two-line hierarchy: CHAPTER NAME → framing question
            - No auto-timeout: stays until user answers first question or clicks ✕
        ────────────────────────────────────────────────────────────────────── */}
        <AnimatePresence>
          {themeIntro && (
            <motion.div
              className="mt-4 px-4 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0,   height: 'auto' }}
              exit={{    opacity: 0, y: -6,   height: 0 }}
              transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <div
                className="flex items-start gap-3.5 px-4 py-3.5 rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden"
                style={{ borderLeft: `3px solid ${THEME_COLORS[themeIntro.theme] ?? '#2563eb'}` }}
              >
                {/* Icon */}
                <span className="text-xl flex-shrink-0 mt-0.5 leading-none">{themeIntro.icon}</span>

                {/* Text hierarchy */}
                <div className="flex-1 min-w-0">
                  <p
                    className="text-[10px] font-bold uppercase tracking-widest mb-1 leading-none"
                    style={{ color: THEME_COLORS[themeIntro.theme] ?? '#2563eb' }}
                  >
                    {themeIntro.chapter}
                  </p>
                  <p className="text-sm font-medium text-slate-800 leading-snug">
                    {themeIntro.text}
                  </p>
                </div>

                {/* Dismiss */}
                <button
                  onClick={() => setThemeIntro(null)}
                  className="text-slate-300 hover:text-slate-500 transition-colors flex-shrink-0 p-0.5 mt-0.5 min-w-[24px] min-h-[24px] flex items-center justify-center"
                  aria-label="Fermer"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Question card — animated slide between questions ── */}
        <div className="flex-1 flex flex-col items-center justify-start pt-8 pb-28 px-4 overflow-hidden">
          <AnimatePresence
            mode="wait"
            custom={directionRef.current}
          >
            {question && (
              <motion.div
                key={question.id}
                custom={directionRef.current}
                variants={{
                  enter: (d) => ({ opacity: 0, x: d * 28, scale: 0.98 }),
                  center: { opacity: 1, x: 0, scale: 1 },
                  exit: (d) => ({ opacity: 0, x: d * -20, scale: 0.98 }),
                }}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="w-full max-w-2xl"
              >
                <QuestionCard
                  question={
                    QUESTION_EXPLANATIONS[question.id]
                      ? { ...question, info: QUESTION_EXPLANATIONS[question.id] }
                      : questionHints[question.id]
                      ? { ...question, info: questionHints[question.id] }
                      : question.explanation
                      ? { ...question, info: question.explanation }
                      : question
                  }
                  currentAnswer={currentAnswer}
                  onAnswer={handleAnswer}
                  onSkip={improveMode ? undefined : handleSkip}
                  language={language}
                  // "Pour aller plus loin" is suppressed once a question has been migrated to
                  // inline Academy terms (QUESTION_EXPLANATIONS) — otherwise the same concept
                  // could appear both inline and as a separate card underneath, duplicated.
                  concepts={QUESTION_EXPLANATIONS[question.id] ? [] : (QUESTION_CONCEPTS[question.id] ?? [])}
                  onConceptClick={(key) => {
                    trackConceptOpened({ conceptKey: key, questionIndex: currentIndex });
                    setActiveConceptKey(key);
                  }}
                  attemptId={attemptSession.attemptId}
                  originScreen={improveMode ? 'improve' : 'questionnaire'}
                  onReportOpenChange={(open) => {
                    if (open) attemptSession.block('modal:report');
                    else attemptSession.unblock('modal:report');
                  }}
                />
                {question.voteInfluencePrompt
                  && influencePromptFor === question.id
                  && currentAnswer != null && (
                  <VoteInfluencePrompt
                    language={language}
                    value={voteInfluence?.[question.id]?.level ?? null}
                    onChoose={handleInfluenceChoice}
                    onSkip={handleInfluenceSkip}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ⚠ ACCÈS AUX DONNÉES PENDANT LE QUIZ.
            « Vous pouvez changer d'avis à tout moment » était faux tant que la commande
            n'existait que sur la page Profil : il fallait terminer le questionnaire pour
            pouvoir retirer son accord à la collecte de ce même questionnaire. */}
        <div className="max-w-2xl mx-auto px-4 pb-24 text-center">
          <button
            type="button"
            data-testid="open-data-controls-quiz"
            onClick={() => setShowDataControls(true)}
            className="text-[11px] text-slate-400 hover:text-slate-600 underline underline-offset-2 transition-colors"
          >
            {language === 'fr' ? 'Mes données et confidentialité' : 'My data and privacy'}
          </button>
        </div>
        {showDataControls && <DataControlsModal onClose={() => setShowDataControls(false)} />}

        {/* ── Navigation bas ── */}
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-slate-200 px-4 py-2 z-30">
          <div className="max-w-2xl mx-auto flex items-center gap-2">
            {improveMode ? (
              <>
                <button
                  onClick={stopImproveMode}
                  className="min-h-[56px] px-4 rounded-xl border border-slate-200 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  {t('improve_stop')}
                </button>
                <button
                  onClick={handleNext}
                  disabled={!hasAnswer || influenceBlocks}
                  className={`ml-auto min-h-[56px] px-6 rounded-xl font-semibold text-sm transition-colors ${
                    hasAnswer && !influenceBlocks
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {t('improve_next')} →
                </button>
              </>
            ) : (
              <>
                {/* Retour */}
                <button
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className={`min-h-[56px] min-w-[56px] rounded-xl border text-sm font-medium transition-colors flex items-center justify-center ${
                    currentIndex === 0
                      ? 'border-slate-100 text-slate-300 cursor-not-allowed bg-white'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50 bg-white'
                  }`}
                  aria-label={t('q_prev')}
                >
                  <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                    <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                {/* Suivant / Terminer */}
                <button
                  onClick={handleNext}
                  disabled={!hasAnswer || influenceBlocks}
                  className={`ml-auto min-h-[56px] px-6 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
                    hasAnswer && !influenceBlocks
                      ? isLast
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  {isLast ? (
                    <>
                      {t('q_finish')}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8l4 4 6-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  ) : (
                    <>
                      {t('q_next')}
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>
              </>
            )}
          </div>
        </div>

      </div>
    </>
  );
}

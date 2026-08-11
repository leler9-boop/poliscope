// POLISCOP — Zustand Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { calculateProfile, isScorable, NO_OPINION } from '../engine/scorer.js';
// Sélection contrôlée v1/v2 : le drapeau vit dans scoringVersion.js, jamais dans l'appelant.
import { calculateActiveProfile, profileAnsweredCount } from '../engine/scoringVersion.js';
import { generateSeed } from '../engine/rng.js';
import { parseImport } from '../engine/importSchema.js';
import { currentVersions, EXPORT_FORMAT_VERSION, QUESTIONNAIRE_VERSION, QUEUE_ALGORITHM_VERSION } from '../engine/versions.js';
import { THEMES_ORDER, getQuestionQueue, getQuestionsByIds, questions as allQuestions } from '../data/questions.js';
import { createTranslator } from '../i18n/translations.js';
import { supabase, isSupabaseEnabled } from '../lib/supabase.js';
import { setMeasurementConsent } from '../lib/anonymous.js';
import { normalizeConsent } from '../lib/consent.js';
import {
  normalizeThemeImportance, PRIORITY_SOURCE, VOTE_INFLUENCE_MULTIPLIER,
} from '../engine/priorityWeights.js';
import { toCloudAnswerRow, cloudAnsweredCount } from '../lib/cloudAnswers.js';
import { routerNavigate, PAGE_TO_PATH } from '../lib/router.js';
import {
  trackTestStart,
  trackTestComplete,
  trackImproveStarted,
  trackImproveCompleted,
  trackRetakeStarted,
} from '../lib/analytics.js';

// Consent text version — bump this if the consent copy shown to users changes
// materially, so previously-granted consent can be distinguished from consent
// to the current wording (mirrors user_consents.version in schema_v3.sql).
export const CONSENT_VERSION = '2026-07';

/**
 * Répercute une décision de consentement sur la collecte réelle.
 *
 * Sans ce pont, le consentement resterait un état d'interface : la file de mutations
 * continuerait d'émettre après un retrait, et l'identifiant pseudonyme resterait déposé
 * sur le terminal. C'est le point où « consentement révocable » devient vrai dans le code
 * et pas seulement dans le texte affiché.
 *
 * Importé paresseusement : `attemptSession` tire `ingestClient` → `import.meta.env`, que le
 * ESM natif de Node ne fournit pas. Les tests d'intégration du store doivent pouvoir
 * l'importer sans navigateur.
 */
function syncAttemptConsent(consent, state) {
  import('../lib/attemptSession.js')
    .then(({ attemptSession }) => {
      attemptSession.setConsent(effectiveConsent(consent, state?.collectionConsent), {
        userId: state?.userId ?? null,
        language: state?.language ?? 'fr',
      });
    })
    .catch(() => { /* module indisponible (test unitaire) : l'état local reste la référence */ });
}

/**
 * État de consentement RÉEL : l'ancien état à deux champs, complété par les décisions
 * prises sous le texte courant.
 *
 * Les deux sources coexistent volontairement pendant la migration. `consent` porte les
 * décisions héritées (sauvegarde compte, mesure d'audience) avec leur version d'origine ;
 * `collectionConsent` porte les décisions prises sous le texte 2026-08, chacune avec sa
 * propre empreinte. Écraser l'un par l'autre reviendrait à réécrire une preuve.
 *
 * @param {object} legacy            état hérité `{politicalData, measurement, ...}`
 * @param {object|null} collection   décisions par finalité prises sous le texte courant
 */
export function effectiveConsent(legacy, collection) {
  const base = normalizeConsent(legacy);
  if (!collection) return base;
  const merged = { ...base };
  for (const [purpose, decision] of Object.entries(collection)) {
    if (decision) merged[purpose] = decision;
  }
  return merged;
}

/**
 * Pick the next question for improve mode.
 * Prefers unanswered questions; avoids repeating the last 3 themes.
 */
function pickNextQuestion(answers, recentThemes = []) {
  const unanswered = allQuestions.filter(q => answers[q.id] == null);
  const pool = unanswered.length > 0 ? unanswered : allQuestions;
  // Avoid repeating same theme as last 3 picks
  const preferred = pool.filter(q => !recentThemes.slice(-3).includes(q.theme));
  const source = preferred.length > 0 ? preferred : pool;
  return source[Math.floor(Math.random() * source.length)];
}

// Clé localStorage historique (ancienne orthographe) : ne PAS renommer, elle identifie
// les données déjà écrites dans les navigateurs des utilisateurs existants.
const OLD_STORAGE_KEY = 'poliscope_state'; // brand-check:allow
const STORAGE_KEY = 'poliscop_state';

// Migrate localStorage data from old key to new key (runs once)
// Wrapped in try/catch: Safari private browsing throws SecurityError on any localStorage access
try {
  if (typeof localStorage !== 'undefined') {
    if (localStorage.getItem(OLD_STORAGE_KEY) && !localStorage.getItem(STORAGE_KEY)) {
      localStorage.setItem(STORAGE_KEY, localStorage.getItem(OLD_STORAGE_KEY));
    }
    localStorage.removeItem(OLD_STORAGE_KEY);
  }
} catch {
  // Safari private browsing — localStorage unavailable, app runs in guest mode
}

function detectLanguage() {
  return 'fr';
}

export const useStore = create(
  persist(
    (set, get) => ({
      // ── App state ──
      language: detectLanguage(),
      currentPage: 'landing',

      // ── Test state ──
      testMode: null,
      questionsQueue: [],
      currentQuestionIndex: 0,

      // ── Answers & profile ──
      answers: {},
      priorityOrder: [...THEMES_ORDER],
      profile: null,

      // ── Auth state (session-only, synced from auth.jsx) ──
      userId: null,
      userEmail: null,

      // ── Improve mode (session-only, not persisted) ──
      improveMode: false,
      recentThemes: [],

      // ── Migration (session-only) ──
      pendingMigration: false,

      // ── Onboarding (session-only) ──
      needsOnboarding: false,

      // ── RGPD consent for storing/transmitting political-opinion data (persisted) ──
      // politicalData: null = never decided (default — nothing is sent anywhere) |
      //                true = granted | false = explicitly declined.
      // This is the single gate checked before any Supabase write of answers,
      // computed profile, or archetype/candidate-carrying analytics events.
      // measurement : consentement DISTINCT à la mesure d'audience (identifiant persistant
      // dans localStorage + événements de parcours). null = non décidé ⇒ aucune collecte et
      // aucun UUID déposé. Séparé de politicalData : accepter l'analyse de ses opinions ne
      // vaut pas acceptation d'un traceur, et inversement.
      consent: { politicalData: null, measurement: null, grantedAt: null, version: null },

      // ── Profile reveal (session-only) — true once after quiz completion ──
      profileRevealPending: false,

      // ── Sync conflict (session-only): set when local > remote on login ──
      // null | { remoteAnswers, remoteCount, localCount, userId }
      syncConflict: null,

      // ── « Comprendre la politique » : dernière fiche consultée (persisté) ──
      // null | { section, slug, title, ts }
      lastLearn: null,

      // ── Gamification apprentissage (persisté, 100 % local — engagement, pas opinion) ──
      // knowledge : { quiz: {qid: bool}, vf: {id: bool}, fiches: {slug: maxLevel} }
      knowledge: { quiz: {}, vf: {}, fiches: {} },
      // parcoursDone : { [parcoursSlug]: [ 'section/slug', … ] }
      parcoursDone: {},

      // ── Profile last updated timestamp (persisted for cross-device sync) ──
      profileLastUpdated: null,

      // ── Profile adjustments (manual refinement, does not touch original answers) ──
      profileAdjustments: {}, // { [THEME]: deltaPoints }

      // ── Priority weights (100 points allocated across themes, null = equal) ──
      themeWeights: null, // { ECONOMY: 20, SOCIAL: 15, … } summing to 100

      // ── TROIS DONNÉES DISTINCTES (contrat priority-v1) ──────────────────────
      //
      //   `answers`         — CE QUE PENSE la personne. Construit le profil idéologique.
      //   `themeImportance` — le poids GÉNÉRAL qu'elle accorde à un sujet.
      //   `voteInfluence`   — la capacité d'une question PRÉCISE à faire basculer son vote.
      //
      // ⚠ Ne JAMAIS fusionner ces champs. « Ce sujet ne changera pas mon vote » ne doit
      // jamais devenir une réponse neutre, une absence de réponse, ni une ligne supprimée :
      // l'opinion reste dans le profil, seul son poids électoral tombe à zéro.
      themeImportance: null,   // { levels: { [THEME]: niveau }, source }
      voteInfluence: {},       // { [questionId]: { level, multiplier, askedAt, answeredAt } }

      // ── Reproductibilité et reprise de la passation ──
      // Graine du tirage des questions. Persistée avec le profil : sans elle, la file exacte
      // à laquelle l'utilisateur a répondu est irrécupérable.
      queueSeed: null,
      // Identifiants de la file, persistés pour la REPRISE après rechargement.
      // `questionsQueue` contient les objets complets et n'est PAS persisté (poids inutile
      // dans localStorage, et cela figerait le texte des questions). Avant ce correctif,
      // recharger /quiz affichait « Aucune question disponible » : la file était perdue.
      queueQuestionIds: [],
      // Métadonnées permettant de REFUSER une reprise devenue incohérente.
      // { mode, seed, questionnaireVersion, queueAlgorithmVersion }
      queueMeta: null,

      // ── Election module ──
      selectedElectionId: null,
      electionAnswers: {}, // { [electionId]: { [questionId]: value } }

      // ── Candidate module ──
      selectedCandidateId: null,
      compareIds: [], // [id1, id2]

      // ── Actions ──
      setLanguage: (lang) => set({ language: lang }),

      setLastLearn: (v) => set({ lastLearn: v }),

      recordQuiz: (qid, correct) => set(st => {
        // ne jamais dégrader un acquis : une bonne réponse passée reste acquise
        if (st.knowledge.quiz[qid] === true) return {};
        return { knowledge: { ...st.knowledge, quiz: { ...st.knowledge.quiz, [qid]: correct } } };
      }),

      recordVf: (id, correct) => set(st => {
        if (st.knowledge.vf[id] === true) return {};
        return { knowledge: { ...st.knowledge, vf: { ...st.knowledge.vf, [id]: correct } } };
      }),

      recordFicheLevel: (slug, level) => set(st => {
        const cur = st.knowledge.fiches[slug] || 0;
        if (level <= cur) return {};
        return { knowledge: { ...st.knowledge, fiches: { ...st.knowledge.fiches, [slug]: level } } };
      }),

      markParcoursStep: (parcoursSlug, key) => set(st => {
        const done = st.parcoursDone[parcoursSlug] || [];
        if (done.includes(key)) return {};
        return { parcoursDone: { ...st.parcoursDone, [parcoursSlug]: [...done, key] } };
      }),

      navigate: (page) => {
        set({ currentPage: page });
        const { selectedElectionId, selectedCandidateId, compareIds } = get();
        let path = PAGE_TO_PATH[page];
        if (page === 'electionDetail')   path = `/elections/${selectedElectionId}`;
        if (page === 'candidateProfile') path = `/candidates/${selectedCandidateId}`;
        if (page === 'compareView')      path = `/compare/${compareIds[0]}/${compareIds[1]}`;
        if (path) routerNavigate(path);
      },

      startTest: (mode) => {
        const { priorityOrder, language } = get();
        // Une graine est tirée UNE fois par passation puis persistée : c'est elle qui rend la
        // file reproductible (reprise après interruption, ré-audit d'un résultat, comparaison
        // de deux passations). Avant, `Math.random()` produisait une file différente à chaque
        // appel sans qu'aucune trace ne permette de la reconstituer.
        const queueSeed = generateSeed();
        const queue = getQuestionQueue(mode, priorityOrder, queueSeed);
        set({
          testMode: mode,
          queueSeed,
          questionsQueue: queue,
          queueQuestionIds: queue.map(q => q.id),
          queueMeta: {
            mode,
            seed: queueSeed,
            questionnaireVersion: QUESTIONNAIRE_VERSION,
            queueAlgorithmVersion: QUEUE_ALGORITHM_VERSION,
          },
          currentQuestionIndex: 0,
          currentPage: 'questionnaire',
        });
        routerNavigate('/quiz');
        trackTestStart({ mode, lang: language });
      },

      startRefinement: (extraCount) => {
        const { answers } = get();
        const unanswered = allQuestions.filter(q => answers[q.id] == null).slice(0, extraCount);
        set({
          improveMode: false,
          questionsQueue: unanswered,
          currentQuestionIndex: 0,
          currentPage: 'questionnaire',
        });
        routerNavigate('/quiz');
      },

      startImproveMode: () => {
        const { answers, recentThemes } = get();
        const question = pickNextQuestion(answers, recentThemes);
        set({
          improveMode: true,
          questionsQueue: [question],
          currentQuestionIndex: 0,
          currentPage: 'questionnaire',
        });
        routerNavigate('/quiz');
        trackImproveStarted();
      },

      stopImproveMode: () => {
        const { answers } = get();
        set({ improveMode: false, currentPage: 'profile' });
        routerNavigate('/profile');
        trackImproveCompleted({ answeredCount: Object.keys(answers).length });
      },

      nextImproveQuestion: () => {
        const { answers, recentThemes, questionsQueue } = get();
        const currentTheme = questionsQueue[0]?.theme;
        const updatedRecent = currentTheme
          ? [...recentThemes, currentTheme].slice(-6)
          : recentThemes;
        const question = pickNextQuestion(answers, updatedRecent);
        set({
          questionsQueue: [question],
          currentQuestionIndex: 0,
          recentThemes: updatedRecent,
        });
      },

      setAuthUser: (user) => set({
        userId:    user?.id    ?? null,
        userEmail: user?.email ?? null,
      }),

      setPendingMigration: (v) => set({ pendingMigration: v }),

      setNeedsOnboarding: (v) => set({ needsOnboarding: v }),

      /**
       * Record a consent decision (grant or decline). Also mirrors the decision
       * into analytics.js's module-level flag so trackQuestionAnswered() and
       * friends start/stop firing immediately, in the same tick. Persisting to
       * Supabase's user_consents table (for logged-in users) happens separately
       * in auth.jsx — this action only updates local/device state.
       */
      /**
       * @param {boolean} granted        consentement au traitement des opinions politiques
       * @param {{measurement?: boolean}} [options] consentement distinct à la mesure d'audience
       *   (identifiant persistant + événements de parcours). Non renseigné ⇒ refusé :
       *   la mesure ne démarre jamais par défaut.
       */
      setConsent: (granted, options = {}) => {
        const measurement = options.measurement === true;
        const consent = {
          politicalData: granted === true,
          measurement,
          // `research` est une finalité DISTINCTE et jamais déduite : accepter l'analyse
          // de ses réponses ne vaut pas autorisation de réutilisation scientifique.
          // Absente des options ⇒ non décidée (`null`), donc refusée par défaut.
          research: options.research === true ? true : (options.research === false ? false : null),
          grantedAt: new Date().toISOString(),
          version: CONSENT_VERSION,
        };
        set({ consent });
        setMeasurementConsent(measurement);
        syncAttemptConsent(consent, get());
      },

      /**
       * Retrait du consentement aux données politiques.
       * @param {{measurement?: boolean}} [options] la mesure d'audience est une décision
       *   SÉPARÉE, locale au terminal. Sans valeur explicite, elle est retirée elle aussi
       *   (comportement d'un « tout refuser »). Avec `measurement: true`, l'utilisateur
       *   refuse la sauvegarde de ses opinions MAIS autorise la mesure — une combinaison
       *   que le produit décrivait comme possible sans jamais la permettre.
       */
      withdrawConsent: ({ measurement } = {}) => {
        const keepMeasurement = measurement === true;
        const consent = {
          politicalData: false,
          measurement: keepMeasurement,
          research: false,
          grantedAt: new Date().toISOString(),
          version: CONSENT_VERSION,
        };
        set({ consent });
        // Le retrait doit AGIR : file d'envoi vidée, identifiant pseudonyme effacé, et
        // décision transmise pour que le serveur supprime ce qu'il détient déjà.
        syncAttemptConsent(consent, get());
        // Purge immédiate de l'identifiant local si la mesure est refusée : un retrait doit
        // arrêter la collecte ET effacer le traceur déjà déposé, pas seulement cesser d'émettre.
        setMeasurementConsent(keepMeasurement);
      },

      /**
       * Sync local consent state FROM a server-side user_consents row (auth.jsx,
       * on login) — unlike setConsent(), preserves the row's original grantedAt
       * rather than stamping "now", since this isn't a new decision.
       */
      hydrateConsent: ({ granted, grantedAt, version }) => {
        // `measurement` est une décision LOCALE au terminal (traceur déposé sur cet appareil)
        // et n'est pas stockée côté serveur : la réhydratation depuis `user_consents` ne doit
        // donc jamais l'écraser. Avant ce correctif, se connecter effaçait silencieusement le
        // choix de mesure d'audience de l'appareil, et le gate n'était pas resynchronisé.
        const previous = get().consent ?? {};
        const measurement = previous.measurement ?? null;
        set({
          consent: {
            politicalData: granted === true,
            measurement,
            grantedAt: grantedAt ?? null,
            version: version ?? null,
          },
        });
        setMeasurementConsent(measurement === true);
      },

      setSyncConflict: (v) => set({ syncConflict: v }),

      applyRefinement: (themeDeltas) => {
        // themeDeltas: { ECONOMY: -5, PUBLIC_SERVICES: +5, ... }
        const current = get().profileAdjustments;
        const next = { ...current };
        Object.entries(themeDeltas).forEach(([theme, delta]) => {
          const prev = next[theme] ?? 0;
          // Cap total adjustment per theme at ±25
          next[theme] = Math.max(-25, Math.min(25, prev + delta));
        });
        set({ profileAdjustments: next });
      },

      resetAdjustments: () => set({ profileAdjustments: {} }),

      setThemeWeights: (weights) => set({ themeWeights: weights }),

      /**
       * Importance générale d'UN thème. Ne touche à aucune réponse politique.
       * @param {string} theme
       * @param {string} level  IMPORTANCE_LEVEL
       */
      setThemeImportanceLevel: (theme, level) => {
        const current = normalizeThemeImportance({
          themeImportance: get().themeImportance, priorityOrder: get().priorityOrder,
        });
        set({
          themeImportance: {
            levels: { ...current.levels, [theme]: level },
            source: PRIORITY_SOURCE.INDEPENDENT,
            updatedAt: new Date().toISOString(),
          },
        });
      },

      /** Applique un jeu complet d'importances (raccourci « tout compte autant », conversion). */
      setThemeImportance: (importance) => set({
        themeImportance: importance
          ? { ...importance, updatedAt: new Date().toISOString() }
          : null,
      }),

      /**
       * Influence d'UNE question sur le vote.
       *
       * ⚠ N'efface JAMAIS `answers[questionId]`. Une influence nulle laisse l'opinion intacte
       * dans le profil idéologique — c'est tout l'objet de la séparation.
       */
      setVoteInfluence: (questionId, level, { askedAt = null } = {}) => {
        const previous = get().voteInfluence?.[questionId] ?? null;
        set({
          voteInfluence: {
            ...get().voteInfluence,
            [questionId]: {
              level,
              multiplier: VOTE_INFLUENCE_MULTIPLIER[level] ?? null,
              askedAt: askedAt ?? previous?.askedAt ?? new Date().toISOString(),
              answeredAt: new Date().toISOString(),
            },
          },
        });
      },

      /**
       * « Je préfère ne pas répondre » : la demande a été VUE mais aucune influence n'est
       * déclarée. Distinct de `none` (décision explicite, multiplicateur 0) et distinct d'une
       * question jamais marquée. `level: null` ⇒ multiplicateur neutre.
       */
      setVoteInfluenceDeclined: (questionId) => set({
        voteInfluence: {
          ...get().voteInfluence,
          [questionId]: {
            level: null, multiplier: null, declined: true,
            askedAt: get().voteInfluence?.[questionId]?.askedAt ?? new Date().toISOString(),
            answeredAt: new Date().toISOString(),
          },
        },
      }),

      /** Importance thématique effective, anciens profils compris. */
      effectiveThemeImportance: () => normalizeThemeImportance({
        themeImportance: get().themeImportance, priorityOrder: get().priorityOrder,
      }),

      selectElection: (id) => {
        set({ selectedElectionId: id, currentPage: 'electionDetail' });
        routerNavigate(`/elections/${id}`);
      },

      selectCandidate: (id) => {
        set({ selectedCandidateId: id, currentPage: 'candidateProfile' });
        routerNavigate(`/candidates/${id}`);
      },

      startCompare: (id1, id2) => {
        set({ compareIds: [id1, id2], currentPage: 'compareView' });
        routerNavigate(`/compare/${id1}/${id2}`);
      },

      answerElectionQuestion: (electionId, questionId, value) => {
        const current = get().electionAnswers;
        set({
          electionAnswers: {
            ...current,
            [electionId]: { ...(current[electionId] ?? {}), [questionId]: value },
          },
        });
      },

      clearElectionAnswers: (electionId) => {
        const current = get().electionAnswers;
        const next = { ...current };
        delete next[electionId];
        set({ electionAnswers: next });
      },

      setPriorityOrder: (order) => set({ priorityOrder: order }),

      answerQuestion: (questionId, value) => {
        const newAnswers = { ...get().answers, [questionId]: value };
        // La file réellement posée est transmise au scoring : sans elle, la couverture v2
        // se calculerait sur toute la banque au lieu des questions effectivement servies.
        const profile = calculateActiveProfile(newAnswers, { askedQuestionIds: get().queueQuestionIds });
        const now = new Date().toISOString();
        set({ answers: newAnswers, profile, profileLastUpdated: now });

        // RGPD (2026-07-11): political answers are local-only by default. Nothing is
        // sent to Supabase — for anonymous OR logged-in users — without explicit,
        // affirmative consent (consent.politicalData === true). Account creation or
        // login alone is NOT sufficient consent. See audit/rgpd-remediation-2026-07/
        // for the full design. Do not remove this check to "fix" sync — that would
        // reintroduce silent transmission of GDPR Article 9 data.
        //
        // Anonymous users are intentionally never written to Supabase at all: the
        // local `answers` state above is already the complete, authoritative copy,
        // so there is nothing to gain from also mirroring it to anonymous_answers
        // pre-consent. If they later sign up and consent, saveAnswers()/
        // saveUserProfile() (auth.jsx) push this same local state to their account.
        const { userId, consent } = get();
        const hasConsent = consent?.politicalData === true;
        if (isSupabaseEnabled && supabase && userId && hasConsent) {
          // `answer_value` est un smallint : « sans opinion » ne peut pas y être écrit.
          // Passage obligatoire par src/lib/cloudAnswers.js — ne jamais reconstruire la
          // ligne à la main ici, c'est ce qui avait produit l'erreur d'écriture.
          const row = toCloudAnswerRow(userId, questionId, value);
          if (row) {
            supabase
              .from('user_answers')
              .upsert(row, { onConflict: 'user_id,question_id' })
              .then(({ error }) => {
                if (error) console.error('[Poliscop] Supabase answer save error:', error.message);
              });
          } else {
            // La réponse est devenue « sans opinion » : on retire la ligne distante, sinon
            // le cloud conserverait une position que l'utilisateur vient de retirer.
            supabase
              .from('user_answers')
              .delete()
              .eq('user_id', userId)
              .eq('question_id', questionId)
              .then(({ error }) => {
                if (error) console.error('[Poliscop] Supabase answer clear error:', error.message);
              });
          }
          // Save profile snapshot (answered_count used for cross-device sync)
          supabase
            .from('user_profiles')
            .upsert(
              {
                user_id:          userId,
                theme_scores:     profile.themes,
                axes:             profile.axes,
                confidence:       profile.confidence ?? 'very_low',
                confidence_score: profile.confidenceScore ?? 0,
                // Ne compte que les réponses exploitables. Comptait auparavant les « sans
                // opinion », ce qui faussait l'arbitrage de conflit local/cloud (l'appareil
                // avec le plus de questions passées gagnait).
                answered_count:   cloudAnsweredCount(newAnswers),
                // Trace de la MÉTHODE : sans elle, un snapshot relu est ininterprétable et
                // deux versions de scoring se mélangeraient dans une même moyenne.
                // Colonnes ajoutées par 20260809130000_profile_versions.sql.
                scoring_version:       profile?.versions?.scoring ?? null,
                questionnaire_version: profile?.versions?.questionnaire ?? null,
              },
              { onConflict: 'user_id' }
            )
            .then(({ error }) => {
              if (error) console.error('[Poliscop] Supabase profile snapshot error:', error.message);
            });
        }
      },

      /**
       * Load answers fetched from Supabase into the store (keyed by question_id).
       * Recalculates the profile so all derived state stays consistent.
       */
      hydrateFromCloud: (cloudAnswers) => {
        if (!cloudAnswers || Object.keys(cloudAnswers).length === 0) return;
        // La file d'origine de la passation distante est inconnue : la couverture v2 le
        // déclarera (`basedOnQueue: false`) au lieu d'inventer un dénominateur.
        const profile = calculateActiveProfile(cloudAnswers);
        set({ answers: cloudAnswers, profile });
      },

      /**
       * Reconstruit la file après un rechargement de page.
       *
       * Appelée à la réhydratation du store. Refuse la reprise plutôt que de servir une file
       * approximative : si le questionnaire ou l'algorithme de file a changé depuis la
       * passation, ou si des questions ont disparu de la banque, la file n'est plus celle à
       * laquelle l'utilisateur répondait.
       *
       * @returns {{resumed: boolean, reason?: string}}
       */
      resumeQuestionnaire: () => {
        const { queueQuestionIds, queueMeta, questionsQueue, currentQuestionIndex } = get();
        if (questionsQueue?.length > 0) return { resumed: true };          // déjà en mémoire
        if (!queueQuestionIds?.length) return { resumed: false, reason: 'no_queue' };

        if (queueMeta?.questionnaireVersion !== QUESTIONNAIRE_VERSION) {
          return { resumed: false, reason: 'questionnaire_version_changed' };
        }
        if (queueMeta?.queueAlgorithmVersion !== QUEUE_ALGORITHM_VERSION) {
          return { resumed: false, reason: 'queue_algorithm_changed' };
        }

        const { queue, missing } = getQuestionsByIds(queueQuestionIds);
        if (missing.length > 0) return { resumed: false, reason: 'questions_missing' };

        set({
          questionsQueue: queue,
          // L'index est borné : une valeur persistée aberrante ne doit pas produire un écran vide.
          currentQuestionIndex: Math.min(Math.max(0, currentQuestionIndex ?? 0), queue.length - 1),
          testMode: queueMeta?.mode ?? get().testMode,
          queueSeed: queueMeta?.seed ?? get().queueSeed,
        });
        return { resumed: true };
      },

      /** Abandonne une file non reprenable, sans toucher aux réponses déjà données. */
      discardQueue: () => set({
        questionsQueue: [], queueQuestionIds: [], queueMeta: null, currentQuestionIndex: 0,
      }),

      nextQuestion: () => {
        const { currentQuestionIndex, questionsQueue } = get();
        if (currentQuestionIndex < questionsQueue.length - 1) {
          set({ currentQuestionIndex: currentQuestionIndex + 1 });
        } else {
          const { answers, testMode, language, queueQuestionIds } = get();
          const profile = calculateActiveProfile(answers, { askedQuestionIds: queueQuestionIds });
          set({ profile, currentPage: 'profile' });
          routerNavigate('/profile');
          trackTestComplete({
            mode: testMode,
            answeredCount: profileAnsweredCount(profile),
            totalCount: queueQuestionIds?.length ?? null,
            lang: language,
          });
        }
      },

      prevQuestion: () => {
        const { currentQuestionIndex } = get();
        if (currentQuestionIndex > 0) {
          set({ currentQuestionIndex: currentQuestionIndex - 1 });
        }
      },

      finishQuestionnaire: () => {
        const { answers, testMode, language, queueQuestionIds } = get();
        // Version ACTIVE, pas v1 en dur : `nextQuestion()`, `finishQuestionnaire()`,
        // `hydrateFromCloud()` et `importProfile()` recalculaient tous explicitement en v1,
        // ce qui rendait le drapeau VITE_SCORING_VERSION trompeur — le profil affiché après
        // la dernière question écrasait celui calculé en v2 par answerQuestion().
        const profile = calculateActiveProfile(answers, { askedQuestionIds: queueQuestionIds });
        set({ profile, currentPage: 'profile', profileRevealPending: true });
        routerNavigate('/profile');
        trackTestComplete({
          mode: testMode,
          answeredCount: Object.keys(answers).length,
          totalCount: profile.totalQuestions,
          lang: language,
        });
      },

      clearRevealPending: () => set({ profileRevealPending: false }),

      resetProfile: () => {
        trackRetakeStarted();
        set({
          answers: {},
          profile: null,
          profileAdjustments: {},
          themeWeights: null,
          themeImportance: null,
          voteInfluence: {},
          testMode: null,
          questionsQueue: [],
          currentQuestionIndex: 0,
          improveMode: false,
          recentThemes: [],
          pendingMigration: false,
          currentPage: 'landing',
        });
        routerNavigate('/');
      },

      exportProfile: () => {
        const { answers, profile, priorityOrder, themeWeights, queueSeed, testMode, questionsQueue } = get();
        const data = {
          // Le format 1.0 embarquait les scores sans dire comment ils avaient été calculés :
          // relire un vieil export était impossible dès que la méthode changeait.
          version: EXPORT_FORMAT_VERSION,
          exportDate: new Date().toISOString(),
          answers,
          // `profile` reste exporté pour lecture humaine, mais il est TOUJOURS recalculé à
          // l'import : il est indicatif, jamais la source de vérité.
          profile,
          priorityOrder,
          themeWeights,
          queueSeed,
          testMode,
          questionnaireVersion: QUESTIONNAIRE_VERSION,
          questionIds: (questionsQueue ?? []).map(q => q.id),
          // Versions RÉELLES du profil exporté. `currentVersions()` retombait par défaut sur
          // `scoring: 'v1'` : un profil calculé en v2 s'exportait donc étiqueté v1, et se
          // relisait comme tel. La version d'origine fait foi.
          versions: profile?.versions ?? currentVersions(),
        };
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `poliscop-profile-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
      },

      /**
       * Import d'un profil exporté.
       *
       * Règle non négociable : le profil est TOUJOURS recalculé depuis les réponses validées.
       * L'ancienne version faisait `profile: data.profile`, c'est-à-dire qu'un fichier JSON
       * fabriqué à la main pouvait imposer n'importe quels scores — et qu'un export d'une
       * version antérieure du moteur restait affiché comme s'il venait du moteur courant.
       *
       * @returns {true | {error: string}} true si importé, sinon un motif exploitable par l'UI.
       */
      importProfile: (jsonData) => {
        const parsed = parseImport(jsonData, {
          knownQuestionIds: new Set(allQuestions.map(q => q.id)),
          isAcceptableAnswer: v => isScorable(v) || v === NO_OPINION,
        });
        if (!parsed.ok) return { error: parsed.error };

        const v = parsed.value;

        // Reconstruction de la file si l'export en contenait une ET qu'elle reste compatible.
        // Sinon la session est importée sans file — l'utilisateur relance un questionnaire.
        let queue = [];
        let queueMeta = null;
        if (v.questionIds && v.questionnaireVersion === QUESTIONNAIRE_VERSION
            && (v.queueAlgorithmVersion == null || v.queueAlgorithmVersion === QUEUE_ALGORITHM_VERSION)) {
          const rebuilt = getQuestionsByIds(v.questionIds);
          if (rebuilt.missing.length === 0) {
            queue = rebuilt.queue;
            queueMeta = {
              mode: v.testMode,
              seed: v.queueSeed,
              questionnaireVersion: QUESTIONNAIRE_VERSION,
              queueAlgorithmVersion: QUEUE_ALGORITHM_VERSION,
            };
          }
        }

        // TOUS les champs de session sont écrits explicitement, y compris à `null`.
        // Un `?? get().champ` ferait survivre l'état local antérieur — c'est précisément le
        // défaut relevé sur `themeWeights` : des poids saisis par l'utilisateur continuaient
        // de pondérer un profil importé d'ailleurs.
        set({
          answers: v.answers,
          // Recalcul systématique, jamais `data.profile` — et avec la version ACTIVE.
          profile: calculateActiveProfile(v.answers, { askedQuestionIds: v.questionIds ?? null }),
          priorityOrder: v.priorityOrder ?? [...THEMES_ORDER],
          themeWeights: v.themeWeights,           // null = réinitialisé, pas « inchangé »
          queueSeed: v.queueSeed,
          testMode: v.testMode,
          questionsQueue: queue,
          queueQuestionIds: queue.map(q => q.id),
          queueMeta,
          currentQuestionIndex: 0,
          profileAdjustments: {},                 // un ajustement manuel ne se transporte pas
          importedFrom: {
            formatVersion: v.formatVersion,
            questionnaireVersion: v.questionnaireVersion ?? 'inconnue',
            droppedAnswers: v.droppedAnswers,
            warnings: parsed.warnings,
            queueRestored: queue.length > 0,
            importedAt: new Date().toISOString(),
          },
          currentPage: 'profile',
        });
        routerNavigate('/profile');
        return true;
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        language: state.language,
        answers: state.answers,
        profile: state.profile,
        priorityOrder: state.priorityOrder,
        electionAnswers: state.electionAnswers,
        profileAdjustments: state.profileAdjustments,
        themeWeights: state.themeWeights,
        themeImportance: state.themeImportance,
        voteInfluence: state.voteInfluence,
        queueSeed: state.queueSeed,
        testMode: state.testMode,
        // Reprise du questionnaire après rechargement : IDs + position + métadonnées de
        // validité. La file complète reste hors localStorage (poids, texte figé).
        queueQuestionIds: state.queueQuestionIds,
        queueMeta: state.queueMeta,
        currentQuestionIndex: state.currentQuestionIndex,
        importedFrom: state.importedFrom,
        profileLastUpdated: state.profileLastUpdated,
        consent: state.consent,
        lastLearn: state.lastLearn,
        knowledge: state.knowledge,
        parcoursDone: state.parcoursDone,
      }),
      // Sync analytics.js's module-level consent flag as soon as the persisted
      // state is available — before this runs, it defaults to false (fail-closed:
      // no tracking of political content until we positively know consent was granted).
      onRehydrateStorage: () => (state) => {
        setMeasurementConsent(state?.consent?.measurement === true);
        // Même logique fail-closed pour la collecte de passation : tant que l'état persisté
        // n'est pas relu, `attemptSession` n'a aucun consentement et n'émet rien.
        if (state?.consent) syncAttemptConsent(state.consent, state);
        // Reconstruit la file du questionnaire depuis les IDs persistés. Sans cela, un
        // rechargement direct sur /quiz affichait « Aucune question disponible ».
        try { state?.resumeQuestionnaire?.(); } catch { /* file inutilisable — écran de reprise */ }
      },
    }
  )
);

export { createTranslator };

// POLISCOPE — Translations (EN / FR)

export const translations = {
  en: {
    // ── App chrome ──
    app_name: `Poliscope`,
    tagline: `Your political profile, mapped.`,
    lang_switch: `Français`,

    // ── Navigation ──
    nav_home: `Home`,
    nav_profile: `My Profile`,
    nav_elections: `Elections`,
    nav_figures: `Historical Figures`,
    nav_french_figures: `French Figures`,
    nav_mission: `Mission`,
    nav_transparency: `Transparency`,
    nav_beginner: `Politics 101`,

    // ── Landing page ──
    landing_hero_title: `Understand your political beliefs`,
    landing_hero_subtitle: `Poliscope is a multi-dimensional political profiling tool. Answer a series of structured questions, discover your ideological profile, and see how you align with candidates, parties, and historical figures.`,
    landing_cta_primary: `Build my political profile`,
    landing_cta_elections: `Explore elections`,
    landing_cta_figures: `Historical figures`,
    landing_no_profile_note: `You haven't completed a profile yet. Build one first for the best experience.`,

    // ── Test mode selection ──
    select_test: `Choose your test length`,
    test_quick: `Quick`,
    test_medium: `Standard`,
    test_full: `Comprehensive`,
    test_quick_desc: `8 questions · ~3 minutes · General orientation`,
    test_medium_desc: `24 questions · ~10 minutes · Reliable profile`,
    test_full_desc: `40 questions · ~20 minutes · Full accuracy`,
    test_start: `Start test`,
    test_note: `Longer tests produce more accurate profiles. You can always add questions later.`,

    // ── Priority ranking ──
    priorities_title: `Which issues matter most to you?`,
    priorities_subtitle: `Rank the themes from most to least important. This affects how your profile is weighted.`,
    priorities_most: `Most important`,
    priorities_least: `Least important`,
    priorities_confirm: `Confirm and start`,
    priorities_skip: `Use equal weighting`,

    // ── Questionnaire ──
    q_progress: `Question {current} of {total}`,
    q_skip: `Skip this question`,
    q_next: `Next`,
    q_prev: `Previous`,
    q_finish: `See my profile`,
    q_answer_1: `Strongly disagree`,
    q_answer_2: `Disagree`,
    q_answer_3: `Neutral`,
    q_answer_4: `Agree`,
    q_answer_5: `Strongly agree`,
    q_learn_more: `Learn more`,
    q_theme_label: `Theme:`,

    // ── Profile page ──
    profile_title: `Your Political Profile`,
    profile_subtitle: `Based on your answers, here is your multi-dimensional political profile.`,
    profile_themes_title: `Profile by theme`,
    profile_axes_title: `Ideological axes`,
    profile_refine: `Refine my profile`,
    profile_refine_add: `Add {n} questions`,
    profile_export: `Export profile (JSON)`,
    profile_import: `Import profile`,
    profile_reset: `Reset profile`,
    profile_reset_confirm: `Reset your profile? This will erase all your answers.`,
    profile_answered: `{n} questions answered`,
    profile_of_total: `out of {total}`,
    profile_view_elections: `Compare with elections`,
    profile_view_figures: `Compare with historical figures`,
    profile_axis_economic: `Economic axis`,
    profile_axis_social: `Social axis`,
    profile_axis_institutional: `Institutional axis`,
    profile_axis_international: `International axis`,

    // ── Elections page ──
    elections_title: `Election Matching`,
    elections_subtitle: `See how your profile aligns with real candidates and parties.`,
    elections_no_profile: `Build your profile first to compare with candidates.`,
    elections_select: `Select an election`,
    elections_your_match: `Your closest match`,
    elections_alignment: `Alignment`,
    elections_disclaimer: `Alignment scores are analytical comparisons based on policy positions. They are not voting recommendations.`,
    elections_sorted: `Sorted by alignment with your profile`,

    // ── Historical figures page ──
    figures_title: `Historical Figure Matching`,
    figures_subtitle: `See which historical political figures you most resemble.`,
    figures_no_profile: `Build your profile first to compare with historical figures.`,
    figures_disclaimer: `⚠️ These profiles are analytical simplifications for educational purposes. Historical figures held views that evolved over time and existed in vastly different contexts. This feature is intended for intellectual exploration only.`,
    figures_top_match: `Your closest match`,
    figures_sorted: `Sorted by alignment with your profile`,

    // ── Confidence bar ──
    confidence_label: `Profile Accuracy`,
    confidence_improve_cta: `Improve my profile`,

    // ── Improve mode ──
    improve_title: `Refine your political profile`,
    improve_subtitle: `Answer as many questions as you want. Your profile updates after each answer.`,
    improve_next: `Next question`,
    improve_stop: `Stop and return to profile`,
    improve_progress: `{n} answers total`,

    // ── Migration banner ──
    migrate_title: `We found answers from your anonymous session.`,
    migrate_subtitle: `Do you want to save them to your account?`,
    migrate_yes: `Save to my account`,
    migrate_no: `No thanks`,

    // ── Profile summary ──
    profile_summary_title: `Your Political Tendencies`,

    // ── Profile refinement ──
    refine_title: `Not quite right?`,
    refine_subtitle: `Adjust your profile if the result doesn't feel accurate.`,
    refine_step1: `Choose a theme to adjust`,
    refine_step2: `Choose what to adjust`,
    refine_step3: `Set your position`,
    refine_apply: `Apply adjustment`,
    refine_back: `Back`,
    refine_reset: `Reset all adjustments`,
    refine_adjusted_badge: `Adjusted`,
    refine_less: `Much less`,
    refine_more: `Much more`,
    refine_neutral: `Neutral`,
    refine_active: `{n} adjustment(s) active`,

    // ── Ideological Currents ──
    currents_title: `Your Ideological Currents`,
    currents_subtitle: `Political traditions that best match your profile.`,
    currents_top_match: `Closest current`,
    currents_key_beliefs: `Core beliefs`,
    currents_show_all: `Show all currents`,
    currents_show_less: `Show less`,

    // ── Election detail ──
    election_about: `About this election`,
    election_understand_more: `Understand this election better`,
    election_disclaimer: `Political debates vary by country. These questions focus on the specific issues of this election.`,
    election_start_quiz: `Answer election-specific questions`,
    election_skip_quiz: `Skip — use my general profile only`,
    election_q_progress: `Question {current} of {total}`,
    election_results_title: `Your candidate matches`,
    election_results_note: `Based on your general profile{extra}.`,
    election_results_note_extra: ` and {n} election-specific answers`,
    election_agreements: `Agreements`,
    election_disagreements: `Disagreements`,
    election_retake: `Retake election questions`,
    election_back: `All elections`,
    election_overview: `Alignment overview`,
    election_no_profile: `Build your profile first to compare with candidates.`,

    // ── Trust & transparency ──
    trust_data: `Your data belongs to you.`,
    trust_no_sell: `Poliscope never sells personal data.`,
    trust_anonymous: `You can explore politics anonymously.`,
    trust_educational: `These comparisons are educational, based on simplified modeling of political positions.`,

    // ── Misc ──
    back: `Back`,
    loading: `Loading…`,
    confirm: `Confirm`,
    cancel: `Cancel`,
    yes: `Yes`,
    no: `No`,
    disclaimer_historical: `Historical context applies. Views shown are analytical approximations.`,
  },

  fr: {
    // ── App chrome ──
    app_name: `Poliscope`,
    tagline: `Votre profil politique, cartographié.`,
    lang_switch: `English`,

    // ── Navigation ──
    nav_home: `Accueil`,
    nav_profile: `Mon profil`,
    nav_elections: `Élections`,
    nav_figures: `Figures historiques`,
    nav_french_figures: `Figures françaises`,
    nav_mission: `Mission`,
    nav_transparency: `Transparence`,
    nav_beginner: `J'y connais rien`,

    // ── Landing page ──
    landing_hero_title: `Comprenez vos convictions politiques`,
    landing_hero_subtitle: `Poliscope est un outil de profilage politique multidimensionnel. Répondez à une série de questions structurées, découvrez votre profil idéologique et voyez comment vous vous alignez avec des candidats, des partis et des figures historiques.`,
    landing_cta_primary: `Construire mon profil politique`,
    landing_cta_elections: `Explorer les élections`,
    landing_cta_figures: `Figures historiques`,
    landing_no_profile_note: `Vous n'avez pas encore de profil. Créez-en un d'abord pour la meilleure expérience.`,

    // ── Test mode selection ──
    select_test: `Choisissez la longueur du test`,
    test_quick: `Rapide`,
    test_medium: `Standard`,
    test_full: `Complet`,
    test_quick_desc: `8 questions · ~3 minutes · Orientation générale`,
    test_medium_desc: `24 questions · ~10 minutes · Profil fiable`,
    test_full_desc: `40 questions · ~20 minutes · Précision maximale`,
    test_start: `Commencer le test`,
    test_note: `Les tests plus longs produisent des profils plus précis. Vous pouvez toujours ajouter des questions plus tard.`,

    // ── Priority ranking ──
    priorities_title: `Quels sujets vous tiennent le plus à cœur ?`,
    priorities_subtitle: `Classez les thèmes du plus au moins important. Cela influence la pondération de votre profil.`,
    priorities_most: `Le plus important`,
    priorities_least: `Le moins important`,
    priorities_confirm: `Confirmer et commencer`,
    priorities_skip: `Pondération égale`,

    // ── Questionnaire ──
    q_progress: `Question {current} sur {total}`,
    q_skip: `Passer cette question`,
    q_next: `Suivant`,
    q_prev: `Précédent`,
    q_finish: `Voir mon profil`,
    q_answer_1: `Pas du tout d'accord`,
    q_answer_2: `Pas d'accord`,
    q_answer_3: `Neutre`,
    q_answer_4: `D'accord`,
    q_answer_5: `Tout à fait d'accord`,
    q_learn_more: `En savoir plus`,
    q_theme_label: `Thème :`,

    // ── Profile page ──
    profile_title: `Votre profil politique`,
    profile_subtitle: `Sur la base de vos réponses, voici votre profil politique multidimensionnel.`,
    profile_themes_title: `Profil par thème`,
    profile_axes_title: `Axes idéologiques`,
    profile_refine: `Affiner mon profil`,
    profile_refine_add: `Ajouter {n} questions`,
    profile_export: `Exporter le profil (JSON)`,
    profile_import: `Importer un profil`,
    profile_reset: `Réinitialiser le profil`,
    profile_reset_confirm: `Réinitialiser votre profil ? Cela effacera toutes vos réponses.`,
    profile_answered: `{n} questions répondues`,
    profile_of_total: `sur {total}`,
    profile_view_elections: `Comparer avec les élections`,
    profile_view_figures: `Comparer avec les figures historiques`,
    profile_axis_economic: `Axe économique`,
    profile_axis_social: `Axe social`,
    profile_axis_institutional: `Axe institutionnel`,
    profile_axis_international: `Axe international`,

    // ── Elections page ──
    elections_title: `Compatibilité électorale`,
    elections_subtitle: `Découvrez comment votre profil s'aligne avec des candidats et des partis réels.`,
    elections_no_profile: `Construisez d'abord votre profil pour comparer avec les candidats.`,
    elections_select: `Sélectionner une élection`,
    elections_your_match: `Votre meilleure correspondance`,
    elections_alignment: `Compatibilité`,
    elections_disclaimer: `Les scores de compatibilité sont des comparaisons analytiques basées sur les positions politiques. Ils ne constituent pas des recommandations de vote.`,
    elections_sorted: `Classé par compatibilité avec votre profil`,

    // ── Historical figures page ──
    figures_title: `Figures historiques`,
    figures_subtitle: `Découvrez quelles figures politiques historiques vous ressemblez le plus.`,
    figures_no_profile: `Construisez d'abord votre profil pour comparer avec les figures historiques.`,
    figures_disclaimer: `⚠️ Ces profils sont des simplifications analytiques à des fins éducatives. Les figures historiques avaient des opinions qui ont évolué au fil du temps et existaient dans des contextes très différents. Cette fonctionnalité est uniquement destinée à l'exploration intellectuelle.`,
    figures_top_match: `Votre meilleure correspondance`,
    figures_sorted: `Classé par compatibilité avec votre profil`,

    // ── Confidence bar ──
    confidence_label: `Précision du profil`,
    confidence_improve_cta: `Améliorer mon profil`,

    // ── Improve mode ──
    improve_title: `Affinez votre profil politique`,
    improve_subtitle: `Répondez à autant de questions que vous voulez. Votre profil se met à jour après chaque réponse.`,
    improve_next: `Question suivante`,
    improve_stop: `Arrêter et revenir au profil`,
    improve_progress: `{n} réponses au total`,

    // ── Migration banner ──
    migrate_title: `Nous avons trouvé des réponses de votre session anonyme.`,
    migrate_subtitle: `Voulez-vous les sauvegarder dans votre compte ?`,
    migrate_yes: `Sauvegarder dans mon compte`,
    migrate_no: `Non merci`,

    // ── Profile summary ──
    profile_summary_title: `Vos tendances politiques`,

    // ── Profile refinement ──
    refine_title: `Pas tout à fait exact ?`,
    refine_subtitle: `Ajustez votre profil si le résultat ne vous semble pas précis.`,
    refine_step1: `Choisissez un thème à ajuster`,
    refine_step2: `Choisissez ce à ajuster`,
    refine_step3: `Définissez votre position`,
    refine_apply: `Appliquer l'ajustement`,
    refine_back: `Retour`,
    refine_reset: `Réinitialiser les ajustements`,
    refine_adjusted_badge: `Ajusté`,
    refine_less: `Beaucoup moins`,
    refine_more: `Beaucoup plus`,
    refine_neutral: `Neutre`,
    refine_active: `{n} ajustement(s) actif(s)`,

    // ── Ideological Currents ──
    currents_title: `Vos courants idéologiques`,
    currents_subtitle: `Les traditions politiques qui correspondent le mieux à votre profil.`,
    currents_top_match: `Courant le plus proche`,
    currents_key_beliefs: `Convictions fondamentales`,
    currents_show_all: `Voir tous les courants`,
    currents_show_less: `Réduire`,

    // ── Election detail ──
    election_about: `À propos de cette élection`,
    election_understand_more: `Comprendre cette élection`,
    election_disclaimer: `Les débats politiques varient selon les pays. Ces questions portent sur les enjeux spécifiques de cette élection.`,
    election_start_quiz: `Répondre aux questions spécifiques`,
    election_skip_quiz: `Passer — utiliser uniquement mon profil général`,
    election_q_progress: `Question {current} sur {total}`,
    election_results_title: `Vos correspondances candidates`,
    election_results_note: `Basé sur votre profil général{extra}.`,
    election_results_note_extra: ` et {n} réponses électorales spécifiques`,
    election_agreements: `Points d'accord`,
    election_disagreements: `Points de désaccord`,
    election_retake: `Refaire les questions électorales`,
    election_back: `Toutes les élections`,
    election_overview: `Vue d'ensemble`,
    election_no_profile: `Construisez d'abord votre profil pour comparer avec les candidats.`,

    // ── Trust & transparency ──
    trust_data: `Vos données vous appartiennent.`,
    trust_no_sell: `Poliscope ne vend jamais de données personnelles.`,
    trust_anonymous: `Vous pouvez explorer la politique anonymement.`,
    trust_educational: `Ces comparaisons sont éducatives, basées sur une modélisation simplifiée des positions politiques.`,

    // ── Misc ──
    back: `Retour`,
    loading: `Chargement…`,
    confirm: `Confirmer`,
    cancel: `Annuler`,
    yes: `Oui`,
    no: `Non`,
    disclaimer_historical: `Le contexte historique s'applique. Les vues présentées sont des approximations analytiques.`,
  },
};

/**
 * Simple translation function with variable interpolation.
 * Usage: t('q_progress', { current: 3, total: 24 })
 */
export function createTranslator(lang) {
  const dict = translations[lang] ?? translations.en;
  return function t(key, vars) {
    let str = dict[key] ?? translations.en[key] ?? key;
    if (vars) {
      Object.entries(vars).forEach(([k, v]) => {
        str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), v);
      });
    }
    return str;
  };
}

/**
 * questionExplanations.js — structured explanations for a curated subset of quiz
 * questions, with important concepts linked to Poliscop Academy.
 *
 * This is additive and deliberately partial: only questions listed here get the
 * new segmented rendering (plain text + inline Academy links). Every other
 * question keeps rendering exactly as before (questionHints.js override, then
 * questions_final.json's plain-string `explanation`, then nothing) — see the
 * priority order in Questionnaire.jsx.
 *
 * Editorial notes:
 * - IMM_1 and PUB_4 already had an entry in questionHints.js that silently
 *   overrode their `explanation` field in the UI. Migrating them here resolves
 *   that for these two IDs by giving them a higher-priority source of truth;
 *   the underlying questionHints.js entries are left untouched (they still
 *   apply to every other overridden id, unaffected by this change).
 * - Numbers/dates below are carried over verbatim from the existing, already
 *   fact-checked `explanation` strings in questions_final.json — this task only
 *   restructures prose for concept-linking, it does not re-verify factual claims.
 * - "droit d'asile" and "l'intégration" have no dedicated Academy fiche outside
 *   the immigration debate page; IMM_2 links the former (its actual subject),
 *   IMM_1 leaves "services publics" and "intégration" as plain text since no
 *   precise, non-immigration-specific destination exists for them yet — see the
 *   final report's "concepts Academy manquants" list.
 *
 * @type {Record<string, import('./academyConcepts.js').ExplanationSegment[]>}
 */
export const QUESTION_EXPLANATIONS = {
  // ── IMMIGRATION ──────────────────────────────────────────────────────────
  IMM_1: [
    { type: 'academy-concept', conceptId: 'immigration', label: "L'immigration" },
    {
      type: 'text',
      value:
        " désigne l'installation en France de personnes qui vivaient auparavant dans un autre pays. En 2025, environ 384 000 premiers titres de séjour ont été délivrés (+11 % sur un an), un niveau record. Certains estiment que ce niveau est trop élevé et pèse sur certains services publics ; d'autres soulignent les contributions économiques et démographiques de l'immigration. Le débat porte aussi sur les conditions d'accueil, l'intégration, le droit d'asile et l'exécution des obligations de quitter le territoire français (",
    },
    { type: 'academy-concept', conceptId: 'oqtf', label: 'OQTF' },
    {
      type: 'text',
      value: ") prononcées à l'encontre des personnes dont la demande de séjour ou d'asile a été rejetée.",
    },
  ],

  IMM_2: [
    { type: 'academy-concept', conceptId: 'droit-asile', label: 'Les demandeurs d’asile' },
    {
      type: 'text',
      value:
        " ont accès à certaines aides en France, mais pas au droit de travailler pendant l'instruction de leur dossier, qui peut durer plusieurs mois voire plus d'un an. Ses partisans y voient un moyen de favoriser l'autonomie financière et l'intégration ; ses opposants craignent que cela n'incite davantage de demandes, y compris infondées.",
    },
  ],

  // ── ÉCONOMIE ─────────────────────────────────────────────────────────────
  ECO_11: [
    { type: 'text', value: 'La ' },
    { type: 'academy-concept', conceptId: 'dette-publique', label: 'dette publique' },
    {
      type: 'text',
      value:
        " française dépasse 3 500 milliards d'euros. Certains veulent la réduire en priorité pour alléger les charges d'intérêts, qui atteignent désormais plus de 77 milliards d'euros par an ; d'autres estiment qu'en période de crise, s'endetter est nécessaire pour investir dans les services publics et ne pas sacrifier la croissance.",
    },
  ],

  ECO_26: [
    { type: 'text', value: 'La ' },
    { type: 'academy-concept', conceptId: 'retraites', anchor: 'mesures-prises', label: 'réforme des retraites de 2023' },
    {
      type: 'text',
      value:
        " a repoussé l'âge légal de départ de 62 à 64 ans, malgré une forte opposition sociale. Ses partisans l'estiment nécessaire pour équilibrer le système ; ses opposants jugent qu'elle pénalise les travailleurs aux carrières longues et aux métiers pénibles.",
    },
  ],

  // ── SERVICES PUBLICS ─────────────────────────────────────────────────────
  PUB_4: [
    { type: 'text', value: 'Le système français fonctionne par ' },
    { type: 'academy-concept', conceptId: 'retraites', label: 'répartition' },
    {
      type: 'text',
      value:
        " : les cotisations des actifs financent directement les retraites d'aujourd'hui. Le vieillissement de la population le fragilise, et certains proposent d'introduire une part de capitalisation (épargne individuelle investie sur les marchés, comme en Suède) pour diversifier le financement. Ses opposants craignent que cela affaiblisse la solidarité entre générations et expose les pensions aux aléas des marchés financiers.",
    },
  ],

  // ── DÉMOCRATIE ───────────────────────────────────────────────────────────
  DEM_5: [
    {
      type: 'text',
      value: 'Le scrutin majoritaire à deux tours favorise les grands partis et assure une majorité stable. La ',
    },
    { type: 'academy-concept', conceptId: 'proportionnelle', label: 'proportionnelle' },
    {
      type: 'text',
      value:
        " donne une représentation fidèle des votes mais produit souvent des coalitions fragiles. Le débat porte sur l'équilibre entre gouvernabilité et représentativité.",
    },
  ],

  DEM_16: [
    { type: 'text', value: 'Le ' },
    {
      type: 'academy-concept',
      conceptId: 'conseil-constitutionnel',
      anchor: 'gouvernement-des-juges',
      label: 'Conseil constitutionnel',
    },
    {
      type: 'text',
      value:
        " peut censurer des lois votées par le Parlement si elles violent la Constitution. Certains veulent renforcer ce contrôle pour protéger les droits fondamentaux ; d'autres estiment que cela donne trop de pouvoir à des juges non élus.",
    },
  ],

  // ── MONDIALISATION ───────────────────────────────────────────────────────
  GLO_8: [
    { type: 'text', value: "L'" },
    { type: 'academy-concept', conceptId: 'union-europeenne', label: 'Union européenne' },
    {
      type: 'text',
      value:
        " a une monnaie commune et des règles budgétaires partagées. Certains souhaitent aller plus loin : budget européen plus important, politique étrangère commune, harmonisation fiscale. Ses opposants craignent une perte de souveraineté nationale supplémentaire.",
    },
  ],

  // ── SOCIAL ───────────────────────────────────────────────────────────────
  SOC_16: [
    {
      type: 'text',
      value:
        "Depuis la loi de 2004, les signes religieux ostensibles sont interdits aux élèves des écoles, collèges et lycées publics, au nom de la ",
    },
    { type: 'academy-concept', conceptId: 'laicite', anchor: 'ecole', label: 'laïcité' },
    {
      type: 'text',
      value:
        ". Certains considèrent cette règle nécessaire à la neutralité scolaire ; d'autres estiment qu'elle limite excessivement la liberté religieuse des élèves.",
    },
  ],
};

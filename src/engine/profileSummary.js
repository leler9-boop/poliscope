// POLISCOPE — Deterministic Profile Summary Generator
// Generates a 3–4 sentence neutral description of the user's political tendencies.
// No AI, no external calls — fully deterministic based on theme scores.

/**
 * Generate a plain-language summary of the user's political profile.
 *
 * @param {Object} themes       - { ECONOMY, SOCIAL, IMMIGRATION, ... } (0–100)
 * @param {Array}  rankedCurrents - ideological currents sorted by alignment
 * @param {string} language     - 'en' | 'fr'
 * @returns {string}
 */
export function generateProfileSummary(themes, rankedCurrents, language) {
  const lang = language === 'fr' ? 'fr' : 'en';
  const { ECONOMY, SOCIAL, IMMIGRATION, SECURITY, ENVIRONMENT, DEMOCRACY, GLOBAL, PUBLIC_SERVICES } = themes;

  // Composite scores
  const economicScore = Math.round((ECONOMY + (100 - PUBLIC_SERVICES)) / 2);
  const socialScore   = Math.round((SOCIAL + (100 - IMMIGRATION)) / 2);

  const sentences = [
    getEconomicSentence(economicScore, lang),
    getSocialSentence(socialScore, lang),
    getSpecialConcernSentence(themes, lang),
    getOverallSentence(rankedCurrents, lang),
  ];

  return sentences.filter(Boolean).join(' ');
}

// ─── Sentence builders ────────────────────────────────────────────────────────

function getEconomicSentence(score, lang) {
  const map = {
    en: [
      [20, `You strongly support a state-directed economy with extensive public ownership and redistribution.`],
      [35, `You tend to favor significant government involvement in the economy and strong public services.`],
      [50, `You support a mixed economy that balances market forces with social protections.`],
      [65, `You lean toward market economics with limited but present government intervention.`],
      [80, `You clearly favor free markets and prefer the state to play a reduced economic role.`],
      [101, `You strongly support free markets and a minimal role for the state in the economy.`],
    ],
    fr: [
      [20, `Vous soutenez fortement une économie dirigée par l'État, avec une propriété publique étendue et une forte redistribution.`],
      [35, `Vous avez tendance à favoriser une intervention étatique importante et de solides services publics.`],
      [50, `Vous soutenez une économie mixte qui équilibre les forces du marché et les protections sociales.`],
      [65, `Vous vous orientez vers l'économie de marché avec une intervention étatique limitée mais présente.`],
      [80, `Vous favorisez clairement les marchés libres et préférez que l'État joue un rôle économique réduit.`],
      [101, `Vous soutenez fortement les marchés libres et un rôle très limité de l'État dans l'économie.`],
    ],
  };
  return pickByThreshold(map[lang], score);
}

function getSocialSentence(score, lang) {
  const map = {
    en: [
      [20, `On social matters, you hold very conservative values and support strict immigration controls.`],
      [35, `You hold conservative social positions with support for controlled and limited immigration.`],
      [50, `You take a broadly centrist social position, moderate on cultural and immigration issues.`],
      [65, `You hold progressive social values and are open toward immigration and diversity.`],
      [80, `You clearly hold progressive social views and favor open, welcoming immigration policies.`],
      [101, `You hold strongly progressive social values and support generous immigration and openness.`],
    ],
    fr: [
      [20, `Sur le plan social, vous défendez des valeurs très conservatrices et soutenez un contrôle strict de l'immigration.`],
      [35, `Vous adoptez des positions sociales conservatrices avec un soutien à une immigration contrôlée.`],
      [50, `Vous adoptez une position sociale globalement centriste, modérée sur les questions culturelles et migratoires.`],
      [65, `Vous avez des valeurs sociales progressistes et êtes ouvert à l'immigration et à la diversité.`],
      [80, `Vous défendez clairement des positions sociales progressistes et favorisez des politiques d'immigration ouvertes.`],
      [101, `Vous défendez des valeurs sociales très progressistes et soutenez une grande ouverture à l'immigration.`],
    ],
  };
  return pickByThreshold(map[lang], score);
}

function getSpecialConcernSentence(themes, lang) {
  const { SECURITY, ENVIRONMENT, DEMOCRACY, GLOBAL } = themes;

  // Find the single most extreme theme (furthest from 50)
  const candidates = [
    { theme: 'ENVIRONMENT', val: ENVIRONMENT, threshold: 72 },
    { theme: 'ENVIRONMENT_LOW', val: 100 - ENVIRONMENT, threshold: 72 },
    { theme: 'SECURITY', val: SECURITY, threshold: 72 },
    { theme: 'SECURITY_LOW', val: 100 - SECURITY, threshold: 72 },
    { theme: 'DEMOCRACY', val: DEMOCRACY, threshold: 76 },
    { theme: 'DEMOCRACY_LOW', val: 100 - DEMOCRACY, threshold: 62 },
    { theme: 'GLOBAL', val: GLOBAL, threshold: 72 },
    { theme: 'GLOBAL_LOW', val: 100 - GLOBAL, threshold: 72 },
  ].filter(c => c.val >= c.threshold)
   .sort((a, b) => b.val - a.val);

  if (!candidates.length) return null;

  const sentences = {
    ENVIRONMENT: {
      en: `Environmental protection and climate action are strong priorities in your profile.`,
      fr: `La protection de l'environnement et l'action climatique sont des priorités fortes dans votre profil.`,
    },
    ENVIRONMENT_LOW: {
      en: `You are skeptical of strict environmental regulation and prioritize economic growth over climate measures.`,
      fr: `Vous êtes sceptique face à une réglementation environnementale stricte et privilégiez la croissance économique aux mesures climatiques.`,
    },
    SECURITY: {
      en: `You place strong emphasis on law, order, and national security.`,
      fr: `Vous accordez une grande importance à l'ordre public et à la sécurité nationale.`,
    },
    SECURITY_LOW: {
      en: `You place strong emphasis on civil liberties and individual rights over state authority and surveillance.`,
      fr: `Vous accordez une grande importance aux libertés civiles et aux droits individuels face à l'autorité étatique.`,
    },
    DEMOCRACY: {
      en: `You place high value on democratic institutions, the rule of law, and checks and balances.`,
      fr: `Vous attachez une grande importance aux institutions démocratiques, à l'état de droit et aux contre-pouvoirs.`,
    },
    DEMOCRACY_LOW: {
      en: `You are skeptical of established institutions and lean toward more direct, popular forms of democracy.`,
      fr: `Vous êtes sceptique envers les institutions établies et penchezvers des formes plus directes et populaires de démocratie.`,
    },
    GLOBAL: {
      en: `You place strong emphasis on national sovereignty and are skeptical of supranational institutions.`,
      fr: `Vous accordez une grande importance à la souveraineté nationale et êtes sceptique envers les institutions supranationales.`,
    },
    GLOBAL_LOW: {
      en: `You strongly support international cooperation and multilateral institutions.`,
      fr: `Vous soutenez fortement la coopération internationale et les institutions multilatérales.`,
    },
  };

  const top = candidates[0];
  return sentences[top.theme]?.[lang] ?? null;
}

function getOverallSentence(rankedCurrents, lang) {
  if (!rankedCurrents?.length) return null;
  const top = rankedCurrents[0];
  const second = rankedCurrents[1];
  const topName = top.name[lang] ?? top.name.en;

  // If a close second exists (within 12 points), mention both
  if (second && second.alignment >= top.alignment - 12) {
    const secondName = second.name[lang] ?? second.name.en;
    return lang === 'fr'
      ? `Dans l'ensemble, vos tendances se situent entre « ${topName} » et « ${secondName} », avec des affinités dans les deux directions.`
      : `Overall, your tendencies sit between ${topName} and ${secondName}, with genuine affinities in both directions.`;
  }

  return lang === 'fr'
    ? `Dans l'ensemble, vos tendances politiques se rapprochent le plus de « ${topName} » (${top.alignment}% de compatibilité).`
    : `Overall, your political tendencies lean most strongly toward ${topName} (${top.alignment}% match).`;
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function pickByThreshold(thresholdMap, value) {
  for (const [threshold, text] of thresholdMap) {
    if (value < threshold) return text;
  }
  return thresholdMap[thresholdMap.length - 1][1];
}

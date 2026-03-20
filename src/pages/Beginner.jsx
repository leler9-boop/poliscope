import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store/useStore.js';

// ─── Content ──────────────────────────────────────────────────────────────────

const TOPICS = [
  {
    id: 'left_right',
    icon: '⚖️',
    title: { en: `Left vs. Right`, fr: `Gauche et droite` },
    definition: {
      en: `In politics, "left" and "right" describe two broad ways of thinking about society. The left generally values equality and social change. The right generally values tradition and individual freedom.`,
      fr: `En politique, « gauche » et « droite » décrivent deux grandes façons de voir la société. La gauche valorise l'égalité et le changement social. La droite valorise la tradition et la liberté individuelle.`,
    },
    example: {
      en: `If the government raises taxes on the rich to help the poor — that's a left-wing idea. If it cuts taxes so everyone keeps more of what they earn — that's more right-wing.`,
      fr: `Si le gouvernement augmente les impôts des riches pour aider les pauvres — c'est une idée de gauche. S'il réduit les impôts pour que chacun garde plus de son argent — c'est plutôt de droite.`,
    },
    politics: {
      en: `Left-wing parties often support strong public services, redistribution, and progressive social change. Right-wing parties tend to favour economic freedom, lower taxes, and traditional values.`,
      fr: `Les partis de gauche soutiennent souvent des services publics forts, la redistribution et le changement social. Les partis de droite favorisent la liberté économique, des impôts bas et les valeurs traditionnelles.`,
    },
  },
  {
    id: 'economy',
    icon: '💶',
    title: { en: `The Economy`, fr: `L'économie` },
    definition: {
      en: `The economy is about how money, jobs, and goods are organised in a country. The main political debate: should the government run things, or leave it to the private market?`,
      fr: `L'économie concerne l'organisation de l'argent, des emplois et des biens dans un pays. Le débat politique central : le gouvernement doit-il tout contrôler, ou laisser faire le marché privé ?`,
    },
    example: {
      en: `If the government builds and owns public housing — that's state-led. If private companies build it and sell it for profit — that's market-led.`,
      fr: `Si l'État construit et possède des logements sociaux — c'est l'économie dirigée. Si des entreprises privées les construisent pour faire des profits — c'est le marché libre.`,
    },
    politics: {
      en: `The left tends to support more state intervention: taxes, welfare, regulation. The right tends to support free markets, lower taxes, and less government involvement.`,
      fr: `La gauche soutient davantage l'intervention de l'État : impôts, aides sociales, régulation. La droite préfère les marchés libres, moins d'impôts et moins de gouvernement.`,
    },
  },
  {
    id: 'immigration',
    icon: '🌍',
    title: { en: `Immigration`, fr: `L'immigration` },
    definition: {
      en: `Immigration is when people move from one country to another to live and work. The political debate is about how many people should be allowed in, and under what conditions.`,
      fr: `L'immigration, c'est quand des personnes quittent un pays pour aller vivre et travailler dans un autre. Le débat porte sur le nombre de personnes autorisées à entrer, et dans quelles conditions.`,
    },
    example: {
      en: `Some countries have strict border controls and limited visas. Others, like EU member states, allow free movement within the region.`,
      fr: `Certains pays ont des contrôles aux frontières stricts et des visas limités. D'autres, comme les États membres de l'UE, permettent la libre circulation dans la région.`,
    },
    politics: {
      en: `The left often supports welcoming more migrants and protecting their rights. The right often favours stricter controls and prioritising citizens already in the country.`,
      fr: `La gauche soutient souvent l'accueil de plus de migrants et la protection de leurs droits. La droite préfère des contrôles plus stricts et la priorité aux citoyens déjà présents dans le pays.`,
    },
  },
  {
    id: 'ecology',
    icon: '🌱',
    title: { en: `Ecology`, fr: `L'écologie` },
    definition: {
      en: `Ecology in politics is about how governments protect the environment — from climate change to pollution to biodiversity. The debate: how much should we change our way of life to protect nature?`,
      fr: `L'écologie en politique concerne la façon dont les gouvernements protègent l'environnement — du changement climatique à la biodiversité. Le débat : jusqu'où faut-il changer notre mode de vie pour protéger la nature ?`,
    },
    example: {
      en: `Should the government ban petrol cars by 2035? Should it tax factories that pollute? Should it ban plastic packaging? These are ecological political decisions.`,
      fr: `Le gouvernement doit-il interdire les voitures à essence d'ici 2035 ? Taxer les usines polluantes ? Interdire les emballages plastiques ? Ce sont des décisions politiques écologiques.`,
    },
    politics: {
      en: `Green parties and the left often support strong environmental rules and rapid change. The right tends to balance ecology with economic concerns and prefers gradual action.`,
      fr: `Les partis Verts et la gauche soutiennent souvent des règles environnementales strictes et un changement rapide. La droite cherche à équilibrer écologie et économie et préfère une action progressive.`,
    },
  },
  {
    id: 'globalization',
    icon: '🌐',
    title: { en: `Globalization`, fr: `La mondialisation` },
    definition: {
      en: `Globalization means countries are more and more connected — through trade, travel, and culture. The debate: is this a good thing, or does it hurt local communities?`,
      fr: `La mondialisation, c'est le fait que les pays sont de plus en plus connectés — par le commerce, les voyages et la culture. Le débat : est-ce une bonne chose, ou cela nuit-il aux communautés locales ?`,
    },
    example: {
      en: `When you buy a phone made in China, that's globalization. When a local factory closes because production moves abroad to save money — that's also globalization.`,
      fr: `Quand vous achetez un téléphone fabriqué en Chine, c'est la mondialisation. Quand une usine locale ferme parce que la production part à l'étranger pour économiser — c'est aussi la mondialisation.`,
    },
    politics: {
      en: `Internationalists (often centre/left) support open trade and global cooperation. Nationalists (often right) want to protect local jobs and reduce dependence on other countries.`,
      fr: `Les internationalistes (souvent centre/gauche) soutiennent le commerce ouvert et la coopération mondiale. Les nationalistes (souvent à droite) veulent protéger les emplois locaux et réduire la dépendance étrangère.`,
    },
  },
  {
    id: 'public_services',
    icon: '🏥',
    title: { en: `Public Services`, fr: `Les services publics` },
    definition: {
      en: `Public services are things the state provides to everyone — schools, hospitals, public transport, social housing. The debate: should these be run by the government, or by private companies?`,
      fr: `Les services publics, ce sont les choses que l'État fournit à tous — écoles, hôpitaux, transports en commun, logements sociaux. Le débat : doivent-ils être gérés par l'État ou par des entreprises privées ?`,
    },
    example: {
      en: `In France, most hospitals are public — anyone can go, costs are covered by the state. In the US, many hospitals are private — you pay directly or through insurance.`,
      fr: `En France, la plupart des hôpitaux sont publics — tout le monde peut y aller, l'État couvre les coûts. Aux États-Unis, beaucoup d'hôpitaux sont privés — vous payez directement ou via une assurance.`,
    },
    politics: {
      en: `The left generally wants to expand and protect public services. The right often believes private companies can provide them more efficiently and at lower cost to the state.`,
      fr: `La gauche veut généralement développer et protéger les services publics. La droite croit souvent que le secteur privé peut les fournir plus efficacement et à moindre coût pour l'État.`,
    },
  },
  {
    id: 'security',
    icon: '🛡️',
    title: { en: `Security`, fr: `La sécurité` },
    definition: {
      en: `Security in politics is about keeping people safe — from crime, terrorism, and disorder. The debate: how far should the state go to ensure safety, and at what cost to our freedoms?`,
      fr: `La sécurité en politique concerne la protection des personnes — contre le crime, le terrorisme et le désordre. Le débat : jusqu'où l'État peut-il aller pour assurer la sécurité, et à quel coût pour nos libertés ?`,
    },
    example: {
      en: `Should police be able to search anyone on the street without a specific reason? Should every public space have cameras? These are security vs. freedom trade-offs.`,
      fr: `La police doit-elle pouvoir fouiller n'importe qui dans la rue sans raison précise ? Toutes les places publiques doivent-elles avoir des caméras ? Ce sont des arbitrages entre sécurité et liberté.`,
    },
    politics: {
      en: `The right tends to support more policing and stricter laws. The left often focuses on the social roots of crime — poverty, inequality — and on protecting civil liberties.`,
      fr: `La droite soutient davantage de police et des lois plus strictes. La gauche se concentre souvent sur les causes sociales du crime — pauvreté, inégalités — et sur la protection des libertés civiles.`,
    },
  },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

// ─── Topic card ───────────────────────────────────────────────────────────────

function TopicCard({ topic, language, onCTA, delay }) {
  const [open, setOpen] = useState(false);

  const t = (key) => topic[key]?.[language] ?? topic[key]?.en ?? '';

  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
      {...fadeUp(delay)}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-2xl flex-shrink-0 w-9 text-center">{topic.icon}</span>
        <span className="font-semibold text-gray-900 text-base flex-1 leading-snug">
          {t('title')}
        </span>
        <span className="text-gray-300 text-lg leading-none flex-shrink-0">
          {open ? '−' : '+'}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-50 space-y-4">

              {/* Definition */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? 'C\'est quoi ?' : 'What is it?'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{t('definition')}</p>
              </div>

              {/* Example */}
              <div className="bg-gray-50 rounded-xl px-4 py-3">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? 'Exemple concret' : 'Concrete example'}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{t('example')}</p>
              </div>

              {/* Political meaning */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? 'En politique, ça donne quoi ?' : 'What does this mean politically?'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{t('politics')}</p>
              </div>

              {/* CTA */}
              <button
                onClick={onCTA}
                className="mt-1 w-full flex items-center justify-between px-4 py-3 rounded-xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all group"
              >
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                  {language === 'fr' ? 'Voir où je me situe →' : 'See where I stand →'}
                </span>
                <span className="text-xs text-gray-400 group-hover:text-gray-600 transition-colors">
                  {language === 'fr' ? 'Faire le test' : 'Take the quiz'}
                </span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Beginner() {
  const language = useStore(s => s.language);
  const navigate = useStore(s => s.navigate);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      {/* Page header */}
      <motion.div className="mb-10" {...fadeUp(0)}>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <span>💡</span>
          {language === 'fr' ? 'Mode débutant' : 'Beginner mode'}
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-3">
          {language === 'fr' ? 'J\'y connais rien' : 'Politics 101'}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
          {language === 'fr'
            ? 'Les grands concepts politiques expliqués simplement. Pas de jargon. Pas de théorie compliquée. Juste l\'essentiel.'
            : 'The big political concepts explained simply. No jargon. No complex theory. Just the essentials.'}
        </p>
      </motion.div>

      {/* Topic cards */}
      <div className="space-y-3">
        {TOPICS.map((topic, idx) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            language={language}
            delay={0.05 + idx * 0.04}
            onCTA={() => navigate('selectTest')}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="mt-12 bg-gray-900 rounded-2xl px-6 py-7 text-center"
        {...fadeUp(0.5)}
      >
        <p className="text-white font-bold text-lg mb-2">
          {language === 'fr' ? 'Prêt à découvrir votre profil ?' : 'Ready to find your profile?'}
        </p>
        <p className="text-gray-400 text-sm mb-5">
          {language === 'fr'
            ? 'Répondez à quelques questions. On s\'occupe du reste.'
            : 'Answer a few questions. We\'ll handle the rest.'}
        </p>
        <button
          onClick={() => navigate('selectTest')}
          className="bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
        >
          {language === 'fr' ? 'Construire mon profil →' : 'Build my profile →'}
        </button>
      </motion.div>
    </div>
  );
}

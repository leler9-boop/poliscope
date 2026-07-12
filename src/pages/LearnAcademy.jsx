import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { useStore } from '../store/useStore.js';
import { findBySlug } from '../content/learn/manifest.js';

const L = (field, language) => field?.[language] ?? field?.fr ?? '';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay },
});

/* ── données éditoriales de la vitrine Academy ────────────────────────────── */

const DOSSIERS_IDEOLOGIES = [
  { slug: 'droite', live: true },
  { slug: 'gauche', icon: '📕', title: { fr: 'La gauche' }, hook: { fr: `Égalité, solidarité… et de nombreuses gauches, de la révolution au réformisme.` } },
  { slug: 'extreme-droite', icon: '📓', title: { fr: `L'extrême droite` }, hook: { fr: `Histoire, critères de classement, différences avec la droite : comprendre au lieu de subir le débat.` } },
  { slug: 'extreme-gauche', icon: '📔', title: { fr: `L'extrême gauche` }, hook: { fr: `Trotskisme, communisme révolutionnaire, anarchisme : la gauche de la gauche.` } },
  { slug: 'centre', icon: '📙', title: { fr: 'Le centre' }, hook: { fr: `Ni neutre ni sans opinion : la tradition centriste française, de la démocratie chrétienne au macronisme.` } },
];

const DOSSIERS_DEBATS = [
  { slug: 'oqtf', live: true },
  { slug: 'inflation', live: true },
  { slug: 'retraites', live: true },
  { slug: 'immigration', icon: '🌍', title: { fr: `L'immigration` }, hook: { fr: `Chiffres sourcés, droit réel, positions de chaque famille : le débat sans les slogans.` } },
  { slug: 'laicite', icon: '🕊️', title: { fr: 'La laïcité' }, hook: { fr: `Ce que dit vraiment la loi de 1905 — et pourquoi tout le monde s'en réclame.` } },
  { slug: 'union-europeenne', icon: '🇪🇺', title: { fr: `L'Union européenne` }, hook: { fr: `Qui décide quoi à Bruxelles, et les différentes visions de l'Europe.` } },
];

const PRESIDENTS = [
  { nom: 'Charles de Gaulle', annees: '1959-1969' },
  { nom: 'Georges Pompidou', annees: '1969-1974' },
  { nom: `Valéry Giscard d'Estaing`, annees: '1974-1981' },
  { nom: 'François Mitterrand', annees: '1981-1995', to: '/learn/presidents/francois-mitterrand?niveau=3' },
  { nom: 'Jacques Chirac', annees: '1995-2007' },
  { nom: 'Nicolas Sarkozy', annees: '2007-2012' },
  { nom: 'François Hollande', annees: '2012-2017' },
  { nom: 'Emmanuel Macron', annees: '2017-' },
];

const OUTILS = [
  { icon: '📖', title: { fr: 'Le dictionnaire politique' }, hook: { fr: 'Chaque mot en trois niveaux de lecture' }, to: '/learn/dico' },
  { icon: '⚖️', title: { fr: 'Les comparateurs' }, hook: { fr: `Deux à quatre idées côte à côte : socialisme et social-démocratie, régimes parlementaire et présidentiel…` } },
  { icon: '📜', title: { fr: 'Les chronologies' }, hook: { fr: `Les Républiques, l'histoire de la gauche et de la droite, la construction européenne — en frises interactives.` } },
  { icon: '🔬', title: { fr: 'Comment le sait-on ?' }, hook: { fr: `Lire un sondage, une statistique, un graphique — la boîte à outils du citoyen.` } },
];

const RESSOURCES = [
  { nom: 'Vie-publique.fr', desc: { fr: `La documentation publique de référence : institutions, politiques publiques, débats.` }, url: 'https://www.vie-publique.fr' },
  { nom: 'Légifrance', desc: { fr: `Tous les textes de loi en vigueur, la Constitution, les codes.` }, url: 'https://www.legifrance.gouv.fr' },
  { nom: 'INSEE', desc: { fr: `Les statistiques officielles : économie, démographie, société.` }, url: 'https://www.insee.fr' },
  { nom: 'Assemblée nationale', desc: { fr: `Textes en discussion, votes, comptes rendus des débats.` }, url: 'https://www.assemblee-nationale.fr' },
  { nom: 'Sénat', desc: { fr: `Travaux, rapports et vidéos de la seconde chambre.` }, url: 'https://www.senat.fr' },
  { nom: 'Conseil constitutionnel', desc: { fr: `Les décisions qui vérifient la conformité des lois à la Constitution.` }, url: 'https://www.conseil-constitutionnel.fr' },
];

const DOSSIERS_INSTITUTIONS = [
  { slug: 'president-de-la-republique', live: true },
  { slug: 'assemblee-nationale', icon: '🏛️', title: { fr: `L'Assemblée nationale` }, hook: { fr: `Qui vote les lois, comment tombe un gouvernement — le cœur du pouvoir législatif.` } },
  { slug: 'conseil-constitutionnel', icon: '⚖️', title: { fr: `Le Conseil constitutionnel` }, hook: { fr: `Les neuf personnes qui peuvent annuler une loi votée — et pourquoi c'est voulu.` } },
];

/* ── composants ───────────────────────────────────────────────────────────── */

function SectionLabel({ children }) {
  return <p className="text-xs font-bold uppercase tracking-wide text-gray-400 mb-3">{children}</p>;
}

function DossierCard({ item, language }) {
  const entry = item.live ? findBySlug(item.slug) : null;
  if (entry) {
    return (
      <Link
        to={`/learn/${entry.section}/${entry.slug}?niveau=3`}
        className="group block bg-white border border-gray-200 hover:border-gray-900 rounded-2xl px-4 py-4 transition-colors"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <span className="text-2xl shrink-0">{entry.icon}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold text-gray-900">{L(entry.title, language)}</p>
              <p className="text-xs text-gray-500 leading-snug mt-1">{L(entry.hook, language)}</p>
              <p className="text-[11px] text-gray-400 mt-1.5">
                ✓ {language === 'fr' ? 'vérifié' : 'verified'} · {entry.hasLevels.length} {language === 'fr' ? 'niveaux de lecture' : 'reading levels'}
              </p>
            </div>
          </div>
          <span className="text-gray-300 group-hover:text-gray-900 transition-colors shrink-0">→</span>
        </div>
      </Link>
    );
  }
  return (
    <div className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl px-4 py-4">
      <div className="flex items-start gap-3">
        <span className="text-2xl shrink-0 opacity-60">{item.icon}</span>
        <div>
          <p className="text-sm font-bold text-gray-500 flex items-center gap-2">
            {L(item.title, language)}
            <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
              {language === 'fr' ? 'en préparation' : 'coming soon'}
            </span>
          </p>
          <p className="text-xs text-gray-400 leading-snug mt-1">{L(item.hook, language)}</p>
        </div>
      </div>
    </div>
  );
}

/* ── page ─────────────────────────────────────────────────────────────────── */

export default function LearnAcademy() {
  const language = useStore(s => s.language);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-14">

      {/* Fil d'Ariane */}
      <motion.nav {...fadeUp(0)} className="text-xs text-gray-400 mb-6">
        <Link to="/learn" className="hover:text-gray-600 transition-colors">
          {language === 'fr' ? `J'y connais rien` : 'Politics 101'}
        </Link>
        <span className="mx-1.5">›</span>
        <span className="text-gray-600 font-medium">Poliscop Academy</span>
      </motion.nav>

      {/* Hero */}
      <motion.div {...fadeUp(0.05)} className="relative overflow-hidden bg-gray-900 rounded-3xl px-6 sm:px-8 py-8 sm:py-10 mb-10">
        <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5" />
        <div className="absolute -bottom-20 -left-10 w-56 h-56 rounded-full bg-white/[0.04]" />
        <p className="relative text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Poliscop</p>
        <h1 className="relative text-3xl sm:text-4xl font-bold text-white tracking-tight mb-3">Academy</h1>
        <p className="relative text-gray-300 text-sm leading-relaxed max-w-md mb-5">
          {language === 'fr'
            ? `Les grands dossiers de la politique française : fiches complètes, histoire, comparaisons, chronologies — tout est sourcé, daté et vérifié.`
            : `The deep-dive side of Poliscop: complete dossiers, history, comparisons, timelines — everything sourced, dated and verified.`}
        </p>
        <div className="relative flex flex-wrap gap-x-5 gap-y-1 text-xs text-gray-400">
          <span>📚 {language === 'fr' ? '4 niveaux de lecture' : '4 reading levels'}</span>
          <span>🧾 {language === 'fr' ? 'sources officielles' : 'official sources'}</span>
          <span>🕰 {language === 'fr' ? 'dates de vérification affichées' : 'verification dates shown'}</span>
        </div>
      </motion.div>

      {/* Les grands dossiers — idéologies */}
      <motion.div {...fadeUp(0.1)} className="mb-10">
        <SectionLabel>{language === 'fr' ? 'Les grandes familles politiques' : 'The great political families'}</SectionLabel>
        <div className="space-y-2.5">
          {DOSSIERS_IDEOLOGIES.map(d => <DossierCard key={d.slug} item={d} language={language} />)}
        </div>
      </motion.div>

      {/* Les institutions */}
      <motion.div {...fadeUp(0.12)} className="mb-10">
        <SectionLabel>{language === 'fr' ? 'Comment fonctionne vraiment la France' : 'How France actually works'}</SectionLabel>
        <div className="space-y-2.5">
          {DOSSIERS_INSTITUTIONS.map(d => <DossierCard key={d.slug} item={d} language={language} />)}
        </div>
      </motion.div>

      {/* Les grands débats */}
      <motion.div {...fadeUp(0.14)} className="mb-10">
        <SectionLabel>{language === 'fr' ? 'Les débats qui structurent la France' : 'The debates that shape France'}</SectionLabel>
        <div className="space-y-2.5">
          {DOSSIERS_DEBATS.map(d => <DossierCard key={d.slug} item={d} language={language} />)}
        </div>
      </motion.div>

      {/* Les présidents — frise teaser */}
      <motion.div {...fadeUp(0.18)} className="mb-10">
        <SectionLabel>{language === 'fr' ? 'Les présidents de la Ve République' : 'Presidents of the Fifth Republic'}</SectionLabel>
        <div className="bg-white border border-gray-200 rounded-2xl p-5">
          <div className="flex gap-3 overflow-x-auto pb-2 -mb-2">
            {PRESIDENTS.map((p, i) => {
              const inner = (
                <>
                  <div className={`w-12 h-12 mx-auto rounded-full text-xs font-bold flex items-center justify-center mb-1.5 ${p.to ? 'bg-gray-900 text-white' : 'bg-gray-100 border border-gray-200 text-gray-500'}`}>
                    {p.nom.split(' ').map(w => w[0]).slice(-2).join('').toUpperCase()}
                  </div>
                  <p className="text-[11px] font-semibold text-gray-700 leading-tight">{p.nom.split(' ').slice(-1)[0]}</p>
                  <p className="text-[10px] text-gray-400 tabular-nums">{p.annees}</p>
                </>
              );
              return p.to ? (
                <Link key={i} to={p.to} className="shrink-0 w-24 text-center hover:opacity-80 transition-opacity">{inner}</Link>
              ) : (
                <div key={i} className="shrink-0 w-24 text-center">{inner}</div>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 mt-3">
            {language === 'fr'
              ? `Une fiche complète par président — élection, mesures, bilan, idées reçues. Première fiche disponible : François Mitterrand (cliquez sur son avatar). Les autres arrivent.`
              : `A complete page per president — election, record, legacy, myths. First one available: François Mitterrand (click his avatar). More coming.`}
          </p>
        </div>
      </motion.div>

      {/* Outils */}
      <motion.div {...fadeUp(0.22)} className="mb-10">
        <SectionLabel>{language === 'fr' ? 'Les outils' : 'Tools'}</SectionLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {OUTILS.map((o, i) => {
            const inner = (
              <>
                <span className="text-xl block mb-1">{o.icon}</span>
                <span className="text-sm font-semibold flex items-center gap-1.5 flex-wrap">
                  <span className={o.to ? 'text-gray-900' : 'text-gray-500'}>{L(o.title, language)}</span>
                  {!o.to && (
                    <span className="text-[9px] font-semibold uppercase tracking-wide text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                      {language === 'fr' ? 'en préparation' : 'soon'}
                    </span>
                  )}
                </span>
                <span className="text-[11px] text-gray-400 block mt-0.5 leading-snug">{L(o.hook, language)}</span>
              </>
            );
            return o.to ? (
              <Link key={i} to={o.to} className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl px-4 py-3.5 transition-colors">
                {inner}
              </Link>
            ) : (
              <div key={i} className="bg-gray-50 border border-dashed border-gray-200 rounded-2xl px-4 py-3.5">{inner}</div>
            );
          })}
        </div>
      </motion.div>

      {/* Ressources officielles */}
      <motion.div {...fadeUp(0.26)} className="mb-6">
        <SectionLabel>{language === 'fr' ? 'Les sources que nous utilisons' : 'The sources we rely on'}</SectionLabel>
        <div className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100">
          {RESSOURCES.map((r, i) => (
            <a
              key={i}
              href={r.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <span>
                <span className="block text-sm font-semibold text-gray-800">{r.nom}</span>
                <span className="block text-xs text-gray-500 leading-snug mt-0.5">{L(r.desc, language)}</span>
              </span>
              <span className="text-gray-300 shrink-0">↗</span>
            </a>
          ))}
        </div>
        <p className="text-[11px] text-gray-400 mt-3 px-1">
          {language === 'fr'
            ? `Chaque fiche de l'Academy cite ses sources en bas de page, avec l'année et le périmètre de chaque chiffre.`
            : `Every Academy page cites its sources, with the year and scope of every figure.`}
        </p>
      </motion.div>

      {/* Retour débutant */}
      <div className="text-center mt-8">
        <Link
          to="/learn"
          className="inline-block text-sm font-semibold text-gray-500 hover:text-gray-900 transition-colors"
        >
          ← {language === 'fr' ? `Revenir à « J'y connais rien »` : 'Back to the basics'}
        </Link>
      </div>
    </div>
  );
}

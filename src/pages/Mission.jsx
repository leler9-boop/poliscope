import React from 'react';
import { useStore } from '../store/useStore.js';

const content = {
  en: {
    title: 'Mission',
    subtitle: 'Why this project exists and what it is trying to do.',

    s1_label: 'The starting point',
    s1_heading: 'Politics affects everyday life',
    s1_p1: 'The price of fuel. The quality of schools. Whether healthcare is free or expensive. How much you pay in taxes. What happens to the environment. Which freedoms you have or lose. Politics shapes all of these things — whether or not we think about it.',
    s1_p2: 'And yet, for many people — especially younger generations — engaging with politics has become harder, not easier.',

    s2_label: 'The problem',
    s2_heading: 'How we receive political information today',
    s2_p1: 'Most people now get their news and political information through social media. Several studies have found that a majority of young adults rely primarily on platforms like Instagram, TikTok, X, or YouTube for political content.',
    s2_p2: 'These platforms are not designed to inform. They are designed to keep you watching. Their algorithms prioritise content that generates reactions — outrage, emotion, conflict — because that keeps people scrolling. Understanding is often secondary to engagement.',
    s2_p3: 'The result is a political environment that often feels noisy, tribal, and exhausting. It becomes easier to know which side someone is on than to understand what they actually think.',

    s3_label: 'The idea',
    s3_heading: 'What if you could compare ideas without the noise?',
    s3_p1: 'Poliscop tries to do something simpler. Instead of opinions and arguments, it focuses on policies and positions. You answer a set of structured questions about real political issues — immigration, public spending, climate, security, and so on.',
    s3_p2: 'Your answers are then compared to the positions held by candidates or parties. The closer your views are to theirs, the higher your compatibility score. That is the whole mechanism.',
    s3_p3: "There is no editorial voice here. No commentary telling you who is right or wrong. The tool does not tell you who to vote for. Its only goal is to show you which candidates are closest to your own expressed views — and let you decide what to do with that.",

    s4_label: 'Independent thinking',
    s4_heading: 'Your opinions, not your background',
    s4_p1: 'Many people vote the way their family votes, or align with the party that represents their neighbourhood, profession, or social group — without ever deeply examining whether they actually agree with those positions.',
    s4_p2: 'Poliscop gives you a space to answer questions independently, without external pressure. You may confirm what you already believed. You may discover that some of your views are closer to a different party than you expected. Either way, you end up with a clearer picture of where you actually stand.',

    s5_label: 'Historical figures',
    s5_heading: 'A cultural extra',
    s5_p1: 'The site also lets you compare your profile to historical and political figures from history — thinkers, leaders, revolutionaries.',
    s5_p2: 'This is a fun addition, not a serious political feature. It is there to make the experience more engaging and to help you understand ideological concepts through recognisable names. These profiles are rough approximations and should be read as intellectual exploration, nothing more.',

    s6_label: 'Neutrality and limitations',
    s6_heading: 'What this tool cannot do',
    s6_p1: 'Political positions are complex. A candidate may say one thing and do another. They may hold nuanced views on some issues while being very clear on others. They change over time.',
    s6_p2: "The positions assigned to candidates in this tool are estimates. They are built from public information: speeches, political programmes, interviews, public statements, and sometimes voting records where available. Assembling this information inevitably requires interpretation — ours may not always be perfect.",
    s6_p3: 'We make a strong effort to be neutral and balanced across all parties and political families. But we acknowledge the following:',
    s6_limits: [
      'Candidates can change positions over time.',
      'Some issues are genuinely ambiguous or contested in their meaning.',
      "Our interpretation of public statements may differ from the candidate's own reading.",
      'Political positions evolve — what was true a year ago may be less accurate today.',
    ],
    s6_p4: 'The profiles on this site are educational approximations meant to help you compare general political orientations. They are not official or endorsed representations of any candidate or party.',
    s6_p5: 'Poliscop does not endorse any political party, candidate, or ideology. We encourage you to explore multiple sources of information before forming your views.',
  },

  fr: {
    title: "Mission",
    subtitle: "Pourquoi ce projet existe et ce qu'il cherche à faire.",

    s1_label: "Le point de départ",
    s1_heading: "La politique affecte la vie quotidienne",
    s1_p1: "Le prix du carburant. La qualité des écoles. Si les soins de santé sont gratuits ou coûteux. Le montant de vos impôts. Ce qui arrive à l'environnement. Les libertés que vous avez ou perdez. La politique façonne tout cela — que nous y pensions ou non.",
    s1_p2: "Et pourtant, pour beaucoup de gens — en particulier les jeunes générations — s'intéresser à la politique est devenu plus difficile, pas plus facile.",

    s2_label: "Le problème",
    s2_heading: "Comment nous recevons l'information politique aujourd'hui",
    s2_p1: "La plupart des gens reçoivent aujourd'hui leurs informations politiques via les réseaux sociaux. Plusieurs études montrent qu'une majorité de jeunes adultes s'appuient principalement sur des plateformes comme Instagram, TikTok, X ou YouTube pour suivre l'actualité politique.",
    s2_p2: "Ces plateformes ne sont pas conçues pour informer. Elles sont conçues pour retenir l'attention. Leurs algorithmes privilégient les contenus qui génèrent des réactions — colère, émotion, conflit — parce que cela maintient l'engagement. Comprendre est souvent secondaire par rapport à réagir.",
    s2_p3: "Le résultat est un environnement politique qui paraît souvent bruyant, tribal et épuisant. Il devient plus facile de savoir de quel camp quelqu'un est que de comprendre ce qu'il pense vraiment.",

    s3_label: "L'idée",
    s3_heading: "Et si on pouvait comparer les idées sans tout ce bruit ?",
    s3_p1: "Poliscop tente de faire quelque chose de plus simple. Au lieu d'opinions et d'arguments, il se concentre sur les politiques et les positions. Vous répondez à un ensemble de questions structurées sur des enjeux politiques réels — immigration, dépenses publiques, climat, sécurité, et ainsi de suite.",
    s3_p2: "Vos réponses sont ensuite comparées aux positions des candidats ou partis. Plus vos opinions sont proches des leurs, plus votre score de compatibilité est élevé. C'est le mécanisme entier.",
    s3_p3: "Il n'y a pas de voix éditoriale ici. Pas de commentaire qui dit qui a tort ou raison. L'outil ne vous dit pas pour qui voter. Son seul but est de montrer quels candidats sont les plus proches de vos opinions exprimées — et vous laisser décider ce que vous en faites.",

    s4_label: "Penser par soi-même",
    s4_heading: "Vos opinions, pas votre environnement",
    s4_p1: "Beaucoup de gens votent comme leur famille, ou s'alignent sur le parti qui représente leur quartier, leur profession ou leur groupe social — sans jamais examiner sérieusement s'ils sont réellement d'accord avec ces positions.",
    s4_p2: "Poliscop vous offre un espace pour répondre à des questions de manière indépendante, sans pression extérieure. Vous pouvez confirmer ce que vous croyiez déjà. Vous pouvez découvrir que certaines de vos opinions sont plus proches d'un autre parti que prévu. Dans tous les cas, vous obtenez une image plus claire de votre positionnement réel.",

    s5_label: "Figures historiques",
    s5_heading: "Un ajout culturel",
    s5_p1: "Le site vous permet aussi de comparer votre profil à des figures historiques et politiques — penseurs, dirigeants, révolutionnaires.",
    s5_p2: "C'est un ajout ludique, pas une fonctionnalité politique sérieuse. Il est là pour rendre l'expérience plus engageante et vous aider à comprendre des concepts idéologiques à travers des noms reconnaissables. Ces profils sont des approximations grossières à lire comme une exploration intellectuelle, rien de plus.",

    s6_label: "Neutralité et limites",
    s6_heading: "Ce que cet outil ne peut pas faire",
    s6_p1: "Les positions politiques sont complexes. Un candidat peut dire une chose et en faire une autre. Il peut avoir des vues nuancées sur certains sujets tout en étant très clair sur d'autres. Ils évoluent avec le temps.",
    s6_p2: "Les positions attribuées aux candidats dans cet outil sont des estimations. Elles sont construites à partir d'informations publiques : discours, programmes politiques, interviews, déclarations publiques, et parfois des votes lorsque disponibles. Rassembler ces informations implique inévitablement une interprétation — la nôtre peut ne pas toujours être parfaite.",
    s6_p3: "Nous faisons un effort sérieux pour être neutres et équilibrés entre tous les partis et familles politiques. Mais nous reconnaissons ce qui suit :",
    s6_limits: [
      "Les candidats peuvent changer de position au fil du temps.",
      "Certains sujets sont genuinement ambigus ou contestés dans leur signification.",
      "Notre interprétation des déclarations publiques peut différer de la lecture du candidat lui-même.",
      "Les positions politiques évoluent — ce qui était vrai il y a un an peut être moins précis aujourd'hui.",
    ],
    s6_p4: "Les profils de ce site sont des approximations éducatives destinées à aider à comparer les orientations politiques générales. Ils ne sont pas des représentations officielles ou approuvées d'un candidat ou parti.",
    s6_p5: "Poliscop ne soutient aucun parti politique, candidat ou idéologie. Nous vous encourageons à explorer plusieurs sources d'information avant de former vos opinions.",
  },
};

function SectionLabel({ text }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{text}</p>
  );
}

export default function Mission() {
  const language = useStore(s => s.language);
  const c = content[language];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">{c.title}</h1>
        <p className="text-gray-500 text-sm">{c.subtitle}</p>
      </div>

      {/* Section 1 — Why politics matters */}
      <section className="mb-10">
        <SectionLabel text={c.s1_label} />
        <h2 className="text-lg font-bold text-gray-900 mb-3">{c.s1_heading}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s1_p1}</p>
        <p className="text-gray-700 text-sm leading-relaxed">{c.s1_p2}</p>
      </section>

      <div className="border-t border-gray-100 mb-10" />

      {/* Section 2 — The problem */}
      <section className="mb-10">
        <SectionLabel text={c.s2_label} />
        <h2 className="text-lg font-bold text-gray-900 mb-3">{c.s2_heading}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s2_p1}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s2_p2}</p>
        <p className="text-gray-700 text-sm leading-relaxed">{c.s2_p3}</p>
      </section>

      <div className="border-t border-gray-100 mb-10" />

      {/* Section 3 — The idea */}
      <section className="mb-10">
        <SectionLabel text={c.s3_label} />
        <h2 className="text-lg font-bold text-gray-900 mb-3">{c.s3_heading}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s3_p1}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s3_p2}</p>
        <div className="bg-gray-50 border-l-2 border-gray-300 pl-4 py-3 rounded-r-lg mb-3">
          <p className="text-gray-700 text-sm leading-relaxed">{c.s3_p3}</p>
        </div>
      </section>

      <div className="border-t border-gray-100 mb-10" />

      {/* Section 4 — Independent thinking */}
      <section className="mb-10">
        <SectionLabel text={c.s4_label} />
        <h2 className="text-lg font-bold text-gray-900 mb-3">{c.s4_heading}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s4_p1}</p>
        <p className="text-gray-700 text-sm leading-relaxed">{c.s4_p2}</p>
      </section>

      <div className="border-t border-gray-100 mb-10" />

      {/* Section 5 — Historical figures */}
      <section className="mb-10">
        <SectionLabel text={c.s5_label} />
        <h2 className="text-lg font-bold text-gray-900 mb-3">{c.s5_heading}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s5_p1}</p>
        <p className="text-gray-500 text-sm leading-relaxed italic">{c.s5_p2}</p>
      </section>

      <div className="border-t border-gray-100 mb-10" />

      {/* Section 6 — Neutrality and limitations */}
      <section className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
        <SectionLabel text={c.s6_label} />
        <h2 className="text-lg font-bold text-gray-900 mb-3">{c.s6_heading}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s6_p1}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s6_p2}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s6_p3}</p>
        <ul className="mb-4 space-y-1.5">
          {c.s6_limits.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
              <span className="mt-1.5 w-1 h-1 rounded-full bg-gray-400 flex-shrink-0" />
              {item}
            </li>
          ))}
        </ul>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s6_p4}</p>
        <p className="text-gray-500 text-sm leading-relaxed">{c.s6_p5}</p>
      </section>

    </div>
  );
}

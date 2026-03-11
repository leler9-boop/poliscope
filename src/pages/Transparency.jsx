import React from 'react';
import { useStore } from '../store/useStore.js';

const content = {
  en: {
    title: 'Transparency',
    subtitle: 'How the scoring system works — no black boxes.',

    s1_label: 'The scoring system',
    s1_heading: 'A simple mathematical comparison',
    s1_p1: 'There is no AI deciding your results. No hidden weighting. No editorial judgement baked into the algorithm. The scoring system is a straightforward comparison between your answers and the positions of candidates.',
    s1_p2: 'Here is how it works, step by step.',

    steps: [
      {
        n: '01',
        heading: 'You answer questions',
        body: 'Each question covers a real political topic: immigration, the economy, climate, security, public services, and more. You answer on a scale from 1 (strongly disagree) to 5 (strongly agree). There are no trick questions and no correct answers.',
      },
      {
        n: '02',
        heading: 'Each candidate has a position too',
        body: 'For each question, every candidate also has a position on the same 1–5 scale. These positions are estimated from public sources — speeches, party programmes, interviews, and statements. We explain more about this in the Mission page.',
      },
      {
        n: '03',
        heading: 'The system measures the distance',
        body: 'For each question, the system measures how far apart your answer is from the candidate\'s position. If you answered 4 and the candidate is at 4, the distance is zero — perfect agreement. If you answered 1 and the candidate is at 5, the distance is as large as it can be.',
      },
      {
        n: '04',
        heading: 'Distance is turned into a score',
        body: 'Small distances produce high compatibility. Large distances produce low compatibility. Strong disagreement — where you are at opposite ends of the scale — is penalised more than moderate disagreement. The final score for each candidate is a percentage between 0% and 100%.',
      },
      {
        n: '05',
        heading: 'Topics you care about count more',
        body: 'Before starting the questionnaire, you can rank which topics matter most to you. If you mark the economy as your top priority, questions on that topic carry more weight in your final score. If you skip the ranking, all topics are weighted equally.',
      },
    ],

    s2_label: 'The result',
    s2_heading: 'What the score means',
    s2_p1: 'A 70% match does not mean you agree with a candidate on everything. It means that, across the questions you answered, your positions are generally close to theirs — closer than most other candidates.',
    s2_p2: 'A low score does not mean a candidate is bad. It means they hold very different positions from yours on the issues you were asked about.',
    s2_p3: 'The tool compares views, not values. It measures proximity, not worth.',

    s3_label: 'Open system',
    s3_heading: 'No hidden decisions',
    s3_p1: 'This is not a black box. The method is described here in plain language. The inputs are your answers. The output is a percentage derived from measuring how different those answers are from the candidate\'s positions.',
    s3_p2: 'There is no machine learning. No profiling. No inference about your identity, beliefs, or intentions beyond what you explicitly answer.',

    s4_label: 'Privacy',
    s4_heading: 'What we collect — and what we do not',
    s4_items: [
      { heading: 'No personal data collected', body: 'Poliscope does not ask for your name, address, age, or any other identifying information. None is required to use the tool.' },
      { heading: 'Your answers stay on your device', body: 'Your responses are stored in your browser\'s local storage. They do not leave your device unless you choose to create an account. If you do create an account, your profile is saved to allow you to return to it — but it is never shared, sold, or used for any purpose other than your own convenience.' },
      { heading: 'No data sold, ever', body: 'We do not sell user data. We do not share it with advertisers, political parties, research institutions, or any third party.' },
      { heading: 'Purpose: education, not influence', body: 'This project exists to support civic understanding. It is not a tool for political influence, commercial exploitation, or behavioural targeting. The goal is simply to help people think more clearly about where they stand.' },
    ],
  },

  fr: {
    title: "Transparence",
    subtitle: "Comment fonctionne le système de scoring — aucune boîte noire.",

    s1_label: "Le système de scoring",
    s1_heading: "Une comparaison mathématique simple",
    s1_p1: "Il n'y a pas d'IA qui décide de vos résultats. Pas de pondération cachée. Pas de jugement éditorial intégré dans l'algorithme. Le système de scoring est une comparaison directe entre vos réponses et les positions des candidats.",
    s1_p2: "Voici comment cela fonctionne, étape par étape.",

    steps: [
      {
        n: "01",
        heading: "Vous répondez à des questions",
        body: "Chaque question porte sur un vrai sujet politique : immigration, économie, climat, sécurité, services publics, et plus encore. Vous répondez sur une échelle de 1 (pas du tout d'accord) à 5 (tout à fait d'accord). Il n'y a pas de questions pièges et pas de bonnes réponses.",
      },
      {
        n: "02",
        heading: "Chaque candidat a aussi une position",
        body: "Pour chaque question, chaque candidat a également une position sur la même échelle de 1 à 5. Ces positions sont estimées à partir de sources publiques — discours, programmes politiques, interviews et déclarations. Nous expliquons davantage cela dans la page Mission.",
      },
      {
        n: "03",
        heading: "Le système mesure la distance",
        body: "Pour chaque question, le système mesure l'écart entre votre réponse et la position du candidat. Si vous avez répondu 4 et que le candidat est à 4, la distance est nulle — accord parfait. Si vous avez répondu 1 et que le candidat est à 5, la distance est maximale.",
      },
      {
        n: "04",
        heading: "La distance est convertie en score",
        body: "Les petites distances produisent une forte compatibilité. Les grandes distances produisent une faible compatibilité. Le désaccord fort — où vous êtes aux extrêmes opposés de l'échelle — est pénalisé davantage qu'un désaccord modéré. Le score final pour chaque candidat est un pourcentage entre 0 % et 100 %.",
      },
      {
        n: "05",
        heading: "Les sujets importants pour vous comptent davantage",
        body: "Avant de commencer le questionnaire, vous pouvez classer les sujets qui comptent le plus pour vous. Si vous indiquez l'économie comme votre priorité principale, les questions sur ce thème ont plus de poids dans votre score final. Si vous ignorez ce classement, tous les sujets sont pondérés à parts égales.",
      },
    ],

    s2_label: "Le résultat",
    s2_heading: "Ce que le score signifie",
    s2_p1: "Un score de 70 % ne signifie pas que vous êtes d'accord avec un candidat sur tout. Cela signifie que, parmi les questions auxquelles vous avez répondu, vos positions sont généralement proches des leurs — plus proches que la plupart des autres candidats.",
    s2_p2: "Un score faible ne signifie pas qu'un candidat est mauvais. Cela signifie qu'il défend des positions très différentes des vôtres sur les sujets abordés.",
    s2_p3: "L'outil compare des opinions, pas des valeurs. Il mesure la proximité, pas la valeur.",

    s3_label: "Système ouvert",
    s3_heading: "Aucune décision cachée",
    s3_p1: "Ce n'est pas une boîte noire. La méthode est décrite ici en langage clair. Les entrées sont vos réponses. La sortie est un pourcentage calculé en mesurant à quel point ces réponses diffèrent des positions du candidat.",
    s3_p2: "Il n'y a pas d'apprentissage automatique. Pas de profilage. Pas d'inférence sur votre identité, vos croyances ou vos intentions au-delà de ce que vous répondez explicitement.",

    s4_label: "Vie privée",
    s4_heading: "Ce que nous collectons — et ce que nous ne collectons pas",
    s4_items: [
      { heading: "Aucune donnée personnelle collectée", body: "Poliscope ne demande pas votre nom, adresse, âge ou toute autre information d'identification. Rien de tout cela n'est nécessaire pour utiliser l'outil." },
      { heading: "Vos réponses restent sur votre appareil", body: "Vos réponses sont stockées dans la mémoire locale de votre navigateur. Elles ne quittent pas votre appareil sauf si vous choisissez de créer un compte. Si vous créez un compte, votre profil est sauvegardé pour vous permettre d'y revenir — mais il n'est jamais partagé, vendu ou utilisé à d'autres fins." },
      { heading: "Aucune vente de données, jamais", body: "Nous ne vendons pas de données utilisateurs. Nous ne les partageons pas avec des annonceurs, des partis politiques, des institutions de recherche ou des tiers." },
      { heading: "Objectif : éducation, pas influence", body: "Ce projet existe pour soutenir la compréhension civique. Ce n'est pas un outil d'influence politique, d'exploitation commerciale ou de ciblage comportemental. Le but est simplement d'aider les gens à réfléchir plus clairement à leur positionnement." },
    ],
  },
};

function SectionLabel({ text }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">{text}</p>
  );
}

export default function Transparency() {
  const language = useStore(s => s.language);
  const c = content[language];

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 sm:py-16">

      {/* Page header */}
      <div className="mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-2">{c.title}</h1>
        <p className="text-gray-500 text-sm">{c.subtitle}</p>
      </div>

      {/* Section 1 — Overview */}
      <section className="mb-8">
        <SectionLabel text={c.s1_label} />
        <h2 className="text-lg font-bold text-gray-900 mb-3">{c.s1_heading}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-2">{c.s1_p1}</p>
        <p className="text-gray-500 text-sm leading-relaxed">{c.s1_p2}</p>
      </section>

      {/* Step-by-step cards */}
      <div className="space-y-3 mb-10">
        {c.steps.map((step) => (
          <div key={step.n} className="bg-white border border-gray-200 rounded-2xl p-5 flex gap-4">
            <span className="text-xs font-bold text-gray-300 tracking-widest mt-0.5 flex-shrink-0 w-6">{step.n}</span>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.heading}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 mb-10" />

      {/* Section 2 — What the score means */}
      <section className="mb-10">
        <SectionLabel text={c.s2_label} />
        <h2 className="text-lg font-bold text-gray-900 mb-3">{c.s2_heading}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s2_p1}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s2_p2}</p>
        <p className="text-gray-500 text-sm leading-relaxed italic">{c.s2_p3}</p>
      </section>

      <div className="border-t border-gray-100 mb-10" />

      {/* Section 3 — No black box */}
      <section className="mb-10">
        <SectionLabel text={c.s3_label} />
        <h2 className="text-lg font-bold text-gray-900 mb-3">{c.s3_heading}</h2>
        <p className="text-gray-700 text-sm leading-relaxed mb-3">{c.s3_p1}</p>
        <p className="text-gray-700 text-sm leading-relaxed">{c.s3_p2}</p>
      </section>

      <div className="border-t border-gray-100 mb-10" />

      {/* Section 4 — Privacy */}
      <section>
        <SectionLabel text={c.s4_label} />
        <h2 className="text-lg font-bold text-gray-900 mb-5">{c.s4_heading}</h2>
        <div className="space-y-3">
          {c.s4_items.map((item, i) => (
            <div key={i} className="bg-gray-50 border border-gray-200 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-900 mb-1.5">{item.heading}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}

/**
 * Fiche débat « Les retraites » — migration du DEEP_DIVE existant de Beginner.jsx
 * vers le nouveau schéma (migration partielle : le modèle débat complet en 16 sections
 * sera appliqué lors de l'extension de cette fiche — cf. docs/jyconnaisrien/04, page #46).
 */

export default {
  slug: 'retraites',
  type: 'debat',
  porte: 'F1',
  title: { fr: `Les retraites`, en: 'Pensions' },
  icon: '🧓',
  difficulty: 2,
  famille: 'dossier',
  updatedAt: '2026-07-12',
  freshness: { type: 'live', reviewEveryMonths: 3, lastReviewedAt: '2026-07-12' },

  level1: {
    fr: `En France, les actifs paient des cotisations qui financent directement les pensions des retraités : c'est la répartition — chaque génération paie pour la précédente. Le problème est démographique : en 1960, il y avait 4 actifs pour 1 retraité ; aujourd'hui environ 1,7 ; vers 2050, environ 1,4. Le système coûte donc chaque année un peu plus cher, et le débat revient à chaque élection.`,
  },

  level2: {
    sections: [
      {
        titre: { fr: 'Les mots indispensables' },
        brique: 'glossaire',
        termes: [
          {
            nom: { fr: 'Répartition' },
            def: { fr: `Les cotisations payées aujourd'hui financent les retraites d'aujourd'hui — il n'y a pas d'épargne individuelle. C'est l'opposé de la capitalisation, où chacun épargne pour soi.` },
          },
          {
            nom: { fr: 'Cotisations retraite' },
            def: { fr: `Les prélèvements sur les salaires qui financent le système. En France, environ 28 % du salaire brut (parts salarié + employeur) — l'un des taux les plus élevés d'Europe.` },
          },
          {
            nom: { fr: 'Âge légal de départ' },
            def: { fr: `L'âge à partir duquel on peut légalement partir. 60 ans avant 2010, 62 ans après la réforme de 2010, 64 ans depuis la réforme de 2023.` },
          },
          {
            nom: { fr: 'Durée de cotisation' },
            def: { fr: `Le nombre de trimestres travaillés requis pour une retraite à taux plein. Depuis 2023 : 172 trimestres (43 ans). En dessous, la pension est réduite (décote).` },
          },
          {
            nom: { fr: 'Pension' },
            def: { fr: `Le montant mensuel versé au retraité, calculé sur les meilleures années de carrière et la durée de cotisation. Pension moyenne en France : environ 1 500 € brut/mois.` },
          },
        ],
      },
      {
        titre: { fr: 'Pourquoi le débat revient sans cesse' },
        corps: {
          fr: `Le vieillissement n'est pas une projection : il est en cours. En 2000, la France comptait 12 millions de retraités ; en 2024, plus de 17 millions ; vers 2040, environ 20 millions.\n\nLe déficit projeté du système est de l'ordre de 0,4 % à 0,8 % du PIB selon les scénarios — entre 10 et 20 milliards d'euros par an dans les décennies à venir. Pas une catastrophe immédiate, mais une pression structurelle permanente. Et comme la dette publique dépasse déjà 3 000 milliards d'euros, financer les retraites par l'emprunt revient à en transférer le coût aux générations futures.\n\nChaque gouvernement affronte donc la même arithmétique : plus de retraités, moins d'actifs — et des solutions toutes politiquement douloureuses : travailler plus longtemps, cotiser plus, recevoir moins, ou financer autrement.`,
        },
      },
    ],
  },

  level3: {
    sections: [
      {
        id: 'comparaison-internationale',
        titre: { fr: 'Comparaison internationale' },
        brique: 'comparaison',
        rows: [
          { pays: { fr: '🇫🇷 France' }, valeur: '64 ans', desc: { fr: `Répartition quasi pure. Forte résistance sociale aux réformes. Parmi les départs les plus précoces d'Europe malgré la réforme de 2023.` } },
          { pays: { fr: '🇩🇪 Allemagne' }, valeur: '67 ans', desc: { fr: `Répartition + cotisations plus élevées. L'âge a été relevé progressivement jusqu'à 67 ans, sans conflit social comparable à la France.` } },
          { pays: { fr: '🇩🇰 Danemark' }, valeur: '67 → 68 ans', desc: { fr: `Pension universelle de base + retraite professionnelle quasi obligatoire. L'âge est automatiquement indexé sur l'espérance de vie.` } },
          { pays: { fr: '🇸🇪 Suède' }, valeur: '62–68 ans', desc: { fr: `Comptes notionnels : chaque cotisation est inscrite sur un compte individuel virtuel. La pension dépend directement de ce qu'on a versé. Plus lisible, plus flexible.` } },
          { pays: { fr: '🇨🇦 Canada' }, valeur: '65 ans', desc: { fr: `Système mixte : pension de base par répartition + épargne individuelle encouragée fiscalement. Moins de résistance aux ajustements.` } },
        ],
      },
      {
        id: 'positions',
        titre: { fr: `Les grandes positions — pourquoi ils ne s'accordent pas` },
        brique: 'visions',
        visions: [
          {
            label: { fr: 'Financer autrement — gauche, syndicats' },
            couleur: 'blue',
            corps: { fr: `On peut financer le système sans travailler plus longtemps : augmenter les cotisations sur les hauts salaires et le capital, faire reculer le chômage (plus d'actifs = plus de cotisations), supprimer certaines exonérations de cotisations accordées aux entreprises. L'âge de 64 ans pénalise les métiers physiques, dont les travailleurs n'atteignent souvent pas cet âge en bonne santé.` },
          },
          {
            label: { fr: 'Travailler plus longtemps — droite, centre' },
            couleur: 'purple',
            corps: { fr: `La démographie ne ment pas : il faut travailler plus longtemps. La France part plus tôt que ses voisins, et le financement alternatif ne suffirait pas à combler le déficit. Sans réforme, c'est la dette qui finance les retraites — au détriment des générations futures. Reculer l'âge légal est la solution la plus équitable à long terme.` },
          },
          {
            label: { fr: `Développer l'épargne — libéraux` },
            couleur: 'green',
            corps: { fr: `La répartition ne peut pas tout porter seule : il faut développer l'épargne retraite individuelle et complémentaire (le PER existe déjà). Un système mixte, comme au Canada ou en Suède, résiste mieux aux chocs démographiques. Moins de dépendance à l'État, plus de liberté individuelle.` },
          },
        ],
      },
    ],
  },

  vraiFaux: [],
  quiz: [],
  motsAssocies: ['dette-publique'],
  continuerAvec: ['dette-publique', '49-3'],

  sources: [
    { label: `COR (Conseil d'orientation des retraites) — rapports annuels sur les perspectives du système`, url: 'https://www.cor-retraites.fr', year: 2025, perimetre: `projections selon plusieurs scénarios économiques ; les chiffres de déficit cités en dépendent` },
    { label: `INSEE — démographie, ratio actifs/retraités`, url: 'https://www.insee.fr', year: 2025 },
    { label: `Vie-publique.fr — dossier « réforme des retraites 2023 »`, url: 'https://www.vie-publique.fr', year: 2023 },
  ],
};

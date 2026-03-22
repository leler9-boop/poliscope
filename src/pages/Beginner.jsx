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
      en: `In politics, "left" and "right" describe two broad ways of thinking about society. They're not fixed — they shift over time and mean different things in different countries.`,
      fr: `En politique, « gauche » et « droite » décrivent deux grandes façons de voir la société. Ces étiquettes évoluent avec le temps et varient selon les pays.`,
    },
    example: {
      en: `If someone wants the government to raise taxes on the rich to fund public services — that's often called a left-wing position. If someone wants lower taxes and more individual responsibility — that's more right-wing. But most people hold a mix of both.`,
      fr: `Si quelqu'un veut que l'État augmente les impôts des riches pour financer les services publics — c'est souvent une position de gauche. Si quelqu'un préfère moins d'impôts et plus de responsabilité individuelle — c'est plutôt de droite. Mais la plupart des gens mélangent les deux.`,
    },
    extended: {
      en: `The terms "left" and "right" come from the French Revolution — deputies who supported the king sat on the right side of the assembly, those who wanted change sat on the left. More than 200 years later, the labels stuck.\n\nToday, left-wing politics tends to emphasise reducing inequality, expanding social protections, and reforming institutions. Right-wing politics tends to emphasise stability, individual freedom, economic growth through private enterprise, and preserving traditions.\n\nBut these are tendencies, not rules. You'll find right-wing politicians who support strong public health systems, and left-wing politicians who are sceptical of immigration. The spectrum is a rough map, not a precise tool.\n\nMany political scientists argue the left–right axis is insufficient. Questions like globalisation, national sovereignty, or civil liberties don't fit neatly on a single line. That's why tools like Poliscope use multiple dimensions.`,
      fr: `Les termes « gauche » et « droite » viennent de la Révolution française — les députés favorables au roi siégeaient à droite de l'assemblée, ceux qui voulaient du changement à gauche. Plus de 200 ans plus tard, ces étiquettes persistent.\n\nAujourd'hui, la gauche met généralement l'accent sur la réduction des inégalités, l'extension des protections sociales, et la réforme des institutions. La droite tend à valoriser la stabilité, la liberté individuelle, la croissance économique par le secteur privé, et la préservation des traditions.\n\nMais ce sont des tendances, pas des règles. On trouve des politiques de droite qui soutiennent un système de santé public fort, et des politiques de gauche sceptiques vis-à-vis de l'immigration. Le spectre est une carte approximative, pas un outil précis.\n\nDe nombreux politologues estiment que l'axe gauche-droite est insuffisant. Des questions comme la mondialisation, la souveraineté nationale, ou les libertés civiles ne s'inscrivent pas facilement sur une seule ligne. C'est pourquoi des outils comme Poliscope utilisent plusieurs dimensions.`,
    },
  },
  {
    id: 'economy',
    icon: '💶',
    title: { en: `The Economy`, fr: `L'économie` },
    definition: {
      en: `The economy is about how money, jobs, and goods are organised in a society. In politics, the main debate is: how much should the state intervene, and how much should be left to the market?`,
      fr: `L'économie concerne la façon dont l'argent, les emplois et les biens sont organisés dans une société. En politique, le débat central est : jusqu'où l'État doit-il intervenir, et jusqu'où faut-il laisser faire le marché ?`,
    },
    example: {
      en: `If you buy a phone made in a private factory, that's the market at work. If the government builds public housing and sets rent prices, that's state intervention. Most economies mix both — the debate is about how much of each.`,
      fr: `Si vous achetez un téléphone fabriqué dans une usine privée, c'est le marché qui fonctionne. Si le gouvernement construit des logements sociaux et fixe les loyers, c'est l'intervention de l'État. La plupart des économies mélangent les deux — le débat porte sur la proportion.`,
    },
    extended: {
      en: `Most countries today operate "mixed economies" — a blend of private enterprise and state involvement. The political debate isn't "market vs. state" in absolute terms, but about where to draw the line.\n\nSome argue that free markets are the best way to create wealth and innovation: competition pushes companies to improve, and prices reflect what people actually value. State intervention, in this view, creates inefficiency and stifles initiative.\n\nOthers argue that markets alone produce inequality: they reward those who already have resources, fail to provide things that aren't profitable (like care for the elderly), and create boom-and-bust cycles that hurt ordinary people. The state, in this view, must correct those failures.\n\nIn practice, both sides accept some mix. The debates are about tax levels, labour market rules, the role of public monopolies, and how to handle large companies that become too powerful.`,
      fr: `La plupart des pays fonctionnent aujourd'hui avec des « économies mixtes » — un mélange d'entreprise privée et d'intervention étatique. Le débat politique n'oppose pas « marché vs État » en termes absolus, mais porte sur où tracer la ligne.\n\nCertains soutiennent que les marchés libres sont le meilleur moyen de créer de la richesse et de l'innovation : la concurrence pousse les entreprises à s'améliorer, et les prix reflètent ce que les gens valorisent vraiment. L'intervention de l'État, dans cette vision, crée de l'inefficacité et étouffe l'initiative.\n\nD'autres estiment que les marchés seuls produisent des inégalités : ils récompensent ceux qui ont déjà des ressources, échouent à fournir ce qui n'est pas rentable (comme les soins aux personnes âgées), et créent des cycles d'expansion et de récession qui nuisent aux gens ordinaires. L'État doit corriger ces défaillances.\n\nEn pratique, les deux camps acceptent un certain mélange. Les débats portent sur les niveaux d'imposition, les règles du marché du travail, le rôle des monopoles publics et la façon de gérer les grandes entreprises qui deviennent trop puissantes.`,
    },
  },
  {
    id: 'fiscalite',
    icon: '📊',
    title: { en: `Taxation`, fr: `La fiscalité` },
    definition: {
      en: `Taxation is how governments collect money to pay for public services. Who should pay, how much, and for what — these are among the most contested questions in all of politics.`,
      fr: `La fiscalité, c'est la façon dont les gouvernements collectent de l'argent pour financer les services publics. Qui doit payer, combien, et pour quoi — ce sont parmi les questions les plus débattues en politique.`,
    },
    example: {
      en: `A flat tax means everyone pays the same percentage (e.g. 20%), whether they earn €15,000 or €500,000 a year. A progressive tax means higher earners pay a higher percentage. France uses a progressive system. This choice has major consequences for inequality.`,
      fr: `Un impôt uniforme signifie que tout le monde paie le même pourcentage (ex. 20%), qu'on gagne 15 000 € ou 500 000 € par an. Un impôt progressif signifie que les revenus plus élevés sont taxés à un taux plus élevé. La France utilise un système progressif. Ce choix a des conséquences majeures sur les inégalités.`,
    },
    extended: {
      en: `Governments spend money on hospitals, schools, roads, pensions, armies, courts, and much more. Taxes are how they raise that money. Without them, public services don't exist.\n\nThe political debate on taxation has several dimensions. First: how much total tax should be collected? Higher taxes fund more public services but leave less in people's pockets. Lower taxes give individuals more freedom to spend but can mean cuts to services.\n\nSecond: who should pay? Progressive systems (where rates rise with income) aim to reduce inequality. Some argue they discourage ambition or drive wealthy people to leave the country. Others argue the wealthy benefit most from stable society and should contribute most.\n\nThird: what should be taxed? Income, wealth, inheritances, capital gains, consumption, carbon? Each choice has different effects on behaviour and fairness.\n\nThere are no easy answers — every tax system involves trade-offs between efficiency, fairness, and social goals.`,
      fr: `Les gouvernements dépensent de l'argent pour les hôpitaux, les écoles, les routes, les retraites, les armées, les tribunaux et bien plus encore. Les impôts permettent de financer tout cela. Sans eux, les services publics n'existent pas.\n\nLe débat politique sur la fiscalité a plusieurs dimensions. Premièrement : quel montant total doit être prélevé ? Des impôts élevés financent plus de services publics mais laissent moins d'argent dans les poches des gens. Des impôts faibles donnent plus de liberté aux individus mais peuvent signifier des coupes dans les services.\n\nDeuxièmement : qui doit payer ? Les systèmes progressifs (où les taux augmentent avec le revenu) visent à réduire les inégalités. Certains estiment qu'ils découragent l'ambition ou incitent les personnes aisées à quitter le pays. D'autres soutiennent que les riches bénéficient le plus d'une société stable et doivent y contribuer davantage.\n\nTroisièmement : que doit-on taxer ? Le revenu, le patrimoine, les héritages, les plus-values, la consommation, le carbone ? Chaque choix a des effets différents sur les comportements et l'équité.\n\nIl n'y a pas de réponses faciles — tout système fiscal implique des compromis entre efficacité, équité et objectifs sociaux.`,
    },
  },
  {
    id: 'immigration',
    icon: '🌍',
    title: { en: `Immigration`, fr: `L'immigration` },
    definition: {
      en: `Immigration is when people move from one country to another to live, work, or seek safety. The political debate is about how many people should be allowed in, under what conditions, and with what rights.`,
      fr: `L'immigration, c'est quand des personnes quittent un pays pour aller vivre, travailler ou chercher la sécurité dans un autre. Le débat porte sur le nombre de personnes autorisées à entrer, les conditions d'accueil et leurs droits.`,
    },
    example: {
      en: `In the EU, citizens can move freely between member states — that's open migration within a bloc. But immigration from outside the EU is much more regulated. Someone fleeing a war can apply for asylum; someone wanting to work needs a visa. These systems involve many political choices.`,
      fr: `Dans l'UE, les citoyens peuvent se déplacer librement entre les États membres — c'est la migration ouverte au sein d'un bloc. Mais l'immigration depuis l'extérieur de l'UE est bien plus réglementée. Quelqu'un qui fuit une guerre peut demander l'asile ; quelqu'un qui veut travailler a besoin d'un visa. Ces systèmes impliquent de nombreux choix politiques.`,
    },
    extended: {
      en: `Immigration is one of the most emotionally charged topics in modern politics. It touches on identity, economics, security, and humanitarian values all at once.\n\nSome argue immigration brings economic benefits: immigrants often fill labour shortages, pay taxes, start businesses, and contribute to innovation. Cultural diversity, in this view, enriches society.\n\nOthers raise concerns: rapid demographic change can create tensions around integration, housing, and public services. Some argue that states have a responsibility to their existing citizens first, and that uncontrolled immigration lowers wages for the lowest-paid workers.\n\nThe humanitarian dimension adds another layer: people fleeing war or persecution have legal rights under international law to seek asylum. How states handle these obligations is fiercely debated.\n\nMost parties across the spectrum accept that some regulation of immigration is needed. The disagreement is about how strict, how humane, and how to balance different types of migration (economic, family, humanitarian).`,
      fr: `L'immigration est l'un des sujets les plus chargés émotionnellement dans la politique moderne. Elle touche simultanément à l'identité, à l'économie, à la sécurité et aux valeurs humanitaires.\n\nCertains soutiennent que l'immigration apporte des bénéfices économiques : les immigrés comblent souvent les pénuries de main-d'œuvre, paient des impôts, créent des entreprises et contribuent à l'innovation. La diversité culturelle, dans cette vision, enrichit la société.\n\nD'autres soulèvent des préoccupations : des changements démographiques rapides peuvent créer des tensions autour de l'intégration, du logement et des services publics. Certains estiment que les États ont une responsabilité envers leurs citoyens existants d'abord, et que l'immigration non contrôlée fait baisser les salaires des travailleurs les moins bien payés.\n\nLa dimension humanitaire ajoute une autre couche : les personnes fuyant la guerre ou les persécutions ont des droits légaux en vertu du droit international pour demander l'asile. La façon dont les États gèrent ces obligations est vigoureusement débattue.\n\nLa plupart des partis acceptent qu'une certaine régulation de l'immigration est nécessaire. Le désaccord porte sur le degré de rigueur, le traitement humain, et l'équilibre entre les différents types de migration (économique, familiale, humanitaire).`,
    },
  },
  {
    id: 'ecology',
    icon: '🌱',
    title: { en: `Ecology`, fr: `L'écologie` },
    definition: {
      en: `Ecology in politics is about how governments protect the environment — from climate change to biodiversity to pollution. The central debate: how fast and at what cost should we transform our economies?`,
      fr: `L'écologie en politique concerne la façon dont les gouvernements protègent l'environnement — du changement climatique à la biodiversité en passant par la pollution. Le débat central : à quelle vitesse et à quel coût doit-on transformer nos économies ?`,
    },
    example: {
      en: `Should the government ban petrol cars by 2035? Tax flights? Subsidise solar panels? Each of these is an ecological political decision with real winners and losers — jobs in some sectors disappear while others grow.`,
      fr: `Le gouvernement doit-il interdire les voitures à essence d'ici 2035 ? Taxer les vols ? Subventionner les panneaux solaires ? Chacune de ces mesures est une décision politique écologique avec de vrais gagnants et perdants — des emplois disparaissent dans certains secteurs tandis que d'autres se développent.`,
    },
    extended: {
      en: `Climate science is largely settled: human activity is warming the planet, with serious consequences for ecosystems, food, water, and sea levels. The political debate isn't about the science — it's about what to do and at what pace.\n\nSome argue that urgent, transformative action is needed: phasing out fossil fuels quickly, setting strict environmental regulations, and making major public investments in green infrastructure. The costs of inaction are seen as far greater than the costs of action.\n\nOthers worry about the economic costs of rapid transition: job losses in fossil-fuel industries, higher energy prices for households, and industrial competitiveness. They often support a more gradual approach, relying on innovation and market incentives rather than heavy regulation.\n\nThere's also a social justice dimension: environmental burdens (pollution, climate impacts) often fall hardest on poorer communities, while the costs of green policies (like higher fuel taxes) can also disproportionately affect lower-income households. How to make the transition fair is a major political challenge.`,
      fr: `La science climatique est largement établie : l'activité humaine réchauffe la planète, avec de graves conséquences pour les écosystèmes, l'alimentation, l'eau et le niveau des mers. Le débat politique ne porte pas sur la science — il porte sur quoi faire et à quelle vitesse.\n\nCertains soutiennent qu'une action urgente et transformatrice est nécessaire : sortir rapidement des combustibles fossiles, fixer des réglementations environnementales strictes, et faire de grands investissements publics dans les infrastructures vertes. Les coûts de l'inaction sont considérés comme bien plus importants que les coûts de l'action.\n\nD'autres s'inquiètent des coûts économiques d'une transition rapide : pertes d'emplois dans les industries fossiles, hausse des prix de l'énergie pour les ménages, et compétitivité industrielle. Ils soutiennent souvent une approche plus graduelle, s'appuyant sur l'innovation et les incitations du marché plutôt que sur une réglementation lourde.\n\nIl y a aussi une dimension de justice sociale : les charges environnementales (pollution, impacts climatiques) pèsent souvent le plus sur les communautés plus pauvres, tandis que les coûts des politiques vertes (comme les taxes sur les carburants) peuvent aussi affecter de façon disproportionnée les ménages à faibles revenus. Rendre la transition équitable est un défi politique majeur.`,
    },
  },
  {
    id: 'dette_publique',
    icon: '📉',
    title: { en: `Public Debt`, fr: `La dette publique` },
    definition: {
      en: `Public debt is the money a government owes because it has spent more than it collected in taxes. It's one of the most technical — and most contested — topics in economic policy.`,
      fr: `La dette publique, c'est l'argent qu'un gouvernement doit parce qu'il a dépensé plus qu'il n'a collecté en impôts. C'est l'un des sujets les plus techniques — et les plus contestés — de la politique économique.`,
    },
    example: {
      en: `France's debt is around 110% of GDP. That means the state owes more than the entire value of goods and services produced in the country in a year. Some see this as a crisis; others say it's manageable as long as interest rates are low.`,
      fr: `La dette française est d'environ 110 % du PIB. Cela signifie que l'État doit plus que la valeur totale des biens et services produits dans le pays en un an. Certains y voient une crise ; d'autres disent que c'est gérable tant que les taux d'intérêt restent bas.`,
    },
    extended: {
      en: `Governments borrow money by issuing bonds — essentially IOUs that investors buy. The government pays interest on this debt over time, then repays the principal.\n\nSome economists argue that public debt is dangerous: it passes costs to future generations, and if markets lose confidence in a government's ability to repay, interest rates spike and a debt crisis can occur (as happened in Greece in 2010).\n\nOthers argue that debt is a tool: when interest rates are low, governments can borrow cheaply to invest in infrastructure, education, and health — investments that pay off in the long run. In a recession, cutting spending to reduce debt can make things worse by destroying demand.\n\nThe debate has a strong political dimension: cutting debt usually means cutting spending (which hits public services) or raising taxes. The question of who bears that burden is deeply political.`,
      fr: `Les gouvernements empruntent de l'argent en émettant des obligations — en quelque sorte des reconnaissances de dette que les investisseurs achètent. Le gouvernement paie des intérêts sur cette dette au fil du temps, puis rembourse le principal.\n\nCertains économistes soutiennent que la dette publique est dangereuse : elle transfère les coûts aux générations futures, et si les marchés perdent confiance dans la capacité d'un gouvernement à rembourser, les taux d'intérêt montent en flèche et une crise de la dette peut survenir (comme en Grèce en 2010).\n\nD'autres soutiennent que la dette est un outil : quand les taux d'intérêt sont bas, les gouvernements peuvent emprunter à moindre coût pour investir dans les infrastructures, l'éducation et la santé — des investissements qui rapportent sur le long terme. En période de récession, réduire les dépenses pour diminuer la dette peut aggraver les choses en détruisant la demande.\n\nLe débat a une forte dimension politique : réduire la dette signifie généralement réduire les dépenses (ce qui touche les services publics) ou augmenter les impôts. La question de qui supporte ce fardeau est profondément politique.`,
    },
  },
  {
    id: 'democracy',
    icon: '🏛️',
    title: { en: `Democracy`, fr: `La démocratie` },
    definition: {
      en: `Democracy means that political power comes from the people. But there are many different ways to organise democracy, and debate continues about how to make it work better.`,
      fr: `La démocratie signifie que le pouvoir politique vient du peuple. Mais il existe de nombreuses façons différentes d'organiser la démocratie, et le débat continue sur la façon de la faire mieux fonctionner.`,
    },
    example: {
      en: `In France, the president is elected directly by all citizens — a "presidential" system. In Germany, citizens elect a parliament, which then chooses the chancellor. The UK uses first-past-the-post voting; many other countries use proportional representation. Each system produces different outcomes.`,
      fr: `En France, le président est élu directement par tous les citoyens — un système « présidentiel ». En Allemagne, les citoyens élisent un parlement qui choisit ensuite le chancelier. Le Royaume-Uni utilise le scrutin majoritaire ; beaucoup d'autres pays utilisent la proportionnelle. Chaque système produit des résultats différents.`,
    },
    extended: {
      en: `Representative democracy — where citizens elect representatives who make decisions on their behalf — is the dominant model today. But it faces challenges.\n\nTurnout is declining in many countries, especially among younger people. Trust in politicians and institutions has fallen. Some argue the system gives too much power to elites and money, while ordinary people feel unheard.\n\nSeveral reforms are debated. Proportional representation would give smaller parties more seats, better reflecting the diversity of opinion. Citizens' assemblies (groups of randomly selected citizens who deliberate on policy) are being tried in France and Ireland. Referendums give citizens a direct vote on specific issues.\n\nAt the same time, some argue that "direct democracy" tools can be captured by populists or produce poorly informed decisions. Representative democracy, with its checks and balances, protects minorities from the tyranny of the majority.\n\nThe debate about democratic reform is itself deeply political — those in power have an interest in systems that keep them in power.`,
      fr: `La démocratie représentative — où les citoyens élisent des représentants qui prennent des décisions en leur nom — est le modèle dominant aujourd'hui. Mais elle fait face à des défis.\n\nLa participation électorale baisse dans de nombreux pays, surtout chez les jeunes. La confiance dans les politiciens et les institutions a diminué. Certains soutiennent que le système donne trop de pouvoir aux élites et à l'argent, tandis que les gens ordinaires se sentent inentendus.\n\nPlusieurs réformes sont débattues. La représentation proportionnelle donnerait plus de sièges aux petits partis, reflétant mieux la diversité des opinions. Les assemblées citoyennes (groupes de citoyens tirés au sort qui délibèrent sur les politiques) sont expérimentées en France et en Irlande. Les référendums donnent aux citoyens un vote direct sur des questions spécifiques.\n\nEn même temps, certains soutiennent que les outils de « démocratie directe » peuvent être captés par les populistes ou produire des décisions mal informées. La démocratie représentative, avec ses freins et contrepoids, protège les minorités contre la tyrannie de la majorité.\n\nLe débat sur la réforme démocratique est lui-même profondément politique — ceux qui sont au pouvoir ont intérêt à des systèmes qui les maintiennent au pouvoir.`,
    },
  },
  {
    id: 'souverainete',
    icon: '🏴',
    title: { en: `Sovereignty`, fr: `La souveraineté` },
    definition: {
      en: `Sovereignty is the idea that a country should control its own decisions — its laws, its borders, its economy. It's at the heart of debates about Europe, globalisation, and national identity.`,
      fr: `La souveraineté, c'est l'idée qu'un pays doit contrôler ses propres décisions — ses lois, ses frontières, son économie. C'est au cœur des débats sur l'Europe, la mondialisation et l'identité nationale.`,
    },
    example: {
      en: `When France joined the European Union, it agreed to have some laws made at the EU level (trade rules, environmental standards, etc.). Supporters say this gives France more influence. Critics say it reduces France's ability to make its own choices.`,
      fr: `Quand la France a rejoint l'Union européenne, elle a accepté que certaines lois soient faites au niveau européen (règles commerciales, normes environnementales, etc.). Les partisans disent que cela donne à la France plus d'influence. Les critiques disent que cela réduit sa capacité à faire ses propres choix.`,
    },
    extended: {
      en: `Sovereignty has become one of the defining debates of the 21st century. Brexit was, at its core, a sovereignty argument: "we want our laws made by our parliament, not Brussels." Similar arguments are made by sovereigntist parties across Europe.\n\nSupporters of pooled sovereignty (like in the EU) argue that modern problems — climate change, global trade, terrorism, pandemics — require international cooperation that no country can achieve alone. Surrendering some control is the price of greater collective power.\n\nSceptics argue that international institutions are remote, unaccountable, and often serve the interests of large states or corporations. National parliaments, elected by citizens, should be the primary source of law.\n\nThis debate cuts across the traditional left–right spectrum. There are sovereigntists on both the left (who oppose EU economic rules that limit public spending) and the right (who oppose EU migration rules or social policies).`,
      fr: `La souveraineté est devenue l'un des débats définissants du XXIe siècle. Le Brexit était, dans son essence, un argument souverainiste : « nous voulons que nos lois soient faites par notre parlement, pas par Bruxelles. » Des arguments similaires sont avancés par des partis souverainistes à travers l'Europe.\n\nLes partisans de la souveraineté partagée (comme dans l'UE) soutiennent que les problèmes modernes — changement climatique, commerce mondial, terrorisme, pandémies — nécessitent une coopération internationale qu'aucun pays ne peut réaliser seul. Céder une partie du contrôle est le prix d'un pouvoir collectif plus grand.\n\nLes sceptiques soutiennent que les institutions internationales sont éloignées, peu responsables, et servent souvent les intérêts des grands États ou des entreprises. Les parlements nationaux, élus par les citoyens, devraient être la principale source de droit.\n\nCe débat traverse le spectre traditionnel gauche-droite. Il y a des souverainistes à gauche (qui s'opposent aux règles économiques de l'UE limitant les dépenses publiques) et à droite (qui s'opposent aux règles migratoires ou aux politiques sociales de l'UE).`,
    },
  },
  {
    id: 'public_services',
    icon: '🏥',
    title: { en: `Public Services`, fr: `Les services publics` },
    definition: {
      en: `Public services are things the state provides to everyone — schools, hospitals, public transport, social housing. The debate: should the government run these directly, or leave them to private companies?`,
      fr: `Les services publics, ce sont les choses que l'État fournit à tous — écoles, hôpitaux, transports en commun, logements sociaux. Le débat : l'État doit-il les gérer directement, ou laisser faire les entreprises privées ?`,
    },
    example: {
      en: `In France, most hospitals are public — anyone can go, costs are largely covered by the state. In the US, many hospitals are private — you pay directly or through insurance. Both systems have strengths and problems.`,
      fr: `En France, la plupart des hôpitaux sont publics — tout le monde peut y aller, les coûts sont largement couverts par l'État. Aux États-Unis, beaucoup d'hôpitaux sont privés — vous payez directement ou via une assurance. Les deux systèmes ont des forces et des problèmes.`,
    },
    extended: {
      en: `Public services exist because some things don't work well when left to the market. Healthcare, education, and basic infrastructure have characteristics that make pure market provision problematic: they often work better at scale, their benefits spread beyond the individual, and leaving people without access creates serious social harms.\n\nThe case for public services: universal access (everyone gets care, not just those who can pay), economies of scale, democratic accountability, and social solidarity. A strong public health system protects everyone, including people who would otherwise fall through the cracks.\n\nThe case for privatisation or market competition: private companies face incentives to cut costs and improve quality that public monopolies don't. Competition can drive innovation. Private providers can often respond faster to changing demand.\n\nIn practice, most countries use a mix: public funding with some private delivery, or regulated markets. The NHS in England, for example, is publicly funded but increasingly uses private providers. The outcomes of these choices vary enormously.`,
      fr: `Les services publics existent parce que certaines choses ne fonctionnent pas bien quand on les laisse au marché. La santé, l'éducation et les infrastructures de base ont des caractéristiques qui rendent leur fourniture purement marchande problématique : ils fonctionnent souvent mieux à grande échelle, leurs bénéfices vont au-delà de l'individu, et laisser des personnes sans accès crée de graves préjudices sociaux.\n\nLes arguments pour les services publics : accès universel (tout le monde reçoit des soins, pas seulement ceux qui peuvent payer), économies d'échelle, responsabilité démocratique et solidarité sociale. Un système de santé public fort protège tout le monde, y compris ceux qui passeraient autrement à travers les mailles du filet.\n\nLes arguments pour la privatisation ou la concurrence marchande : les entreprises privées font face à des incitations à réduire les coûts et à améliorer la qualité que les monopoles publics n'ont pas. La concurrence peut stimuler l'innovation. Les prestataires privés peuvent souvent répondre plus rapidement aux changements de la demande.\n\nEn pratique, la plupart des pays utilisent un mélange : financement public avec une partie de prestation privée, ou marchés réglementés. Le NHS en Angleterre, par exemple, est financé publiquement mais fait de plus en plus appel à des prestataires privés. Les résultats de ces choix varient considérablement.`,
    },
  },
  {
    id: 'security',
    icon: '🛡️',
    title: { en: `Security`, fr: `La sécurité` },
    definition: {
      en: `Security in politics is about keeping people safe — from crime, terrorism, and disorder. The debate: how far should the state go to ensure safety, and at what cost to personal freedom?`,
      fr: `La sécurité en politique concerne la protection des personnes — contre le crime, le terrorisme et le désordre. Le débat : jusqu'où l'État peut-il aller pour assurer la sécurité, et à quel coût pour les libertés individuelles ?`,
    },
    example: {
      en: `Should police be allowed to search anyone on the street without a specific reason? Should every public square have security cameras? Should the government be able to read private messages to prevent terrorism? These are security vs. freedom trade-offs.`,
      fr: `La police devrait-elle pouvoir fouiller n'importe qui dans la rue sans raison précise ? Toutes les places publiques devraient-elles avoir des caméras de sécurité ? Le gouvernement devrait-il pouvoir lire des messages privés pour prévenir le terrorisme ? Ce sont des arbitrages entre sécurité et liberté.`,
    },
    extended: {
      en: `The tension between security and liberty is one of the oldest in political philosophy. The state has a duty to protect citizens; it also has a duty not to abuse its power.\n\nAfter the terrorist attacks of the 2000s and 2010s, many governments expanded surveillance powers, extended detention without charge, and increased police stop-and-search powers. Proponents argued these measures saved lives. Critics argued they eroded civil liberties and disproportionately targeted ethnic minorities.\n\nThe debate about crime has a similar structure. Some argue that more policing, tougher sentences, and less tolerance for disorder are needed to keep communities safe. Others argue that crime is rooted in poverty, inequality, and lack of opportunity — that investing in social services prevents more crime than punishment does.\n\nDigital security adds new dimensions: governments want access to encrypted communications to fight crime and terrorism; tech companies and privacy advocates argue this creates backdoors that undermine everyone's security.`,
      fr: `La tension entre sécurité et liberté est l'une des plus anciennes en philosophie politique. L'État a le devoir de protéger les citoyens ; il a aussi le devoir de ne pas abuser de son pouvoir.\n\nAprès les attentats terroristes des années 2000 et 2010, de nombreux gouvernements ont élargi leurs pouvoirs de surveillance, prolongé la détention sans inculpation, et augmenté les pouvoirs de contrôle de la police. Les partisans soutiennent que ces mesures ont sauvé des vies. Les critiques soutiennent qu'elles ont érodé les libertés civiles et ciblé de façon disproportionnée les minorités ethniques.\n\nLe débat sur la criminalité a une structure similaire. Certains soutiennent qu'il faut plus de police, des peines plus sévères et moins de tolérance pour le désordre pour assurer la sécurité des communautés. D'autres soutiennent que la criminalité est enracinée dans la pauvreté, les inégalités et le manque d'opportunités — que investir dans les services sociaux prévient plus de crimes que la punition.\n\nLa sécurité numérique ajoute de nouvelles dimensions : les gouvernements veulent accéder aux communications chiffrées pour lutter contre la criminalité et le terrorisme ; les entreprises technologiques et les défenseurs de la vie privée soutiennent que cela crée des portes dérobées qui compromettent la sécurité de tous.`,
    },
  },
  {
    id: 'globalization',
    icon: '🌐',
    title: { en: `Globalization`, fr: `La mondialisation` },
    definition: {
      en: `Globalization means countries are increasingly connected through trade, finance, travel, and culture. The debate: who benefits, who loses, and should we try to slow it down?`,
      fr: `La mondialisation, c'est le fait que les pays sont de plus en plus connectés par le commerce, la finance, les voyages et la culture. Le débat : qui en bénéficie, qui en pâtit, et faut-il essayer de la ralentir ?`,
    },
    example: {
      en: `A phone assembled in China from parts made in a dozen countries, sold in France — that's globalization. A French factory that closes because production moves to a country with lower wages — that's also globalization.`,
      fr: `Un téléphone assemblé en Chine à partir de pièces fabriquées dans une douzaine de pays, vendu en France — c'est la mondialisation. Une usine française qui ferme parce que la production est délocalisée dans un pays aux salaires plus bas — c'est aussi la mondialisation.`,
    },
    extended: {
      en: `Globalization has dramatically reduced poverty in many parts of the world — China lifted hundreds of millions out of poverty through export-led growth. Global trade has also made goods cheaper for consumers in rich countries.\n\nBut the benefits have been unequally distributed. Working-class communities in deindustrialised regions of the US, UK, and France have seen factories close, jobs disappear, and little of the promised "trickle-down" wealth. This anger fuelled the rise of Trump, Brexit, and various populist movements.\n\nThe debate today is less about whether to globalise and more about how to manage it. Some argue for more protectionism — tariffs, "buy local" rules, industrial policy — to protect domestic industries. Others say this raises prices for everyone and provokes retaliation.\n\nFinancial globalization also raises questions about who controls multinational corporations and offshore tax havens, which allow wealthy individuals and companies to avoid taxes that ordinary citizens cannot.`,
      fr: `La mondialisation a considérablement réduit la pauvreté dans de nombreuses régions du monde — la Chine a sorti des centaines de millions de personnes de la pauvreté grâce à une croissance tirée par les exportations. Le commerce mondial a aussi rendu les biens moins chers pour les consommateurs des pays riches.\n\nMais les bénéfices ont été inégalement répartis. Les communautés ouvrières des régions désindustrialisées des États-Unis, du Royaume-Uni et de France ont vu des usines fermer, des emplois disparaître, et peu de la richesse « ruisselant » promise. Cette colère a alimenté l'essor de Trump, du Brexit et de divers mouvements populistes.\n\nLe débat aujourd'hui porte moins sur la question de mondialiser ou non, et davantage sur la façon de la gérer. Certains plaident pour plus de protectionnisme — droits de douane, règles d'achat local, politique industrielle — pour protéger les industries nationales. D'autres disent que cela augmente les prix pour tout le monde et provoque des représailles.\n\nLa mondialisation financière soulève également des questions sur le contrôle des multinationales et des paradis fiscaux offshore, qui permettent aux individus et aux entreprises fortunés d'éviter les impôts que les citoyens ordinaires ne peuvent pas éviter.`,
    },
  },
];

// ─── Crises ───────────────────────────────────────────────────────────────────

const CRISES = [
  {
    id: 'gilets_jaunes',
    icon: '🦺',
    title: { en: `The Yellow Vests (2018–2019)`, fr: `Les Gilets jaunes (2018–2019)` },
    what: {
      en: `In November 2018, hundreds of thousands of people across France took to the streets wearing yellow vests — the safety vests all French drivers must keep in their cars. The trigger was a fuel tax hike. Within weeks, the movement had grown into a broad revolt against the government.`,
      fr: `En novembre 2018, des centaines de milliers de personnes à travers la France ont manifesté en portant des gilets jaunes — les gilets de sécurité que tout conducteur français doit avoir dans sa voiture. Le déclencheur était une hausse de la taxe sur les carburants. En quelques semaines, le mouvement était devenu une révolte générale contre le gouvernement.`,
    },
    why: {
      en: `The movement tapped into deep frustration: the cost of living, low wages, the feeling that rural and suburban France was ignored by a Paris-based elite. The fuel tax felt like one burden too many for people who depend on cars to get to work.`,
      fr: `Le mouvement a canalisé une frustration profonde : le coût de la vie, les salaires bas, le sentiment que la France rurale et périurbaine était ignorée par une élite parisienne. La taxe sur les carburants semblait être une charge de trop pour des gens qui dépendent de la voiture pour aller au travail.`,
    },
    debates: {
      en: `The crisis raised questions that remain live today. Should ecological taxes be progressive (protecting lower incomes)? Is the French political system too centralised? How do you reduce carbon emissions without hurting working people? The government eventually scrapped the fuel tax and launched a "Great National Debate."`,
      fr: `La crise a soulevé des questions qui restent d'actualité. Les taxes écologiques doivent-elles être progressives (protégeant les revenus plus bas) ? Le système politique français est-il trop centralisé ? Comment réduire les émissions de carbone sans pénaliser les travailleurs ? Le gouvernement a finalement renoncé à la taxe sur les carburants et lancé un « Grand Débat National. »`,
    },
  },
  {
    id: 'retraites',
    icon: '🕰️',
    title: { en: `The Pension Reform (2023)`, fr: `La réforme des retraites (2023)` },
    what: {
      en: `In 2023, the French government pushed through a law raising the retirement age from 62 to 64. The reform was highly controversial: it was passed without a parliamentary vote using a special constitutional provision (Article 49.3), triggering massive protests and a political crisis.`,
      fr: `En 2023, le gouvernement français a fait passer une loi repoussant l'âge de la retraite de 62 à 64 ans. La réforme était très controversée : elle a été adoptée sans vote parlementaire en utilisant une disposition constitutionnelle spéciale (l'article 49.3), déclenchant des protestations massives et une crise politique.`,
    },
    why: {
      en: `The government argued the change was necessary because the pension system would otherwise run out of money as the population ages. Critics argued there were other ways to fund pensions (taxing capital, taxing higher incomes), and that forcing people to work longer disproportionately hurts workers in physically demanding jobs.`,
      fr: `Le gouvernement a soutenu que ce changement était nécessaire car le système de retraite se retrouverait sinon à court d'argent avec le vieillissement de la population. Les opposants soutenaient qu'il existait d'autres façons de financer les retraites (taxer le capital, taxer les revenus plus élevés), et que forcer les gens à travailler plus longtemps pénalise de façon disproportionnée les travailleurs aux emplois physiquement exigeants.`,
    },
    debates: {
      en: `The reform raised questions about democratic legitimacy (should major reforms be passed without a vote?), the sustainability of the welfare state, and who bears the costs of demographic change. It also revealed deep distrust between citizens and the political class.`,
      fr: `La réforme a soulevé des questions sur la légitimité démocratique (de grandes réformes devraient-elles être adoptées sans vote ?), la soutenabilité de l'État-providence, et qui supporte les coûts du changement démographique. Elle a aussi révélé une profonde méfiance entre les citoyens et la classe politique.`,
    },
  },
  {
    id: 'crise_agricole',
    icon: '🚜',
    title: { en: `The Farmers' Crisis (2024)`, fr: `La crise agricole (2024)` },
    what: {
      en: `In early 2024, French farmers blockaded motorways and dumped manure outside government buildings. Similar protests broke out across Germany, Belgium, and other European countries. The trigger was a mix of factors: cheap imported food, rising costs, heavy regulations, and falling incomes.`,
      fr: `Au début de 2024, des agriculteurs français ont bloqué des autoroutes et déversé du fumier devant des bâtiments gouvernementaux. Des protestations similaires ont éclaté en Allemagne, en Belgique et dans d'autres pays européens. Le déclencheur était un mélange de facteurs : les aliments importés bon marché, la hausse des coûts, les réglementations lourdes et la baisse des revenus.`,
    },
    why: {
      en: `Farmers felt squeezed from all sides: EU environmental rules that required them to change practices, competition from cheaper imports (including from countries with lower standards), supermarkets that kept prices low at their expense, and a sense that their work and way of life were not valued by urban society.`,
      fr: `Les agriculteurs se sentaient pris en étau de toutes parts : les règles environnementales de l'UE qui les obligeaient à changer leurs pratiques, la concurrence des importations moins chères (y compris de pays avec des normes moins élevées), les supermarchés qui maintenaient les prix bas à leurs dépens, et le sentiment que leur travail et leur mode de vie n'étaient pas valorisés par la société urbaine.`,
    },
    debates: {
      en: `The crisis illustrated tensions at the heart of environmental policy: how do you ask farmers to adopt greener practices when it makes them less competitive? Who should pay for the transition to sustainable agriculture? How do you reconcile free trade with food sovereignty? These questions don't have easy answers.`,
      fr: `La crise a illustré les tensions au cœur de la politique environnementale : comment demander aux agriculteurs d'adopter des pratiques plus vertes quand cela les rend moins compétitifs ? Qui doit payer la transition vers une agriculture durable ? Comment concilier libre-échange et souveraineté alimentaire ? Ces questions n'ont pas de réponses faciles.`,
    },
  },
];

// ─── Glossary ─────────────────────────────────────────────────────────────────

const GLOSSARY_CATEGORIES = [
  {
    id: 'institutions',
    icon: '🏛️',
    label: { en: 'Institutions', fr: 'Institutions' },
    terms: [
      {
        id: 'article_49_3',
        term: { en: 'Article 49.3', fr: 'Article 49.3' },
        simple: {
          en: `A constitutional provision that lets the French Prime Minister pass a law without a vote in the National Assembly.`,
          fr: `Un article de la Constitution française qui permet au Premier ministre de faire adopter une loi sans vote à l'Assemblée nationale.`,
        },
        concretement: {
          en: `Normally, laws must be voted on by MPs. With 49.3, the government declares the law passed automatically. MPs can respond by filing a "motion de censure" — a vote to topple the government. If the motion fails, the law stands. If it passes, the government falls. In practice, 49.3 is used when the government doesn't have a stable majority.`,
          fr: `Normalement, les lois doivent être votées par les députés. Avec le 49.3, le gouvernement déclare la loi adoptée d'office. Les députés peuvent réagir en déposant une motion de censure — un vote pour renverser le gouvernement. Si elle échoue, la loi passe. Si elle est adoptée, le gouvernement tombe. En pratique, le 49.3 est utilisé quand le gouvernement n'a pas de majorité stable.`,
        },
        exemple: {
          en: `In 2023, Prime Minister Élisabeth Borne used 49.3 to pass the pension reform raising the retirement age from 62 to 64 — without a final vote in the National Assembly.`,
          fr: `En 2023, la Première ministre Élisabeth Borne a utilisé le 49.3 pour faire passer la réforme des retraites reculant l'âge de départ de 62 à 64 ans — sans vote final à l'Assemblée nationale.`,
        },
        debat: {
          en: `Supporters say it's a necessary tool for governing when parliament is fragmented. Critics argue it bypasses democracy and silences elected representatives. Its repeated use tends to anger the public and fuel street protests.`,
          fr: `Ses partisans estiment que c'est un outil nécessaire pour gouverner quand l'Assemblée est fragmentée. Ses opposants estiment qu'il contourne la démocratie et fait taire les élus. Son usage répété tend à mettre en colère l'opinion et à alimenter les protestations dans la rue.`,
        },
      },
      {
        id: 'motion_censure',
        term: { en: 'Motion de censure', fr: 'Motion de censure' },
        simple: {
          en: `A vote by MPs to bring down the government — if it passes, the Prime Minister must resign.`,
          fr: `Un vote des députés pour renverser le gouvernement — si elle est adoptée, le Premier ministre doit démissionner.`,
        },
        concretement: {
          en: `MPs who oppose the government can gather signatures and table a motion de censure. An absolute majority (289 out of 577 MPs) must vote in favour for the government to fall. The motion is debated in the National Assembly. It is a key check on executive power in France's system.`,
          fr: `Les députés qui s'opposent au gouvernement peuvent rassembler des signatures et déposer une motion de censure. Une majorité absolue (289 sur 577 députés) doit voter pour qu'elle soit adoptée. Elle est débattue à l'Assemblée nationale. C'est un contrepoids clé au pouvoir exécutif dans le système français.`,
        },
        exemple: {
          en: `In December 2024, a motion de censure brought down Prime Minister Michel Barnier's government after just 89 days in office — the shortest in the Fifth Republic.`,
          fr: `En décembre 2024, une motion de censure a renversé le gouvernement de Michel Barnier après seulement 89 jours — le plus court de la Ve République.`,
        },
        debat: {
          en: `Some see it as a vital democratic tool to hold governments accountable. Others argue that its use in fragmented parliaments leads to political instability and makes governing nearly impossible.`,
          fr: `Certains y voient un outil démocratique vital pour responsabiliser les gouvernements. D'autres estiment que son usage dans des assemblées fragmentées mène à l'instabilité politique et rend la gouvernance quasi impossible.`,
        },
      },
      {
        id: 'dissolution',
        term: { en: 'Dissolution', fr: 'Dissolution' },
        simple: {
          en: `When the President dissolves the National Assembly, forcing early legislative elections.`,
          fr: `Quand le Président dissout l'Assemblée nationale, forçant des élections législatives anticipées.`,
        },
        concretement: {
          en: `Under the Fifth Republic, the President can dissolve the National Assembly at almost any time. This triggers snap legislative elections — a political gamble. The President hopes the vote will give their side a stronger majority. But the outcome is uncertain and can backfire completely.`,
          fr: `Sous la Ve République, le Président peut dissoudre l'Assemblée nationale à presque n'importe quel moment. Cela déclenche des élections législatives anticipées — un pari politique. Le Président espère que le scrutin donnera à son camp une majorité plus solide. Mais le résultat est incertain et peut se retourner contre lui.`,
        },
        exemple: {
          en: `In June 2024, President Macron dissolved the National Assembly after a poor result in the European elections — and his party lost seats rather than gaining them.`,
          fr: `En juin 2024, le Président Macron a dissous l'Assemblée nationale après un mauvais résultat aux élections européennes — et son camp a perdu des sièges au lieu d'en gagner.`,
        },
        debat: {
          en: `Some see dissolution as a legitimate way to seek a democratic mandate. Critics argue it can be used strategically by presidents in their own political interest rather than for the national good.`,
          fr: `Certains voient la dissolution comme un moyen légitime de chercher un mandat démocratique. Des critiques estiment qu'elle peut être utilisée stratégiquement par le président dans son intérêt politique personnel plutôt que pour le bien national.`,
        },
      },
      {
        id: 'majorite',
        term: { en: 'Majorité / Minority government', fr: 'Majorité / Minorité' },
        simple: {
          en: `A majority government has over half of MPs on its side; a minority government does not.`,
          fr: `Un gouvernement majoritaire dispose de plus de la moitié des députés ; un gouvernement minoritaire non.`,
        },
        concretement: {
          en: `In France's National Assembly, 289 seats out of 577 are needed for an absolute majority. If the ruling party or coalition has that, it can pass laws more easily. Without it, the government must negotiate every bill, make concessions, or use tools like the 49.3. A minority government is weaker and more vulnerable.`,
          fr: `À l'Assemblée nationale française, 289 sièges sur 577 sont nécessaires pour une majorité absolue. Si le parti ou la coalition au pouvoir en dispose, il peut voter des lois plus facilement. Sans cela, le gouvernement doit négocier chaque texte, faire des concessions, ou utiliser des outils comme le 49.3. Un gouvernement minoritaire est plus faible et plus vulnérable.`,
        },
        exemple: {
          en: `Since 2022, Macron's government has governed without an absolute majority, forcing it to seek allies bill by bill — or use 49.3.`,
          fr: `Depuis 2022, le gouvernement de Macron gouverne sans majorité absolue, l'obligeant à chercher des alliés texte par texte — ou à recourir au 49.3.`,
        },
        debat: {
          en: `Some argue minority governments force compromise and better represent voters. Others say they paralyse decision-making and create instability.`,
          fr: `Certains estiment que les gouvernements minoritaires forcent le compromis et représentent mieux les électeurs. D'autres disent qu'ils paralysent la prise de décision et créent de l'instabilité.`,
        },
      },
      {
        id: 'coalition',
        term: { en: 'Coalition', fr: 'Coalition' },
        simple: {
          en: `An alliance of several parties that agree to govern together because none has a majority alone.`,
          fr: `Une alliance de plusieurs partis qui acceptent de gouverner ensemble parce qu'aucun n'a de majorité seul.`,
        },
        concretement: {
          en: `In coalition governments, parties negotiate a shared programme. Each partner gets ministerial positions. They must agree on major decisions, which requires compromise. Coalitions are common in proportional voting systems like Germany's. In France, presidential elections make them less frequent — but they occur in parliament.`,
          fr: `Dans les gouvernements de coalition, les partis négocient un programme commun. Chaque partenaire obtient des postes ministériels. Ils doivent s'accorder sur les grandes décisions, ce qui exige des compromis. Les coalitions sont courantes dans les systèmes à représentation proportionnelle comme en Allemagne. En France, les élections présidentielles les rendent moins fréquentes — mais elles existent au parlement.`,
        },
        exemple: {
          en: `Germany has been governed by coalitions for decades. After the 2021 elections, the SPD, Greens, and FDP formed a three-party coalition called the "traffic light coalition."`,
          fr: `L'Allemagne est gouvernée par des coalitions depuis des décennies. Après les élections de 2021, le SPD, les Verts et le FDP ont formé une coalition à trois partis appelée la « coalition feu tricolore ».`,
        },
        debat: {
          en: `Coalitions can represent a wider range of voters and force moderation. But they can also be slow, unstable, and lead to backroom deals that voters never explicitly approved.`,
          fr: `Les coalitions peuvent représenter un plus large éventail d'électeurs et favoriser la modération. Mais elles peuvent aussi être lentes, instables, et mener à des accords en coulisse que les électeurs n'ont pas explicitement approuvés.`,
        },
      },
      {
        id: 'amendement',
        term: { en: 'Amendment', fr: 'Amendement' },
        simple: {
          en: `A proposed modification to a law being debated in parliament.`,
          fr: `Une proposition de modification d'un texte de loi en cours de débat au parlement.`,
        },
        concretement: {
          en: `When a bill is debated, MPs can propose changes — these are amendments. They can add, remove, or reword sections. Thousands of amendments can be filed on a single bill. The government can declare amendments "irrecevable" (inadmissible) if they don't fit the bill's scope. Amendments are a key tool for opposition parties to reshape legislation.`,
          fr: `Quand un projet de loi est débattu, les députés peuvent proposer des modifications — ce sont des amendements. Ils peuvent ajouter, supprimer ou reformuler des articles. Des milliers d'amendements peuvent être déposés sur un seul texte. Le gouvernement peut les déclarer « irrecevables » s'ils ne correspondent pas à l'objet du texte. Les amendements sont un outil clé pour les partis d'opposition.`,
        },
        exemple: {
          en: `During the 2023 pension reform debate, over 20,000 amendments were filed by opposition parties in an attempt to delay or block the bill.`,
          fr: `Lors du débat sur la réforme des retraites en 2023, plus de 20 000 amendements ont été déposés par les partis d'opposition pour tenter de ralentir ou bloquer le texte.`,
        },
        debat: {
          en: `Amendments allow MPs to improve and adapt laws — a vital democratic process. But mass filing of amendments is also used as "obstruction" to slow down legislation, which some see as legitimate resistance and others as abuse of procedure.`,
          fr: `Les amendements permettent aux députés d'améliorer et d'adapter les lois — un processus démocratique essentiel. Mais le dépôt massif d'amendements est aussi utilisé comme « obstruction » pour ralentir la législation, ce que certains voient comme une résistance légitime et d'autres comme un abus de procédure.`,
        },
      },
    ],
  },
  {
    id: 'economie',
    icon: '💰',
    label: { en: 'Economy', fr: 'Économie' },
    terms: [
      {
        id: 'inflation',
        term: { en: 'Inflation', fr: 'Inflation' },
        simple: {
          en: `When prices rise across the economy, making your money worth less than before.`,
          fr: `Quand les prix augmentent dans toute l'économie, rendant votre argent moins puissant qu'avant.`,
        },
        concretement: {
          en: `If inflation is 5%, a coffee that cost €2 last year now costs €2.10. Your salary buys less unless it also rises. Central banks (like the ECB for Europe) try to keep inflation around 2% — low enough to be stable, high enough to avoid deflation. When inflation spikes, they raise interest rates to cool down spending.`,
          fr: `Si l'inflation est de 5 %, un café qui coûtait 2 € l'an dernier coûte maintenant 2,10 €. Votre salaire achète moins, sauf s'il augmente aussi. Les banques centrales (comme la BCE pour l'Europe) s'efforcent de maintenir l'inflation autour de 2 % — assez basse pour être stable, assez haute pour éviter la déflation. Quand l'inflation s'envole, elles augmentent les taux d'intérêt pour freiner les dépenses.`,
        },
        exemple: {
          en: `In 2022, inflation hit 6% in France — driven by energy prices after Russia's invasion of Ukraine. Supermarket prices soared, hitting low-income households hardest.`,
          fr: `En 2022, l'inflation a atteint 6 % en France — poussée par les prix de l'énergie après l'invasion de l'Ukraine par la Russie. Les prix des supermarchés ont flambé, touchant surtout les ménages modestes.`,
        },
        debat: {
          en: `Governments disagree on how to fight inflation: raise interest rates (which slows growth and hits borrowers) or subsidise energy prices (which costs public money). Neither is painless. The poor are generally hit hardest since they spend more of their income on food and energy.`,
          fr: `Les gouvernements sont en désaccord sur la façon de combattre l'inflation : augmenter les taux d'intérêt (ce qui ralentit la croissance et pénalise les emprunteurs) ou subventionner les prix de l'énergie (ce qui coûte de l'argent public). Aucune option n'est indolore. Les plus modestes sont généralement les plus touchés car ils dépensent une plus grande part de leurs revenus en alimentation et énergie.`,
        },
      },
      {
        id: 'dette',
        term: { en: 'National debt', fr: 'Dette publique' },
        simple: {
          en: `The total amount of money a government has borrowed and not yet paid back.`,
          fr: `Le montant total d'argent qu'un gouvernement a emprunté et n'a pas encore remboursé.`,
        },
        concretement: {
          en: `Governments borrow money by issuing bonds — investors lend them money and get interest in return. The debt grows when a government spends more than it collects in taxes (a deficit). Debt is measured as a percentage of GDP. France's debt is around 110% of GDP. This means interest payments take up a large share of the budget each year.`,
          fr: `Les gouvernements empruntent en émettant des obligations — les investisseurs leur prêtent de l'argent et reçoivent des intérêts en échange. La dette augmente quand un gouvernement dépense plus qu'il ne collecte en impôts (un déficit). La dette est mesurée en pourcentage du PIB. Celle de la France est d'environ 110 % du PIB. Cela signifie que les remboursements d'intérêts absorbent une grande part du budget chaque année.`,
        },
        exemple: {
          en: `France's national debt surpassed €3,000 billion in 2024. The government pays over €50 billion per year just in interest — more than the entire education budget.`,
          fr: `La dette publique française a dépassé 3 000 milliards d'euros en 2024. Le gouvernement rembourse plus de 50 milliards d'euros par an rien qu'en intérêts — plus que l'ensemble du budget de l'éducation.`,
        },
        debat: {
          en: `Some economists argue debt is dangerous and must be reduced urgently. Others say borrowing for investment (schools, infrastructure, green energy) is rational. The debate is about speed and priorities, not whether debt exists.`,
          fr: `Certains économistes estiment que la dette est dangereuse et doit être réduite d'urgence. D'autres disent qu'emprunter pour investir (écoles, infrastructures, énergie verte) est rationnel. Le débat porte sur le rythme et les priorités, pas sur l'existence de la dette.`,
        },
      },
      {
        id: 'deficit',
        term: { en: 'Deficit', fr: 'Déficit' },
        simple: {
          en: `When the government spends more money in a year than it collects in taxes.`,
          fr: `Quand le gouvernement dépense plus d'argent dans l'année qu'il n'en collecte en impôts.`,
        },
        concretement: {
          en: `If the government collects €1,000 billion in taxes but spends €1,050 billion, the deficit is €50 billion. That gap must be financed by borrowing. The EU's rules (Stability and Growth Pact) say deficits should stay below 3% of GDP. Countries that exceed this can face fines. Running a deficit isn't always bad — it depends on what the spending is for.`,
          fr: `Si le gouvernement collecte 1 000 milliards en impôts mais dépense 1 050 milliards, le déficit est de 50 milliards. Cet écart doit être financé par l'emprunt. Les règles de l'UE (Pacte de stabilité) imposent que les déficits restent sous 3 % du PIB. Les pays qui dépassent ce seuil peuvent être sanctionnés. Avoir un déficit n'est pas toujours mauvais — tout dépend de ce à quoi sert la dépense.`,
        },
        exemple: {
          en: `France's 2023 deficit was 5.5% of GDP — well above the EU's 3% limit — triggering an EU "excessive deficit procedure" in 2024.`,
          fr: `Le déficit français de 2023 était de 5,5 % du PIB — bien au-dessus de la limite de 3 % imposée par l'UE — déclenchant une procédure de déficit excessif en 2024.`,
        },
        debat: {
          en: `Left-leaning economists often accept deficits to fund social spending during crises. Right-leaning economists prioritise balancing the books to avoid debt spiral. The EU's rules are themselves contested — some say they force austerity at the worst moment.`,
          fr: `Les économistes de gauche acceptent souvent les déficits pour financer les dépenses sociales en temps de crise. Ceux de droite privilégient l'équilibre budgétaire pour éviter une spirale de la dette. Les règles de l'UE sont elles-mêmes contestées — certains estiment qu'elles imposent l'austérité au pire moment.`,
        },
      },
      {
        id: 'tva',
        term: { en: 'VAT (TVA)', fr: 'TVA' },
        simple: {
          en: `A tax added to the price of almost everything you buy — it's the main source of state revenue.`,
          fr: `Une taxe ajoutée sur le prix de presque tout ce que vous achetez — c'est la principale source de revenus de l'État.`,
        },
        concretement: {
          en: `In France, the standard VAT rate is 20%. On food basics it's 5.5%, and on medicine it's 2.1%. Unlike income tax, VAT is paid by everyone who buys goods — regardless of income. When you pay €120 for a product, €20 goes to the state. Businesses collect it and pass it on.`,
          fr: `En France, le taux normal de TVA est de 20 %. Sur les produits alimentaires de base, il est de 5,5 %, et sur les médicaments de 2,1 %. Contrairement à l'impôt sur le revenu, la TVA est payée par toute personne qui achète des biens — quelle que soit sa situation. Quand vous payez 120 € pour un produit, 20 € vont à l'État. Les entreprises la collectent et la reversent.`,
        },
        exemple: {
          en: `France collects around €200 billion in VAT annually — its single largest source of tax revenue, more than income tax.`,
          fr: `La France collecte environ 200 milliards d'euros de TVA chaque année — sa principale source de recettes fiscales, davantage que l'impôt sur le revenu.`,
        },
        debat: {
          en: `VAT is criticised as regressive: poorer households spend a larger share of their income on goods, so they pay proportionally more. Some argue reduced VAT rates on essentials help. Others say it's better to redistribute through income taxes and social benefits.`,
          fr: `La TVA est critiquée comme régressive : les ménages modestes dépensent une plus grande part de leurs revenus en biens, ils paient donc proportionnellement plus. Certains estiment que les taux réduits sur les produits essentiels aident. D'autres pensent qu'il vaut mieux redistribuer via l'impôt sur le revenu et les aides sociales.`,
        },
      },
      {
        id: 'pouvoir_achat',
        term: { en: 'Purchasing power', fr: 'Pouvoir d\'achat' },
        simple: {
          en: `What your money can actually buy — how many goods and services your income covers.`,
          fr: `Ce que votre argent peut réellement acheter — combien de biens et services votre revenu permet de couvrir.`,
        },
        concretement: {
          en: `If your salary stays flat but prices rise by 5%, your purchasing power drops — you can buy less even with the same income. Purchasing power depends on wages, inflation, taxes, housing costs, and public services. It's one of the top concerns in French elections. Even small changes feel very concrete in daily life.`,
          fr: `Si votre salaire reste stable mais que les prix augmentent de 5 %, votre pouvoir d'achat baisse — vous achetez moins à revenu égal. Il dépend des salaires, de l'inflation, des impôts, du coût du logement et des services publics. C'est l'une des premières préoccupations des Français lors des élections. Même de petits changements se ressentent très concrètement au quotidien.`,
        },
        exemple: {
          en: `During the Gilets Jaunes crisis in 2018, the trigger was a fuel tax increase that reduced purchasing power for rural workers who depend on their cars.`,
          fr: `Pendant la crise des Gilets Jaunes en 2018, le déclencheur a été une hausse de la taxe sur les carburants qui a réduit le pouvoir d'achat des travailleurs ruraux dépendant de leur voiture.`,
        },
        debat: {
          en: `The left often proposes raising the minimum wage and taxing the wealthy to boost purchasing power. The right tends to favour reducing taxes on labour and businesses. Both sides claim to defend purchasing power — they disagree on how.`,
          fr: `La gauche propose souvent d'augmenter le SMIC et de taxer les plus riches pour soutenir le pouvoir d'achat. La droite tend à préférer la baisse des charges et des impôts sur les entreprises. Les deux bords prétendent défendre le pouvoir d'achat — ils s'opposent sur la méthode.`,
        },
      },
      {
        id: 'croissance',
        term: { en: 'GDP & Growth', fr: 'Croissance / PIB' },
        simple: {
          en: `GDP (Gross Domestic Product) measures the total value of all goods and services produced in a country. Growth means GDP is increasing.`,
          fr: `Le PIB (Produit Intérieur Brut) mesure la valeur totale de tous les biens et services produits dans un pays. La croissance signifie que ce chiffre augmente.`,
        },
        concretement: {
          en: `If France's GDP grows by 1.5% this year, it means the economy produced 1.5% more than last year. Positive growth generally means more jobs, more tax revenue, and room to fund public services. Negative growth for two consecutive quarters is called a recession. GDP is the most-used but also most-criticised economic indicator.`,
          fr: `Si le PIB de la France augmente de 1,5 % cette année, cela signifie que l'économie a produit 1,5 % de plus que l'année précédente. Une croissance positive signifie généralement plus d'emplois, plus de recettes fiscales et de quoi financer les services publics. Une croissance négative pendant deux trimestres consécutifs s'appelle une récession. Le PIB est l'indicateur économique le plus utilisé mais aussi le plus critiqué.`,
        },
        exemple: {
          en: `France's GDP shrank by 7.9% in 2020 due to COVID lockdowns — the worst drop since World War II. It rebounded strongly in 2021.`,
          fr: `Le PIB de la France a chuté de 7,9 % en 2020 en raison des confinements liés au COVID — la pire baisse depuis la Seconde Guerre mondiale. Il a fortement rebondi en 2021.`,
        },
        debat: {
          en: `GDP doesn't measure inequality, happiness, or environmental damage. Many economists argue for complementary indicators like the Human Development Index or carbon footprint metrics. "Degrowth" advocates say pursuing endless GDP growth is incompatible with ecological sustainability.`,
          fr: `Le PIB ne mesure pas les inégalités, le bonheur ni les dégâts environnementaux. Beaucoup d'économistes préconisent des indicateurs complémentaires comme l'Indice de Développement Humain ou des mesures d'empreinte carbone. Les partisans de la « décroissance » estiment que la quête d'une croissance infinie est incompatible avec la durabilité écologique.`,
        },
      },
    ],
  },
  {
    id: 'societe',
    icon: '🌍',
    label: { en: 'Society', fr: 'Société' },
    terms: [
      {
        id: 'laicite',
        term: { en: 'Secularism (Laïcité)', fr: 'Laïcité' },
        simple: {
          en: `The strict separation of religion from the state — a core principle of the French Republic.`,
          fr: `La séparation stricte entre la religion et l'État — un principe fondamental de la République française.`,
        },
        concretement: {
          en: `In France, the state is officially neutral on religion. Public schools cannot teach religion. Civil servants cannot display religious symbols at work. Religious groups can practise freely, but don't receive state funding. The 1905 law established this separation. Laïcité is seen by many French people as a marker of national identity and equality.`,
          fr: `En France, l'État est officiellement neutre en matière de religion. Les écoles publiques ne peuvent pas enseigner la religion. Les fonctionnaires ne peuvent pas porter de signes religieux au travail. Les groupes religieux peuvent pratiquer librement, mais ne reçoivent pas de financement public. La loi de 1905 a établi cette séparation. La laïcité est perçue par beaucoup de Français comme un marqueur d'identité nationale et d'égalité.`,
        },
        exemple: {
          en: `In 2004, France banned the wearing of conspicuous religious symbols (including headscarves, large crosses, and kippahs) in public schools. The law sparked intense national debate.`,
          fr: `En 2004, la France a interdit le port de signes religieux ostensibles (y compris le voile, les grandes croix et la kippa) dans les écoles publiques. Cette loi a déclenché un intense débat national.`,
        },
        debat: {
          en: `Some see laïcité as a guarantee of equality and republican unity. Others argue that in practice it disproportionately targets Muslim women, and that a stricter interpretation limits religious freedom rather than protecting it.`,
          fr: `Certains voient la laïcité comme une garantie d'égalité et d'unité républicaine. D'autres estiment qu'en pratique elle cible de manière disproportionnée les femmes musulmanes, et qu'une interprétation plus stricte restreint la liberté religieuse plutôt qu'elle ne la protège.`,
        },
      },
      {
        id: 'immigration',
        term: { en: 'Immigration', fr: 'Immigration' },
        simple: {
          en: `The movement of people to live permanently in a country that is not their country of birth.`,
          fr: `Le déplacement de personnes pour vivre de façon permanente dans un pays qui n'est pas leur pays de naissance.`,
        },
        concretement: {
          en: `People immigrate for many reasons: work, family reunification, fleeing war or persecution (asylum), or study. France has different legal paths for each. The number of people who arrive each year, how many receive residency, and how many are expelled are all political flashpoints. Immigration policy involves border control, asylum law, integration programmes, and citizenship rules.`,
          fr: `Les personnes immigrent pour de nombreuses raisons : le travail, le regroupement familial, la fuite de la guerre ou des persécutions (asile), ou les études. La France dispose de différentes voies légales pour chacun. Le nombre de personnes qui arrivent chaque année, combien obtiennent un titre de séjour, et combien sont expulsées sont tous des points d'accrochage politique. La politique d'immigration touche au contrôle des frontières, au droit d'asile, aux programmes d'intégration et aux règles de citoyenneté.`,
        },
        exemple: {
          en: `The 2024 immigration law in France tightened conditions for family reunification, restricted access to social benefits for foreigners, and expanded the use of deportation orders.`,
          fr: `La loi immigration de 2024 en France a durci les conditions de regroupement familial, restreint l'accès aux aides sociales pour les étrangers, et élargi le recours aux mesures d'expulsion.`,
        },
        debat: {
          en: `The right generally wants stricter border control and faster deportations. The left tends to emphasise humanitarian duties and integration. Far-right parties call for a drastic reduction in immigration. Far-left parties argue the real issue is global inequality and climate change — which drive migration in the first place.`,
          fr: `La droite veut généralement un contrôle plus strict des frontières et des expulsions plus rapides. La gauche tend à mettre en avant les obligations humanitaires et l'intégration. Les partis d'extrême droite réclament une réduction drastique de l'immigration. Ceux d'extrême gauche estiment que le vrai problème est l'inégalité mondiale et le changement climatique — qui alimentent les migrations à la base.`,
        },
      },
      {
        id: 'services_publics',
        term: { en: 'Public services', fr: 'Services publics' },
        simple: {
          en: `Services provided by the state to all citizens, like hospitals, schools, public transport, and post offices.`,
          fr: `Des services fournis par l'État à tous les citoyens, comme les hôpitaux, les écoles, les transports en commun et les bureaux de poste.`,
        },
        concretement: {
          en: `Public services are funded by taxes and are meant to be accessible to everyone regardless of income. France has one of the largest public sectors in Europe. In recent decades, some services have been privatised or reduced. Public servants (fonctionnaires) work in these services and have specific employment protections.`,
          fr: `Les services publics sont financés par les impôts et sont censés être accessibles à tous quelle que soit la situation financière. La France possède l'un des secteurs publics les plus importants d'Europe. Ces dernières décennies, certains services ont été privatisés ou réduits. Les fonctionnaires travaillent dans ces services et bénéficient de protections spécifiques de l'emploi.`,
        },
        exemple: {
          en: `France's universal healthcare system (Sécurité Sociale) covers everyone — including low-income people. Closing a rural hospital or post office triggers intense local protests.`,
          fr: `Le système de santé universel français (Sécurité Sociale) couvre tout le monde — y compris les personnes à faibles revenus. La fermeture d'un hôpital ou d'un bureau de poste rural déclenche d'intenses protestations locales.`,
        },
        debat: {
          en: `The left generally wants to expand and protect public services. The right often argues for efficiency, privatisation, or market competition to reduce costs. Closing services in rural areas is particularly sensitive, fuelling resentment toward Paris and the political class.`,
          fr: `La gauche veut généralement développer et protéger les services publics. La droite plaide souvent pour l'efficacité, la privatisation ou la concurrence pour réduire les coûts. La fermeture de services en zones rurales est particulièrement sensible, alimentant le ressentiment envers Paris et la classe politique.`,
        },
      },
      {
        id: 'ecologie',
        term: { en: 'Ecology / Green transition', fr: 'Écologie / Transition énergétique' },
        simple: {
          en: `The political effort to reduce pollution and carbon emissions, and shift to renewable energy.`,
          fr: `L'effort politique pour réduire la pollution et les émissions de carbone, et passer aux énergies renouvelables.`,
        },
        concretement: {
          en: `Countries signed the Paris Agreement in 2015 to limit global warming. To do this, they need to phase out fossil fuels (oil, gas, coal), invest in renewables (solar, wind), and change farming and transport. This is expensive and touches almost every sector of the economy. Some changes happen fast; others face strong resistance from affected industries or workers.`,
          fr: `Les pays ont signé l'Accord de Paris en 2015 pour limiter le réchauffement climatique. Pour cela, ils doivent abandonner les combustibles fossiles (pétrole, gaz, charbon), investir dans les énergies renouvelables (solaire, éolien), et transformer l'agriculture et les transports. C'est coûteux et cela touche presque tous les secteurs de l'économie. Certains changements avancent vite ; d'autres font face à de fortes résistances des industries ou travailleurs concernés.`,
        },
        exemple: {
          en: `France plans to close all coal plants by 2027 and expand nuclear and offshore wind. The EU's "Fit for 55" package aims to cut emissions by 55% by 2030 compared to 1990.`,
          fr: `La France prévoit de fermer toutes ses centrales à charbon d'ici 2027 et d'étendre le nucléaire et l'éolien en mer. Le paquet « Fit for 55 » de l'UE vise à réduire les émissions de 55 % d'ici 2030 par rapport à 1990.`,
        },
        debat: {
          en: `Greens want faster and more radical action. Industry groups warn of job losses and competitiveness risks. Some on the left argue the wealthy must pay more for the transition. Some on the right question the pace and economic cost. There is broad consensus that climate change is real — the debates are about who pays and how fast.`,
          fr: `Les Verts veulent des actions plus rapides et plus radicales. Les groupes industriels avertissent des risques de perte d'emplois et de compétitivité. Certains à gauche estiment que les plus riches doivent davantage financer la transition. Certains à droite s'interrogent sur le rythme et le coût économique. Il y a un large consensus sur le fait que le changement climatique est réel — les débats portent sur qui paie et à quelle vitesse.`,
        },
      },
    ],
  },
  {
    id: 'commerce',
    icon: '🌐',
    label: { en: 'Trade & Globalisation', fr: 'Commerce & Mondialisation' },
    terms: [
      {
        id: 'mondialisation',
        term: { en: 'Globalisation', fr: 'Mondialisation' },
        simple: {
          en: `The process by which countries, economies, and cultures become increasingly interconnected.`,
          fr: `Le processus par lequel les pays, les économies et les cultures deviennent de plus en plus interconnectés.`,
        },
        concretement: {
          en: `Globalisation means goods, money, data, and people move across borders more freely than ever. A phone made in China, with chips from Taiwan, software from the US, and sold in France — that's globalisation. It drives down consumer prices but also moves jobs overseas. Supply chains span dozens of countries. Financial crises in one place ripple everywhere.`,
          fr: `La mondialisation signifie que les biens, l'argent, les données et les personnes traversent les frontières plus librement que jamais. Un téléphone fabriqué en Chine, avec des puces de Taïwan, un logiciel américain, et vendu en France — c'est la mondialisation. Elle fait baisser les prix à la consommation mais déplace aussi des emplois à l'étranger. Les chaînes d'approvisionnement s'étendent sur des dizaines de pays. Les crises financières dans un endroit se répercutent partout.`,
        },
        exemple: {
          en: `During the COVID pandemic, France struggled to source masks and medicines because production had been moved to Asia. This reignited the debate about strategic independence.`,
          fr: `Pendant la pandémie de COVID, la France a eu du mal à s'approvisionner en masques et médicaments car la production avait été déplacée en Asie. Cela a relancé le débat sur l'indépendance stratégique.`,
        },
        debat: {
          en: `Supporters say globalisation reduces poverty globally and lowers prices. Critics say it benefits multinational corporations and wealthy countries most, while workers in rich nations lose jobs and workers in poor nations face exploitation. Both can be partially true.`,
          fr: `Ses partisans disent que la mondialisation réduit la pauvreté à l'échelle mondiale et fait baisser les prix. Ses critiques estiment qu'elle profite surtout aux multinationales et aux pays riches, tandis que les travailleurs des pays riches perdent des emplois et ceux des pays pauvres font face à l'exploitation. Les deux peuvent être partiellement vrais.`,
        },
      },
      {
        id: 'protectionnisme',
        term: { en: 'Protectionism', fr: 'Protectionnisme' },
        simple: {
          en: `When a government protects its own industries by taxing or limiting imports from other countries.`,
          fr: `Quand un gouvernement protège ses propres industries en taxant ou en limitant les importations d'autres pays.`,
        },
        concretement: {
          en: `Protectionist measures include tariffs (extra taxes on imports), import quotas, or subsidies for domestic producers. The goal is to make foreign goods more expensive so local ones stay competitive. This protects local jobs but raises consumer prices. The opposite of protectionism is free trade, where goods flow with minimal barriers.`,
          fr: `Les mesures protectionnistes comprennent les droits de douane (taxes supplémentaires sur les importations), les quotas d'importation, ou les subventions aux producteurs nationaux. L'objectif est de rendre les produits étrangers plus chers pour que les produits locaux restent compétitifs. Cela protège les emplois locaux mais augmente les prix à la consommation. L'opposé du protectionnisme est le libre-échange, où les biens circulent avec peu de barrières.`,
        },
        exemple: {
          en: `In 2025, the US imposed 25% tariffs on European steel and aluminium under Trump. The EU responded with counter-tariffs on American goods — a trade war.`,
          fr: `En 2025, les États-Unis ont imposé des droits de douane de 25 % sur l'acier et l'aluminium européens sous Trump. L'UE a répondu avec des contre-tarifs sur les produits américains — une guerre commerciale.`,
        },
        debat: {
          en: `The right often favours protectionism to defend national industry and sovereignty. Mainstream economists generally prefer free trade for its efficiency gains. The left is split: some support protectionism to defend workers' jobs; others worry it raises prices for the poor.`,
          fr: `La droite est souvent favorable au protectionnisme pour défendre l'industrie nationale et la souveraineté. Les économistes dominants préfèrent généralement le libre-échange pour ses gains d'efficacité. La gauche est divisée : certains soutiennent le protectionnisme pour défendre les emplois des travailleurs ; d'autres craignent qu'il augmente les prix pour les plus modestes.`,
        },
      },
      {
        id: 'libre_echange',
        term: { en: 'Free trade', fr: 'Libre-échange' },
        simple: {
          en: `Trade between countries with no or minimal tariffs and restrictions.`,
          fr: `Le commerce entre pays sans droits de douane ni restrictions, ou avec un minimum de barrières.`,
        },
        concretement: {
          en: `Free trade agreements (like CETA between the EU and Canada) allow goods to cross borders more freely. This can lower consumer prices and create export opportunities. But it also means domestic industries face more competition — which can mean job losses. The EU's single market is the world's largest free trade area.`,
          fr: `Les accords de libre-échange (comme le CETA entre l'UE et le Canada) permettent aux marchandises de traverser les frontières plus librement. Cela peut faire baisser les prix à la consommation et créer des opportunités d'exportation. Mais cela expose aussi les industries nationales à une concurrence accrue — ce qui peut signifier des pertes d'emplois. Le marché unique de l'UE est la plus grande zone de libre-échange au monde.`,
        },
        exemple: {
          en: `CETA, the EU–Canada trade deal, lowered tariffs on cars, food, and services. French farmers protested, fearing competition from cheaper Canadian agricultural imports.`,
          fr: `Le CETA, l'accord commercial UE–Canada, a réduit les droits de douane sur les voitures, l'alimentation et les services. Des agriculteurs français ont manifesté, craignant la concurrence des importations agricoles canadiennes moins chères.`,
        },
        debat: {
          en: `Supporters of free trade argue it boosts prosperity for all. Critics — on both left and right — argue it can undermine labour standards, food safety, and sovereignty. The debate is often about the terms of trade, not just whether trade happens.`,
          fr: `Les partisans du libre-échange estiment qu'il accroît la prospérité de tous. Ses critiques — à gauche comme à droite — affirment qu'il peut affaiblir les normes sociales, la sécurité alimentaire et la souveraineté. Le débat porte souvent sur les conditions des échanges, pas seulement sur leur existence.`,
        },
      },
    ],
  },
  {
    id: 'concepts',
    icon: '🧠',
    label: { en: 'Political concepts', fr: 'Concepts politiques' },
    terms: [
      {
        id: 'extreme_gauche',
        term: { en: 'Far left', fr: 'Extrême gauche' },
        simple: {
          en: `Political movements that seek radical transformation of society toward equality and collective ownership.`,
          fr: `Des mouvements politiques qui cherchent une transformation radicale de la société vers l'égalité et la propriété collective.`,
        },
        concretement: {
          en: `Far-left parties generally advocate nationalising major industries, heavily taxing wealth, redistributing land, and abolishing or drastically reforming capitalism. They often support strong workers' rights and radical climate action. In France, parties to the left of La France Insoumise are often labelled far-left (e.g. NPA, Lutte Ouvrière). The term has a broader definition in the US.`,
          fr: `Les partis d'extrême gauche préconisent généralement la nationalisation des grandes industries, une forte taxation de la richesse, la redistribution des terres, et l'abolition ou la réforme radicale du capitalisme. Ils soutiennent souvent des droits des travailleurs solides et une action climatique radicale. En France, les partis à gauche de La France Insoumise sont souvent étiquetés extrême gauche (ex. : NPA, Lutte Ouvrière). Le terme a une définition plus large aux États-Unis.`,
        },
        exemple: {
          en: `Lutte Ouvrière (LO), a Trotskyist party in France, regularly runs in elections and advocates for workers' control of factories and abolition of the market economy.`,
          fr: `Lutte Ouvrière (LO), parti trotskyste français, se présente régulièrement aux élections et prône le contrôle ouvrier des usines et l'abolition de l'économie de marché.`,
        },
        debat: {
          en: `Supporters say capitalism generates inequality that only radical change can fix. Critics argue far-left programmes have historically failed or led to authoritarianism. The label "far left" is itself contested — often used pejoratively by opponents.`,
          fr: `Ses partisans estiment que le capitalisme génère des inégalités que seul un changement radical peut corriger. Ses critiques avancent que les programmes d'extrême gauche ont historiquement échoué ou conduit à l'autoritarisme. L'étiquette « extrême gauche » est elle-même contestée — souvent utilisée de façon péjorative par les adversaires.`,
        },
      },
      {
        id: 'extreme_droite',
        term: { en: 'Far right', fr: 'Extrême droite' },
        simple: {
          en: `Political movements that prioritise national identity, strict immigration control, and strong state authority — often rejecting liberal democracy or multiculturalism.`,
          fr: `Des mouvements politiques qui privilégient l'identité nationale, un contrôle strict de l'immigration et une autorité étatique forte — rejetant souvent la démocratie libérale ou le multiculturalisme.`,
        },
        concretement: {
          en: `Far-right parties typically call for steep reductions in immigration, prioritising citizens over foreigners in social benefits ("national preference"), strong law-and-order policies, and scepticism of international institutions like the EU. Some embrace nationalism; a smaller fringe advocates authoritarianism. In France, the Rassemblement National (RN) is the main far-right party.`,
          fr: `Les partis d'extrême droite appellent généralement à une forte réduction de l'immigration, à la priorité nationale dans les aides sociales, à des politiques sécuritaires fortes et au scepticisme envers les institutions internationales comme l'UE. Certains embrassent le nationalisme ; une frange plus petite prône l'autoritarisme. En France, le Rassemblement National (RN) est le principal parti d'extrême droite.`,
        },
        exemple: {
          en: `In the 2024 French legislative elections, the RN came first in the first round with around 33% of votes — the highest score for a far-right party in French history.`,
          fr: `Lors des élections législatives françaises de 2024, le RN est arrivé premier au premier tour avec environ 33 % des voix — le meilleur score d'un parti d'extrême droite dans l'histoire de la France.`,
        },
        debat: {
          en: `Supporters say far-right parties give voice to concerns about identity and security ignored by mainstream politics. Critics warn of risks to minority rights, democratic institutions, and international cooperation. The boundary between "conservative right" and "far right" is itself contested.`,
          fr: `Ses partisans estiment que les partis d'extrême droite donnent une voix aux préoccupations d'identité et de sécurité ignorées par la politique traditionnelle. Ses critiques mettent en garde contre les risques pour les droits des minorités, les institutions démocratiques et la coopération internationale. La frontière entre « droite conservatrice » et « extrême droite » est elle-même contestée.`,
        },
      },
      {
        id: 'populisme',
        term: { en: 'Populism', fr: 'Populisme' },
        simple: {
          en: `A political style that pits "the people" against "the elite" — claiming to represent the real majority against corrupt or out-of-touch leaders.`,
          fr: `Un style politique qui oppose « le peuple » aux « élites » — prétendant représenter la vraie majorité contre des dirigeants corrompus ou déconnectés.`,
        },
        concretement: {
          en: `Populism isn't a fixed ideology — it can be left-wing (redistributing from the rich) or right-wing (protecting the "real" nation from immigrants or globalists). What defines it is the claim that a pure, authentic "people" is being betrayed by a corrupt elite. Populist leaders tend to bypass traditional institutions, appeal directly to voters, and distrust journalists and experts.`,
          fr: `Le populisme n'est pas une idéologie fixe — il peut être de gauche (redistribuer des riches) ou de droite (protéger la « vraie » nation contre les immigrés ou les mondialistes). Ce qui le définit, c'est l'affirmation qu'un « peuple » pur et authentique est trahi par une élite corrompue. Les leaders populistes tendent à contourner les institutions traditionnelles, à s'adresser directement aux électeurs et à se méfier des journalistes et des experts.`,
        },
        exemple: {
          en: `Donald Trump ("Make America Great Again") and Jean-Luc Mélenchon ("La France Insoumise") are both described as populist — despite being on opposite ends of the political spectrum.`,
          fr: `Donald Trump (« Make America Great Again ») et Jean-Luc Mélenchon (« La France Insoumise ») sont tous deux décrits comme populistes — malgré leurs positions opposées sur l'échiquier politique.`,
        },
        debat: {
          en: `Some see populism as a healthy democratic corrective — a way for ordinary people to reclaim power from entrenched elites. Others warn that populists, once in power, often attack democratic institutions (courts, press, opposition) in the name of "the people."`,
          fr: `Certains voient le populisme comme un correctif démocratique sain — un moyen pour les citoyens ordinaires de reprendre le pouvoir aux élites établies. D'autres avertissent que les populistes, une fois au pouvoir, s'attaquent souvent aux institutions démocratiques (tribunaux, presse, opposition) au nom du « peuple ».`,
        },
      },
      {
        id: 'souverainete',
        term: { en: 'Sovereignty', fr: 'Souveraineté' },
        simple: {
          en: `The idea that a nation has the right and power to make its own decisions, free from external interference.`,
          fr: `L'idée qu'une nation a le droit et le pouvoir de prendre ses propres décisions, sans ingérence extérieure.`,
        },
        concretement: {
          en: `Sovereignty means a country controls its own laws, borders, currency, and military. In the EU, member states have shared some sovereignty — EU law overrides national law in many areas. Sovereignists want to reclaim more national control. The debate became central with Brexit, when the UK voted to leave the EU partly to "take back control."`,
          fr: `La souveraineté signifie qu'un pays contrôle ses propres lois, frontières, monnaie et armée. Dans l'UE, les États membres ont partagé une partie de leur souveraineté — le droit européen prime sur le droit national dans de nombreux domaines. Les souverainistes veulent reprendre plus de contrôle national. Ce débat est devenu central avec le Brexit, lorsque le Royaume-Uni a voté pour quitter l'UE en partie pour « reprendre le contrôle ».`,
        },
        exemple: {
          en: `France's decision to develop its own nuclear deterrent (the "Force de frappe") in the 1960s was a sovereignty move — choosing not to rely entirely on the US for defence.`,
          fr: `La décision de la France de développer sa propre dissuasion nucléaire (la « Force de frappe ») dans les années 1960 était un geste de souveraineté — choisir de ne pas dépendre entièrement des États-Unis pour sa défense.`,
        },
        debat: {
          en: `Sovereignists — on left and right — argue that shared governance undermines democracy because voters can't change rules set at EU or international level. European integrationists counter that pooling sovereignty gives small countries more collective power in a globalised world.`,
          fr: `Les souverainistes — à gauche comme à droite — soutiennent que la gouvernance partagée affaiblit la démocratie car les électeurs ne peuvent pas changer les règles fixées au niveau européen ou international. Les partisans de l'intégration européenne rétorquent que la mise en commun de la souveraineté donne aux petits pays plus de puissance collective dans un monde globalisé.`,
        },
      },
    ],
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
  const [expanded, setExpanded] = useState(false);

  const t = (key) => topic[key]?.[language] ?? topic[key]?.en ?? '';

  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      {...fadeUp(delay)}
    >
      {/* Header row */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-2xl flex-shrink-0 w-9 text-center">{topic.icon}</span>
        <span className="font-semibold text-gray-900 text-base flex-1 leading-snug">
          {t('title')}
        </span>
        <span className="text-gray-300 text-xl leading-none flex-shrink-0 w-5 text-center">
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
            <div className="px-6 pb-6 pt-1 border-t border-gray-50 space-y-4">

              {/* Definition */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? `C'est quoi ?` : 'What is it?'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{t('definition')}</p>
              </div>

              {/* Example */}
              <div className="bg-gray-50 rounded-xl px-4 py-3.5">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? 'Exemple concret' : 'Concrete example'}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{t('example')}</p>
              </div>

              {/* Read more */}
              <AnimatePresence initial={false}>
                {expanded && (
                  <motion.div
                    key="extended"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                    className="overflow-hidden"
                  >
                    <div className="space-y-3 pt-1">
                      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                        {language === 'fr' ? 'Pour aller plus loin' : 'Going deeper'}
                      </p>
                      {t('extended').split('\n\n').map((para, i) => (
                        <p key={i} className="text-sm text-gray-600 leading-relaxed">{para}</p>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Expand/collapse toggle */}
              <button
                onClick={() => setExpanded(e => !e)}
                className="text-xs font-medium text-gray-400 hover:text-gray-700 transition-colors py-0.5"
              >
                {expanded
                  ? (language === 'fr' ? '↑ Réduire' : '↑ Show less')
                  : (language === 'fr' ? '↓ En savoir plus' : '↓ Read more')}
              </button>

              {/* CTA */}
              <button
                onClick={onCTA}
                className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-gray-200 hover:border-gray-900 hover:bg-gray-50 transition-all group"
              >
                <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900 transition-colors">
                  {language === 'fr' ? `Voir où je me situe →` : 'See where I stand →'}
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

// ─── Crisis card ──────────────────────────────────────────────────────────────

function CrisisCard({ crisis, language, delay }) {
  const [open, setOpen] = useState(false);

  const t = (key) => crisis[key]?.[language] ?? crisis[key]?.en ?? '';

  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
      {...fadeUp(delay)}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-2xl flex-shrink-0 w-9 text-center">{crisis.icon}</span>
        <span className="font-semibold text-gray-900 text-base flex-1 leading-snug">
          {t('title')}
        </span>
        <span className="text-gray-300 text-xl leading-none flex-shrink-0 w-5 text-center">
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
            <div className="px-6 pb-6 pt-1 border-t border-gray-50 space-y-4">

              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? `Qu'est-ce qui s'est passé ?` : 'What happened?'}
                </p>
                <p className="text-sm text-gray-700 leading-relaxed">{t('what')}</p>
              </div>

              <div className="bg-amber-50 rounded-xl px-4 py-3.5">
                <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? 'Pourquoi ça a explosé ?' : 'Why did it blow up?'}
                </p>
                <p className="text-sm text-amber-900 leading-relaxed">{t('why')}</p>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? 'Les questions que ça soulève' : 'The questions it raises'}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{t('debates')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Glossary card ────────────────────────────────────────────────────────────

function GlossaryCard({ term, language, delay }) {
  const [open, setOpen] = useState(false);

  const t = (key) => term[key]?.[language] ?? term[key]?.en ?? '';

  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-xl overflow-hidden"
      {...fadeUp(delay)}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-5 py-3.5 text-left hover:bg-gray-50 transition-colors gap-3"
      >
        <span className="font-semibold text-gray-800 text-sm leading-snug">{t('term')}</span>
        <span className="text-gray-300 text-lg leading-none flex-shrink-0">{open ? '−' : '+'}</span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-1 border-t border-gray-50 space-y-3.5">
              {/* Simple definition */}
              <p className="text-sm text-gray-700 leading-relaxed">👉 {t('simple')}</p>

              {/* Concrètement */}
              <div className="bg-gray-50 rounded-xl px-4 py-3.5">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? 'Concrètement' : 'In practice'}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{t('concretement')}</p>
              </div>

              {/* Exemple */}
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? 'Exemple' : 'Example'}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">{t('exemple')}</p>
              </div>

              {/* Pourquoi c'est débattu */}
              <div className="border-l-2 border-amber-200 pl-3.5">
                <p className="text-[11px] font-semibold text-amber-600 uppercase tracking-widest mb-1.5">
                  {language === 'fr' ? `Pourquoi c'est débattu` : 'Why it\'s debated'}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">{t('debat')}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GlossaryCategory({ category, language, baseDelay }) {
  const [open, setOpen] = useState(false);

  const label = category.label[language] ?? category.label.en;

  return (
    <motion.div
      className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
      {...fadeUp(baseDelay)}
    >
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-4 px-6 py-5 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-2xl flex-shrink-0 w-9 text-center">{category.icon}</span>
        <div className="flex-1">
          <span className="font-semibold text-gray-900 text-base leading-snug">{label}</span>
          <span className="ml-2 text-xs text-gray-400">
            {category.terms.length} {language === 'fr' ? 'termes' : 'terms'}
          </span>
        </div>
        <span className="text-gray-300 text-xl leading-none flex-shrink-0 w-5 text-center">
          {open ? '−' : '+'}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="terms"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-50 space-y-2">
              {category.terms.map((term, idx) => (
                <GlossaryCard
                  key={term.id}
                  term={term}
                  language={language}
                  delay={0.04 + idx * 0.02}
                />
              ))}
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
          {language === 'fr' ? `J'y connais rien` : 'Politics 101'}
        </h1>
        <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
          {language === 'fr'
            ? `Les grands concepts politiques expliqués simplement. Pas de jargon, pas de parti pris. Chaque sujet en une minute — ou en profondeur si tu veux.`
            : `The big political concepts explained simply. No jargon, no spin. Each topic in a minute — or in depth if you want.`}
        </p>
      </motion.div>

      {/* Topic cards */}
      <div className="space-y-3 mb-14">
        {TOPICS.map((topic, idx) => (
          <TopicCard
            key={topic.id}
            topic={topic}
            language={language}
            delay={0.04 + idx * 0.03}
            onCTA={() => navigate('selectTest')}
          />
        ))}
      </div>

      {/* Crises section */}
      <motion.div className="mb-6" {...fadeUp(0.3)}>
        <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <span>🔥</span>
          {language === 'fr' ? 'Crises récentes' : 'Recent crises'}
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
          {language === 'fr' ? 'Comprendre les crises récentes' : 'Understanding recent crises'}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
          {language === 'fr'
            ? `Ce qui s'est passé, pourquoi ça a explosé, et ce que ça dit de nos sociétés.`
            : `What happened, why it blew up, and what it reveals about our societies.`}
        </p>
      </motion.div>

      <div className="space-y-3 mb-14">
        {CRISES.map((crisis, idx) => (
          <CrisisCard
            key={crisis.id}
            crisis={crisis}
            language={language}
            delay={0.32 + idx * 0.04}
          />
        ))}
      </div>

      {/* Glossary section */}
      <motion.div className="mb-6" {...fadeUp(0.45)}>
        <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full mb-4">
          <span>📖</span>
          {language === 'fr' ? 'Glossaire' : 'Glossary'}
        </div>
        <h2 className="text-xl font-bold text-gray-900 tracking-tight mb-2">
          {language === 'fr' ? 'Les mots que tu dois connaître' : 'Words you need to know'}
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed max-w-lg">
          {language === 'fr'
            ? `Les termes politiques expliqués sans jargon. Clique sur une catégorie pour explorer.`
            : `Political terms explained without jargon. Click a category to explore.`}
        </p>
      </motion.div>

      <div className="space-y-3 mb-14">
        {GLOSSARY_CATEGORIES.map((category, idx) => (
          <GlossaryCategory
            key={category.id}
            category={category}
            language={language}
            baseDelay={0.47 + idx * 0.03}
          />
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        className="bg-gray-900 rounded-2xl px-6 py-8 text-center"
        {...fadeUp(0.6)}
      >
        <p className="text-white font-bold text-lg mb-2">
          {language === 'fr' ? `Prêt à découvrir votre profil ?` : 'Ready to find your profile?'}
        </p>
        <p className="text-gray-400 text-sm mb-5">
          {language === 'fr'
            ? `Répondez à quelques questions. On s'occupe du reste.`
            : `Answer a few questions. We'll handle the rest.`}
        </p>
        <button
          onClick={() => navigate('selectTest')}
          className="bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm px-6 py-2.5 rounded-xl transition-colors"
        >
          {language === 'fr' ? `Construire mon profil →` : 'Build my profile →'}
        </button>
      </motion.div>
    </div>
  );
}

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

      {/* Bottom CTA */}
      <motion.div
        className="bg-gray-900 rounded-2xl px-6 py-8 text-center"
        {...fadeUp(0.5)}
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

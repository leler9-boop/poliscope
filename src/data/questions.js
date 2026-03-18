// POLISCOPE — Question Bank (expanded)
// 120 questions across 8 themes (15 per theme)
// Priority 1 = quick test (2 per theme), 2 = medium (7 per theme), 3 = full (15 per theme)
// direction: 1 = agreement shifts theme score UP, -1 = DOWN

export const THEMES = {
  ECONOMY: `ECONOMY`,
  SOCIAL: `SOCIAL`,
  IMMIGRATION: `IMMIGRATION`,
  SECURITY: `SECURITY`,
  ENVIRONMENT: `ENVIRONMENT`,
  DEMOCRACY: `DEMOCRACY`,
  GLOBAL: `GLOBAL`,
  PUBLIC_SERVICES: `PUBLIC_SERVICES`,
};

export const THEME_LABELS = {
  en: {
    ECONOMY: `Economy`,
    SOCIAL: `Social issues`,
    IMMIGRATION: `Immigration`,
    SECURITY: `Security`,
    ENVIRONMENT: `Environment`,
    DEMOCRACY: `Democracy`,
    GLOBAL: `Globalization`,
    PUBLIC_SERVICES: `Public services`,
  },
  fr: {
    ECONOMY: `Économie`,
    SOCIAL: `Questions sociales`,
    IMMIGRATION: `Immigration`,
    SECURITY: `Sécurité`,
    ENVIRONMENT: `Environnement`,
    DEMOCRACY: `Démocratie`,
    GLOBAL: `Mondialisation`,
    PUBLIC_SERVICES: `Services publics`,
  },
};

export const THEME_COLORS = {
  ECONOMY: `#f59e0b`,
  SOCIAL: `#8b5cf6`,
  IMMIGRATION: `#ef4444`,
  SECURITY: `#6b7280`,
  ENVIRONMENT: `#10b981`,
  DEMOCRACY: `#3b82f6`,
  GLOBAL: `#06b6d4`,
  PUBLIC_SERVICES: `#f97316`,
};

export const questions = [

  // ─── ECONOMY ────────────────────────────────────────────────────────────────
  {
    id: `ECO_1`,
    theme: THEMES.ECONOMY,
    priority: 1,
    weight: 5,
    text: {
      en: `The top income tax rate should be significantly increased.`,
      fr: `Le taux marginal d'imposition sur le revenu devrait être significativement augmenté.`,
    },
    direction: -1,
    info: {
      en: `Income tax is levied on personal earnings. A higher top rate means wealthier individuals pay a larger share. Supporters say it reduces inequality; critics argue it discourages investment and entrepreneurship.`,
      fr: `L'impôt sur le revenu est prélevé sur les revenus personnels. Un taux marginal plus élevé signifie que les plus aisés paient une part plus importante. Ses partisans estiment qu'il réduit les inégalités ; ses détracteurs estiment qu'il décourage l'investissement.`,
    },
  },
  {
    id: `ECO_2`,
    theme: THEMES.ECONOMY,
    priority: 1,
    weight: 3,
    text: {
      en: `The minimum wage should be raised significantly above current levels.`,
      fr: `Le salaire minimum devrait être augmenté de manière significative au-dessus des niveaux actuels.`,
    },
    direction: -1,
    info: {
      en: `A minimum wage sets a legal floor on hourly pay. Raising it lifts incomes for the lowest-paid workers but critics argue it can reduce employment if businesses respond by cutting jobs or hours.`,
      fr: `Un salaire minimum fixe un plancher légal sur la rémunération horaire. Le relever améliore les revenus des travailleurs les moins bien payés, mais les critiques soutiennent qu'il peut réduire l'emploi si les entreprises répondent en supprimant des postes.`,
    },
  },
  {
    id: `ECO_3`,
    theme: THEMES.ECONOMY,
    priority: 2,
    weight: 2,
    text: {
      en: `Corporate taxes should be lowered to attract investment and create jobs.`,
      fr: `Les impôts sur les sociétés devraient être abaissés pour attirer les investissements et créer des emplois.`,
    },
    direction: 1,
    info: {
      en: `Corporate tax cuts are central to supply-side economics: lower rates attract foreign investment and encourage domestic expansion, boosting employment. Critics argue profits flow to shareholders rather than workers, increasing inequality.`,
      fr: `Les baisses d'impôts sur les sociétés sont au cœur de l'économie de l'offre. Des taux plus bas attirent les investissements étrangers. Les critiques soutiennent que les bénéfices vont aux actionnaires plutôt qu'aux travailleurs, augmentant les inégalités.`,
    },
  },
  {
    id: `ECO_4`,
    theme: THEMES.ECONOMY,
    priority: 2,
    weight: 3,
    text: {
      en: `Wealth taxes on assets above a high threshold should be introduced or expanded.`,
      fr: `Des impôts sur la fortune au-delà d'un seuil élevé devraient être introduits ou élargis.`,
    },
    direction: -1,
    info: {
      en: `A wealth tax targets the total value of assets owned, not just income earned. France has had such a tax; economists debate whether it reduces investment or effectively funds redistribution. The ultra-rich often oppose it vigorously.`,
      fr: `Un impôt sur la fortune cible la valeur totale des actifs détenus, pas seulement les revenus. La France a eu un tel impôt. Les économistes débattent de son impact sur l'investissement. Les ultra-riches s'y opposent souvent vigoureusement.`,
    },
  },
  {
    id: `ECO_5`,
    theme: THEMES.ECONOMY,
    priority: 2,
    weight: 2,
    text: {
      en: `Austerity policies (cutting public spending to reduce deficits) are necessary and effective.`,
      fr: `Les politiques d'austérité (réduction des dépenses publiques pour réduire les déficits) sont nécessaires et efficaces.`,
    },
    direction: 1,
    info: {
      en: `Austerity means cutting government spending and/or raising taxes to reduce deficits. Proponents argue debt is unsustainable; critics like Keynesians argue austerity deepens recessions by reducing demand, as seen in post-2008 Europe.`,
      fr: `L'austérité signifie réduire les dépenses publiques pour réduire les déficits. Ses partisans soutiennent que la dette est insoutenable ; les keynésiens estiment qu'elle aggrave les récessions en réduisant la demande, comme observé en Europe après 2008.`,
    },
  },
  {
    id: `ECO_6`,
    theme: THEMES.ECONOMY,
    priority: 2,
    weight: 2,
    text: {
      en: `Workers should have stronger rights to unionize and engage in collective bargaining.`,
      fr: `Les travailleurs devraient avoir des droits plus solides pour se syndiquer et s'engager dans la négociation collective.`,
    },
    direction: -1,
    info: {
      en: `Trade unions negotiate pay and conditions on behalf of workers. Stronger union rights tend to raise wages and reduce inequality but may increase labour costs and reduce flexibility for employers. Union membership has declined in most western countries since the 1980s.`,
      fr: `Les syndicats négocient les salaires et les conditions au nom des travailleurs. Des droits syndicaux plus forts tendent à augmenter les salaires mais peuvent accroître les coûts salariaux. Le syndicalisme a décliné dans la plupart des pays occidentaux depuis les années 1980.`,
    },
  },
  {
    id: `ECO_7`,
    theme: THEMES.ECONOMY,
    priority: 2,
    weight: 2,
    text: {
      en: `Free trade agreements are generally beneficial for the economy.`,
      fr: `Les accords de libre-échange sont généralement bénéfiques pour l'économie.`,
    },
    direction: 1,
    info: {
      en: `Free trade reduces tariffs and barriers, lowering prices for consumers and expanding export markets. Critics argue it hollows out domestic manufacturing, increases inequality, and transfers jobs to lower-wage countries. The debate intensified after the 2016 backlash against globalization.`,
      fr: `Le libre-échange réduit les tarifs et les barrières, abaissant les prix pour les consommateurs. Les critiques soutiennent qu'il détruit l'industrie nationale et augmente les inégalités. Le débat s'est intensifié après le backlash contre la mondialisation en 2016.`,
    },
  },
  {
    id: `ECO_8`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `The government should nationalize strategic industries such as energy and rail.`,
      fr: `Le gouvernement devrait nationaliser les industries stratégiques comme l'énergie et le rail.`,
    },
    direction: -1,
    info: {
      en: `Nationalisation means state ownership of key industries. Proponents argue it ensures public benefit over profit and long-term investment. Critics argue it leads to inefficiency, political interference, and crowds out private investment.`,
      fr: `La nationalisation signifie la propriété d'État des industries clés. Ses partisans soutiennent qu'elle garantit l'intérêt public sur le profit. Ses critiques estiment qu'elle conduit à l'inefficacité et à l'interférence politique.`,
    },
  },
  {
    id: `ECO_9`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `Financial markets should face significantly more regulation to prevent crises.`,
      fr: `Les marchés financiers devraient faire face à une réglementation nettement plus stricte pour prévenir les crises.`,
    },
    direction: -1,
    info: {
      en: `The 2008 financial crisis exposed risks from unregulated banking. Post-crisis reforms like Dodd-Frank tightened oversight. Supporters argue more regulation prevents systemic risk; critics say it stifles innovation and lending.`,
      fr: `La crise financière de 2008 a exposé les risques d'un secteur bancaire peu réglementé. Les partisans d'une réglementation plus stricte avancent qu'elle prévient le risque systémique ; les critiques estiment qu'elle freine l'innovation.`,
    },
  },
  {
    id: `ECO_10`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `A universal basic income (UBI) should replace most existing welfare programmes.`,
      fr: `Un revenu universel de base (RUB) devrait remplacer la plupart des programmes d'aide sociale existants.`,
    },
    direction: -1,
    info: {
      en: `UBI provides every citizen with a regular, unconditional cash payment. Supporters argue it eliminates poverty traps, simplifies bureaucracy, and prepares for automation. Critics worry about cost, inflation, and disincentives to work.`,
      fr: `Le revenu universel verse à chaque citoyen un paiement régulier et inconditionnel. Ses partisans soutiennent qu'il élimine les pièges à la pauvreté et simplifie la bureaucratie. Ses critiques s'inquiètent du coût et des effets sur l'incitation au travail.`,
    },
  },
  {
    id: `ECO_11`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `Reducing the national debt should be the government's top fiscal priority.`,
      fr: `La réduction de la dette nationale devrait être la priorité fiscale numéro un du gouvernement.`,
    },
    direction: 1,
    info: {
      en: `National debt represents cumulative government borrowing. Fiscal conservatives argue high debt burdens future generations and raises interest costs. Keynesians counter that debt enables investment in growth, and that the ratio to GDP matters more than the absolute level.`,
      fr: `La dette nationale représente l'emprunt cumulatif des gouvernements. Les conservateurs budgétaires estiment qu'une dette élevée pèse sur les générations futures. Les keynésiens rétorquent que la dette permet d'investir dans la croissance.`,
    },
  },
  {
    id: `ECO_12`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `Large technology companies should be broken up under anti-monopoly laws.`,
      fr: `Les grandes entreprises technologiques devraient être démantelées en vertu des lois antitrust.`,
    },
    direction: -1,
    info: {
      en: `Tech giants like Google, Amazon, and Meta have faced antitrust scrutiny in the US and EU. Breaking them up would increase competition but critics argue their scale also produces efficiency and innovation benefits.`,
      fr: `Les géants de la tech comme Google, Amazon et Meta font face à des enquêtes antitrust aux États-Unis et en Europe. Les démanteler augmenterait la concurrence, mais les critiques soutiennent que leur taille produit aussi des gains d'efficacité.`,
    },
  },
  {
    id: `ECO_13`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `The gig economy provides valuable flexibility and should face minimal regulation.`,
      fr: `L'économie de plateforme offre une flexibilité précieuse et devrait faire l'objet d'une réglementation minimale.`,
    },
    direction: 1,
    info: {
      en: `The gig economy (Uber, Deliveroo, etc.) offers flexible work but often without employment protections. Some argue it empowers independent workers; others say it exploits them by denying benefits, sick pay, and job security.`,
      fr: `L'économie de plateforme (Uber, Deliveroo, etc.) offre un travail flexible mais souvent sans protections salariales. Certains estiment qu'elle autonomise les travailleurs indépendants ; d'autres qu'elle les exploite en refusant avantages sociaux et sécurité d'emploi.`,
    },
  },
  {
    id: `ECO_14`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `Inheritance taxes should be substantially increased to reduce generational wealth inequality.`,
      fr: `Les droits de succession devraient être substantiellement augmentés pour réduire les inégalités de richesse intergénérationnelles.`,
    },
    direction: -1,
    info: {
      en: `Inheritance taxes (estate taxes) target wealth passed between generations. Progressives argue they reduce dynastic privilege; conservatives argue they tax already-taxed assets and break up family businesses or farms.`,
      fr: `Les droits de succession ciblent la richesse transmise entre générations. Les progressistes soutiennent qu'ils réduisent les privilèges dynastiques ; les conservateurs estiment qu'ils taxent des actifs déjà imposés et peuvent démanteler des entreprises familiales.`,
    },
  },
  {
    id: `ECO_15`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 5,
    text: {
      en: `Privatisation of state-owned enterprises generally improves efficiency and should be pursued.`,
      fr: `La privatisation des entreprises publiques améliore généralement l'efficacité et devrait être poursuivie.`,
    },
    direction: 1,
    info: {
      en: `Privatisation transfers public assets to private ownership. Proponents say market competition forces efficiency. Critics argue it raises prices for consumers, reduces access, and puts profit above public good, especially for natural monopolies like water or rail.`,
      fr: `La privatisation transfère des actifs publics vers la propriété privée. Ses partisans soutiennent que la concurrence force l'efficacité. Ses critiques estiment qu'elle augmente les prix pour les consommateurs et place le profit au-dessus de l'intérêt public.`,
    },
  },

  // ─── SOCIAL ──────────────────────────────────────────────────────────────────
  {
    id: `SOC_1`,
    theme: THEMES.SOCIAL,
    priority: 1,
    weight: 3,
    text: {
      en: `Same-sex couples should have exactly the same legal rights as heterosexual couples.`,
      fr: `Les couples de même sexe devraient avoir exactement les mêmes droits légaux que les couples hétérosexuels.`,
    },
    direction: 1,
    info: {
      en: `Marriage equality gives same-sex couples the same legal protections as heterosexual couples, including inheritance, parental rights, and next-of-kin recognition. It is now legal in over 30 countries but remains contested in many others.`,
      fr: `Le mariage pour tous donne aux couples de même sexe les mêmes protections légales que les couples hétérosexuels. Il est désormais légal dans plus de 30 pays mais reste contesté dans beaucoup d'autres.`,
    },
  },
  {
    id: `SOC_2`,
    theme: THEMES.SOCIAL,
    priority: 1,
    weight: 3,
    text: {
      en: `Women should have unrestricted access to abortion services.`,
      fr: `Les femmes devraient avoir un accès sans restriction aux services d'avortement.`,
    },
    direction: 1,
    info: {
      en: `Abortion rights remain one of the most polarising political issues globally. Proponents frame it as bodily autonomy; opponents argue life begins at conception. The US Supreme Court overturned Roe v. Wade in 2022, returning the issue to states.`,
      fr: `Le droit à l'avortement reste l'un des sujets politiques les plus polarisants. Ses partisans parlent d'autonomie corporelle ; ses adversaires arguent que la vie commence à la conception. La Cour suprême américaine a annulé Roe v. Wade en 2022.`,
    },
  },
  {
    id: `SOC_3`,
    theme: THEMES.SOCIAL,
    priority: 2,
    weight: 2,
    text: {
      en: `Cannabis should be fully legalised and regulated for recreational use.`,
      fr: `Le cannabis devrait être entièrement légalisé et réglementé pour un usage récréatif.`,
    },
    direction: 1,
    info: {
      en: `Cannabis legalisation has been adopted in Canada, Uruguay, and many US states. Proponents argue it reduces crime, generates tax revenue, and removes racial disparities in policing. Critics worry about increased use, public health, and road safety.`,
      fr: `La légalisation du cannabis a été adoptée au Canada, en Uruguay et dans de nombreux États américains. Ses partisans soutiennent qu'elle réduit la criminalité et génère des recettes fiscales. Ses critiques s'inquiètent de la santé publique et de la sécurité routière.`,
    },
  },
  {
    id: `SOC_4`,
    theme: THEMES.SOCIAL,
    priority: 2,
    weight: 2,
    text: {
      en: `Affirmative action programmes to help historically disadvantaged groups are justified.`,
      fr: `Les programmes de discrimination positive pour aider les groupes historiquement défavorisés sont justifiés.`,
    },
    direction: 1,
    info: {
      en: `Affirmative action uses race, gender, or other factors in hiring or admissions to counteract historical discrimination. The US Supreme Court struck down race-based college admissions in 2023. Supporters say it corrects inequality; critics argue it introduces reverse discrimination.`,
      fr: `La discrimination positive utilise la race, le genre ou d'autres facteurs dans l'embauche ou les admissions pour contrer la discrimination historique. Ses partisans disent qu'elle corrige les inégalités ; ses critiques estiment qu'elle introduit une discrimination à rebours.`,
    },
  },
  {
    id: `SOC_5`,
    theme: THEMES.SOCIAL,
    priority: 2,
    weight: 5,
    text: {
      en: `Religious values should play a greater role in shaping public policy.`,
      fr: `Les valeurs religieuses devraient jouer un rôle plus important dans l'élaboration des politiques publiques.`,
    },
    direction: 0,
    info: {
      en: `The relationship between religion and the state varies globally. Some countries have official state religions; others maintain strict separation. Conservatives often favour faith-based policies on issues like abortion or marriage; secularists argue the state must remain neutral.`,
      fr: `La relation entre la religion et l'État varie à travers le monde. Les conservateurs privilégient souvent des politiques fondées sur la foi sur des questions comme l'avortement ou le mariage ; les laïques soutiennent que l'État doit rester neutre.`,
    },
  },
  {
    id: `SOC_6`,
    theme: THEMES.SOCIAL,
    priority: 2,
    weight: 2,
    text: {
      en: `Transgender people should be able to legally change their gender without medical requirements.`,
      fr: `Les personnes transgenres devraient pouvoir changer légalement de genre sans exigences médicales.`,
    },
    direction: 1,
    info: {
      en: `Gender self-identification allows individuals to change their legal gender based on personal declaration. Some countries like Ireland and Denmark allow this; others require medical diagnosis or surgery. The debate involves rights, access to spaces, and safeguarding concerns.`,
      fr: `L'auto-identification de genre permet aux individus de changer leur genre légal sur déclaration personnelle. Certains pays comme l'Irlande permettent cela ; d'autres exigent un diagnostic médical. Le débat porte sur les droits et les questions de protection.`,
    },
  },
  {
    id: `SOC_7`,
    theme: THEMES.SOCIAL,
    priority: 2,
    weight: 2,
    text: {
      en: `Traditional family structures (two-parent, heterosexual households) should be actively promoted by the state.`,
      fr: `Les structures familiales traditionnelles (foyers hétérosexuels, deux parents) devraient être activement promues par l'État.`,
    },
    direction: 0,
    info: {
      en: `Some conservative parties argue the state should favour traditional family structures through tax policy and social norms, citing social stability benefits. Critics argue this marginalises single parents, same-sex parents, and diverse family forms.`,
      fr: `Certains partis conservateurs soutiennent que l'État devrait favoriser les structures familiales traditionnelles via la fiscalité, citant des bénéfices de stabilité sociale. Ses critiques estiment que cela marginalise les familles monoparentales ou homoparentales.`,
    },
  },
  {
    id: `SOC_8`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Hate speech laws should be expanded to better protect marginalised groups.`,
      fr: `Les lois sur les discours haineux devraient être élargies pour mieux protéger les groupes marginalisés.`,
    },
    direction: 1,
    info: {
      en: `Hate speech laws criminalise speech that targets people based on race, religion, sexual orientation, etc. Supporters argue they protect vulnerable groups from harm; free speech advocates argue they chill legitimate debate and are prone to abuse by authorities.`,
      fr: `Les lois sur les discours haineux criminalisent les propos ciblant des personnes en raison de leur race, religion ou orientation sexuelle. Leurs partisans soutiennent qu'elles protègent les groupes vulnérables ; les défenseurs de la liberté d'expression arguent qu'elles brident le débat légitime.`,
    },
  },
  {
    id: `SOC_9`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Sex work should be fully decriminalised.`,
      fr: `Le travail du sexe devrait être entièrement décriminalisé.`,
    },
    direction: 1,
    info: {
      en: `Decriminalisation removes criminal penalties for selling and buying sex. New Zealand fully decriminalised in 2003. The Nordic model criminalises buyers, not sellers. Feminists and sex workers are divided on which approach better protects safety and rights.`,
      fr: `La décriminalisation supprime les sanctions pénales pour la vente et l'achat de rapports sexuels. La Nouvelle-Zélande a entièrement décriminalisé en 2003. Le modèle nordique criminalise les acheteurs, pas les vendeurs. Les féministes sont divisées sur l'approche.`,
    },
  },
  {
    id: `SOC_10`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Assisted dying should be legal for terminally ill patients who request it.`,
      fr: `L'aide médicale à mourir devrait être légale pour les patients en phase terminale qui en font la demande.`,
    },
    direction: 1,
    info: {
      en: `Assisted dying allows terminally ill patients to end their lives with medical help. It is legal in the Netherlands, Canada, Switzerland, and some US states. Supporters cite dignity and autonomy; opponents raise concerns about pressure on vulnerable people and medical ethics.`,
      fr: `L'aide médicale à mourir permet aux patients en phase terminale de mettre fin à leur vie avec une aide médicale. Elle est légale aux Pays-Bas, au Canada et en Suisse. Ses partisans citent la dignité ; ses adversaires s'inquiètent des pressions sur les personnes vulnérables.`,
    },
  },
  {
    id: `SOC_11`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Stricter gun control laws should be introduced to reduce violence.`,
      fr: `Des lois plus strictes sur le contrôle des armes devraient être introduites pour réduire la violence.`,
    },
    direction: 1,
    info: {
      en: `Gun control includes background checks, restrictions on assault weapons, and bans on high-capacity magazines. The US is a major outlier with a constitutional right to bear arms. Other countries adopted stricter measures after mass shootings with significant reductions in gun deaths.`,
      fr: `Le contrôle des armes comprend les vérifications des antécédents et les restrictions sur les armes d'assaut. Les États-Unis se distinguent avec un droit constitutionnel de porter des armes. D'autres pays ont adopté des mesures plus strictes après des fusillades de masse.`,
    },
  },
  {
    id: `SOC_12`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Universities and schools should be required to use gender-neutral language in all communications.`,
      fr: `Les universités et les écoles devraient être tenues d'utiliser un langage neutre sur le plan du genre dans toutes leurs communications.`,
    },
    direction: 1,
    info: {
      en: `Gender-neutral language aims to be inclusive of all gender identities. In French, this includes the "écriture inclusive" (using both masculine and feminine forms). Supporters argue it normalises gender diversity; critics claim it is confusing or imposes ideology.`,
      fr: `Le langage neutre sur le genre vise à inclure toutes les identités de genre. En français, cela comprend l'écriture inclusive. Ses partisans soutiennent qu'il normalise la diversité de genre ; ses critiques estiment qu'il est confus ou impose une idéologie.`,
    },
  },
  {
    id: `SOC_13`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `The death penalty should be abolished in all circumstances.`,
      fr: `La peine de mort devrait être abolie dans toutes les circonstances.`,
    },
    direction: 1,
    info: {
      en: `The death penalty is abolished in most democratic countries but still practised in the US, China, Iran, and others. Abolitionists cite the risk of executing innocent people and the lack of deterrence evidence. Supporters argue some crimes warrant the ultimate punishment.`,
      fr: `La peine de mort est abolie dans la plupart des démocraties mais reste pratiquée aux États-Unis, en Chine et en Iran. Ses opposants citent le risque d'exécuter des innocents et l'absence de preuves d'effet dissuasif. Ses partisans arguent que certains crimes le justifient.`,
    },
  },
  {
    id: `SOC_14`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Pornography should face stricter age verification and content regulation.`,
      fr: `La pornographie devrait faire l'objet de vérifications d'âge plus strictes et d'une réglementation du contenu.`,
    },
    direction: 0,
    info: {
      en: `Online pornography is widely accessible with minimal age checks. The UK and France have both attempted mandatory age verification. Supporters argue it protects children; civil liberties groups warn of privacy risks and censorship creep.`,
      fr: `La pornographie en ligne est largement accessible avec peu de contrôle de l'âge. Le Royaume-Uni et la France ont tenté une vérification d'âge obligatoire. Ses partisans soutiennent qu'elle protège les enfants ; les défenseurs des libertés civiles avertissent des risques pour la vie privée.`,
    },
  },
  {
    id: `SOC_15`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Social media platforms should be held legally responsible for harmful content posted by users.`,
      fr: `Les plateformes de réseaux sociaux devraient être tenues légalement responsables des contenus nuisibles publiés par leurs utilisateurs.`,
    },
    direction: 1,
    info: {
      en: `Section 230 in the US and the EU Digital Services Act take different approaches to platform liability. Making platforms responsible could prompt more content moderation; critics warn it could lead to over-censorship or favour large incumbents who can afford compliance.`,
      fr: `La Section 230 aux États-Unis et le DSA en Europe adoptent des approches différentes de la responsabilité des plateformes. Les rendre responsables pourrait inciter à plus de modération ; les critiques avertissent d'une sur-censure possible.`,
    },
  },

  // ─── IMMIGRATION ────────────────────────────────────────────────────────────
  {
    id: `IMM_1`,
    theme: THEMES.IMMIGRATION,
    priority: 1,
    weight: 5,
    text: {
      en: `Immigration levels into our country should be significantly reduced.`,
      fr: `Les niveaux d'immigration dans notre pays devraient être significativement réduits.`,
    },
    direction: 1,
    info: {
      en: `Immigration reduction is a core demand of many right-wing and nationalist parties. Proponents argue it eases pressure on public services and housing and preserves cultural cohesion. Critics argue immigration boosts economic growth and fills labour gaps.`,
      fr: `La réduction de l'immigration est une demande centrale de nombreux partis de droite et nationalistes. Ses partisans soutiennent qu'elle réduit la pression sur les services publics. Ses critiques estiment que l'immigration stimule la croissance économique et comble les pénuries de main-d'œuvre.`,
    },
  },
  {
    id: `IMM_2`,
    theme: THEMES.IMMIGRATION,
    priority: 1,
    weight: 3,
    text: {
      en: `Refugees and asylum seekers should receive full welfare rights and legal protection upon arrival.`,
      fr: `Les réfugiés et les demandeurs d'asile devraient recevoir tous les droits sociaux et la protection juridique à leur arrivée.`,
    },
    direction: -1,
    info: {
      en: `International law, including the 1951 Refugee Convention, grants asylum seekers the right to protection. Welfare rights for asylum seekers vary widely across countries. Critics argue generous rights act as a pull factor; supporters say basic welfare is a humanitarian obligation.`,
      fr: `Le droit international, y compris la Convention de 1951 sur les réfugiés, accorde aux demandeurs d'asile le droit à la protection. Les critiques estiment que des droits généreux constituent un facteur d'attraction ; les partisans disent qu'une aide de base est une obligation humanitaire.`,
    },
  },
  {
    id: `IMM_3`,
    theme: THEMES.IMMIGRATION,
    priority: 2,
    weight: 2,
    text: {
      en: `People who have lived in a country for many years without legal status should be given a path to citizenship.`,
      fr: `Les personnes qui vivent dans un pays depuis de nombreuses années sans statut légal devraient se voir offrir une voie vers la citoyenneté.`,
    },
    direction: -1,
    info: ``,
    info: {
      en: `Amnesty or regularisation programmes for undocumented long-term residents are controversial. Proponents argue they integrate communities already living and working in a country. Critics argue they reward illegal entry and create incentives for future illegal immigration.`,
      fr: `Les programmes d'amnistie pour les résidents sans papiers de longue date sont controversés. Leurs partisans soutiennent qu'ils intègrent des communautés déjà établies. Leurs critiques estiment qu'ils récompensent l'entrée illégale et créent des incitations à l'immigration clandestine future.`,
    },
  },
  {
    id: `IMM_4`,
    theme: THEMES.IMMIGRATION,
    priority: 2,
    weight: 2,
    text: {
      en: `Immigration policy should focus on attracting highly skilled workers only.`,
      fr: `La politique d'immigration devrait se concentrer sur l'attraction des travailleurs hautement qualifiés uniquement.`,
    },
    direction: 1,
    info: {
      en: `Points-based immigration systems like Canada's or Australia's prioritise skills, education, and language. Critics argue this deprives poorer nations of talent and neglects the economic contribution of lower-skilled workers, especially in care, construction, and agriculture.`,
      fr: `Les systèmes d'immigration basés sur les points, comme au Canada ou en Australie, privilégient les compétences et l'éducation. Ses critiques soutiennent que cela prive les nations pauvres de leurs talents et néglige la contribution économique des travailleurs moins qualifiés.`,
    },
  },
  {
    id: `IMM_5`,
    theme: THEMES.IMMIGRATION,
    priority: 2,
    weight: 3,
    text: {
      en: `Border controls within the EU or similar regional blocs should be strengthened.`,
      fr: `Les contrôles aux frontières au sein de l'UE ou de blocs régionaux similaires devraient être renforcés.`,
    },
    direction: 1,
    info: {
      en: `The EU Schengen Area allows free movement across most member states. Rising support for border controls reflects concerns about irregular migration and security. Critics argue reintroducing borders fragments the single market and harms workers who rely on cross-border jobs.`,
      fr: `L'espace Schengen de l'UE permet la libre circulation dans la plupart des États membres. Le soutien croissant aux contrôles aux frontières reflète des préoccupations concernant l'immigration irrégulière et la sécurité. Ses critiques estiment que cela fragmente le marché unique.`,
    },
  },
  {
    id: `IMM_6`,
    theme: THEMES.IMMIGRATION,
    priority: 2,
    weight: 2,
    text: {
      en: `Immigrants should be required to demonstrate cultural integration before receiving residency rights.`,
      fr: `Les immigrants devraient être tenus de démontrer leur intégration culturelle avant de recevoir des droits de résidence.`,
    },
    direction: 1,
    info: {
      en: `Integration requirements can include language tests, civic knowledge exams, or pledges to respect local values. Countries like the Netherlands and Denmark have moved toward stricter integration conditions. Critics argue such requirements are discriminatory or vaguely defined.`,
      fr: `Les exigences d'intégration peuvent inclure des tests de langue ou des examens de connaissance civique. Les Pays-Bas et le Danemark ont adopté des conditions d'intégration plus strictes. Ses critiques soutiennent que ces exigences sont discriminatoires ou vaguement définies.`,
    },
  },
  {
    id: `IMM_7`,
    theme: THEMES.IMMIGRATION,
    priority: 2,
    weight: 3,
    text: {
      en: `The state should actively promote multiculturalism and cultural diversity.`,
      fr: `L'État devrait activement promouvoir le multiculturalisme et la diversité culturelle.`,
    },
    direction: -1,
    info: {
      en: `Multiculturalism as policy encourages distinct cultural communities to maintain their identities within a shared civic framework. Critics like Angela Merkel, who declared multiculturalism had failed, argue it leads to parallel societies. Supporters argue diversity enriches society.`,
      fr: `Le multiculturalisme comme politique encourage les communautés culturelles distinctes à maintenir leurs identités. Les critiques, dont Angela Merkel qui a déclaré que le multiculturalisme avait échoué, soutiennent qu'il conduit à des sociétés parallèles. Ses partisans voient la diversité comme une richesse.`,
    },
  },
  {
    id: `IMM_8`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Economic migrants should have the same rights as citizens once they are employed and paying taxes.`,
      fr: `Les migrants économiques devraient avoir les mêmes droits que les citoyens une fois qu'ils travaillent et paient des impôts.`,
    },
    direction: -1,
    info: {
      en: `Economic migrants contribute to host economies through labour and taxes but often lack full civic rights. Granting fuller rights can improve integration and reduce exploitation but raises questions about the meaning of citizenship and national identity.`,
      fr: `Les migrants économiques contribuent aux économies d'accueil mais manquent souvent de droits civiques complets. Accorder des droits plus étendus peut améliorer l'intégration mais soulève des questions sur la citoyenneté et l'identité nationale.`,
    },
  },
  {
    id: `IMM_9`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Countries should accept more climate refugees as global warming displaces populations.`,
      fr: `Les pays devraient accueillir davantage de réfugiés climatiques à mesure que le réchauffement climatique déplace des populations.`,
    },
    direction: -1,
    info: {
      en: `Climate change is expected to displace hundreds of millions by 2050 through rising seas, desertification, and extreme weather. Climate refugees currently lack legal status under international law. Progressive voices argue rich nations that caused warming bear a responsibility.`,
      fr: `Le changement climatique devrait déplacer des centaines de millions de personnes d'ici 2050. Les réfugiés climatiques n'ont actuellement aucun statut légal en droit international. Les progressistes soutiennent que les nations riches qui ont causé le réchauffement ont une responsabilité.`,
    },
  },
  {
    id: `IMM_10`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Immigration detention centres should be abolished.`,
      fr: `Les centres de détention pour immigrants devraient être abolis.`,
    },
    direction: -1,
    info: {
      en: `Immigration detention holds people awaiting processing or deportation. Critics argue it is inhumane and expensive, with poor conditions and indefinite detention. Governments argue it is necessary to enforce immigration law and prevent absconding before deportation.`,
      fr: `La détention administrative retient les personnes en attente de traitement ou d'expulsion. Ses critiques estiment qu'elle est inhumaine et coûteuse. Les gouvernements soutiennent qu'elle est nécessaire pour appliquer la loi sur l'immigration et éviter les disparitions avant l'expulsion.`,
    },
  },
  {
    id: `IMM_11`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Immigrants bring significant economic benefits and should be actively encouraged.`,
      fr: `Les immigrants apportent d'importants avantages économiques et devraient être activement encouragés.`,
    },
    direction: -1,
    info: {
      en: `Research consistently finds that immigrants contribute positively to host economies on average, filling skills gaps, starting businesses, and paying taxes. However, distributional effects vary by skill level, region, and the strength of public services in receiving areas.`,
      fr: `La recherche constate systématiquement que les immigrants contribuent positivement aux économies d'accueil en moyenne, comblant des lacunes de compétences et créant des entreprises. Cependant, les effets distributifs varient selon le niveau de compétences et la région.`,
    },
  },
  {
    id: `IMM_12`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Foreign nationals who commit serious crimes should be automatically deported after serving their sentence.`,
      fr: `Les ressortissants étrangers qui commettent des crimes graves devraient être automatiquement expulsés après avoir purgé leur peine.`,
    },
    direction: 1,
    info: {
      en: `Automatic deportation after criminal sentences raises questions about double punishment, family ties, and human rights. The European Court of Human Rights has blocked some deportations citing Article 8 (right to family life). Most countries have some form of criminal deportation.`,
      fr: `L'expulsion automatique après une peine criminelle soulève des questions de double peine, de liens familiaux et de droits de l'homme. La CEDH a bloqué certaines expulsions en invoquant l'article 8. La plupart des pays ont une forme d'expulsion après condamnation.`,
    },
  },
  {
    id: `IMM_13`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Second-generation immigrants should be expected to identify primarily with their host country.`,
      fr: `Les immigrants de deuxième génération devraient être censés s'identifier principalement à leur pays d'accueil.`,
    },
    direction: 1,
    info: {
      en: `Questions of identity for children of immigrants are complex. Assimilationist views prioritise identification with the host nation. Multiculturalists argue dual or hyphenated identities are valid. Research suggests strong identities with host countries emerge naturally with integration.`,
      fr: `Les questions d'identité pour les enfants d'immigrants sont complexes. Les assimilationnistes privilégient l'identification à la nation d'accueil. Les multiculturalistes soutiennent que les identités doubles sont valides. La recherche suggère que les identités fortes émergent naturellement avec l'intégration.`,
    },
  },
  {
    id: `IMM_14`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `The processing of asylum claims should be done offshore, outside the host country.`,
      fr: `Le traitement des demandes d'asile devrait être effectué à l'étranger, en dehors du pays d'accueil.`,
    },
    direction: 1,
    info: {
      en: `Offshore processing (as trialled by the UK with Rwanda and Australia with Nauru) aims to deter irregular boat crossings by removing the prospect of settlement. Critics argue it violates international law and human rights; proponents claim it saves lives by removing the economic incentive for dangerous crossings.`,
      fr: `Le traitement offshore (testé par le Royaume-Uni avec le Rwanda et l'Australie avec Nauru) vise à dissuader les traversées irrégulières. Ses critiques soutiennent qu'il viole le droit international ; ses partisans affirment qu'il sauve des vies en supprimant les incitations aux traversées dangereuses.`,
    },
  },
  {
    id: `IMM_15`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Language and integration tests for immigration should be abolished as discriminatory.`,
      fr: `Les tests de langue et d'intégration pour l'immigration devraient être abolis comme discriminatoires.`,
    },
    direction: -1,
    info: {
      en: `Language and integration requirements are standard in many countries including Germany, France, and the UK. Critics argue they are barriers that exclude poorer and older applicants, while proponents say basic language skills are essential for successful integration and employment.`,
      fr: `Les exigences de langue et d'intégration sont standard dans de nombreux pays dont l'Allemagne, la France et le Royaume-Uni. Leurs critiques soutiennent qu'elles excluent les candidats plus pauvres et plus âgés ; leurs partisans disent que les compétences linguistiques de base sont essentielles à l'intégration.`,
    },
  },

  // ─── SECURITY ────────────────────────────────────────────────────────────────
  {
    id: `SEC_1`,
    theme: THEMES.SECURITY,
    priority: 1,
    weight: 5,
    text: {
      en: `Mass surveillance of citizens' communications goes too far and should be curtailed.`,
      fr: `La surveillance de masse des communications des citoyens va trop loin et devrait être restreinte.`,
    },
    direction: -1,
    info: {
      en: `After Snowden's revelations in 2013, mass surveillance by intelligence agencies became a major political issue. Proponents argue bulk data collection helps prevent terrorism; civil liberties groups argue it violates privacy rights and chills free speech.`,
      fr: `Après les révélations de Snowden en 2013, la surveillance de masse par les services de renseignement est devenue un sujet politique majeur. Ses partisans soutiennent qu'elle aide à prévenir le terrorisme ; les défenseurs des libertés civiles estiment qu'elle viole la vie privée.`,
    },
  },
  {
    id: `SEC_2`,
    theme: THEMES.SECURITY,
    priority: 1,
    weight: 5,
    text: {
      en: `Police should be given more powers and resources to tackle crime.`,
      fr: `La police devrait se voir accorder davantage de pouvoirs et de ressources pour lutter contre la criminalité.`,
    },
    direction: 1,
    info: {
      en: `More policing resources can improve response times and detection rates but raises questions about oversight and disproportionate targeting of communities. The debate intensified following Black Lives Matter protests highlighting racial disparities in policing.`,
      fr: `Davantage de ressources policières peut améliorer les temps de réponse mais soulève des questions de surveillance et de ciblage disproportionné. Le débat s'est intensifié après les manifestations Black Lives Matter soulignant les disparités raciales dans le maintien de l'ordre.`,
    },
  },
  {
    id: `SEC_3`,
    theme: THEMES.SECURITY,
    priority: 2,
    weight: 2,
    text: {
      en: `Anti-terrorism laws that restrict civil liberties are justified by the security benefits they provide.`,
      fr: `Les lois antiterroristes qui restreignent les libertés civiles sont justifiées par les avantages de sécurité qu'elles procurent.`,
    },
    direction: 1,
    info: {
      en: `Post-9/11 anti-terror laws expanded state surveillance and detention powers. Governments argue these measures prevent attacks; civil libertarians argue they create a surveillance state and are prone to misuse against legitimate political dissent.`,
      fr: `Les lois antiterroristes post-11 septembre ont élargi les pouvoirs de surveillance et de détention. Les gouvernements soutiennent que ces mesures préviennent les attaques ; les libertaires civils estiment qu'elles créent un État de surveillance et sont susceptibles d'abus.`,
    },
  },
  {
    id: `SEC_4`,
    theme: THEMES.SECURITY,
    priority: 2,
    weight: 2,
    text: {
      en: `Facial recognition technology should not be used by police in public spaces.`,
      fr: `La technologie de reconnaissance faciale ne devrait pas être utilisée par la police dans les espaces publics.`,
    },
    direction: -1,
    info: {
      en: `Facial recognition is increasingly deployed by police for real-time identification. The EU AI Act restricts its use in public; the UK has used it more freely. Critics argue it is inaccurate, especially for dark-skinned faces, and creates a surveillance society.`,
      fr: `La reconnaissance faciale est de plus en plus déployée par la police. Le règlement européen sur l'IA en restreint l'utilisation en public. Les critiques soutiennent qu'elle est imprécise, en particulier pour les personnes à la peau foncée, et crée une société de surveillance.`,
    },
  },
  {
    id: `SEC_5`,
    theme: THEMES.SECURITY,
    priority: 2,
    weight: 2,
    text: {
      en: `Prison sentences for most crimes should be longer and more severe.`,
      fr: `Les peines de prison pour la plupart des crimes devraient être plus longues et plus sévères.`,
    },
    direction: 1,
    info: {
      en: `Longer sentences aim to deter crime and protect the public through incapacitation. However, evidence on deterrence is mixed; rehabilitation approaches used in Scandinavia show lower reoffending rates. The US has the highest incarceration rate in the world.`,
      fr: `Des peines plus longues visent à dissuader le crime et à protéger le public par l'incapacitation. Cependant, les preuves sur l'effet dissuasif sont mitigées ; les approches de réhabilitation scandinaves montrent des taux de récidive plus faibles. Les États-Unis ont le plus haut taux d'incarcération mondial.`,
    },
  },
  {
    id: `SEC_6`,
    theme: THEMES.SECURITY,
    priority: 2,
    weight: 2,
    text: {
      en: `The focus of the criminal justice system should be rehabilitation rather than punishment.`,
      fr: `L'accent du système judiciaire pénal devrait être mis sur la réhabilitation plutôt que sur la punition.`,
    },
    direction: -1,
    info: {
      en: `Rehabilitative justice focuses on reforming offenders rather than punishing them. Nordic countries have the lowest reoffending rates, with prisons offering education and therapy. Punitive approaches are common in the US and UK, where reoffending remains high.`,
      fr: `La justice réhabilitatrice vise à réformer les délinquants plutôt qu'à les punir. Les pays nordiques ont les taux de récidive les plus faibles, avec des prisons offrant éducation et thérapie. Les approches punitives sont courantes aux États-Unis et au Royaume-Uni.`,
    },
  },
  {
    id: `SEC_7`,
    theme: THEMES.SECURITY,
    priority: 2,
    weight: 3,
    text: {
      en: `Military spending should be significantly increased to counter external threats.`,
      fr: `Les dépenses militaires devraient être significativement augmentées pour contrer les menaces extérieures.`,
    },
    direction: 1,
    info: {
      en: `NATO members are committed to spending 2% of GDP on defence. After Russia's invasion of Ukraine, many European countries increased defence budgets. Critics argue money should go to social needs; supporters argue security underpins all other priorities.`,
      fr: `Les membres de l'OTAN s'engagent à consacrer 2% de leur PIB à la défense. Après l'invasion russe de l'Ukraine, de nombreux pays européens ont augmenté leurs budgets de défense. Les critiques soutiennent que l'argent devrait aller aux besoins sociaux.`,
    },
  },
  {
    id: `SEC_8`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Intelligence agencies should operate with greater parliamentary oversight and transparency.`,
      fr: `Les services de renseignement devraient opérer avec une plus grande surveillance parlementaire et transparence.`,
    },
    direction: -1,
    info: {
      en: `Intelligence agencies in most democracies are subject to some parliamentary oversight, but the extent varies. After Snowden, calls grew for stronger scrutiny of data collection. Agencies argue that transparency compromises their effectiveness against adversaries.`,
      fr: `Les services de renseignement dans la plupart des démocraties font l'objet d'une certaine surveillance parlementaire, mais dans une mesure variable. Après Snowden, les appels à un contrôle plus strict ont augmenté. Les agences soutiennent que la transparence compromet leur efficacité.`,
    },
  },
  {
    id: `SEC_9`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Drug possession for personal use should be decriminalised.`,
      fr: `La possession de drogues pour usage personnel devrait être décriminalisée.`,
    },
    direction: -1,
    info: {
      en: `Portugal decriminalised all drugs in 2001, treating use as a health rather than criminal issue, with significant reductions in HIV infections and drug deaths. Critics argue it sends the wrong message; proponents say it frees police resources and reduces stigma.`,
      fr: `Le Portugal a décriminalisé toutes les drogues en 2001, traitant l'usage comme un problème de santé, avec des réductions significatives des infections au VIH. Ses critiques estiment que cela envoie un mauvais signal ; ses partisans disent que cela libère des ressources policières.`,
    },
  },
  {
    id: `SEC_10`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Citizens who spread misinformation online should face legal consequences.`,
      fr: `Les citoyens qui répandent de la désinformation en ligne devraient faire face à des conséquences légales.`,
    },
    direction: 1,
    info: {
      en: `Misinformation has been linked to public health crises and election interference. Several countries have introduced laws targeting false information. Critics warn such laws are easily abused to suppress dissent and that governments are poorly placed to define truth.`,
      fr: `La désinformation a été liée à des crises de santé publique et à des ingérences électorales. Plusieurs pays ont introduit des lois ciblant les fausses informations. Ses critiques avertissent que ces lois peuvent être utilisées pour réprimer la dissidence.`,
    },
  },
  {
    id: `SEC_11`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `The state should have the power to revoke citizenship of individuals convicted of terrorism.`,
      fr: `L'État devrait avoir le pouvoir de révoquer la citoyenneté des individus condamnés pour terrorisme.`,
    },
    direction: 1,
    info: {
      en: `Citizenship revocation has been used or proposed in the UK, France, and Australia for terrorism-related offences. Critics argue it creates second-class citizens and may make people stateless, violating international law. Proponents say it protects national security.`,
      fr: `La révocation de la citoyenneté a été utilisée ou proposée au Royaume-Uni, en France et en Australie pour des infractions liées au terrorisme. Ses critiques soutiennent qu'elle crée des citoyens de seconde classe et peut rendre les personnes apatrides.`,
    },
  },
  {
    id: `SEC_12`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Encryption backdoors should be mandatory so security services can access private communications.`,
      fr: `Des portes dérobées dans le chiffrement devraient être obligatoires pour que les services de sécurité puissent accéder aux communications privées.`,
    },
    direction: 1,
    info: {
      en: `Governments have sought "backdoors" into encrypted apps like WhatsApp to access terrorist or criminal communications. Cryptographers argue this is technically impossible to restrict only to legitimate access; any backdoor would compromise all users' security.`,
      fr: `Les gouvernements ont demandé des "portes dérobées" dans des applications chiffrées comme WhatsApp. Les cryptographes soutiennent que cela compromet la sécurité de tous les utilisateurs, car il est techniquement impossible de limiter l'accès aux seules autorités légitimes.`,
    },
  },
  {
    id: `SEC_13`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Police should be required to wear body cameras at all times.`,
      fr: `La police devrait être obligée de porter des caméras-piétons en permanence.`,
    },
    direction: -1,
    info: {
      en: `Body cameras are used by police in many countries to record encounters. Evidence on their impact is mixed; some studies show reductions in use of force and complaints, while others find minimal effects. Privacy concerns about footage management also arise.`,
      fr: `Les caméras-piétons sont utilisées par la police dans de nombreux pays pour enregistrer les interventions. Les preuves sur leur impact sont mitigées ; certaines études montrent des réductions du recours à la force, d'autres des effets minimes.`,
    },
  },
  {
    id: `SEC_14`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Juvenile offenders should be treated more leniently than adult criminals.`,
      fr: `Les délinquants juvéniles devraient être traités avec plus de clémence que les criminels adultes.`,
    },
    direction: -1,
    info: {
      en: `Most legal systems distinguish juvenile from adult offenders, recognising that young people are still developing. Critics of lenient approaches argue it lets serious offenders off lightly; supporters cite neuroscience showing adolescent brains are less capable of impulse control.`,
      fr: `La plupart des systèmes juridiques distinguent les délinquants juvéniles des adultes. Les critiques des approches clémentes soutiennent qu'elles permettent aux délinquants sérieux de s'en tirer facilement ; les partisans citent les neurosciences montrant que le cerveau adolescent est moins capable de contrôle des impulsions.`,
    },
  },
  {
    id: `SEC_15`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Citizens should have a right to own firearms for self-defence.`,
      fr: `Les citoyens devraient avoir le droit de posséder des armes à feu pour se défendre.`,
    },
    direction: 1,
    info: {
      en: `The US Second Amendment protects individual gun rights, a position supported by many conservatives. Most other democracies severely restrict civilian gun ownership. Evidence shows fewer guns correlates with fewer gun deaths, but proponents argue the right to self-defence is fundamental.`,
      fr: `Le Second Amendement américain protège les droits individuels aux armes, une position soutenue par de nombreux conservateurs. La plupart des autres démocraties restreignent sévèrement la possession civile d'armes. Les preuves montrent que moins d'armes correspond à moins de décès par armes.`,
    },
  },

  // ─── ENVIRONMENT ────────────────────────────────────────────────────────────
  {
    id: `ENV_1`,
    theme: THEMES.ENVIRONMENT,
    priority: 1,
    weight: 3,
    text: {
      en: `Climate change is primarily caused by human activity and requires urgent action.`,
      fr: `Le changement climatique est principalement causé par l'activité humaine et nécessite une action urgente.`,
    },
    direction: 1,
    info: {
      en: `The scientific consensus (97%+ of climate scientists) is that human greenhouse gas emissions are driving unprecedented warming. The IPCC warns of catastrophic consequences without rapid decarbonisation. Some politicians question the urgency or cost of action.`,
      fr: `Le consensus scientifique (97%+ des climatologues) est que les émissions humaines de gaz à effet de serre provoquent un réchauffement sans précédent. Le GIEC avertit de conséquences catastrophiques sans décarbonisation rapide.`,
    },
  },
  {
    id: `ENV_2`,
    theme: THEMES.ENVIRONMENT,
    priority: 1,
    weight: 2,
    text: {
      en: `Nuclear energy should be expanded as part of the transition to a low-carbon economy.`,
      fr: `L'énergie nucléaire devrait être développée dans le cadre de la transition vers une économie bas-carbone.`,
    },
    direction: 0,
    info: {
      en: `Nuclear power produces minimal CO₂ but faces concerns over safety (Chernobyl, Fukushima), waste disposal, and high construction costs. France gets 70% of its electricity from nuclear; Germany shut down its last plants in 2023. It divides environmental and economic perspectives.`,
      fr: `L'énergie nucléaire produit peu de CO₂ mais suscite des préoccupations concernant la sécurité, les déchets et les coûts de construction. La France tire 70% de son électricité du nucléaire ; l'Allemagne a fermé ses dernières centrales en 2023.`,
    },
  },
  {
    id: `ENV_3`,
    theme: THEMES.ENVIRONMENT,
    priority: 2,
    weight: 3,
    text: {
      en: `A carbon tax or carbon pricing should be significantly expanded.`,
      fr: `Une taxe carbone ou une tarification du carbone devrait être significativement étendue.`,
    },
    direction: 1,
    info: {
      en: `Carbon pricing makes companies and individuals pay for the CO₂ they emit. The idea is to make pollution expensive and incentivise cleaner alternatives. Critics argue it increases energy costs for households and burdens the poor disproportionately.`,
      fr: `La tarification du carbone oblige les entreprises et les particuliers à payer pour le CO₂ qu'ils émettent. L'objectif est de rendre la pollution coûteuse. Les critiques soutiennent qu'elle augmente les coûts énergétiques pour les ménages les plus défavorisés.`,
    },
  },
  {
    id: `ENV_4`,
    theme: THEMES.ENVIRONMENT,
    priority: 2,
    weight: 2,
    text: {
      en: `Businesses should face strict environmental regulations, even if it costs jobs.`,
      fr: `Les entreprises devraient faire face à des réglementations environnementales strictes, même si cela coûte des emplois.`,
    },
    direction: 1,
    info: {
      en: `Environmental regulations set limits on pollution, emissions, and resource use. They can protect ecosystems and public health but may increase costs for businesses, potentially leading to job losses or relocation to less-regulated countries.`,
      fr: `Les réglementations environnementales fixent des limites à la pollution et à l'utilisation des ressources. Elles peuvent protéger les écosystèmes mais peuvent aussi augmenter les coûts des entreprises, entraînant potentiellement des pertes d'emplois.`,
    },
  },
  {
    id: `ENV_5`,
    theme: THEMES.ENVIRONMENT,
    priority: 2,
    weight: 5,
    text: {
      en: `The transition to renewable energy should be accelerated, even at significant economic cost.`,
      fr: `La transition vers les énergies renouvelables devrait être accélérée, même à un coût économique significatif.`,
    },
    direction: 1,
    info: {
      en: `Renewable energy (solar, wind, hydro) produces electricity without emissions. Rapid transition requires massive investment and may raise energy prices in the short term. Supporters argue climate urgency justifies the cost; critics prefer a gradual transition.`,
      fr: `Les énergies renouvelables produisent de l'électricité sans émissions. Une transition rapide nécessite des investissements massifs et peut augmenter les prix à court terme. Ses partisans estiment que l'urgence climatique justifie ce coût.`,
    },
  },
  {
    id: `ENV_6`,
    theme: THEMES.ENVIRONMENT,
    priority: 2,
    weight: 2,
    text: {
      en: `Intensive farming practices should be heavily regulated to protect biodiversity.`,
      fr: `Les pratiques agricoles intensives devraient être fortement réglementées pour protéger la biodiversité.`,
    },
    direction: 1,
    info: {
      en: `Intensive agriculture contributes to biodiversity loss through habitat destruction, pesticide use, and soil degradation. Regulation may increase food prices. Green parties strongly favour restrictions; farming lobbies argue against regulations that hurt competitiveness.`,
      fr: `L'agriculture intensive contribue à la perte de biodiversité à travers la destruction des habitats et l'utilisation de pesticides. La réglementation peut augmenter les prix alimentaires. Les partis verts favorisent fortement les restrictions ; les lobbies agricoles s'y opposent.`,
    },
  },
  {
    id: `ENV_7`,
    theme: THEMES.ENVIRONMENT,
    priority: 2,
    weight: 2,
    text: {
      en: `The sale of new petrol and diesel cars should be banned before 2035.`,
      fr: `La vente de nouvelles voitures à essence et diesel devrait être interdite avant 2035.`,
    },
    direction: 1,
    info: {
      en: `The EU set a target to ban new internal combustion engine car sales by 2035. Proponents argue it drives EV adoption and reduces transport emissions. Critics argue it limits consumer choice and disadvantages people in rural areas without charging infrastructure.`,
      fr: `L'UE a fixé un objectif d'interdiction des nouvelles voitures à moteur thermique d'ici 2035. Ses partisans soutiennent qu'elle accélère l'adoption des véhicules électriques. Ses critiques estiment qu'elle restreint le choix des consommateurs et désavantage les zones rurales.`,
    },
  },
  {
    id: `ENV_8`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Economic growth and environmental protection are fundamentally incompatible.`,
      fr: `La croissance économique et la protection de l'environnement sont fondamentalement incompatibles.`,
    },
    direction: 1,
    info: {
      en: `"Degrowth" theorists argue that infinite economic growth is impossible on a finite planet and that rich countries must reduce production and consumption. Mainstream economists argue that green growth (decoupling emissions from GDP) is achievable through technology.`,
      fr: `Les théoriciens de la "décroissance" soutiennent que la croissance économique infinie est impossible sur une planète finie. Les économistes conventionnels soutiennent que la croissance verte (découplage des émissions du PIB) est réalisable grâce à la technologie.`,
    },
  },
  {
    id: `ENV_9`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Meat consumption should be taxed to reflect its environmental impact.`,
      fr: `La consommation de viande devrait être taxée pour refléter son impact environnemental.`,
    },
    direction: 1,
    info: {
      en: `Livestock farming accounts for around 14.5% of global greenhouse gas emissions. A meat tax would incentivise dietary shifts but would disproportionately affect lower-income households who spend a higher share of income on food. No country has yet introduced one nationally.`,
      fr: `L'élevage représente environ 14,5% des émissions mondiales de gaz à effet de serre. Une taxe sur la viande inciterait à des changements alimentaires mais affecterait de manière disproportionnée les ménages à faibles revenus. Aucun pays n'en a encore introduit une au niveau national.`,
    },
  },
  {
    id: `ENV_10`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Rich countries should provide substantial financial compensation to poorer nations for climate damage.`,
      fr: `Les pays riches devraient fournir une compensation financière substantielle aux pays plus pauvres pour les dommages climatiques.`,
    },
    direction: 1,
    info: {
      en: `"Loss and damage" compensation acknowledges that rich nations caused most historical emissions while poorer nations face the worst consequences. The COP27 summit created a loss and damage fund. Critics argue the amounts pledged are insufficient; some argue rich countries should not pay for sovereign decisions.`,
      fr: `La compensation pour "pertes et préjudices" reconnaît que les nations riches ont causé la plupart des émissions historiques tandis que les pays pauvres en subissent les pires conséquences. Le sommet COP27 a créé un fonds dédié.`,
    },
  },
  {
    id: `ENV_11`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Environmental activists who engage in civil disobedience should not face criminal charges.`,
      fr: `Les militants écologistes qui pratiquent la désobéissance civile ne devraient pas faire face à des poursuites pénales.`,
    },
    direction: 1,
    info: {
      en: `Groups like Just Stop Oil and Extinction Rebellion have used disruptive tactics including blocking roads, defacing artworks, and gluing themselves to infrastructure. Governments have responded with new criminal offences targeting protests. Supporters argue urgency justifies disruption; critics prioritise rule of law.`,
      fr: `Des groupes comme Just Stop Oil ont utilisé des tactiques perturbantes en bloquant des routes ou vandalisant des œuvres d'art. Les gouvernements ont répondu avec de nouvelles infractions pénales ciblant les manifestations. Leurs partisans soutiennent que l'urgence justifie la perturbation.`,
    },
  },
  {
    id: `ENV_12`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Environmental concerns should take precedence over economic development in planning decisions.`,
      fr: `Les préoccupations environnementales devraient primer sur le développement économique dans les décisions d'urbanisme.`,
    },
    direction: 1,
    info: {
      en: `Planning decisions often balance economic benefits (housing, jobs, infrastructure) against environmental costs. The precautionary principle argues for protecting nature when in doubt; others argue over-strict environmental rules block necessary development.`,
      fr: `Les décisions d'urbanisme équilibrent souvent les avantages économiques et les coûts environnementaux. Le principe de précaution plaide pour la protection de la nature en cas de doute ; d'autres soutiennent que des règles environnementales trop strictes bloquent le développement nécessaire.`,
    },
  },
  {
    id: `ENV_13`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `International environmental treaties should be enforceable against nation-states.`,
      fr: `Les traités environnementaux internationaux devraient être applicables contre les États-nations.`,
    },
    direction: 1,
    info: {
      en: `The Paris Agreement relies on voluntary national pledges rather than binding commitments. Creating enforcement mechanisms would strengthen action but raise sovereignty concerns. The EU has more binding rules within its borders.`,
      fr: `L'Accord de Paris repose sur des engagements nationaux volontaires plutôt que sur des engagements contraignants. Créer des mécanismes d'application renforcerait l'action mais soulèverait des préoccupations de souveraineté.`,
    },
  },
  {
    id: `ENV_14`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Geoengineering (e.g. solar radiation management) should be researched and potentially deployed to combat climate change.`,
      fr: `La géo-ingénierie (p. ex. gestion du rayonnement solaire) devrait être étudiée et potentiellement déployée pour lutter contre le changement climatique.`,
    },
    direction: 0,
    info: {
      en: `Solar geoengineering involves reflecting sunlight to cool the Earth. Some scientists argue it could buy time while decarbonisation proceeds. Critics worry about unknown side effects, unequal impacts, and that it reduces pressure to cut emissions at source.`,
      fr: `La géo-ingénierie solaire consiste à réfléchir la lumière du soleil pour refroidir la Terre. Certains scientifiques soutiennent qu'elle pourrait faire gagner du temps pendant la décarbonisation. Les critiques s'inquiètent des effets secondaires inconnus et de la réduction de la pression pour réduire les émissions.`,
    },
  },
  {
    id: `ENV_15`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Single-use plastics should be completely banned worldwide.`,
      fr: `Les plastiques à usage unique devraient être complètement interdits dans le monde entier.`,
    },
    direction: 1,
    info: {
      en: `Single-use plastics (bags, straws, packaging) cause severe ocean and land pollution. The EU has banned many items; other regions lag behind. Critics note bans can increase food waste and that biodegradable alternatives have their own environmental footprints.`,
      fr: `Les plastiques à usage unique causent une grave pollution des océans et des terres. L'UE en a interdit beaucoup ; d'autres régions sont en retard. Les critiques notent que les interdictions peuvent augmenter les déchets alimentaires et que les alternatives biodégradables ont aussi un impact environnemental.`,
    },
  },

  // ─── DEMOCRACY ───────────────────────────────────────────────────────────────
  {
    id: `DEM_1`,
    theme: THEMES.DEMOCRACY,
    priority: 1,
    weight: 2,
    text: {
      en: `Voting should be compulsory for all citizens.`,
      fr: `Le vote devrait être obligatoire pour tous les citoyens.`,
    },
    direction: 1,
    info: {
      en: `Compulsory voting, as in Australia and Belgium, increases turnout significantly. Proponents say higher participation strengthens democratic legitimacy; critics argue forcing people to vote violates political freedom and produces more uninformed votes.`,
      fr: `Le vote obligatoire, comme en Australie et en Belgique, augmente significativement la participation. Ses partisans soutiennent qu'une participation plus élevée renforce la légitimité démocratique ; ses critiques estiment qu'il viole la liberté politique.`,
    },
  },
  {
    id: `DEM_2`,
    theme: THEMES.DEMOCRACY,
    priority: 1,
    weight: 2,
    text: {
      en: `Social media companies have too much unaccountable power over democratic debate.`,
      fr: `Les entreprises de médias sociaux ont trop de pouvoir non contrôlé sur le débat démocratique.`,
    },
    direction: 1,
    info: {
      en: `A handful of tech companies control most of the world's public discourse. Critics argue their algorithms amplify extremism, their content moderation is inconsistent, and they can effectively silence political speech. Some argue regulation or break-up is needed.`,
      fr: `Une poignée d'entreprises technologiques contrôle la majeure partie du discours public mondial. Leurs critiques soutiennent que leurs algorithmes amplifient l'extrémisme et que leur modération de contenu est incohérente. Certains réclament une réglementation ou un démantèlement.`,
    },
  },
  {
    id: `DEM_3`,
    theme: THEMES.DEMOCRACY,
    priority: 2,
    weight: 2,
    text: {
      en: `Citizens should be able to vote in referendums on major national decisions.`,
      fr: `Les citoyens devraient pouvoir voter lors de référendums sur les grandes décisions nationales.`,
    },
    direction: 1,
    info: {
      en: `Direct democracy through referendums allows citizens to decide on major issues. Proponents argue it increases legitimacy; critics argue complex issues require expert deliberation, and referendums are easily manipulated by populists with simple yes/no framings.`,
      fr: `La démocratie directe via des référendums permet aux citoyens de décider des grandes questions. Ses partisans soutiennent qu'elle augmente la légitimité ; ses critiques soutiennent que les référendums sont facilement manipulés par des populistes avec des cadres oui/non simplistes.`,
    },
  },
  {
    id: `DEM_4`,
    theme: THEMES.DEMOCRACY,
    priority: 2,
    weight: 5,
    text: {
      en: `The judiciary should be fully independent from political influence.`,
      fr: `La magistrature devrait être totalement indépendante de toute influence politique.`,
    },
    direction: 1,
    info: {
      en: `Judicial independence is a cornerstone of the rule of law. Hungary and Poland have faced EU sanctions for political interference in their courts. Some populists argue elected politicians should control courts; liberals argue judicial independence protects rights from majorities.`,
      fr: `L'indépendance judiciaire est une pierre angulaire de l'état de droit. La Hongrie et la Pologne ont fait face à des sanctions de l'UE pour ingérence politique dans leurs tribunaux. Certains populistes soutiennent que les politiciens élus devraient contrôler les tribunaux.`,
    },
  },
  {
    id: `DEM_5`,
    theme: THEMES.DEMOCRACY,
    priority: 2,
    weight: 2,
    text: {
      en: `Electoral systems should use proportional representation to better reflect voters' choices.`,
      fr: `Les systèmes électoraux devraient utiliser la représentation proportionnelle pour mieux refléter les choix des électeurs.`,
    },
    direction: 1,
    info: {
      en: `Proportional systems (Germany, Netherlands) give parties seats matching their vote share; first-past-the-post (UK, US) tends to produce strong single-party governments. PR advocates argue it is fairer; FPTP advocates argue it produces stronger, more accountable governments.`,
      fr: `Les systèmes proportionnels (Allemagne, Pays-Bas) accordent des sièges proportionnels au nombre de voix ; le scrutin majoritaire (Royaume-Uni, États-Unis) tend à produire des gouvernements monopartites forts. Ses partisans soutiennent que c'est plus juste ; ses critiques préfèrent des gouvernements forts.`,
    },
  },
  {
    id: `DEM_6`,
    theme: THEMES.DEMOCRACY,
    priority: 2,
    weight: 2,
    text: {
      en: `The voting age should be lowered to 16.`,
      fr: `L'âge de voter devrait être abaissé à 16 ans.`,
    },
    direction: 1,
    info: {
      en: `Scotland, Austria, and Wales allow 16-year-olds to vote in some elections. Proponents argue young people are affected by political decisions and are engaged enough to participate. Critics argue 16-year-olds lack the experience and independence to vote effectively.`,
      fr: `L'Écosse, l'Autriche et le Pays de Galles permettent aux jeunes de 16 ans de voter dans certaines élections. Ses partisans soutiennent que les jeunes sont concernés par les décisions politiques. Ses critiques soutiennent que les jeunes de 16 ans manquent d'expérience.`,
    },
  },
  {
    id: `DEM_7`,
    theme: THEMES.DEMOCRACY,
    priority: 2,
    weight: 2,
    text: {
      en: `Politicians who spread deliberate misinformation should face sanctions or removal from office.`,
      fr: `Les hommes politiques qui répandent délibérément de la désinformation devraient faire l'objet de sanctions ou être révoqués.`,
    },
    direction: 1,
    info: {
      en: `Political speech is generally given wide latitude in liberal democracies. Some argue deliberate lies by elected officials erode trust and democracy itself. Critics worry that defining "misinformation" politically could be used to silence opposition.`,
      fr: `Le discours politique bénéficie généralement d'une grande latitude dans les démocraties libérales. Certains soutiennent que les mensonges délibérés des élus érodent la confiance et la démocratie elle-même. Les critiques s'inquiètent de la définition politique de la "désinformation".`,
    },
  },
  {
    id: `DEM_8`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Political donations from corporations and wealthy individuals should be banned.`,
      fr: `Les dons politiques des entreprises et des individus fortunés devraient être interdits.`,
    },
    direction: 1,
    info: {
      en: `Large donations can give wealthy interests disproportionate influence over parties and policy. Some countries ban corporate donations; the US Supreme Court ruled that political spending is protected free speech. Public funding of parties is the alternative model.`,
      fr: `Les dons importants peuvent donner aux intérêts fortunés une influence disproportionnée sur les partis et les politiques. Certains pays interdisent les dons d'entreprises. La Cour suprême américaine a estimé que les dépenses politiques sont une liberté d'expression protégée.`,
    },
  },
  {
    id: `DEM_9`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `An unelected upper house (like the UK House of Lords) should be abolished or fully elected.`,
      fr: `Une chambre haute non élue (comme la Chambre des lords britannique) devrait être abolie ou entièrement élue.`,
    },
    direction: 1,
    info: {
      en: `The UK House of Lords has hundreds of appointed members. Critics argue unelected legislators have no democratic mandate; supporters argue the Lords provides valuable scrutiny and expertise. Reforming it has been on the UK political agenda for a century without resolution.`,
      fr: `La Chambre des lords britannique compte des centaines de membres nommés. Ses critiques soutiennent que des législateurs non élus n'ont aucun mandat démocratique ; ses partisans soutiennent qu'elle fournit un contrôle précieux.`,
    },
  },
  {
    id: `DEM_10`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Emergency powers granted to governments during crises should automatically expire after 30 days unless renewed by parliament.`,
      fr: `Les pouvoirs d'urgence accordés aux gouvernements en temps de crise devraient expirer automatiquement après 30 jours sauf renouvellement par le parlement.`,
    },
    direction: 1,
    info: {
      en: `The COVID-19 pandemic showed how emergency powers can be used with minimal parliamentary oversight. In many countries, executives were able to pass extensive restrictions by decree. Sunset clauses and parliamentary approval mechanisms protect against permanent extension of emergency powers.`,
      fr: `La pandémie de COVID-19 a montré comment les pouvoirs d'urgence peuvent être utilisés avec une surveillance parlementaire minimale. Des clauses d'extinction et des mécanismes d'approbation parlementaire protègent contre l'extension permanente des pouvoirs d'urgence.`,
    },
  },
  {
    id: `DEM_11`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Term limits should be introduced for all elected political offices.`,
      fr: `Des limites de mandats devraient être introduites pour toutes les fonctions politiques électives.`,
    },
    direction: 1,
    info: {
      en: `Term limits prevent entrenchment of power and encourage new leadership. The US president is limited to two terms; many countries have no such limits. Critics argue term limits remove experienced politicians and reduce accountability to voters who could simply not re-elect them.`,
      fr: `Les limites de mandats empêchent l'enracinement du pouvoir et encouragent de nouveaux dirigeants. Le président américain est limité à deux mandats. Ses critiques soutiennent que les limites de mandats suppriment des politiciens expérimentés.`,
    },
  },
  {
    id: `DEM_12`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Citizens should be able to recall their elected representatives before their term ends.`,
      fr: `Les citoyens devraient pouvoir révoquer leurs représentants élus avant la fin de leur mandat.`,
    },
    direction: 1,
    info: {
      en: `Recall mechanisms allow voters to remove representatives through a vote before term ends, as exists in some US states. Proponents argue it keeps politicians accountable; critics warn it is open to abuse by well-funded interests who can mount expensive recall campaigns.`,
      fr: `Les mécanismes de révocation permettent aux électeurs de renvoyer les représentants avant la fin de leur mandat, comme dans certains États américains. Ses partisans soutiennent qu'il renforce la responsabilité ; ses critiques avertissent qu'il peut être exploité par des intérêts bien financés.`,
    },
  },
  {
    id: `DEM_13`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `The press should face stricter regulations on political bias to ensure balanced reporting.`,
      fr: `La presse devrait faire face à des réglementations plus strictes sur le biais politique pour garantir une couverture équilibrée.`,
    },
    direction: 0,
    info: {
      en: `Press freedom is fundamental to democracy, but many outlets have strong partisan leanings. Broadcast media in the UK must maintain impartiality (Ofcom rules); newspapers do not. Stricter press regulation raises concerns about government interference in editorial decisions.`,
      fr: `La liberté de la presse est fondamentale pour la démocratie, mais de nombreux médias ont de fortes orientations partisanes. Les médias audiovisuels au Royaume-Uni doivent maintenir l'impartialité. Une réglementation plus stricte soulève des inquiétudes quant à l'ingérence gouvernementale.`,
    },
  },
  {
    id: `DEM_14`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Parliamentary privileges protecting what politicians say in debates should be significantly reduced.`,
      fr: `Les privilèges parlementaires protégeant ce que disent les politiciens dans les débats devraient être significativement réduits.`,
    },
    direction: 0,
    info: {
      en: `Parliamentary privilege protects MPs from defamation suits for statements made in parliament. While it allows open debate, it has been used to make claims about individuals that could not be made outside the chamber. Reform advocates argue accountability should not have a safe harbour.`,
      fr: `Le privilège parlementaire protège les députés des poursuites pour diffamation pour les déclarations faites au parlement. Bien qu'il permette un débat ouvert, il a été utilisé pour faire des allégations sur des individus. Les partisans d'une réforme arguent que la responsabilité ne devrait pas avoir de refuge.`,
    },
  },
  {
    id: `DEM_15`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Lobbying by corporations should be much more strictly regulated and disclosed.`,
      fr: `Le lobbying par les entreprises devrait être beaucoup plus strictement réglementé et divulgué.`,
    },
    direction: 1,
    info: {
      en: `Corporate lobbying can distort policy in favour of well-funded interests. The EU and US have lobbying registers, but disclosure is incomplete. Campaign finance and lobbying reform are a priority for anti-corruption advocates who argue money corrupts democratic outcomes.`,
      fr: `Le lobbying des entreprises peut distordre les politiques en faveur d'intérêts bien financés. L'UE et les États-Unis ont des registres de lobbying, mais la divulgation est incomplète. La réforme du financement des campagnes et du lobbying est une priorité pour les militants anticorruption.`,
    },
  },

  // ─── GLOBALIZATION ────────────────────────────────────────────────────────────
  {
    id: `GLO_1`,
    theme: THEMES.GLOBAL,
    priority: 1,
    weight: 5,
    text: {
      en: `Countries should prioritise their own national interest above international commitments.`,
      fr: `Les pays devraient prioriser leur propre intérêt national au-dessus des engagements internationaux.`,
    },
    direction: 1,
    info: {
      en: `"America First" and similar nationalist doctrines argue states owe their citizens priority over global obligations. Internationalists counter that shared institutions, alliances, and rules create stability and prosperity that serves national interests too.`,
      fr: `Les doctrines nationalistes de type "America First" soutiennent que les États doivent prioriser leurs citoyens sur les obligations mondiales. Les internationalistes rétorquent que les institutions partagées créent une stabilité et une prospérité qui servent aussi les intérêts nationaux.`,
    },
  },
  {
    id: `GLO_2`,
    theme: THEMES.GLOBAL,
    priority: 1,
    weight: 3,
    text: {
      en: `Global institutions like the UN, WTO, and IMF have too much power over national governments.`,
      fr: `Les institutions mondiales comme l'ONU, l'OMC et le FMI ont trop de pouvoir sur les gouvernements nationaux.`,
    },
    direction: 1,
    info: {
      en: `Sovereignists argue that unelected international bodies undermine democracy by imposing rules on sovereign nations. Internationalists argue global problems require global solutions, and that such institutions have delivered decades of peace, trade, and development.`,
      fr: `Les souverainistes soutiennent que les organes internationaux non élus sapent la démocratie en imposant des règles aux nations souveraines. Les internationalistes soutiennent que les problèmes mondiaux nécessitent des solutions mondiales.`,
    },
  },
  {
    id: `GLO_3`,
    theme: THEMES.GLOBAL,
    priority: 2,
    weight: 3,
    text: {
      en: `NATO and military alliances are essential for national security.`,
      fr: `L'OTAN et les alliances militaires sont essentielles pour la sécurité nationale.`,
    },
    direction: -1,
    info: {
      en: `NATO has provided collective security in the West since 1949. Russia's invasion of Ukraine in 2022 strengthened support for NATO in Europe. Eurosceptics and some on the left question whether alliances drag countries into conflicts; nationalists argue independent defence is preferable.`,
      fr: `L'OTAN assure la sécurité collective en Occident depuis 1949. L'invasion russe de l'Ukraine en 2022 a renforcé le soutien à l'OTAN en Europe. Certains eurosceptiques et membres de la gauche s'interrogent sur les risques des alliances.`,
    },
  },
  {
    id: `GLO_4`,
    theme: THEMES.GLOBAL,
    priority: 2,
    weight: 2,
    text: {
      en: `Our country should increase its foreign aid budget.`,
      fr: `Notre pays devrait augmenter son budget d'aide étrangère.`,
    },
    direction: -1,
    info: {
      en: `Foreign aid includes development assistance, humanitarian relief, and diplomatic support to poorer countries. Proponents argue it is a moral obligation and serves long-term strategic interests. Critics argue the money should be spent domestically.`,
      fr: `L'aide étrangère comprend l'assistance au développement et l'aide humanitaire aux pays plus pauvres. Ses partisans soutiennent qu'il s'agit d'une obligation morale et d'un intérêt stratégique à long terme. Ses critiques estiment que l'argent devrait être dépensé dans le pays.`,
    },
  },
  {
    id: `GLO_5`,
    theme: THEMES.GLOBAL,
    priority: 2,
    weight: 3,
    text: {
      en: `National sovereignty is more important than international agreements on human rights.`,
      fr: `La souveraineté nationale est plus importante que les accords internationaux sur les droits de l'homme.`,
    },
    direction: 1,
    info: {
      en: `International human rights law allows outside courts to overrule domestic laws. Sovereignists argue this undermines democracy; internationalists argue shared norms protect citizens against their own governments.`,
      fr: `Le droit international des droits de l'homme permet à des tribunaux extérieurs d'annuler les lois nationales. Les souverainistes soutiennent que cela compromet la démocratie ; les internationalistes estiment que des normes partagées protègent les citoyens.`,
    },
  },
  {
    id: `GLO_6`,
    theme: THEMES.GLOBAL,
    priority: 2,
    weight: 2,
    text: {
      en: `Protectionist tariffs and industrial policy are legitimate tools to preserve domestic industries.`,
      fr: `Les tarifs protectionnistes et la politique industrielle sont des outils légitimes pour préserver les industries nationales.`,
    },
    direction: 1,
    info: {
      en: `Industrial policy involves the state supporting strategic industries. "Friend-shoring" and supply chain resilience became priorities after COVID supply shocks. Economic liberals argue protectionism raises prices and invites retaliation; nationalists argue strategic industries must be defended.`,
      fr: `La politique industrielle implique que l'État soutienne des industries stratégiques. Les libéraux économiques soutiennent que le protectionnisme augmente les prix et invite à des représailles ; les nationalistes soutiennent que les industries stratégiques doivent être défendues.`,
    },
  },
  {
    id: `GLO_7`,
    theme: THEMES.GLOBAL,
    priority: 2,
    weight: 2,
    text: {
      en: `Economic sanctions against authoritarian regimes are effective and should be used more.`,
      fr: `Les sanctions économiques contre les régimes autoritaires sont efficaces et devraient être davantage utilisées.`,
    },
    direction: -1,
    info: {
      en: `Sanctions attempt to change state behaviour through economic pressure. Their effectiveness is debated: Iran, Russia, and Cuba have all maintained authoritarian systems under decades of sanctions. Critics argue they hurt ordinary citizens more than regimes while hardening anti-Western sentiment.`,
      fr: `Les sanctions visent à modifier le comportement des États par la pression économique. Leur efficacité est débattue : l'Iran, la Russie et Cuba ont tous maintenu des systèmes autoritaires sous des décennies de sanctions. Les critiques soutiennent qu'elles nuisent davantage aux citoyens ordinaires.`,
    },
  },
  {
    id: `GLO_8`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `The European Union should deepen political and fiscal integration among member states.`,
      fr: `L'Union européenne devrait approfondir l'intégration politique et fiscale entre les États membres.`,
    },
    direction: -1,
    info: {
      en: `European federalists argue deeper integration — joint debt, unified foreign policy — would make Europe stronger. Eurosceptics argue it dilutes national democracy and accountability. The eurozone debt crisis, COVID, and Ukraine have pushed both integration and sovereignty debates.`,
      fr: `Les fédéralistes européens soutiennent qu'une intégration plus profonde (dette commune, politique étrangère unifiée) renforcerait l'Europe. Les eurosceptiques estiment qu'elle dilue la démocratie nationale.`,
    },
  },
  {
    id: `GLO_9`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Cultural globalisation (the spread of American/Western culture globally) is a negative force.`,
      fr: `La mondialisation culturelle (la diffusion de la culture américaine/occidentale dans le monde) est une force négative.`,
    },
    direction: 1,
    info: {
      en: `Critics of cultural globalisation argue it homogenises local cultures and undermines non-Western traditions. Some nations have introduced cultural quotas for media. Proponents argue that cultural exchange is enriching and that local cultures can adapt and endure.`,
      fr: `Les critiques de la mondialisation culturelle soutiennent qu'elle homogénéise les cultures locales et sape les traditions non occidentales. Certains pays ont introduit des quotas culturels pour les médias. Ses partisans soutiennent que l'échange culturel est enrichissant.`,
    },
  },
  {
    id: `GLO_10`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Multinational corporations should be subject to a global minimum tax to prevent tax avoidance.`,
      fr: `Les entreprises multinationales devraient être soumises à un impôt minimum mondial pour prévenir l'évasion fiscale.`,
    },
    direction: -1,
    info: {
      en: `The OECD reached agreement in 2021 on a global minimum corporate tax of 15%. Proponents argue it ends the race to the bottom on tax; small countries like Ireland and Luxembourg that compete on low rates objected. It represents a significant step in global tax coordination.`,
      fr: `L'OCDE a conclu un accord en 2021 sur un impôt minimum mondial sur les sociétés de 15%. Ses partisans soutiennent qu'il met fin à la course vers le bas en matière fiscale. Les petits pays comme l'Irlande, qui concurrencent sur des taux bas, s'y sont opposés.`,
    },
  },
  {
    id: `GLO_11`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Countries should reduce their economic dependency on China.`,
      fr: `Les pays devraient réduire leur dépendance économique vis-à-vis de la Chine.`,
    },
    direction: 1,
    info: {
      en: `Western democracies have grown economically entangled with China, especially in supply chains and energy. After COVID and rising tensions over Taiwan, "de-risking" has become mainstream. Critics worry about economic costs and provoking unnecessary confrontation.`,
      fr: `Les démocraties occidentales se sont enchevêtrées économiquement avec la Chine, surtout dans les chaînes d'approvisionnement. Après le COVID et les tensions croissantes autour de Taiwan, la "réduction des risques" est devenue dominante. Les critiques s'inquiètent des coûts économiques.`,
    },
  },
  {
    id: `GLO_12`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Countries with colonial histories owe reparations to formerly colonised nations.`,
      fr: `Les pays ayant un passé colonial doivent des réparations aux nations anciennement colonisées.`,
    },
    direction: -1,
    info: {
      en: `Colonial reparations are on the agenda in several countries, including discussions in the UK and France about slavery and colonisation. Proponents argue colonialism extracted enormous wealth; critics question legal responsibility of present citizens for historical actions.`,
      fr: `Les réparations coloniales sont à l'ordre du jour dans plusieurs pays. Leurs partisans soutiennent que le colonialisme a extrait d'énormes richesses ; leurs critiques s'interrogent sur la responsabilité juridique des citoyens actuels pour des actions historiques.`,
    },
  },
  {
    id: `GLO_13`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `International courts (like the ICC) should have jurisdiction over war crimes regardless of the nationality of the accused.`,
      fr: `Les tribunaux internationaux (comme la CPI) devraient avoir compétence sur les crimes de guerre quelle que soit la nationalité des accusés.`,
    },
    direction: -1,
    info: {
      en: `The ICC was created to try war crimes, genocide, and crimes against humanity. The US, Russia, and China are not members, limiting its reach. When it issued an arrest warrant for Vladimir Putin, Western governments split over whether to enforce it. Sovereignists argue it infringes national justice systems.`,
      fr: `La CPI a été créée pour juger les crimes de guerre, les génocides et les crimes contre l'humanité. Les États-Unis, la Russie et la Chine n'en sont pas membres. Quand elle a émis un mandat d'arrêt contre Vladimir Poutine, les gouvernements occidentaux se sont divisés sur son application.`,
    },
  },
  {
    id: `GLO_14`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Countries should be able to restrict foreign ownership of media and strategic companies.`,
      fr: `Les pays devraient pouvoir restreindre la propriété étrangère des médias et des entreprises stratégiques.`,
    },
    direction: 1,
    info: {
      en: `Restrictions on foreign ownership of media and critical infrastructure are common on grounds of national security and sovereignty. Several countries have tightened rules after concerns about Chinese or Russian investment. Critics see this as protectionism masquerading as security.`,
      fr: `Les restrictions sur la propriété étrangère des médias et des infrastructures critiques sont courantes pour des raisons de sécurité nationale. Plusieurs pays ont renforcé les règles après des inquiétudes concernant les investissements chinois ou russes. Ses critiques y voient du protectionnisme.`,
    },
  },
  {
    id: `GLO_15`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Rich nations have a moral obligation to intervene militarily to stop genocide or mass atrocities.`,
      fr: `Les nations riches ont une obligation morale d'intervenir militairement pour arrêter les génocides ou les atrocités de masse.`,
    },
    direction: -1,
    info: {
      en: `The "Responsibility to Protect" (R2P) doctrine holds that sovereignty is conditional on a government not committing atrocities. Interventionism is supported by liberal internationalists but opposed by sovereignists and those sceptical after Iraq and Libya. The UN Security Council veto blocks many potential interventions.`,
      fr: `La doctrine "Responsabilité de protéger" (R2P) stipule que la souveraineté est conditionnelle à ce qu'un gouvernement ne commette pas d'atrocités. L'interventionnisme est soutenu par les internationalistes libéraux mais s'oppose aux souverainistes sceptiques après l'Irak et la Libye.`,
    },
  },

  // ─── PUBLIC SERVICES ─────────────────────────────────────────────────────────
  {
    id: `PUB_1`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 1,
    weight: 5,
    text: {
      en: `The government should provide free universal healthcare for all citizens.`,
      fr: `Le gouvernement devrait fournir des soins de santé universels et gratuits à tous les citoyens.`,
    },
    direction: 1,
    info: {
      en: `Universal healthcare (like the NHS in the UK or French Sécurité Sociale) means the state covers all citizens' basic medical needs. Proponents cite health outcomes and equity; critics warn of cost, inefficiency, and wait times.`,
      fr: `La santé universelle (comme le NHS ou la Sécurité Sociale française) signifie que l'État couvre les besoins médicaux fondamentaux de tous les citoyens. Ses partisans citent les résultats sanitaires et l'équité ; ses critiques avertissent du coût et des délais d'attente.`,
    },
  },
  {
    id: `PUB_2`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 1,
    weight: 3,
    text: {
      en: `Public schools should receive significantly more government funding.`,
      fr: `Les écoles publiques devraient recevoir des financements gouvernementaux nettement plus importants.`,
    },
    direction: 1,
    info: {
      en: `Public education funding levels affect class sizes, facilities, and teacher pay. In many countries, public schools are underfunded relative to private schools. Increasing funding is typically a left-of-centre position; fiscal conservatives tend to favour school choice.`,
      fr: `Le niveau de financement de l'enseignement public affecte la taille des classes et les salaires des enseignants. L'augmentation des financements est généralement une position de centre-gauche ; les conservateurs budgétaires préfèrent les programmes de choix scolaire.`,
    },
  },
  {
    id: `PUB_3`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 2,
    weight: 3,
    text: {
      en: `Private companies should be allowed to compete with state services in healthcare and education.`,
      fr: `Les entreprises privées devraient être autorisées à concurrencer les services publics dans les domaines de la santé et de l'éducation.`,
    },
    direction: -1,
    info: {
      en: `The question of market competition in public services is deeply political. Supporters argue competition drives quality and efficiency. Critics argue it creates inequality and prioritises profit over wellbeing in essential services.`,
      fr: `La question de la concurrence dans les services publics est profondément politique. Ses partisans estiment que la concurrence stimule la qualité. Ses critiques soutiennent qu'elle crée des inégalités et favorise le profit sur le bien-être dans les services essentiels.`,
    },
  },
  {
    id: `PUB_4`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 2,
    weight: 2,
    text: {
      en: `The state pension system should be strengthened and expanded.`,
      fr: `Le système de retraite par répartition devrait être renforcé et étendu.`,
    },
    direction: 1,
    info: {
      en: `State pensions provide retirement income funded by current workers. As populations age, governments debate raising retirement ages or shifting to private savings. Left parties generally defend state pensions; right parties often advocate personal savings.`,
      fr: `Les retraites publiques fournissent un revenu de retraite financé par les travailleurs actuels. Face au vieillissement des populations, de nombreux gouvernements débattent d'âges de départ plus élevés ou de schémas d'épargne privée. La gauche défend les retraites publiques ; la droite préfère l'épargne personnelle.`,
    },
  },
  {
    id: `PUB_5`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 2,
    weight: 2,
    text: {
      en: `Higher education should be free or heavily subsidised for all students.`,
      fr: `L'enseignement supérieur devrait être gratuit ou fortement subventionné pour tous les étudiants.`,
    },
    direction: 1,
    info: {
      en: `University tuition fees vary enormously — free in Germany and France, very high in the US and UK. Free higher education increases access but requires higher public spending. Critics argue it subsidises middle-class families; income-based loans may be fairer.`,
      fr: `Les frais de scolarité universitaires varient enormément — de gratuits en Allemagne et en France à très élevés aux États-Unis. L'enseignement supérieur gratuit augmente l'accès mais nécessite des dépenses publiques plus élevées. Les critiques soutiennent que cela subventionne les classes moyennes.`,
    },
  },
  {
    id: `PUB_6`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 2,
    weight: 2,
    text: {
      en: `Social housing should be significantly expanded to tackle the housing crisis.`,
      fr: `Le logement social devrait être significativement étendu pour résoudre la crise du logement.`,
    },
    direction: 1,
    info: {
      en: `Social housing provides affordable accommodation for lower-income households. Many Western countries have dramatically reduced social housing stock since the 1980s, contributing to the housing crisis. Proponents argue public investment is essential; critics prefer market solutions.`,
      fr: `Le logement social fournit des logements abordables aux ménages à revenus modestes. De nombreux pays occidentaux ont considérablement réduit leur parc de logements sociaux depuis les années 1980. Ses partisans soutiennent que l'investissement public est essentiel ; ses critiques préfèrent des solutions de marché.`,
    },
  },
  {
    id: `PUB_7`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 2,
    weight: 2,
    text: {
      en: `A state-funded basic income or negative income tax should replace the current welfare bureaucracy.`,
      fr: `Un revenu de base financé par l'État ou un impôt négatif sur le revenu devrait remplacer la bureaucratie actuelle de l'aide sociale.`,
    },
    direction: 1,
    info: {
      en: `Replacing complex means-tested benefits with a simple basic income can reduce administrative costs and stigma. Milton Friedman advocated a negative income tax on the right; socialists support unconditional basic income for different reasons. Pilots in Finland and Kenya showed promising results.`,
      fr: `Remplacer les prestations complexes soumises à conditions de ressources par un revenu de base simple peut réduire les coûts administratifs. Milton Friedman préconisait un impôt négatif sur le revenu ; les socialistes soutiennent un revenu de base inconditionnel. Des pilotes en Finlande et au Kenya ont montré des résultats prometteurs.`,
    },
  },
  {
    id: `PUB_8`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `Public libraries and cultural institutions should receive guaranteed long-term funding.`,
      fr: `Les bibliothèques publiques et les institutions culturelles devraient recevoir un financement garanti à long terme.`,
    },
    direction: 1,
    info: {
      en: `Public libraries provide free access to information, community spaces, and digital access for the less well-off. Many countries have significantly cut library budgets since 2010. Supporters argue they are essential public infrastructure; critics see them as low priority in tight budgets.`,
      fr: `Les bibliothèques publiques offrent un accès gratuit à l'information et des espaces communautaires. De nombreux pays ont considérablement réduit leurs budgets depuis 2010. Leurs partisans soutiennent qu'elles sont une infrastructure publique essentielle ; leurs critiques les voient comme une priorité faible.`,
    },
  },
  {
    id: `PUB_9`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `Childcare should be universally free and publicly provided.`,
      fr: `La garde d'enfants devrait être universellement gratuite et fournie par le secteur public.`,
    },
    direction: 1,
    info: {
      en: `Childcare costs are a major barrier to female employment and to having children. Countries like Sweden and France heavily subsidise childcare. The UK has moved toward expanded free hours; the US lags significantly. Universal childcare is supported by feminist and labour movements.`,
      fr: `Les coûts de garde d'enfants sont un obstacle majeur à l'emploi des femmes. Des pays comme la Suède et la France subventionnent massivement la garde d'enfants. La garde universelle est soutenue par les mouvements féministes et syndicaux.`,
    },
  },
  {
    id: `PUB_10`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `Mental health services should receive the same level of funding as physical health services.`,
      fr: `Les services de santé mentale devraient recevoir le même niveau de financement que les services de santé physique.`,
    },
    direction: 1,
    info: {
      en: `Mental health is consistently underfunded relative to physical health globally. The WHO estimates depression and anxiety cost $1 trillion per year in lost productivity. Parity advocates argue mental illness is as real and treatable as physical illness; budget pressures often push it down the priority list.`,
      fr: `La santé mentale est systématiquement sous-financée par rapport à la santé physique dans le monde. L'OMS estime que la dépression et l'anxiété coûtent 1 billion de dollars par an en productivité perdue. Les partisans de la parité soutiennent que les maladies mentales sont aussi réelles et traitables que les maladies physiques.`,
    },
  },
  {
    id: `PUB_11`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `The state should cap rents in major cities to address the housing crisis.`,
      fr: `L'État devrait plafonner les loyers dans les grandes villes pour résoudre la crise du logement.`,
    },
    direction: 1,
    info: {
      en: `Rent controls limit rent increases for existing tenants, providing stability. Berlin and New York have experimented with strong rent controls. Economists are divided: many argue controls reduce housing supply by discouraging construction; proponents argue they protect residents from displacement.`,
      fr: `Les contrôles des loyers limitent les hausses pour les locataires existants. Berlin et New York ont expérimenté des contrôles stricts des loyers. Les économistes sont divisés : beaucoup soutiennent que les contrôles réduisent l'offre de logements ; les partisans soutiennent qu'ils protègent les résidents de l'expulsion.`,
    },
  },
  {
    id: `PUB_12`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `Public transport should be free or heavily subsidised and massively expanded.`,
      fr: `Les transports en commun devraient être gratuits ou fortement subventionnés et massivement étendus.`,
    },
    direction: 1,
    info: {
      en: `Free public transport has been trialled in Luxembourg and some Spanish cities. It can reduce car use, emissions, and inequality. Critics argue free fares are expensive and may not shift car users who value convenience; others argue targeted subsidies are more efficient.`,
      fr: `Les transports en commun gratuits ont été expérimentés au Luxembourg et dans certaines villes espagnoles. Cela peut réduire l'utilisation de la voiture, les émissions et les inégalités. Ses critiques soutiennent que la gratuité est coûteuse et ne détourne pas forcément les automobilistes.`,
    },
  },
  {
    id: `PUB_13`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `The welfare state has grown too large and should be significantly reformed to reduce dependency.`,
      fr: `L'État-providence est devenu trop important et devrait être significativement réformé pour réduire la dépendance.`,
    },
    direction: -1,
    info: {
      en: `Welfare reform — including tightening eligibility, introducing work requirements, and time-limiting benefits — has been central to right-of-centre politics since the 1990s. Critics argue welfare dependency is overstated and that reforms often push people deeper into poverty.`,
      fr: `La réforme de l'aide sociale — resserrement des critères d'éligibilité, exigences de travail — est centrale à la politique de droite depuis les années 1990. Ses critiques soutiennent que la dépendance à l'aide sociale est surestimée et que les réformes poussent souvent les gens plus profondément dans la pauvreté.`,
    },
  },
  {
    id: `PUB_14`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `The state should guarantee employment to anyone willing to work.`,
      fr: `L'État devrait garantir un emploi à quiconque est prêt à travailler.`,
    },
    direction: 1,
    info: {
      en: `A Job Guarantee is a radical fiscal policy proposal where the government acts as "employer of last resort". Proponents from Modern Monetary Theory (MMT) circles argue it eliminates unemployment and inflation simultaneously. Critics question cost, feasibility, and whether all created jobs would be productive.`,
      fr: `Une "garantie d'emploi" est une proposition de politique fiscale radicale où le gouvernement agit comme "employeur en dernier ressort". Ses partisans soutiennent qu'elle élimine le chômage. Ses critiques s'interrogent sur le coût, la faisabilité et la productivité des emplois créés.`,
    },
  },
  {
    id: `PUB_15`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `Healthcare rationing (deciding who gets limited treatments based on cost-effectiveness) is a necessary and acceptable part of public health systems.`,
      fr: `Le rationnement des soins de santé (décider qui reçoit des traitements limités en fonction du rapport coût-efficacité) est une partie nécessaire et acceptable des systèmes de santé publics.`,
    },
    direction: 0,
    info: {
      en: `All health systems ration care in some form. The UK's NICE assesses cost-effectiveness of treatments. Rationing decisions are politically sensitive. Proponents argue transparent criteria are more equitable than ability-to-pay; critics argue the state should not set a price on human life.`,
      fr: `Tous les systèmes de santé rationalisent les soins sous une forme ou une autre. Le NICE britannique évalue le rapport coût-efficacité des traitements. Les rationnements sont politiquement sensibles. Ses partisans soutiennent que des critères transparents sont plus équitables que la capacité de payer.`,
    },
  },

  // ── ECONOMY (extended) ────────────────────────────────────────────────────
  {
    id: `ECO_16`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `The government should redistribute wealth more aggressively to reduce economic inequality.`,
      fr: `Le gouvernement devrait redistribuer les richesses plus agressivement pour réduire les inégalités économiques.`,
    },
    direction: -1,
    info: {
      en: `Wealth redistribution through progressive taxation and social transfers is central to social-democratic politics. Critics argue it reduces incentives and capital formation; proponents contend that extreme inequality harms social cohesion and growth.`,
      fr: `La redistribution des richesses via la taxation progressive et les transferts sociaux est au cœur de la politique sociale-démocrate. Les critiques soutiennent qu'elle réduit les incitations; les partisans estiment que les inégalités extrêmes nuisent à la cohésion sociale.`,
    },
  },
  {
    id: `ECO_17`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `International free trade agreements generally benefit workers and consumers.`,
      fr: `Les accords de libre-échange international profitent généralement aux travailleurs et aux consommateurs.`,
    },
    direction: 1,
    info: {
      en: `Mainstream economic theory supports free trade as increasing overall welfare through comparative advantage. Critics on both left and right argue that trade agreements suppress wages, offshore jobs, and bypass democratic oversight through investor-state dispute mechanisms.`,
      fr: `La théorie économique dominante soutient le libre-échange comme augmentant le bien-être global. Les critiques de gauche comme de droite soutiennent que les accords commerciaux suppriment les salaires et contournent la démocratie.`,
    },
  },
  {
    id: `ECO_18`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `Large corporations exercise too much influence over government policy and should be more strictly regulated.`,
      fr: `Les grandes entreprises exercent trop d'influence sur les politiques gouvernementales et devraient être plus strictement réglementées.`,
    },
    direction: -1,
    info: {
      en: `Corporate political influence through lobbying, revolving doors, and campaign finance is well-documented. The debate concerns whether regulation or market competition is the appropriate corrective, and whether state regulators can be kept independent from industry capture.`,
      fr: `L'influence politique des entreprises via le lobbying est bien documentée. Le débat porte sur si la réglementation ou la concurrence du marché est la correction appropriée.`,
    },
  },
  {
    id: `ECO_19`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `A shorter working week (e.g. 4 days) should be mandated by law without loss of pay.`,
      fr: `Une semaine de travail plus courte (ex. 4 jours) devrait être imposée par la loi sans perte de salaire.`,
    },
    direction: -1,
    info: {
      en: `Pilots in Iceland, Japan and the UK showed productivity maintained or improved with a four-day week. Employers and some economists worry about competitiveness and costs. Proponents argue it improves wellbeing, reduces unemployment, and increases domestic spending.`,
      fr: `Des pilotes en Islande, au Japon et au Royaume-Uni ont montré une productivité maintenue ou améliorée avec une semaine de quatre jours. Les partisans soutiennent qu'elle améliore le bien-être et réduit le chômage.`,
    },
  },
  {
    id: `ECO_20`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `Central banks should be subject to greater democratic accountability and parliamentary oversight.`,
      fr: `Les banques centrales devraient être soumises à une plus grande responsabilité démocratique et à une surveillance parlementaire accrue.`,
    },
    direction: -1,
    info: {
      en: `Central bank independence is considered best practice to insulate monetary policy from political pressure. Critics — from left and right — argue that unelected technocrats making consequential economic decisions creates a democratic deficit. Balancing independence and accountability is a key institutional design question.`,
      fr: `L'indépendance des banques centrales est considérée comme la meilleure pratique pour isoler la politique monétaire des pressions politiques. Les critiques soutiennent que des technocrates non élus prenant des décisions économiques créent un déficit démocratique.`,
    },
  },
  {
    id: `ECO_21`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `Inheritance taxes should be significantly increased to limit the transfer of large fortunes across generations.`,
      fr: `Les droits de succession devraient être significativement augmentés pour limiter le transfert de grandes fortunes entre générations.`,
    },
    direction: -1,
    info: {
      en: `High inheritance taxes are supported by economists like Thomas Piketty as tools against dynastic wealth concentration. Opponents argue they punish aspiration, force asset sales in family businesses, and amount to double taxation. Many countries combine exemptions for small inheritances with higher rates on large ones.`,
      fr: `Les droits de succession élevés sont défendus par des économistes comme Thomas Piketty comme outils contre la concentration dynastique de la richesse. Les opposants soutiennent qu'ils pénalisent l'aspiration et constituent une double imposition.`,
    },
  },
  {
    id: `ECO_22`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `The state should own or control strategically important industries such as energy, railways, and telecommunications.`,
      fr: `L'État devrait posséder ou contrôler les industries stratégiquement importantes telles que l'énergie, les chemins de fer et les télécommunications.`,
    },
    direction: -1,
    info: {
      en: `Strategic state ownership of natural monopolies (railways, utilities) is defended as ensuring affordable universal access and preventing rent extraction. Critics argue state enterprises are inefficient and politically captured. Many countries use regulated private companies as a middle ground.`,
      fr: `La propriété étatique stratégique des monopoles naturels est défendue comme garantissant un accès universel abordable. Les critiques soutiennent que les entreprises d'État sont inefficaces et captées politiquement.`,
    },
  },
  {
    id: `ECO_23`,
    theme: THEMES.ECONOMY,
    priority: 3,
    weight: 1,
    text: {
      en: `Economic growth should take priority over reducing inequality when the two goals conflict.`,
      fr: `La croissance économique devrait primer sur la réduction des inégalités lorsque ces deux objectifs s'opposent.`,
    },
    direction: 1,
    info: {
      en: `The relationship between growth and inequality is contested. "Trickle-down" theory holds that growth eventually benefits all; Keynesian and inequality researchers argue that extreme inequality reduces demand and aggregate growth. The IMF has found that inequality can itself be a drag on sustainable growth.`,
      fr: `La relation entre croissance et inégalités est contestée. La théorie du "ruissellement" soutient que la croissance finit par profiter à tous; les chercheurs en inégalités soutiennent que les inégalités extrêmes réduisent la demande et la croissance.`,
    },
  },

  // ── SOCIAL (extended) ─────────────────────────────────────────────────────
  {
    id: `SOC_16`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Religious symbols and dress should be permitted in all public spaces including government offices and schools.`,
      fr: `Les symboles et vêtements religieux devraient être autorisés dans tous les espaces publics, y compris les bureaux gouvernementaux et les écoles.`,
    },
    direction: 1,
    info: {
      en: `France bans conspicuous religious symbols in public schools and for civil servants; the UK and US take a more permissive approach. The debate involves competing values: secularism and state neutrality on one hand, religious freedom and minority rights on the other.`,
      fr: `La France interdit les signes religieux ostentatoires dans les écoles publiques et pour les fonctionnaires; le Royaume-Uni et les États-Unis adoptent une approche plus permissive. Le débat implique des valeurs concurrentes: laïcité et liberté religieuse.`,
    },
  },
  {
    id: `SOC_17`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Affirmative action policies that give preference to historically marginalised groups are justified to correct past injustices.`,
      fr: `Les politiques de discrimination positive qui donnent la préférence aux groupes historiquement marginalisés sont justifiées pour corriger les injustices passées.`,
    },
    direction: 1,
    info: {
      en: `Affirmative action (positive discrimination) exists in many countries to address structural disadvantage. Proponents argue representation requires active measures; opponents contend it violates merit principles and may stigmatise beneficiaries. The US Supreme Court has significantly limited race-conscious admissions policies.`,
      fr: `La discrimination positive existe dans de nombreux pays pour remédier aux désavantages structurels. Les partisans soutiennent que la représentation nécessite des mesures actives; les opposants soutiennent qu'elle viole les principes du mérite.`,
    },
  },
  {
    id: `SOC_18`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `The state should guarantee the right to assisted dying for terminally ill patients who wish it.`,
      fr: `L'État devrait garantir le droit à l'euthanasie pour les patients en phase terminale qui le souhaitent.`,
    },
    direction: 1,
    info: {
      en: `Assisted dying is legal in the Netherlands, Belgium, Canada, and several US states. Proponents emphasise autonomy and dignity; opponents — often religious — cite sanctity of life and risks to vulnerable people. Palliative care advocates argue better end-of-life care is a more appropriate response to suffering.`,
      fr: `L'aide médicale à mourir est légale aux Pays-Bas, en Belgique, au Canada et dans plusieurs États américains. Les partisans mettent en avant l'autonomie et la dignité; les opposants citent le caractère sacré de la vie.`,
    },
  },
  {
    id: `SOC_19`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Gender is determined by biology and cannot be changed.`,
      fr: `Le genre est déterminé par la biologie et ne peut pas être changé.`,
    },
    direction: -1,
    info: {
      en: `The scientific consensus distinguishes biological sex (chromosomes, hormones, anatomy) from gender identity (one's internal sense of self). Medical organisations including the WHO and APA recognise that gender identity can differ from sex assigned at birth. Legal recognition of gender transitions varies widely across countries.`,
      fr: `Le consensus scientifique distingue le sexe biologique de l'identité de genre. Les organisations médicales dont l'OMS reconnaissent que l'identité de genre peut différer du sexe assigné à la naissance.`,
    },
  },
  {
    id: `SOC_20`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Sex work between consenting adults should be fully decriminalised.`,
      fr: `Le travail du sexe entre adultes consentants devrait être entièrement décriminalisé.`,
    },
    direction: 1,
    info: {
      en: `New Zealand has fully decriminalised sex work; the "Nordic model" criminalises buyers but not sellers; many countries criminalise both. Amnesty International supports full decriminalisation as safer for workers. Feminist perspectives are divided between harm reduction and abolitionist views.`,
      fr: `La Nouvelle-Zélande a entièrement décriminalisé le travail du sexe. Le "modèle nordique" criminalise les acheteurs mais pas les vendeurs. Amnesty International soutient la décriminalisation totale comme plus sûre pour les travailleurs.`,
    },
  },
  {
    id: `SOC_21`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Drug possession for personal use should be decriminalised or treated as a public health issue rather than a criminal one.`,
      fr: `La possession de drogues pour usage personnel devrait être dépénalisée ou traitée comme un problème de santé publique plutôt que comme une affaire criminelle.`,
    },
    direction: 1,
    info: {
      en: `Portugal decriminalised possession of all drugs in 2001 with positive public health outcomes. Switzerland and Canada have adopted harm reduction approaches. Critics worry about increased use and social signals. The "war on drugs" approach has been criticised for mass incarceration and racial disparities.`,
      fr: `Le Portugal a dépénalisé la possession de toutes les drogues en 2001 avec des résultats positifs en matière de santé publique. Les critiques s'inquiètent d'une augmentation de l'usage.`,
    },
  },
  {
    id: `SOC_22`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Freedom of speech must be protected even when it causes offence to religious or minority communities.`,
      fr: `La liberté d'expression doit être protégée même lorsqu'elle offense des communautés religieuses ou minoritaires.`,
    },
    direction: 1,
    info: {
      en: `Free speech debates involve balancing expression against harm. Most democracies prohibit incitement to violence but protect offensive speech short of that threshold. The US First Amendment is the world's most permissive free speech standard. European countries more often balance speech against dignity and social harm.`,
      fr: `Les débats sur la liberté d'expression impliquent d'équilibrer l'expression et le préjudice. La plupart des démocraties interdisent l'incitation à la violence mais protègent les discours offensants.`,
    },
  },
  {
    id: `SOC_23`,
    theme: THEMES.SOCIAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Public schools should provide comprehensive, evidence-based sex education to all students.`,
      fr: `Les écoles publiques devraient dispenser une éducation sexuelle complète et fondée sur des preuves à tous les élèves.`,
    },
    direction: 1,
    info: {
      en: `Comprehensive sex education is associated with lower teen pregnancy rates and better sexual health outcomes. Abstinence-only programmes have not demonstrated effectiveness. Religious communities often object to content they consider incompatible with their values. This remains one of the more culturally contested education policy areas.`,
      fr: `L'éducation sexuelle complète est associée à des taux de grossesse chez les adolescentes plus bas. Les programmes axés uniquement sur l'abstinence n'ont pas démontré leur efficacité.`,
    },
  },

  // ── IMMIGRATION (extended) ────────────────────────────────────────────────
  {
    id: `IMM_16`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Countries have a moral obligation to accept refugees fleeing war or persecution, regardless of their number.`,
      fr: `Les pays ont une obligation morale d'accueillir les réfugiés fuyant la guerre ou la persécution, quel que soit leur nombre.`,
    },
    direction: -1,
    info: {
      en: `The 1951 Refugee Convention creates legal obligations toward asylum seekers. Debates arise around capacity, integration costs, and the distinction between refugees and economic migrants. Some argue obligations must be balanced against social sustainability; others argue they are non-negotiable human rights commitments.`,
      fr: `La Convention de 1951 sur les réfugiés crée des obligations légales envers les demandeurs d'asile. Des débats surgissent autour de la capacité d'accueil, des coûts d'intégration et de la distinction entre réfugiés et migrants économiques.`,
    },
  },
  {
    id: `IMM_17`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Immigration strengthens a country's economy and culture.`,
      fr: `L'immigration renforce l'économie et la culture d'un pays.`,
    },
    direction: -1,
    info: {
      en: `Economic research generally finds that immigration raises overall GDP and fills labour shortages. Cultural impacts are more contested. Some studies find positive effects on innovation; others point to integration challenges in concentrated areas. Effects depend heavily on skills mix, integration policies, and housing supply.`,
      fr: `Les recherches économiques constatent généralement que l'immigration augmente le PIB global et comble les pénuries de main-d'œuvre. Les effets culturels sont plus contestés.`,
    },
  },
  {
    id: `IMM_18`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Undocumented immigrants who have lived and worked in a country for many years should be given a path to citizenship.`,
      fr: `Les immigrants en situation irrégulière qui ont vécu et travaillé dans un pays pendant de nombreuses années devraient se voir offrir une voie vers la citoyenneté.`,
    },
    direction: -1,
    info: {
      en: `Regularisation programmes have been used in Spain, Italy, the US (DACA) and elsewhere. Proponents argue long-term residents are de facto members of society; opponents argue regularisation encourages future illegal immigration ("pull factors"). The practicalities of mass deportation are also contested.`,
      fr: `Des programmes de régularisation ont été utilisés en Espagne, en Italie, aux États-Unis (DACA) et ailleurs. Les partisans soutiennent que les résidents de longue durée sont de facto membres de la société.`,
    },
  },
  {
    id: `IMM_19`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `A country's immigration policy should prioritise cultural compatibility with the host society.`,
      fr: `La politique d'immigration d'un pays devrait accorder la priorité à la compatibilité culturelle avec la société d'accueil.`,
    },
    direction: 1,
    info: {
      en: `Cultural selection criteria are explicitly used by some countries (Australia's historical "White Australia" policy, later abandoned; some European parties' proposals). Human rights law generally prohibits ethnic or religious discrimination in asylum. The debate involves questions of national identity, integration capacity, and the definition of "cultural compatibility".`,
      fr: `Certains pays appliquent des critères de sélection culturelle. Le droit international des droits de l'homme interdit généralement la discrimination ethnique ou religieuse dans l'asile.`,
    },
  },
  {
    id: `IMM_20`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Immigrants should be required to learn the official language of their host country as a condition of residence.`,
      fr: `Les immigrants devraient être tenus d'apprendre la langue officielle de leur pays d'accueil comme condition de résidence.`,
    },
    direction: 1,
    info: {
      en: `Many countries require language proficiency for citizenship (but not residency). Language is seen as central to integration and labour market access. Critics argue mandating it before residence is logistically impractical and penalises those who lack prior access to language education.`,
      fr: `De nombreux pays exigent la maîtrise linguistique pour la citoyenneté. La langue est considérée comme centrale pour l'intégration. Les critiques soutiennent que l'imposer avant la résidence est peu pratique.`,
    },
  },
  {
    id: `IMM_21`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `The European Union should develop a common immigration and asylum policy binding on all member states.`,
      fr: `L'Union européenne devrait développer une politique commune d'immigration et d'asile contraignante pour tous les États membres.`,
    },
    direction: -1,
    info: `The Dublin Regulation has placed disproportionate burden on border states (Greece, Italy). Attempts at mandatory burden-sharing have collapsed due to opposition from Hungary, Poland and others. A common policy would require states to surrender significant sovereignty. A voluntary EU resettlement mechanism has seen limited participation.`,
    info: {
      en: `The Dublin Regulation has placed disproportionate burden on border states. Attempts at mandatory burden-sharing have collapsed due to opposition from Hungary and Poland. A common policy would require states to surrender significant sovereignty.`,
      fr: `Le règlement Dublin a imposé un fardeau disproportionné aux États frontaliers. Les tentatives de partage obligatoire des charges ont échoué en raison de l'opposition de la Hongrie et de la Pologne.`,
    },
  },
  {
    id: `IMM_22`,
    theme: THEMES.IMMIGRATION,
    priority: 3,
    weight: 1,
    text: {
      en: `Strict border controls are an effective and necessary tool for managing immigration.`,
      fr: `Les contrôles stricts aux frontières sont un outil efficace et nécessaire pour gérer l'immigration.`,
    },
    direction: 1,
    info: {
      en: `Physical border barriers (fences, walls) and increased surveillance are championed by many governments. Evidence on their effectiveness is mixed — they can redirect migration flows rather than reduce overall numbers. Critics also raise human rights concerns about "push-backs" and dangerous crossings.`,
      fr: `Les barrières frontalières physiques et la surveillance accrue sont défendues par de nombreux gouvernements. Les données sur leur efficacité sont mitigées — elles peuvent rediriger les flux migratoires plutôt que les réduire.`,
    },
  },

  // ── SECURITY (extended) ───────────────────────────────────────────────────
  {
    id: `SEC_16`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Mass surveillance programmes are an acceptable tool for preventing terrorism even if they compromise privacy.`,
      fr: `Les programmes de surveillance de masse sont un outil acceptable pour prévenir le terrorisme même s'ils compromettent la vie privée.`,
    },
    direction: 1,
    info: {
      en: `Edward Snowden's 2013 revelations exposed mass NSA surveillance. Intelligence agencies argue bulk data collection is essential for identifying terror networks. Civil liberties advocates and courts have found such programmes disproportionate under human rights law. Targeted surveillance with judicial oversight is the alternative model.`,
      fr: `Les révélations d'Edward Snowden en 2013 ont exposé la surveillance de masse de la NSA. Les agences de renseignement soutiennent que la collecte de données en masse est essentielle. Les défenseurs des libertés civiles ont jugé ces programmes disproportionnés.`,
    },
  },
  {
    id: `SEC_17`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `The death penalty should be abolished in all circumstances.`,
      fr: `La peine de mort devrait être abolie dans toutes les circonstances.`,
    },
    direction: -1,
    info: {
      en: `Over 100 countries have abolished the death penalty. The US, China, Iran and Saudi Arabia are among those that retain it. Abolitionists cite irreversibility (innocent people have been executed), racial and socioeconomic disparities in application, and human dignity. Retentionists argue it deters severe crime and reflects justice for extreme offences.`,
      fr: `Plus de 100 pays ont aboli la peine de mort. Les abolitionnistes citent l'irréversibilité, les disparités raciales et socioéconomiques dans son application, et la dignité humaine.`,
    },
  },
  {
    id: `SEC_18`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `The right to bear arms should be protected and not significantly restricted by government.`,
      fr: `Le droit de porter des armes devrait être protégé et non significativement restreint par le gouvernement.`,
    },
    direction: 1,
    info: {
      en: `The Second Amendment is unique among democracies in its broad constitutional protection of civilian gun ownership. Cross-country comparisons show strong correlations between gun ownership rates and gun deaths. The US debate involves constitutional interpretation, individual rights, self-defence, and the role of gun culture in national identity.`,
      fr: `Le Second Amendement est unique parmi les démocraties dans sa large protection constitutionnelle de la possession d'armes civiles. Les comparaisons entre pays montrent de fortes corrélations entre les taux de possession d'armes et les décès par armes à feu.`,
    },
  },
  {
    id: `SEC_19`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `People convicted of terrorist offences should be subject to extended detention beyond normal criminal sentences.`,
      fr: `Les personnes condamnées pour des infractions terroristes devraient être soumises à une détention prolongée au-delà des peines criminelles normales.`,
    },
    direction: 1,
    info: {
      en: `Post-release monitoring and preventive detention of terrorism offenders is used in France, Germany and the UK. Human rights bodies have challenged such measures as double punishment and as incompatible with rehabilitation principles. Governments argue the ongoing threat justifies exceptional measures.`,
      fr: `La surveillance post-libération et la détention préventive des auteurs d'actes terroristes est utilisée en France, en Allemagne et au Royaume-Uni. Les organismes de défense des droits de l'homme ont contesté ces mesures.`,
    },
  },
  {
    id: `SEC_20`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Police should be given broader stop-and-search powers even if this leads to racial profiling.`,
      fr: `La police devrait disposer de pouvoirs de contrôle et de fouille plus larges, même si cela conduit à du profilage racial.`,
    },
    direction: 1,
    info: {
      en: `Racial profiling in stop-and-search is well-documented in the UK, US and France. Evidence on crime-reduction effectiveness is mixed. Courts and equality bodies have found blanket stop powers discriminatory. Targeted intelligence-led policing is presented as a more effective and rights-compatible alternative.`,
      fr: `Le profilage racial dans les contrôles au faciès est bien documenté au Royaume-Uni, aux États-Unis et en France. Les données sur l'efficacité en matière de réduction de la criminalité sont mitigées.`,
    },
  },
  {
    id: `SEC_21`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Whistleblowers who reveal illegal government surveillance or war crimes should be protected from prosecution.`,
      fr: `Les lanceurs d'alerte qui révèlent une surveillance gouvernementale illégale ou des crimes de guerre devraient être protégés contre les poursuites judiciaires.`,
    },
    direction: -1,
    info: {
      en: `Whistleblowers like Snowden and Chelsea Manning face prosecution under espionage laws. Whistleblower protection laws in most countries exclude classified information. The debate involves national security interests, the public's right to know, and the legitimacy of government secrecy.`,
      fr: `Des lanceurs d'alerte comme Snowden et Chelsea Manning font face à des poursuites en vertu des lois sur l'espionnage. Le débat implique des intérêts de sécurité nationale et le droit du public à savoir.`,
    },
  },
  {
    id: `SEC_22`,
    theme: THEMES.SECURITY,
    priority: 3,
    weight: 1,
    text: {
      en: `Strong national defence spending is necessary to ensure a country's security and geopolitical influence.`,
      fr: `Des dépenses importantes en matière de défense nationale sont nécessaires pour assurer la sécurité d'un pays et son influence géopolitique.`,
    },
    direction: 1,
    info: {
      en: `NATO's 2% of GDP target for defence spending is met by few European members. Russia's invasion of Ukraine (2022) prompted defence spending increases across Europe. Critics argue military spending crowds out social investment; others contend that security is a prerequisite for prosperity.`,
      fr: `L'objectif de l'OTAN de 2% du PIB pour les dépenses de défense est atteint par peu de membres européens. L'invasion de l'Ukraine par la Russie a entraîné des augmentations des dépenses de défense à travers l'Europe.`,
    },
  },

  // ── ENVIRONMENT (extended) ────────────────────────────────────────────────
  {
    id: `ENV_16`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Environmental protection should take priority over economic growth when the two conflict.`,
      fr: `La protection de l'environnement devrait primer sur la croissance économique lorsque les deux objectifs s'opposent.`,
    },
    direction: 1,
    info: {
      en: `The tension between environmental and economic goals is a central political fault line. Proponents of ecological limits argue growth on a finite planet is inherently unsustainable. Mainstream economists argue technological innovation and pricing carbon can decouple growth from environmental harm. "Green growth" vs. "degrowth" is an active debate.`,
      fr: `La tension entre objectifs environnementaux et économiques est une ligne de fracture politique centrale. Les partisans des limites écologiques soutiennent que la croissance sur une planète finie est intrinsèquement insoutenable.`,
    },
  },
  {
    id: `ENV_17`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Nuclear energy should be part of a country's strategy to address climate change.`,
      fr: `L'énergie nucléaire devrait faire partie de la stratégie d'un pays pour lutter contre le changement climatique.`,
    },
    direction: 1,
    info: {
      en: `Nuclear power produces very low CO2 emissions and provides reliable baseload power. Critics cite accident risks (Chernobyl, Fukushima), radioactive waste storage, high construction costs, and long build times. France generates about 70% of electricity from nuclear; Germany closed its last plants in 2023. The IPCC includes nuclear as a potential low-carbon option.`,
      fr: `L'énergie nucléaire produit très peu d'émissions de CO2 et fournit une puissance de base fiable. Les critiques citent les risques d'accidents, le stockage des déchets radioactifs et les coûts élevés de construction.`,
    },
  },
  {
    id: `ENV_18`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `A carbon tax is the most effective tool for reducing greenhouse gas emissions.`,
      fr: `Une taxe carbone est l'outil le plus efficace pour réduire les émissions de gaz à effet de serre.`,
    },
    direction: 1,
    info: {
      en: `Economists broadly support carbon pricing as efficient and technology-neutral. British Columbia and Sweden have implemented carbon taxes with positive results. The "yellow vest" protests in France showed that carbon taxes can be regressive if not paired with redistribution. Cap-and-trade systems (like the EU ETS) are an alternative market mechanism.`,
      fr: `Les économistes soutiennent largement la tarification du carbone comme efficace et technologiquement neutre. Les manifestations des "gilets jaunes" en France ont montré que les taxes carbone peuvent être régressives sans redistribution.`,
    },
  },
  {
    id: `ENV_19`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Meat consumption should be significantly reduced through taxation or regulation to address climate change.`,
      fr: `La consommation de viande devrait être significativement réduite par la taxation ou la réglementation pour lutter contre le changement climatique.`,
    },
    direction: 1,
    info: {
      en: `Livestock agriculture accounts for approximately 14.5% of global greenhouse gas emissions (FAO). A meat tax is supported by some environmentalists and health economists. Opposition comes from farming communities, cultural arguments, and concerns about food sovereignty. Behavioural change vs. regulatory intervention is the central debate.`,
      fr: `L'agriculture d'élevage représente environ 14,5% des émissions mondiales de gaz à effet de serre. Une taxe sur la viande est soutenue par certains environnementalistes et économistes de la santé.`,
    },
  },
  {
    id: `ENV_20`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Rich countries have a moral obligation to pay climate reparations to developing countries most affected by climate change.`,
      fr: `Les pays riches ont une obligation morale de verser des réparations climatiques aux pays en développement les plus touchés par le changement climatique.`,
    },
    direction: 1,
    info: {
      en: `The "loss and damage" fund agreed at COP27 acknowledges that historically high-emitting countries bear responsibility for climate impacts on vulnerable nations. Developed countries have largely failed to deliver the $100bn annual climate finance promised in 2009. This is one of the most contested areas of international climate negotiations.`,
      fr: `Le fonds "pertes et préjudices" convenu à la COP27 reconnaît que les pays historiquement gros émetteurs sont responsables des impacts climatiques sur les nations vulnérables.`,
    },
  },
  {
    id: `ENV_21`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Protecting biodiversity should be treated as urgently as addressing climate change.`,
      fr: `La protection de la biodiversité devrait être traitée avec la même urgence que la lutte contre le changement climatique.`,
    },
    direction: 1,
    info: {
      en: `The IPBES (the biodiversity equivalent of the IPCC) warns that one million species face extinction. Habitat loss, pesticides, and climate change are the main drivers. The Kunming-Montreal Global Biodiversity Framework (2022) set targets to protect 30% of land and sea by 2030. Biodiversity receives far less political attention and funding than climate change.`,
      fr: `L'IPBES avertit qu'un million d'espèces risquent l'extinction. Le Cadre mondial pour la biodiversité de Kunming-Montréal (2022) a fixé des objectifs pour protéger 30% des terres et des mers d'ici 2030.`,
    },
  },
  {
    id: `ENV_22`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Private car ownership should be discouraged through taxation and urban planning in favour of public transport.`,
      fr: `La possession d'une voiture particulière devrait être découragée par la fiscalité et l'urbanisme au profit des transports en commun.`,
    },
    direction: 1,
    info: {
      en: `Transport is a major emissions sector. Cities from Amsterdam to Bogotá have reduced car dependency through investment in public transit, cycling infrastructure, and congestion charges. Car culture remains deeply embedded in many societies, and rural residents often lack alternatives. Equity concerns arise around the cost of transition.`,
      fr: `Les transports sont un secteur d'émissions majeur. Des villes d'Amsterdam à Bogotá ont réduit la dépendance à la voiture. La culture automobile reste profondément ancrée et les résidents ruraux manquent souvent d'alternatives.`,
    },
  },
  {
    id: `ENV_23`,
    theme: THEMES.ENVIRONMENT,
    priority: 3,
    weight: 1,
    text: {
      en: `Economic degrowth — deliberately reducing GDP — is necessary to achieve environmental sustainability.`,
      fr: `La décroissance économique — réduire délibérément le PIB — est nécessaire pour atteindre la durabilité environnementale.`,
    },
    direction: 1,
    info: {
      en: `Degrowth theory argues that material throughput must decline in wealthy countries to stay within planetary boundaries. Mainstream economists dispute this, arguing green innovation and decoupling are sufficient. Degrowth advocates question whether capitalism is compatible with ecological limits.`,
      fr: `La théorie de la décroissance soutient que le débit matériel doit diminuer dans les pays riches pour rester dans les limites planétaires. Les économistes dominants contestent cela, soutenant que l'innovation verte et le découplage sont suffisants.`,
    },
  },

  // ── DEMOCRACY (extended) ─────────────────────────────────────────────────
  {
    id: `DEM_16`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Judges and courts should have the power to strike down laws passed by elected parliaments.`,
      fr: `Les juges et les tribunaux devraient avoir le pouvoir d'annuler les lois adoptées par des parlements élus.`,
    },
    direction: 1,
    info: {
      en: `Judicial review of legislation is standard in most constitutional democracies (US Supreme Court, French Conseil Constitutionnel, German Bundesverfassungsgericht). Populists argue it gives unelected judges too much power; liberals argue it protects rights from majority tyranny. The scope of judicial review is a key separation-of-powers question.`,
      fr: `Le contrôle judiciaire de la législation est standard dans la plupart des démocraties constitutionnelles. Les populistes soutiennent qu'il donne trop de pouvoir aux juges non élus; les libéraux soutiennent qu'il protège les droits contre la tyrannie de la majorité.`,
    },
  },
  {
    id: `DEM_17`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Voting should be mandatory for all eligible citizens.`,
      fr: `Le vote devrait être obligatoire pour tous les citoyens éligibles.`,
    },
    direction: 1,
    info: {
      en: `About 30 countries have compulsory voting, including Australia and Belgium, with generally higher turnout and more representative electorate. Opponents argue it compels participation in something that should be voluntary, and may produce less thoughtful votes. "None of the above" options are sometimes offered as a compromise.`,
      fr: `Environ 30 pays ont le vote obligatoire, dont l'Australie et la Belgique, avec généralement une participation plus élevée. Les opposants soutiennent que cela contraint à la participation dans quelque chose qui devrait être volontaire.`,
    },
  },
  {
    id: `DEM_18`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Citizens should be able to directly vote on major policy decisions through referendums.`,
      fr: `Les citoyens devraient pouvoir voter directement sur les grandes décisions politiques par le biais de référendums.`,
    },
    direction: 1,
    info: {
      en: `Direct democracy via referendums is used frequently in Switzerland and California. Critics argue complex policies are reduced to binary yes/no choices, vulnerable to manipulation and emotionally charged campaigns (as Brexit demonstrated). Representative democracy proponents argue elected officials are better positioned to make nuanced policy judgements.`,
      fr: `La démocratie directe via des référendums est fréquemment utilisée en Suisse et en Californie. Les critiques soutiennent que des politiques complexes sont réduites à des choix binaires, vulnérables à la manipulation (comme le Brexit l'a démontré).`,
    },
  },
  {
    id: `DEM_19`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Political parties should be publicly funded to reduce dependence on private donors and corporate interests.`,
      fr: `Les partis politiques devraient être financés publiquement pour réduire la dépendance envers les donateurs privés et les intérêts des entreprises.`,
    },
    direction: 1,
    info: {
      en: `Most European democracies have significant public party funding alongside strict donation limits. The US system is dominated by private and corporate money, especially after Citizens United (2010). Public funding aims to level the field; critics argue it forces taxpayers to fund parties they oppose.`,
      fr: `La plupart des démocraties européennes ont un financement public significatif des partis avec des limites strictes sur les dons. Le système américain est dominé par l'argent privé et des entreprises.`,
    },
  },
  {
    id: `DEM_20`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `The media has too much power to shape public opinion and should be more strictly regulated.`,
      fr: `Les médias ont trop de pouvoir pour façonner l'opinion publique et devraient être plus strictement réglementés.`,
    },
    direction: -1,
    info: {
      en: `Media regulation involves balancing press freedom against accuracy, pluralism, and democratic health. Concerns about concentrated media ownership, disinformation, and social media algorithms are widespread. Heavy media regulation risks state capture of information; light regulation allows commercial and political distortion. Most democracies maintain some public broadcasting.`,
      fr: `La réglementation des médias implique d'équilibrer la liberté de la presse avec la précision, le pluralisme et la santé démocratique. Les préoccupations concernant la propriété concentrée des médias et la désinformation sont répandues.`,
    },
  },
  {
    id: `DEM_21`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Elected governments should have the power to remove judges who make rulings that conflict with the will of the democratic majority.`,
      fr: `Les gouvernements élus devraient avoir le pouvoir de révoquer les juges qui rendent des décisions contraires à la volonté de la majorité démocratique.`,
    },
    direction: -1,
    info: {
      en: `Judicial independence from elected governments is a pillar of liberal democracy and the rule of law. Hungary and Poland have undermined it under the guise of democratic reform. Courts that defer to electoral majorities cannot protect minority rights or enforce constitutional limits on power. Most democracies give judges long tenure to insulate them from political pressure.`,
      fr: `L'indépendance judiciaire vis-à-vis des gouvernements élus est un pilier de la démocratie libérale et de l'État de droit. La Hongrie et la Pologne l'ont sapée sous prétexte de réforme démocratique.`,
    },
  },
  {
    id: `DEM_22`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `Social media platforms should be held legally responsible for the content they host and amplify.`,
      fr: `Les plateformes de médias sociaux devraient être légalement responsables du contenu qu'elles hébergent et amplifient.`,
    },
    direction: 1,
    info: {
      en: `Section 230 of the US Communications Decency Act shields platforms from liability for user content. The EU's Digital Services Act (2022) imposes more obligations on large platforms. Holding platforms liable could incentivise over-removal of speech; current immunity incentivises engagement-maximising algorithms regardless of harm.`,
      fr: `La Section 230 américaine protège les plateformes de la responsabilité pour le contenu des utilisateurs. La Loi sur les services numériques de l'UE (2022) impose plus d'obligations aux grandes plateformes.`,
    },
  },
  {
    id: `DEM_23`,
    theme: THEMES.DEMOCRACY,
    priority: 3,
    weight: 1,
    text: {
      en: `International institutions (UN, WTO, ICC) should have stronger powers to enforce their decisions on member states.`,
      fr: `Les institutions internationales (ONU, OMC, CPI) devraient avoir des pouvoirs plus forts pour faire respecter leurs décisions par les États membres.`,
    },
    direction: 1,
    info: {
      en: `International law depends largely on voluntary compliance and lacks enforcement mechanisms comparable to domestic law. Strengthening supranational institutions involves surrendering national sovereignty. Multilateralists argue it is necessary for addressing global challenges; sovereignists argue it undermines democratic self-determination.`,
      fr: `Le droit international dépend largement de la conformité volontaire. Renforcer les institutions supranationales implique de céder la souveraineté nationale. Les multilatéralistes soutiennent que c'est nécessaire pour relever les défis mondiaux.`,
    },
  },

  // ── GLOBAL (extended) ─────────────────────────────────────────────────────
  {
    id: `GLO_16`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Countries should prioritise national self-sufficiency in strategic goods like food, energy, and medicines.`,
      fr: `Les pays devraient prioriser l'autosuffisance nationale dans les biens stratégiques comme la nourriture, l'énergie et les médicaments.`,
    },
    direction: 1,
    info: {
      en: `The Covid-19 pandemic and Ukraine war exposed vulnerabilities from global supply chains. "Reshoring" and strategic autonomy have become bipartisan concerns. Economists worry about efficiency losses from deglobalisation; security advocates argue resilience outweighs cost. "Friend-shoring" — moving supply chains to allied countries — is a middle approach.`,
      fr: `La pandémie de Covid-19 et la guerre en Ukraine ont exposé les vulnérabilités des chaînes d'approvisionnement mondiales. Les économistes s'inquiètent des pertes d'efficacité de la déglobalisation.`,
    },
  },
  {
    id: `GLO_17`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Countries should reduce their military alliances and pursue a policy of neutrality.`,
      fr: `Les pays devraient réduire leurs alliances militaires et poursuivre une politique de neutralité.`,
    },
    direction: 1,
    info: {
      en: `NATO has expanded significantly since the Cold War. Russia's invasion of Ukraine prompted Finland and Sweden to join. Critics of military alliances argue they entrench bloc thinking and extend great power competition. Proponents argue collective defence deters aggression and reduces free-rider problems.`,
      fr: `L'OTAN s'est considérablement élargie depuis la Guerre froide. L'invasion de l'Ukraine par la Russie a poussé la Finlande et la Suède à rejoindre l'Alliance. Les critiques des alliances militaires soutiennent qu'elles entretiennent la pensée de blocs.`,
    },
  },
  {
    id: `GLO_18`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Countries should be willing to use military force to protect human rights in other nations.`,
      fr: `Les pays devraient être prêts à utiliser la force militaire pour protéger les droits de l'homme dans d'autres nations.`,
    },
    direction: -1,
    info: {
      en: `The "Responsibility to Protect" (R2P) doctrine authorises international intervention to prevent genocide. But interventions in Iraq and Libya damaged its credibility. Non-interventionists emphasise sovereignty; interventionists emphasise universal human rights. The UN Security Council veto often blocks authorised action.`,
      fr: `La doctrine de la "Responsabilité de protéger" (R2P) autorise l'intervention internationale pour prévenir le génocide. Mais les interventions en Irak et en Libye ont endommagé sa crédibilité.`,
    },
  },
  {
    id: `GLO_19`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Rich countries should increase foreign aid to at least 0.7% of GNI as agreed at the UN.`,
      fr: `Les pays riches devraient augmenter l'aide étrangère à au moins 0,7% du RNB comme convenu à l'ONU.`,
    },
    direction: -1,
    info: {
      en: `The 0.7% UN target for official development assistance has been met consistently by only five countries: Sweden, Norway, Luxembourg, Denmark and the UK (until 2021). Development aid is criticised as creating dependency and serving donor interests. Proponents argue it is a moral obligation given historical exploitation.`,
      fr: `L'objectif de 0,7% de l'ONU n'a été atteint en permanence que par cinq pays. L'aide au développement est critiquée comme créant de la dépendance et servant les intérêts des donateurs.`,
    },
  },
  {
    id: `GLO_20`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `Countries should impose economic sanctions on states that violate human rights or international law.`,
      fr: `Les pays devraient imposer des sanctions économiques aux États qui violent les droits de l'homme ou le droit international.`,
    },
    direction: -1,
    info: {
      en: `Economic sanctions are a tool of statecraft used against Russia, Iran, North Korea, and others. Evidence on their effectiveness is mixed — they rarely cause regime change and often harm civilian populations. "Smart sanctions" targeting elites are considered more effective than broad economic embargoes.`,
      fr: `Les sanctions économiques sont un outil de la diplomatie utilisé contre la Russie, l'Iran, la Corée du Nord et d'autres. Les données sur leur efficacité sont mitigées — elles provoquent rarement un changement de régime et nuisent souvent aux populations civiles.`,
    },
  },
  {
    id: `GLO_21`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `European integration should be deepened with more powers transferred to EU institutions.`,
      fr: `L'intégration européenne devrait être approfondie avec plus de pouvoirs transférés aux institutions de l'UE.`,
    },
    direction: -1,
    info: {
      en: `The EU debate involves balancing efficiency of supranational governance against democratic legitimacy and national sovereignty. Federalists argue deeper integration is necessary to address common challenges; Eurosceptics argue the EU lacks democratic accountability and has overstepped into areas best governed nationally.`,
      fr: `Le débat sur l'UE implique d'équilibrer l'efficacité de la gouvernance supranationale et la légitimité démocratique. Les fédéralistes soutiennent qu'une intégration plus poussée est nécessaire; les eurosceptiques soutiennent que l'UE manque de responsabilité démocratique.`,
    },
  },
  {
    id: `GLO_22`,
    theme: THEMES.GLOBAL,
    priority: 3,
    weight: 1,
    text: {
      en: `National culture and traditions must be actively protected from the homogenising effects of globalisation.`,
      fr: `La culture et les traditions nationales doivent être activement protégées des effets homogénéisants de la mondialisation.`,
    },
    direction: 1,
    info: {
      en: `Cultural protectionism is embedded in French policy (quotas on foreign films, language laws). UNESCO's Convention on Cultural Diversity supports states' right to protect cultural industries. Opponents argue cultural exchange and mixing is historically normal and enriching, and that protectionism serves nationalist agendas.`,
      fr: `Le protectionnisme culturel est inscrit dans la politique française (quotas sur les films étrangers, lois linguistiques). La Convention de l'UNESCO sur la diversité culturelle soutient le droit des États à protéger leurs industries culturelles.`,
    },
  },

  // ── PUBLIC SERVICES (extended) ────────────────────────────────────────────
  {
    id: `PUB_16`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `A universal basic income (UBI) should replace means-tested welfare programmes.`,
      fr: `Un revenu universel de base (RUB) devrait remplacer les programmes d'aide sociale sous conditions de ressources.`,
    },
    direction: 1,
    info: {
      en: `UBI pilots in Finland, Kenya, Stockton (USA) and elsewhere show improved wellbeing without major work disincentives. Critics on the left worry UBI would be used to justify dismantling targeted welfare; those on the right object to cost and work disincentives. Automation arguments have renewed interest in UBI.`,
      fr: `Des pilotes de RUB en Finlande, au Kenya et aux États-Unis montrent un bien-être amélioré sans désincitatifs majeurs au travail. Les critiques de gauche s'inquiètent que le RUB soit utilisé pour justifier le démantèlement de l'aide sociale ciblée.`,
    },
  },
  {
    id: `PUB_17`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `Private companies should not be allowed to profit from delivering essential public services such as prisons, water, or probation.`,
      fr: `Les entreprises privées ne devraient pas être autorisées à tirer profit de la fourniture de services publics essentiels tels que les prisons, l'eau ou la probation.`,
    },
    direction: 1,
    info: {
      en: `Privatisation of prisons is common in the US and UK. Water privatisation in England has generated controversy over dividends and sewage discharges. Public service advocates argue profit incentives are incompatible with public interest obligations; proponents argue private management improves efficiency.`,
      fr: `La privatisation des prisons est courante aux États-Unis et au Royaume-Uni. La privatisation de l'eau en Angleterre a suscité des controverses. Les défenseurs des services publics soutiennent que les incitations au profit sont incompatibles avec les obligations d'intérêt public.`,
    },
  },
  {
    id: `PUB_18`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `University education should be free for all students, funded through general taxation.`,
      fr: `L'enseignement universitaire devrait être gratuit pour tous les étudiants, financé par l'impôt général.`,
    },
    direction: 1,
    info: {
      en: `Free university education exists in Germany, Norway and (until 2017) Scotland. England charges up to £9,250/year. The US has among the world's highest tuition fees. Arguments for free education cite equality of opportunity; arguments for tuition fees cite personal benefit, fiscal cost, and the regressive nature of subsidising those who will earn more.`,
      fr: `L'enseignement universitaire gratuit existe en Allemagne et en Norvège. Les arguments en faveur de l'éducation gratuite citent l'égalité des chances; les arguments en faveur des frais de scolarité citent le bénéfice personnel et le coût fiscal.`,
    },
  },
  {
    id: `PUB_19`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `Pension entitlements should not be reduced even if public finances require difficult choices.`,
      fr: `Les droits à la retraite ne devraient pas être réduits, même si les finances publiques nécessitent des choix difficiles.`,
    },
    direction: 1,
    info: {
      en: `Pension reform is one of the most politically explosive issues in ageing societies. France's 2023 pension age increase to 64 triggered mass protests. Fiscal pressures from ageing populations put pension sustainability at the centre of long-term budget debates. Intergenerational equity arguments point in different directions.`,
      fr: `La réforme des retraites est l'un des sujets les plus explosifs politiquement dans les sociétés vieillissantes. Le relèvement de l'âge de la retraite en France à 64 ans en 2023 a déclenché des manifestations massives.`,
    },
  },
  {
    id: `PUB_20`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `The state should invest heavily in affordable housing to address the housing crisis.`,
      fr: `L'État devrait investir massivement dans le logement abordable pour résoudre la crise du logement.`,
    },
    direction: 1,
    info: {
      en: `Housing affordability has deteriorated sharply in major cities globally. Public housing programmes were central in post-war European welfare states but were reduced from the 1980s. Vienna's social housing is often cited as a successful model. Critics argue supply deregulation (planning reform) is a more effective solution than public construction.`,
      fr: `L'accessibilité au logement s'est fortement détériorée dans les grandes villes mondiales. Les programmes de logement social étaient centraux dans les États-providence européens d'après-guerre. Le logement social de Vienne est souvent cité comme un modèle réussi.`,
    },
  },
  {
    id: `PUB_21`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `Mental health services should receive the same funding priority as physical health services.`,
      fr: `Les services de santé mentale devraient recevoir la même priorité de financement que les services de santé physique.`,
    },
    direction: 1,
    info: {
      en: `Mental illness accounts for a substantial share of disease burden but receives disproportionately less funding than physical health. "Parity of esteem" is policy in several countries but poorly implemented. Mental health investment shows strong economic returns through reduced disability, unemployment, and incarceration.`,
      fr: `Les maladies mentales représentent une part substantielle du fardeau des maladies mais reçoivent proportionnellement moins de financement. La "parité d'estime" est la politique dans plusieurs pays mais mal mise en œuvre.`,
    },
  },
  {
    id: `PUB_22`,
    theme: THEMES.PUBLIC_SERVICES,
    priority: 3,
    weight: 1,
    text: {
      en: `Governments should provide free, high-quality childcare from birth to school age.`,
      fr: `Les gouvernements devraient fournir une garde d'enfants gratuite et de haute qualité de la naissance jusqu'à l'âge scolaire.`,
    },
    direction: 1,
    info: {
      en: `Universal childcare enables maternal employment, reduces child poverty, and has long-term educational benefits. France's crèche system and Nordic universal childcare are often cited as models. In the US and UK, childcare costs are among the highest in the OECD as a share of family income, acting as a significant barrier to women's workforce participation.`,
      fr: `La garde d'enfants universelle permet l'emploi maternel, réduit la pauvreté infantile et a des avantages éducatifs à long terme. Les coûts de garde d'enfants aux États-Unis et au Royaume-Uni sont parmi les plus élevés de l'OCDE en proportion du revenu familial.`,
    },
  },

];

// Select questions for each test length
export function getQuestionQueue(mode, priorityOrder) {
  const byTheme = {};
  THEMES_ORDER.forEach(t => { byTheme[t] = []; });

  questions.forEach(q => {
    byTheme[q.theme].push(q);
  });

  let questionsPerTheme;
  if (mode === 'quick')  questionsPerTheme = 2;
  if (mode === 'medium') questionsPerTheme = 7;
  if (mode === 'full')   questionsPerTheme = 15;

  // Fisher-Yates shuffle helper
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Sort by priority then shuffle within each priority group for variety across sessions
  THEMES_ORDER.forEach(t => {
    byTheme[t].sort((a, b) => a.priority - b.priority);
    const groups = [];
    let i = 0;
    while (i < byTheme[t].length) {
      let j = i;
      while (j < byTheme[t].length && byTheme[t][j].priority === byTheme[t][i].priority) j++;
      groups.push(...shuffle(byTheme[t].slice(i, j)));
      i = j;
    }
    byTheme[t] = groups.slice(0, questionsPerTheme);
  });

  // Interleave themes based on priority order (round-robin)
  const queue = [];
  const maxRounds = questionsPerTheme;
  for (let round = 0; round < maxRounds; round++) {
    const themeOrder = priorityOrder && priorityOrder.length === THEMES_ORDER.length
      ? priorityOrder
      : THEMES_ORDER;
    themeOrder.forEach(theme => {
      if (byTheme[theme] && byTheme[theme][round]) {
        queue.push(byTheme[theme][round]);
      }
    });
  }

  return queue;
}

export const THEMES_ORDER = [
  THEMES.ECONOMY,
  THEMES.SOCIAL,
  THEMES.IMMIGRATION,
  THEMES.SECURITY,
  THEMES.ENVIRONMENT,
  THEMES.DEMOCRACY,
  THEMES.GLOBAL,
  THEMES.PUBLIC_SERVICES,
];

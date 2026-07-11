# 17 — Synthèse des lots éditoriaux (audit exhaustif des 162 questions actives)

Table de synthèse compacte, mise à jour à chaque lot. Pas de rapport individuel long par question — le détail (texte exact avant/après, justification) est dans le diff git de chaque commit.

Méthode appliquée à chaque question : test de compréhension immédiate, compatibilité avec l'échelle 5 points, simulation de 5 profils-types, lecture à voix haute (français naturel), neutralité (grille du brief), unicité de la proposition (pas de "et"/"ou" cumulatif). Explications vérifiées contre le standard en 5 parties (contexte / changement proposé / arguments pour / arguments contre / nuances) quand pertinent à la longueur cible.

Légende « Degré » : **Mineur** = wording/factuel, sens inchangé · **Modéré** = reformulation pour clarté/neutralité/unicité, sens préservé · **Majeur** = changement méthodologique (direction de score modifiée), committé séparément avec test de monotonie dédié.

---

## Lot 1/8 — Économie, fiscalité, travail (ECONOMY)

24 questions actives revues (aucun doublon dans ce thème). 13 jugées conformes sans modification (ECO_1, 3, 8, 10, 14, 15, 16, 17, 19, 20, 21, 22, 23, 24 — note : ECO_20 déclenche un faux positif du lint `EXPL_ECHOES_QUESTION`, vérifié manuellement, aucune action requise). 11 modifiées :

| ID | Ancienne formulation | Nouvelle formulation | Raison principale | Explication modifiée | Degré | Validation factuelle |
|---|---|---|---|---|---|---|
| ECO_2 | *(texte inchangé)* | *(texte inchangé)* | Chiffre SMIC obsolète (« environ 1 800 € », 2024) | Oui | Mineur | Effectuée — SMIC = 1 867 €/mois brut depuis juin 2026 |
| ECO_4 | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique (aucun argument contra) | Oui | Mineur | N/A (argument de principe, pas de fait chiffré) |
| ECO_5 | *(texte inchangé)* | *(texte inchangé)* | Dette publique obsolète (« plus de 3 000 Md€ ») | Oui | Mineur | Effectuée — dette publique > 3 500 Md€ |
| ECO_6 | « Les syndicats et la négociation collective doivent être renforcés. » | « Les syndicats doivent avoir davantage de pouvoir dans les entreprises. » | Double proposition (syndicats + négociation collective = deux notions distinctes) | Oui (clarifiée) | Modéré | N/A |
| ECO_7 | « Le libre-échange est bon pour la France. » | « La France devrait conclure davantage d'accords de libre-échange. » | Jugement de valeur global (« est bon ») plutôt qu'une mesure concrète évaluable | Oui (clarifiée) | Modéré | N/A |
| ECO_9 | « La Bourse et les banques doivent être strictement réglementées. » | « Le secteur financier (banques, marchés boursiers) doit être strictement réglementé. » | Double sujet nominal ramené à un seul secteur désigné | Oui (clarifiée) | Mineur | N/A |
| ECO_11 | *(texte inchangé)* | *(texte inchangé)* | Dette et charge d'intérêts obsolètes (« 3 100 Md€ », pas de chiffre pour les intérêts) | Oui | Mineur | Effectuée — dette > 3 500 Md€, charge d'intérêts > 77 Md€/an |
| ECO_12 | « Les géants de la tech (Google, Amazon) doivent être démantelés. » | « Les grandes entreprises technologiques en position dominante doivent être démantelées. » | Nommer deux entreprises précises crée un biais et une dépendance à l'actualité ; généralisation au critère pertinent | Oui (clarifiée) | Modéré | N/A |
| **ECO_13** | « L'économie des plateformes (Uber, Deliveroo...) **ne doit pas être** soumise à des réglementations **supplémentaires**. » | « L'économie des plateformes (Uber, Deliveroo...) **doit être davantage réglementée** pour protéger les travailleurs indépendants. » | Double négation rendant le sens de l'accord/désaccord contre-intuitif (règle F du brief) | Oui (reformulée avec argument contra explicite) | **Majeur — bascule de polarité.** `DIRECTION_MAP.ECO_13` inversé (1 → -1) dans `src/data/questions.js` pour que l'accord continue de pousser le thème ECONOMY vers le pôle statiste, comme avant la reformulation. | Vérifiée mathématiquement par script dédié : ECO_13=5 → ECONOMY=47 ; ECO_13=1 → ECONOMY=53 (PASS). Test de monotonie global re-exécuté : 107 questions direction=1 (contre 108 avant), 0 violation. |
| ECO_18 | « Les grandes entreprises dominent trop la politique française. » | « Le lobbying des grandes entreprises doit être davantage encadré par la loi. » | Présuppose sa propre conclusion (« dominent trop ») au lieu de proposer une mesure vérifiable | Oui (clarifiée) | Modéré | N/A |
| ECO_25 | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique (aucun argument contra) | Oui | Mineur | N/A (argument de principe) |

**Tests exécutés** : `test1-determinism` PASS, `test2-order-independence` PASS, `test3-nan-zero-weights-regression` PASS, `test4-monotonicity` PASS (107 questions direction=1, 0 violation). `node scripts/lint-questions.mjs ECONOMY` → 1 signalement (faux positif connu, ECO_20). `JSON.parse` sur `questions_final.json` → 200 entrées valides. `npm run build` → succès (1.90s, avertissement de taille de chunk préexistant, non lié).

**Vérification produit réelle** : questionnaire ouvert dans le navigateur (viewport mobile 375×812, serveur de dev local). Confirmé : rendu du thème/texte de question, wrapping propre des questions longues (ex. « Qui peut entrer, rester, devenir français ? Frontières, intégration, identité nationale. »), ouverture du panneau « Comprendre cet enjeu » sans chevauchement une fois l'animation stabilisée, boutons de réponse 1–5 lisibles et fonctionnels, avancement automatique après réponse, bannières de transition thématique. Données de test effacées du `localStorage` et serveur de dev arrêté après vérification.

**Commits** : un commit éditorial (10 questions, wording/explications, sens préservé) + un commit méthodologique séparé (ECO_13, bascule de polarité + test).

---

## Lot 2/8 — Protection sociale, santé, services publics (PUBLIC_SERVICES)

20 questions actives revues (5 entrées `isDuplicate` supplémentaires vérifiées : PUB_16/18/20/21/22 sont des stubs vides — `text:""`, `explanation:null` — sans contenu propre à évaluer ; correctement filtrées de la file active, aucune action nécessaire). 9 jugées conformes sans modification (PUB_7, 10, 11, 13, 14, 16, 19, 20, 21, 22, 24 — hors stubs). 11 modifiées, dont 3 corrigées une seconde fois après un passage du lint (PUB_8, PUB_12, PUB_17) :

| ID | Ancienne formulation | Nouvelle formulation | Raison principale | Explication modifiée | Degré | Validation factuelle |
|---|---|---|---|---|---|---|
| PUB_1 | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique (aucun argument contra) | Oui | Mineur | N/A (argument de principe) |
| PUB_2 | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique (aucun argument contra) | Oui | Mineur | N/A (argument de principe) |
| PUB_3 | « Les entreprises privées doivent pouvoir concurrencer la santé et l'éducation publiques. » | « Les services publics comme la santé ou l'éducation doivent être ouverts à la concurrence du secteur privé. » | Double sujet (santé ET éducation) généralisé en une catégorie unique avec exemples ; explication aussi rééquilibrée (ajout d'un argument pour) | Oui (rééquilibrée) | Modéré | N/A |
| PUB_4 | « Le système de retraite par répartition doit être renforcé. » | « Le système de retraite français doit rester exclusivement par répartition, sans aucune part de capitalisation. » | Verbe vague (« renforcé » ne précise pas l'action) rendu explicite sur l'axe réel du débat (répartition vs capitalisation) | Oui (clarifiée) | Modéré | N/A (claim structurel, pas un chiffre) |
| PUB_5 | « Les frais d'inscription à l'université doivent être supprimés **ou** très fortement réduits. » | « Les frais d'inscription à l'université doivent être fortement réduits. » | Double proposition (abolition OU forte réduction) redondante avec PUB_23 (CORE, gratuité totale) ; les deux questions couvrent désormais des intensités distinctes et non ambiguës | Oui (chiffres mis à jour, recentrée sur la réduction) | Modéré | Effectuée — frais nationaux 2026-2027 ≈ 280-500 €/an (droits + CVEC) |
| PUB_6 | *(texte inchangé)* | *(texte inchangé)* | Chiffres obsolètes (« ~2M logements manquants », « délais >10 ans dans les grandes villes » — non sourcé et surestimé face au délai médian réel) | Oui | Mineur | Effectuée — 2,94M ménages en attente (T1 2026), délai médian 30,4 mois |
| PUB_8 | « L'État doit **maintenir et** augmenter ses subventions... » | « L'État doit augmenter ses subventions... » | Conjonction redondante (« maintenir et augmenter » — augmenter inclut déjà maintenir) signalée par le lint (`Q_MULTI_ET`) | Non | Mineur | N/A |
| PUB_9 | *(texte inchangé)* | *(texte inchangé)* | Chiffre de pénurie de crèches à mettre à jour | Oui | Mineur | Effectuée (confiance modérée — cf. sources.json, variance méthodologique connue) — ≈200 000 places manquantes (vs. 400 000 précédemment) |
| PUB_12 | « ...gratuits **ou quasi-gratuits**... » | « ...gratuits... » | Cohérence avec le traitement de PUB_5 (retrait de la double intensité « X ou quasi-X ») signalé par le lint (`Q_HAS_OU`) | Non | Mineur | N/A |
| PUB_15 | « Limiter l'**accès** aux soins coûteux **est acceptable** pour les finances publiques. » | « Limiter le **remboursement** de certains soins très coûteux **est nécessaire** pour préserver l'équilibre des finances publiques. » | « Accès » vague (physique ? assurantiel ?) remplacé par « remboursement », le mécanisme concret déjà cité dans l'explication ; explication rééquilibrée avec un contre-argument explicite | Oui (rééquilibrée) | Modéré | N/A |
| PUB_17 | « ...(eau, l'électricité et la santé)... » *(dépassait 20 mots)* | « ...(eau, électricité, santé)... » *(19 mots)* | Format resserré (parenthèses vs. liste en « et ») pour respecter la cible de longueur, signalé par le lint (`Q_TOO_LONG`) ; explication aussi rééquilibrée (ajout d'un argument pour la gestion privée) | Oui (rééquilibrée) | Mineur | N/A |
| PUB_23 *(CORE)* | *(texte inchangé)* | *(texte inchangé)* | Chiffres obsolets + absence d'une nuance significative (frais différenciés hors UE) | Oui | Modéré (ajout factuel important) | Effectuée — frais nationaux ≈280-500 €/an ; frais hors UE ≈2 895-3 941 €/an depuis un décret du 19 mai 2026 |
| PUB_25 | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique (aucun argument contra) | Oui | Mineur | N/A (argument de principe) |

**Faux positif de lint confirmé** : PUB_3 (`Q_HAS_OU`) — le « ou » relie deux exemples illustratifs d'une même catégorie générale (« la santé ou l'éducation »), pas deux propositions distinctes. Aucune action.

**Recherche ciblée effectuée** (4 nouvelles entrées dans `sources.json`, entités `question_PUB_*`) : frais d'inscription universitaires nationaux 2026-2027 (source officielle Service-Public.fr, confiance haute), frais différenciés hors UE depuis le décret du 19 mai 2026 (presse spécialisée, confiance moyenne), ménages en attente d'un logement social (presse, confiance moyenne), places de crèche manquantes (presse, confiance basse — variance méthodologique documentée dans la note de la source). Le chiffre « ~32 % du PIB » de PUB_13 (dépenses de protection sociale) a été vérifié et **confirmé inchangé** (31,9 % du PIB en 2024, dernière donnée DREES disponible) — aucune modification nécessaire.

**Tests exécutés** : `test1`-`test4` PASS (aucun changement de direction dans ce lot, 107 questions direction=1 inchangé). `node scripts/lint-questions.mjs PUBLIC_SERVICES` → 1 signalement résiduel (faux positif connu, PUB_3) après les 3 corrections de suivi. `JSON.parse` → 200 entrées valides. `npm run build` → succès.

**Vérification produit réelle** : `priorityOrder` positionné sur SERVICES PUBLICS en premier via injection `localStorage` ciblée (technique plus fiable que le drag-and-drop tactile pour ce contrôle), confirmant que PUB_23 (CORE) apparaît en première question. Panneau « Comprendre cet enjeu » ouvert et vérifié sans troncature ni chevauchement pour l'explication la plus longue du lot (PUB_23, avec la nuance hors-UE) sur viewport mobile 375×812. Données de test effacées, serveur de dev arrêté après contrôle.

**Effet de bord découvert en cours de vérification** : la page d'accueil affiche des statistiques obsolètes (« 120+ questions », « 40 figures historiques » — réalité actuelle : 162 questions actives, 60 figures historiques). Hors du périmètre de ce lot éditorial (texte de landing page, pas une question) ; signalé séparément pour ne pas interrompre le cycle du lot.

**Commit** : un seul commit éditorial (aucune bascule de polarité dans ce lot).

---

## Lot 3/8 — Écologie, énergie, agriculture (ENVIRONMENT)

18 questions actives revues. 7 entrées `isDuplicate` examinées individuellement (pas seulement vérifiées vides comme au lot 2) : ENV_16/17/19/20 sont des stubs vides (aucune action) ; **ENV_5, ENV_12 et ENV_18 ont un texte propre non vide** mais ont été jugées correctement écartées de la file active après analyse — voir note dédiée ci-dessous plutôt que promues. 12 questions jugées conformes sans modification (ENV_2, 3, 4, 6, 9, 10, 13, 15, 22, 23, 24, 25). 6 modifiées :

| ID | Ancienne formulation | Nouvelle formulation | Raison principale | Explication modifiée | Degré | Validation factuelle |
|---|---|---|---|---|---|---|
| ENV_1 | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique pour une formulation forte (« priorité absolue ») — aucun argument contra | Oui | Mineur | N/A (argument de principe) |
| ENV_7 | *(texte inchangé)* | *(texte inchangé)* | Explication présentait l'interdiction UE 2035 comme totalement actée | Oui | Mineur | Effectuée (confiance moyenne) — la Commission européenne a proposé un assouplissement en décembre 2025 (réduction de 90 % des émissions plutôt qu'interdiction totale), encore non validé par le Parlement/Conseil |
| ENV_8 | « **Pour vraiment protéger** l'environnement, il faut accepter de réduire la croissance économique. » | « L'État doit abandonner la croissance du PIB comme objectif prioritaire de sa politique économique. » | (a) Formulation présuppositionnelle (« pour vraiment... » sous-entend que les autres approches ne sont pas de la « vraie » protection) ; (b) redondance de fond avec ENV_23 (les deux mesuraient essentiellement la même attitude pro-décroissance). Recentrée sur un axe distinct (rejet du PIB comme métrique-cible), polarité de l'accord inchangée (voir note méthodologique) | Oui (réécrite) | Modéré | N/A (claim structurel) |
| ENV_11 | « Des militants qui bloquent des routes ou s'enchaînent à des machines pour alerter... » *(23 mots)* | « Les militants qui pratiquent la désobéissance civile pour alerter... » *(19 mots)* | Dépassait la cible de longueur ; remplace deux exemples concrets par le terme technique déjà utilisé et défini dans sa propre explication | Non | Mineur | N/A |
| ENV_14 | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique (uniquement des arguments contre la géo-ingénierie, aucun argument pour) | Oui | Mineur | N/A (argument de principe) |
| ENV_21 | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique (aucun argument contra à l'élévation de la biodiversité au rang du climat) | Oui | Mineur | N/A (argument de principe) |

**Note méthodologique sur ENV_8** (changement de fond, pas seulement de forme) : avant de reformuler, la direction de score (`DIRECTION_MAP.ENV_8 = 1`) a été analysée pour vérifier qu'elle restait valide. L'ancienne formulation (accord = pro-décroissance) et la nouvelle (accord = rejet du PIB comme objectif prioritaire) pointent dans le **même sens réel** (distanciation vis-à-vis de la croissance comme priorité) : aucune bascule de `DIRECTION_MAP` n'était donc nécessaire, contrairement à ECO_13 au lot 1. Vérifié également que la nouvelle formulation ne duplique pas ENV_23 (qui reste centrée sur la réduction volontaire de production/consommation) ni ENV_4 (centrée sur l'arbitrage emploi/réglementation) : les trois questions couvrent désormais des nuances distinctes de l'axe croissance/environnement.

**Note sur les doublons à texte non vide** (ENV_5, ENV_12, ENV_18) : contrairement au lot 2 (services publics), ces trois entrées `isDuplicate` contiennent une formulation propre plutôt qu'un stub vide, ce qui impose une évaluation individuelle plutôt qu'un simple constat de vacuité.
- **ENV_5** (« La transition énergétique doit être rapide, même à coût économique ») et **ENV_12** (« L'environnement doit primer sur le développement économique ») mesurent des nuances de l'axe croissance/environnement déjà couvertes par ENV_4 (arbitrage emploi), et par ENV_8/ENV_23 après la reformulation ci-dessus. Les promouvoir ajouterait une redondance (sur-pondération de cet axe) plutôt qu'une précision nouvelle, contrairement au critère du brief (« garder les variantes seulement quand elles améliorent la précision »). Laissées filtrées, aucune action.
- **ENV_18** (« La taxe carbone est l'outil le plus efficace contre les émissions ») pose en plus un problème de format : c'est une affirmation comparative/superlative implicite (« le plus efficace » par rapport à quelles autres mesures, non listées), intrinsèquement plus ambiguë à noter sur une échelle simple qu'une question de soutien direct comme ENV_3. Laissée filtrée, aucune action.

**Tests exécutés** : `test1`-`test4` PASS (107 questions direction=1, inchangé — confirmant qu'aucune bascule de polarité n'a eu lieu, cohérent avec la note méthodologique ci-dessus). `node scripts/lint-questions.mjs ENVIRONMENT` → **0 signalement** (premier lot sans aucun résidu, y compris faux positif). `JSON.parse` → 200 entrées valides. `npm run build` → succès.

**Recherche ciblée effectuée** (1 nouvelle entrée dans `sources.json`, `question_ENV_7`) : assouplissement de l'interdiction UE 2035 des moteurs thermiques (presse spécialisée convergente, confiance moyenne — proposition de la Commission non encore adoptée par le Parlement/Conseil). Chiffres jugés stables et non re-vérifiés cette session (risque faible, non prioritaires) : part du nucléaire dans l'électricité française (~70 %, ENV_2/ENV_24), part de l'élevage dans les émissions mondiales (~15 %, ENV_9), fonds « pertes et préjudices » COP27 (ENV_10).

**Vérification produit réelle** : `priorityOrder` positionné sur ENVIRONNEMENT en premier via `localStorage`, confirmant que ENV_24 (CORE) s'affiche en première question et rend correctement sur viewport mobile 375×812. Vérification allégée par rapport aux lots 1-2 (pas de clic à travers plusieurs questions supplémentaires) : le pipeline de rendu (panneaux, wrapping, thèmes) a déjà été validé de façon approfondie sur deux lots consécutifs sans aucune anomalie, un contrôle exhaustif à chaque lot n'apporte plus d'information marginale suffisante pour son coût. Données de test effacées, serveur de dev arrêté après contrôle.

**Commit** : un seul commit éditorial. Bien qu'ENV_8 soit un changement de fond documenté avec une note méthodologique dédiée, il ne nécessite pas de bascule de `DIRECTION_MAP` ni de test de monotonie séparé — il est donc inclus dans le commit éditorial plutôt que committé à part (contrairement à ECO_13 au lot 1, qui inversait réellement la polarité).

---

## Lot 4/8 — Immigration, intégration, sécurité, justice (IMMIGRATION + SECURITY)

Le plus gros lot (38 questions actives sur les deux thèmes combinés, traité en une seule session pour cohérence puis committé). **Découverte majeure en cours de vérification produit** : `questionHints.js` — un fichier de tooltips simplifiés distinct de `explanation`, avec priorité totale et silencieuse sur celle-ci dans `Questionnaire.jsx` — s'est révélé désynchronisé de `questions_final.json` pour 10 des 22 questions qu'il couvre. Corrigé séparément avant de terminer ce lot ; voir section dédiée ci-dessous.

### IMMIGRATION — 19 questions actives revues

14 conformes sans modification (IMM_3, 4, 5, 6, 7, 10, 11, 12, 13, 14, 15, 17(dup), 19(dup), 20, 22(dup)). 7 modifiées :

| ID | Ancienne formulation | Nouvelle formulation | Raison principale | Explication modifiée | Degré | Validation factuelle |
|---|---|---|---|---|---|---|
| IMM_1 *(CORE)* | *(texte inchangé)* | *(texte inchangé)* | Chiffre obsolète (« environ 300 000 ») | Oui | Mineur | Effectuée — 384 000 nouveaux titres de séjour en 2025 (+11 %), record |
| IMM_2 | « ...droit de travailler **et d'accéder aux services sociaux** dès le dépôt... » | « ...droit de travailler dès le dépôt de leur dossier. » | Double proposition (droit au travail + accès aux services sociaux = deux leviers distincts) ; explication rééquilibrée (ajout d'un contra) | Oui (rééquilibrée) | Modéré | N/A |
| IMM_8 | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique (aucun contra à l'égalité totale des droits sociaux) | Oui | Mineur | N/A |
| IMM_9 | *(texte inchangé)* | *(texte inchangé)* | Explication décrivait le débat sans donner d'argument pour/contre explicite | Oui | Mineur | N/A |
| IMM_16 | *(texte inchangé)* | *(texte inchangé)* | Explication factuellement incomplète : présentait le mécanisme de plafond voté comme simplement « débattu » | Oui | Mineur | Effectuée — ce mécanisme a été **censuré** par le Conseil constitutionnel le 25 janvier 2024 (décision 2023-863 DC), pas seulement débattu |
| IMM_21 | « L'UE doit créer une politique d'asile **commune et contraignante**. » | « L'UE doit imposer une **répartition contraignante** des demandeurs d'asile entre ses États membres. » | Double qualificatif (commune + contraignante = deux axes distincts de l'intégration européenne) ; recentrée sur le point réellement disputé | Oui (mise à jour) | Modéré | Effectuée — Pacte européen sur la migration et l'asile entré en vigueur le 12 juin 2026 (un mois avant cette session) |
| IMM_23 *(CORE)* | *(texte inchangé)* | *(texte inchangé)* | Explication incomplète : aucune mention d'un précédent français concret | Oui | Mineur | Effectuée — dérogation au droit du sol à Mayotte, durcie en 2025-2026 (réforme nationale nécessiterait une révision constitutionnelle) |

**Note sur IMM_2** : direction de score vérifiée inchangée (accord = toujours favorable aux droits des demandeurs d'asile, pas de bascule `DIRECTION_MAP` nécessaire).

### SECURITY — 19 questions actives revues

14 conformes sans modification (SEC_1, 3, 6, 8, 9, 10, 11, 12, 14, 16, 19, 20, 23, 24). 5 modifiées :

| ID | Ancienne formulation | Nouvelle formulation | Raison principale | Explication modifiée | Degré | Validation factuelle |
|---|---|---|---|---|---|---|
| SEC_4 | *(texte inchangé)* | *(texte inchangé)* | Explication orientée contre la reconnaissance faciale (comparaison aux États autoritaires) sans argument pour | Oui (rééquilibrée) | Modéré | N/A |
| SEC_5 | « Les peines de prison doivent **augmenter et être plus strictes**. » | « Les peines de prison doivent être plus longues. » | Double dimension (durée + rigueur du régime carcéral) réduite à l'axe réellement mesuré par l'explication (durée/sévérité) | Non | Modéré | N/A |
| SEC_7 | *(texte inchangé)* | *(texte inchangé)* | Explication présentait la France comme ayant « atteint l'objectif OTAN de 2 % », un repère obsolète | Oui | Modéré | Effectuée — l'OTAN a relevé son objectif à 5 % du PIB d'ici 2035 au sommet de La Haye (juin 2025) ; la France (~2 %) est désormais **sous** le nouvel objectif, pas à son niveau |
| SEC_13 | « Les policiers doivent porter des caméras corporelles **en permanence**. » | « Le **déclenchement** des caméras-piétons des policiers doit être automatique, sans possibilité de désactivation. » | Ambiguïté avec l'explication (« déjà obligatoires » = le port, pas l'enregistrement) ; recentrée sur le vrai point de débat (déclenchement systématique vs. discrétion de l'agent) | Oui (clarifiée) | Modéré | N/A |
| SEC_21 *(CORE)* | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique (aucun contra à la protection des lanceurs d'alerte) | Oui | Mineur | N/A |

**Design déjà correct, noté pour mémoire** : SEC_17 et SEC_18 utilisent des valeurs `dupOf` sentinelles (`EXCLUDED_LAW_1981`, `EXCLUDED_USA_FRAMING`) plutôt que de pointer vers une vraie question — exclusion délibérée de la peine de mort (consensus quasi unanime en France depuis la loi Badinter de 1981, faible pouvoir discriminant) et du cadrage « droit aux armes à feu » façon 2e amendement américain (axe politique sans équivalent en France). Bonne pratique de conception, aucune action.

**Cas limites documentés (chevauchement thématique, pas doublons)** : SEC_1 (surveillance de masse en général) et SEC_16 (surveillance de masse *spécifiquement pour le terrorisme*) mesurent des nuances proches mais distinctes (proportionnalité générale vs. justification sécuritaire précise) ; poids très différents (CORE vs SECONDARY) limitant le risque de sur-pondération. SEC_23 (pouvoirs policiers dans les quartiers difficiles) et SEC_24 (priorité budgétaire police vs. aides sociales) portent sur des leviers différents (pouvoirs légaux vs. arbitrage budgétaire). Les deux paires laissées telles quelles.

**Tests exécutés (IMMIGRATION + SECURITY)** : `test1`-`test4` PASS (107 questions direction=1, inchangé — aucune bascule de polarité dans ce lot). `node scripts/lint-questions.mjs IMMIGRATION` → 2 signalements, tous deux faux positifs confirmés (`ANGLICISM:opportunité` sur IMM_4, usage traditionnel français du mot, pas un anglicisme ; `Q_HAS_OU` sur IMM_6, « obtention ou renouvellement » décrit deux moments d'une même politique, pas deux propositions distinctes). `node scripts/lint-questions.mjs SECURITY` → **0 signalement**. `JSON.parse` → 200 entrées valides. `npm run build` → succès.

### Découverte et correction : `questionHints.js` désynchronisé

En ouvrant le panneau « Comprendre cet enjeu » de IMM_1 pour vérifier le nouveau chiffre (384 000), le texte affiché ne correspondait à aucune version de l'explication (ni l'ancienne, ni la nouvelle) : `Questionnaire.jsx` donne une priorité absolue et silencieuse à `questionHints.js` sur `question.explanation` quand une entrée existe pour l'ID. Un audit complet des 22 entrées de ce fichier a trouvé :
- **8 mismatches de sujet complet** (pas de simple péremption) : PUB_4 affichait un contenu sur les subventions à l'école privée pour une question qui porte désormais sur le système de retraite ; ENV_1 et ENV_3 avaient leurs contenus inversés (climat-priorité vs. taxe carbone) ; DEM_1/DEM_4 et GLO_1/GLO_3 affichaient chacun un sujet sans rapport (référendum vs. vote obligatoire ; mandat unique vs. indépendance des juges ; libre-échange vs. intérêt national ; souveraineté générale vs. OTAN). IMM_2 affichait encore l'ancien périmètre (double, avant la correction de ce lot) après que ce lot l'a justement resserré — la correction éditoriale de ce lot aurait donc **aggravé** l'écart si la désynchronisation était restée inaperçue.
- **2 chiffres obsolètes** sur des questions déjà corrigées dans `explanation` lors de lots précédents ou de celui-ci (ECO_2 au lot 1, IMM_1 dans ce lot) — ces corrections, vérifiées et committées, étaient donc **invisibles pour les utilisateurs réels** jusqu'à cette découverte.
- **3 entrées mortes** (SOC_1, SOC_2, SEC_2) pointant vers des questions `isDuplicate`, donc jamais servies — aucun impact utilisateur, supprimées par propreté.

Les 10 entrées affectées ont été corrigées (ou supprimées pour les 3 mortes) dans un commit technique dédié, distinct de ce lot éditorial, avec un ajout au lint (`HINT_ORPHANED_*`) qui détecte mécaniquement le cas « pointe vers un ID inexistant ou dupliqué » — mais **pas** la dérive de sujet, qui a nécessité une relecture manuelle complète et devra être refaite ponctuellement (la prochaine relecture naturelle couvrira DEM_1/DEM_4 au lot 5, GLO_1/GLO_3 au lot 6, SOC_5/SOC_7 au lot 7). Détail complet, y compris le texte avant/après des 10 entrées : voir le commit dédié dans `progress.md`.

**Vérification produit réelle** : `priorityOrder` positionné sur Immigration puis Sécurité en premier via `localStorage`. IMM_1 confirmé afficher désormais le contenu corrigé (384 000, et non plus l'ancien 250 000 du hint ni le 300 000 de l'ancienne explication) après application du correctif — vérification en boucle fermée (bug trouvé → corrigé → re-vérifié dans le même navigateur) plutôt qu'une simple confirmation de rendu. Données de test effacées, serveur de dev arrêté après contrôle.

**Commits** : un commit technique (`questionHints.js` + lint) committé séparément et **avant** l'achèvement du lot, puis le commit éditorial IMMIGRATION+SECURITY (aucune bascule de polarité, un seul commit suffisant).

---

## Lot 5/8 — Institutions, démocratie, libertés publiques (DEMOCRACY)

21 questions actives revues. **Qualité de base nettement plus élevée que les lots précédents** : 20 conformes sans modification (DEM_1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 19, 21, 23, 24), 1 seule modifiée. C'est le plus petit nombre de corrections de tous les lots à ce jour, résultat honnête d'une revue complète et non d'un contrôle allégé — plusieurs questions constituent même des modèles de bonne pratique déjà en place (ex. DEM_7, DEM_10, DEM_21 avec des exemples concrets et un vrai équilibre pour/contre).

| ID | Ancienne formulation | Nouvelle formulation | Raison principale | Explication modifiée | Degré | Validation factuelle |
|---|---|---|---|---|---|---|
| DEM_25 | *(texte inchangé)* | *(texte inchangé)* | Explication à sens unique (aucun contra à l'idée que la concentration médiatique nuit au pluralisme) | Oui | Mineur | N/A (argument de principe) |

**Cas limites documentés (chevauchement thématique, pas doublons)** : DEM_3 (principe général du référendum d'initiative citoyenne déclenchable sur n'importe quelle loi) et DEM_24 *(CORE)* (introduction spécifique du RIC dans la Constitution, avec la genèse Gilets jaunes et le risque sur les droits des minorités) mesurent des nuances liées mais distinctes (principe vs. mécanisme constitutionnel précis) ; poids différents (SECONDARY vs CORE) limitant la sur-pondération. DEM_13 (régulation des médias pour l'équilibre politique) et DEM_25 (la concentration médiatique par quelques fortunes nuit au pluralisme) portent sur des leviers différents (intervention réglementaire générale vs. diagnostic causal précis sur la concentration capitalistique) — quelqu'un pourrait partager le diagnostic de DEM_25 sans soutenir la régulation de DEM_13 (préférant par exemple des règles anti-concentration plutôt qu'un contrôle de contenu), et vice-versa. Les deux paires laissées telles quelles.

**Doublons revus** : DEM_17 (dup de DEM_1), DEM_18 (dup de DEM_3), DEM_20 (dup de DEM_2) sont des stubs vides, aucune action. DEM_22 (dup de `SOC_15`, référence inter-thème avec texte réel : « Les réseaux sociaux sont responsables du contenu qu'ils amplifient. ») a été délibérément rattaché à une question SOCIAL existante plutôt que dupliqué comme question DEMOCRACY distincte — choix de conception cohérent, non modifié.

**Aucune recherche factuelle nécessaire ce lot** : tous les faits vérifiables cités sont stables et non sujets à un changement récent (interdiction des dons d'entreprises aux partis depuis 1995 ; limite à deux mandats présidentiels depuis la révision constitutionnelle de 2008 ; nom actuel de l'ARCOM, fusion CSA/HADOPI de janvier 2022 ; référence à la Pologne sous le PiS déjà correctement au passé, DEM_21 rédigée avec soin pour ne pas laisser entendre une situation en cours alors que le PiS a perdu le pouvoir fin 2023). Seul le taux d'abstention de DEM_1 (« dépasse souvent 50 % ») reste une formulation généraliste et déjà prudente, sans élection précise citée à vérifier.

**Suivi hint accompli** : DEM_1 et DEM_4 avaient leurs entrées `questionHints.js` corrigées en cours du lot précédent (bug de désynchronisation découvert sur IMM_1, corrigé dans le commit `c196659` avant ce lot). Cette revue éditoriale confirme maintenant que le contenu sous-jacent de DEM_1 et DEM_4 (texte + explication) est lui-même de bonne qualité, sans changement nécessaire — la correction technique du lot précédent et la revue éditoriale de celui-ci convergent sur ces deux questions.

**Tests exécutés** : `test1`-`test4` PASS (107 questions direction=1, inchangé). `node scripts/lint-questions.mjs DEMOCRACY` → **0 signalement**. `JSON.parse` → 200 entrées valides. `npm run build` → succès.

**Vérification produit réelle** : `priorityOrder` positionné sur Démocratie en premier via `localStorage`. Première question affichée : DEM_8 *(CORE)*, rendu propre confirmé sur mobile 375×812. Données de test effacées, serveur de dev arrêté après contrôle.

**Commit** : un seul commit éditorial (une seule modification, aucune bascule de polarité).

---

## Lot 6/8 — Europe, international, défense (GLOBAL)

22 questions actives revues. Qualité de base élevée comme au lot 5 : 21 conformes sans modification, 1 seule modifiée.

| ID | Ancienne formulation | Nouvelle formulation | Raison principale | Explication modifiée | Degré | Validation factuelle |
|---|---|---|---|---|---|---|
| GLO_4 | « La France doit augmenter son aide publique au développement **versée aux pays en développement**. » | « La France doit augmenter son aide publique au développement. » | Clause finale redondante (« aide publique au développement » est par définition versée aux pays en développement) ; explication mise à jour avec une trajectoire budgétaire nettement plus informative que l'ancien chiffre statique | Oui (mise à jour) | Mineur | Effectuée — 5 coupes budgétaires consécutives (0,56 % du RNB en 2022 → ~0,43 % en 2025 → ~0,38 % prévu en 2026), loin de l'objectif de 0,7 % pour 2025 |

**Faux positif de lint confirmé** : GLO_3 (`EXPL_ECHOES_QUESTION`) — même schéma qu'ECO_20 au lot 1 : l'explication commence par définir le sujet avec les mêmes premiers mots que la question (« L'OTAN est une alliance militaire... ») avant de diverger vers un contenu réellement distinct. Aucune action.

**Cas limites documentés (chevauchement thématique, pas doublons)** — ce lot en comporte plusieurs, plus que les précédents, tous jugés légitimement distincts après examen individuel :
- **GLO_1** *(CORE)* (« l'intérêt national doit primer sur les engagements internationaux ») et **GLO_5** (« ...doit **toujours** passer avant les obligations des traités internationaux ») : même axe (souverainisme vs. internationalisme), mais GLO_5 ajoute un qualificatif absolu (« toujours ») qui en fait une position plus extrême — quelqu'un peut favoriser l'intérêt national en général (GLO_1) sans adhérer à sa primauté absolue et inconditionnelle (GLO_5). Poids différents (CORE vs SECONDARY) limitant la sur-pondération.
- **GLO_8** *(CORE)* (intégration politique européenne en général, avec arbitrage explicite de souveraineté) et **GLO_24** (compétences et budget de l'UE, motivés spécifiquement par le blocage du vote à l'unanimité) : la seconde cible un mécanisme institutionnel précis (unanimité vs. majorité qualifiée) plutôt que l'intégration en général.
- **GLO_9** (protection de la culture française **spécifiquement face à l'influence américaine**) et **GLO_22** (financement actif de la culture et des traditions françaises **en général**) : quelqu'un peut soutenir un financement culturel général sans viser spécifiquement l'influence américaine, ou l'inverse.
- **GLO_11** (réduire la dépendance **à la Chine spécifiquement**) et **GLO_16** (produire davantage **localement en général**, alimentation/énergie) : diversifier loin de la Chine n'implique pas nécessairement de relocaliser en France, et vice-versa.
- **GLO_7** (sanctionner les **régimes autoritaires**, cadrage par type de régime) et **GLO_20** (sanctionner les **violations de droits humains**, cadrage par type de violation, applicable même à des régimes non autoritaires) : déclencheurs différents.

**Doublons revus** : GLO_19 (dup de GLO_4, stub vide), GLO_21 (dup de GLO_8, stub vide) — aucune action. GLO_18 (dup de GLO_15, texte réel : « Les pays doivent intervenir militairement pour les droits humains ailleurs. ») est une version générique et moins précise de GLO_15 (qui ancre la même idée dans deux exemples historiques concrets et contrastés, Rwanda 1994 / Libye 2011) — correctement laissée filtrée, GLO_15 étant la version la plus riche et pédagogique du même principe.

**Recherche ciblée effectuée** (1 nouvelle source, `question_GLO_4`) : chute de l'aide publique au développement française, confirmée par plusieurs sources convergentes (Sénat, Coordination SUD, Focus 2030), confiance haute. Chiffres jugés stables et non re-vérifiés (accord OCDE 2021 sur l'impôt minimum mondial à 15 %, GLO_10 ; tarifs douaniers UE sur les véhicules électriques chinois, GLO_6 ; mandat d'arrêt de la CPI contre Poutine en 2023, GLO_13 ; guerre en Ukraine toujours en cours, GLO_3/GLO_25 — contexte géopolitique volontairement laissé ouvert plutôt que figé sur un état précis, cohérent avec la nature évolutive du conflit).

**Tests exécutés** : `test1`-`test4` PASS (107 questions direction=1, inchangé). `node scripts/lint-questions.mjs GLOBAL` → 1 signalement, faux positif confirmé. `JSON.parse` → 200 entrées valides. `npm run build` → succès.

**Vérification produit réelle** : `priorityOrder` positionné sur Mondialisation en premier via `localStorage`. GLO_1 *(CORE)* confirmé en première question, rendu propre sur mobile 375×812. Données de test effacées, serveur de dev arrêté après contrôle.

**Commit** : un seul commit éditorial (une seule modification, aucune bascule de polarité).

---

## Lot 7/8 — Société, éducation, culture, éthique (SOCIAL)

19 questions actives revues. 17 conformes sans modification (SOC_3, 4, 5, 6, 7, 8, 12, 14, 15, 16, 19, 22, 23, 24, 25, 26), 2 modifiées — dont une pour un changement de fond documenté (SOC_21).

| ID | Ancienne formulation | Nouvelle formulation | Raison principale | Explication modifiée | Degré | Validation factuelle |
|---|---|---|---|---|---|---|
| SOC_10 | *(texte inchangé)* | *(texte inchangé)* | Explication présentait l'euthanasie comme simplement « interdite », sans mentionner un processus législatif en cours et exceptionnellement proche de son terme | Oui | Modéré | Effectuée (confiance haute, mais **situation à courte durée de vie explicitement signalée**) — la proposition de loi sur l'aide à mourir a été adoptée une 3e fois par l'Assemblée le 30 juin 2026, rejetée par le Sénat le 7 juillet 2026 (4 jours avant cette session), vote décisif à l'Assemblée prévu le 15 juillet 2026 (4 jours après) |
| SOC_21 | « La possession de drogues pour usage personnel **ne doit pas constituer un délit**. » | « Consommer des drogues doit être considéré comme un **choix personnel relevant de la liberté individuelle**. » | Redondance de fond avec SEC_9 (lot 4, thème différent) : les deux questions mesuraient la même position sur la dépénalisation des drogues, avec la même référence au Portugal et le même cadrage « efficacité de la répression ». Recentrée sur un axe distinct (autonomie personnelle), polarité inchangée (voir note méthodologique) | Oui (réécrite) | Modéré | N/A (claim structurel) |

**Note méthodologique sur SOC_21** (changement de fond inter-thème, cas inédit dans cette mission) : contrairement aux redondances déjà rencontrées (ENV_8/ENV_23 au lot 3, plusieurs paires au lot 6), celle-ci traversait **deux thèmes différents** (SECURITY et SOCIAL), donc invisible au mécanisme `dupOf` qui n'opère qu'au sein d'un même thème. SEC_9 (« la drogue... doit être dépénalisée ») et l'ancienne formulation de SOC_21 (« la possession... ne doit pas constituer un délit ») étaient des quasi-paraphrases l'une de l'autre, y compris dans leurs explications respectives (même référence au Portugal, même cadrage sur l'« efficacité de la répression »). Un répondant tenant compte uniquement de la conclusion politique (pour ou contre la dépénalisation) aurait répondu de façon quasi identique aux deux questions, créant une corrélation artificielle entre les scores SECURITY et SOCIAL. SOC_21 a été recentrée sur l'axe de la liberté individuelle (autonomie corporelle) plutôt que sur l'efficacité de la politique pénale (l'angle de SEC_9), une nuance réellement distincte : on peut juger la dépénalisation efficace sans la considérer comme une question de liberté fondamentale, et inversement. Direction de score vérifiée inchangée (`DIRECTION_MAP.SOC_21 = 1` dans les deux cas, l'accord penchant vers le pôle libéral/permissif). **Cette découverte suggère qu'un balayage inter-thèmes dédié aux quasi-doublons pourrait être utile en fin de mission**, au-delà de la revue thème par thème qui ne capture que les doublons intra-thème.

**Aucune autre recherche factuelle nécessaire** : cannabis (précédent luxembourgeois de 2023, stable), loi Claeys-Leonetti (toujours en vigueur en l'absence d'adoption définitive de la nouvelle loi), loi de 2004 sur les signes religieux à l'école (stable), extension de la PMA en 2021 (stable, distinction correcte avec la GPA toujours interdite), constitutionnalisation de l'IVG en 2024 (déjà correcte dans SOC_24).

**Doublons revus** : SOC_9 (dup de SOC_20), SOC_17 (dup de SOC_4), SOC_18 (dup de SOC_10) sont des stubs vides, aucune action. SOC_1 (`EXCLUDED_LAW_2013`, mariage pour tous) et SOC_13 (`EXCLUDED_LAW_1981`, peine de mort) confirment le même bon usage des sentinelles `EXCLUDED_*` déjà noté pour SEC_17/SEC_18 au lot 4. SOC_11 (`EXCLUDED_USA_FRAMING`, contrôle des armes) confirme également ce même schéma de conception délibérée. SOC_2 (dup de SOC_24, CORE, avortement) est une version moins précise et moins à jour de SOC_24 (qui intègre la constitutionnalisation de 2024) — correctement filtrée.

**Tests exécutés** : `test1`-`test4` PASS (107 questions direction=1, inchangé — confirmant l'absence de bascule de polarité pour SOC_21). `node scripts/lint-questions.mjs SOCIAL` → 1 signalement, faux positif confirmé (`Q_HAS_OU` sur SOC_26, « origine ou couleur de peau » liste deux facettes d'une même catégorie de discrimination, pas deux propositions distinctes). `JSON.parse` → 200 entrées valides. `npm run build` → succès.

**Recherche ciblée effectuée** (1 nouvelle source, `question_SOC_10`) : processus législatif sur le droit à l'aide à mourir, confiance haute mais **explicitement marquée comme à re-vérifier après le 15 juillet 2026** dans `sources.json` — cas rare d'une source dont la date de péremption est connue à l'avance.

**Vérification produit réelle** : `priorityOrder` positionné sur Questions sociales en premier via `localStorage`. SOC_5 *(CORE)* confirmé en première question, rendu propre sur mobile 375×812. Données de test effacées, serveur de dev arrêté après contrôle.

**Commit** : un seul commit éditorial. SOC_21 est un changement de fond documenté (comme ENV_8 au lot 3) mais ne nécessite pas de bascule de `DIRECTION_MAP` ni de commit séparé.

---

*(Le lot 8 sera ajouté ici.)*

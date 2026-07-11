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

*(Les lots 3 à 8 seront ajoutés ici au fur et à mesure.)*

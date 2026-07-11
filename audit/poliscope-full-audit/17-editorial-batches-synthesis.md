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

*(Les lots 2 à 8 seront ajoutés ici au fur et à mesure.)*

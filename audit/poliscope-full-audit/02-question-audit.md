# Audit éditorial des questions

**Source de vérité auditée** : `src/data/questions_final.json` filtré par `src/data/questions.js`. **Correction du périmètre** : la documentation existante (commentaire d'en-tête de `questions.js`, `CLAUDE.md`) annonce 180 questions brutes / 22 doublons / 158 vives. Vérification directe (import du module réel) : **200 questions brutes, 38 marquées `isDuplicate` (dont 17 conservent un texte non vide — contenu écrit puis mis de côté sans nettoyage), 162 questions réellement actives.** Toute la documentation existante sur ce chiffre est à corriger (voir [01-project-map.md](01-project-map.md) et [10-prioritized-remediation-plan.md](10-prioritized-remediation-plan.md)).

Chaque question a été notée 0-5 sur un score composite (clarté, neutralité, absence de double question, absence de présupposé idéologique, absence de formulation émotionnelle, actualité). Un score détaillé n'est fourni que pour les questions ≤3/5 ou présentant un problème structurel, conformément à la consigne de regrouper les constats similaires plutôt que de répéter la même explication 162 fois.

Codes de défaut utilisés : **DQ**=question double/bundling · **AB**=formulation absolutiste · **FD**=fausse dichotomie · **PR**=présupposé idéologique · **NE**=vocabulaire non neutre · **CL**=clarté/seuil vague · **FC**=affirmation factuelle présentée comme acquise · **AC**=cadrage daté/étroit · **WM**=poids affiché incohérent avec le poids réellement appliqué.

## Inventaire compact (162 questions actives)

*(Colonnes : ID · Score global /5 · Défauts. Thème et question complète disponibles dans `questions_final.json` par ID. Score vide = 5/5, RAS.)*

### ECONOMY (24 questions, poids effectif total 107)
ECO_1(5) · ECO_2(4,CL) · ECO_3(5) · ECO_4(5) · ECO_5(4,CL) · ECO_6(4,DQ léger) · ECO_7(4,CL) · ECO_8(5) · **ECO_9(3,DQ)** · ECO_10(5) · ECO_11(5) · ECO_12(4,AC léger) · **ECO_13(3,CL)** · ECO_14(5) · ECO_15(5) · ECO_17(5) · ECO_18(4,PR léger) · ECO_19(5) · ECO_20(5) · ECO_23(5) · ECO_24(5, *voir doublon inter-thème ci-dessous*) · ECO_25(5) · ECO_26(5) · ECO_27(5, *voir doublon inter-thème*)

### SOCIAL (19 questions, poids effectif total 78)
**SOC_16(2,DQ)** · **SOC_19(2,DQ,AB)** · **SOC_23(2,DQ)** · **SOC_24(3,DQ)** · **SOC_25(3,DQ)** · **SOC_22(3,NE)** · **SOC_26(3,CL)** · **SOC_4(3,CL)** · SOC_3(4,DQ léger) · SOC_5(4,CL) · SOC_6(5) · SOC_7(4,NE léger) · SOC_8(5) · SOC_10(5) · **SOC_12(3,DQ)** · SOC_14(5) · SOC_15(4,CL) · SOC_20(5) · SOC_21(4,CL — *voir aussi doublon inter-thème et biais d'explication*)

### IMMIGRATION (19 questions, poids effectif total 62)
**IMM_13(2,PR,NE)** · **IMM_2(3,DQ)** · **IMM_15(3,DQ)** · **IMM_21(3,DQ)** · IMM_1(5) · IMM_3(4,CL) · IMM_4(5) · IMM_5(5) · IMM_6(5) · IMM_7(4,DQ léger) · IMM_8(4,DQ léger) · IMM_9(5) · IMM_10(5) · IMM_11(5) · IMM_12(4,CL) · IMM_14(5) · IMM_16(4,DQ léger) · IMM_20(5) · IMM_23(5)

### SECURITY (19 questions, poids effectif total 70)
**SEC_6(3,FD)** · **SEC_24(3,FD, *quasi-redondant avec SEC_23*)** · SEC_1(5, *bon design, voir note positive*) · SEC_16(5, *idem*) · SEC_3(5) · SEC_4(5) · SEC_5(4,DQ léger) · SEC_7(5) · SEC_8(5) · **SEC_9(3? → voir biais d'explication ci-dessous, contenu neutre mais explanation non équilibrée)** · SEC_10(4,CL) · SEC_11(4,CL) · SEC_12(5) · SEC_13(5) · SEC_14(5) · SEC_19(5) · SEC_20(4,DQ léger) · SEC_21(5) · SEC_23(4,NE léger)

### ENVIRONMENT (18 questions, poids effectif total 44 — le plus faible avec PUBLIC_SERVICES)
**ENV_1(3,AB,WM)** · **ENV_8(3,PR)** · **ENV_23(3,PR)** · ENV_2(5) · ENV_3(5) · ENV_4(5) · ENV_6(5) · ENV_7(5) · ENV_9(5) · ENV_10(5) · ENV_11(4,CL) · ENV_13(5) · ENV_14(5) · ENV_15(5) · ENV_21(5) · ENV_22(5) · ENV_24(5, *voir note sur le codage direction, 08-bias-and-neutrality.md*) · ENV_25(5)

### DEMOCRACY (21 questions, poids effectif total 58)
**DEM_4(3,AB)** · **DEM_25(3,FC)** · DEM_1(5) · DEM_2(4,PR léger) · DEM_3(5) · DEM_5(5) · DEM_6(5) · DEM_7(4,CL) · DEM_8(4,CL) · DEM_9(4,CL) · DEM_10(5) · DEM_11(4,CL) · DEM_12(5) · DEM_13(4,CL) · DEM_14(5) · DEM_15(4,DQ léger) · DEM_16(5) · DEM_19(5) · DEM_21(5) · DEM_23(4,CL) · DEM_24(5)

### GLOBAL (22 questions, poids effectif total 68 — le plus dense mais le plus redondant)
**GLO_2(2,DQ)** · **GLO_5(3,AB)** · **GLO_9(3,NE,AC)** · **GLO_17(3,DQ)** · **GLO_24(3,DQ)** · **GLO_25(3,DQ)** · GLO_1(5) · GLO_3(5) · GLO_4(4,CL) · GLO_6(5, *voir doublon inter-thème*) · GLO_7(5) · GLO_8(5) · GLO_10(5, *voir doublon inter-thème*) · GLO_11(5) · GLO_12(4,CL) · GLO_13(5) · GLO_14(5) · GLO_15(5) · GLO_16(4,DQ léger) · GLO_20(4,AC léger) · GLO_22(4,AC léger) · GLO_23(5)

### PUBLIC_SERVICES (20 questions, poids effectif total 48 — le plus faible avec ENVIRONMENT)
**PUB_1(2,DQ,WM)** · **PUB_3(3,DQ)** · **PUB_9(3,DQ)** · PUB_2(4,CL) · PUB_4(5) · PUB_5(4,CL léger) · PUB_6(5) · PUB_7(5) · PUB_8(4,DQ léger) · PUB_10(5) · PUB_11(5) · PUB_12(4,CL léger) · PUB_13(4,CL) · PUB_14(5) · PUB_15(5) · PUB_17(4,CL) · PUB_19(5) · PUB_23(4,AB léger) · PUB_24(5) · PUB_25(4,CL)

**Bilan : 31/162 questions (19%) obtiennent ≤3/5.** Aucune question active n'a de texte ou d'`explanation` manquant.

## Commentaires détaillés par type de défaut

**1. Questions doubles/bundling (défaut le plus fréquent — 17 questions ≤3/5, plusieurs autres en « léger »)**
Structure typique dénoncée par la mission (« faut-il réduire les impôts ET les dépenses ? ») retrouvée à l'identique dans le corpus :
- `SOC_16` (CORE) : signes religieux dans « écoles **et** administrations » fusionne deux régimes juridiques distincts (loi de 2004 sur les élèves vs devoir de neutralité des agents publics).
- `SOC_19` (CORE) : le genre est « **uniquement** déterminé par la biologie **et** ne peut pas être modifié » — deux affirmations séparables, cumulées avec une formulation absolutiste.
- `SOC_23` : bundling triple (consentement + contraception + relations saines).
- `GLO_2` : ONU, OMC, FMI — trois institutions à mandats radicalement différents évaluées par une seule réponse.
- `GLO_24`/`GLO_25` (CORE, sujet Ukraine) : compétences+budget UE ; soutien militaire+financier — deux axes séparables sur un sujet sensible où la distinction compte réellement dans le débat public.
- `PUB_1` : soins « **gratuits** ET de **qualité égale** ET **pour tous** » — triple condition cumulative.
- Autres cas : `ECO_9`, `IMM_2`, `IMM_15`, `IMM_21`, `SOC_24`, `SOC_25`, `SOC_12`, `GLO_17`, `PUB_3`, `PUB_9`.
- **Impact générique** : le barème 1-5 ne permet pas d'exprimer un accord partiel avec un énoncé composite — la réponse moyenne masque des positions internes contradictoires, réduisant la capacité de l'échelle à distinguer un accord réellement fort d'un accord réellement modéré pour ces 17+ items.

**2. Formulations absolutistes compressant l'échelle**
`ENV_1` (« priorité **absolue** »), `DEM_4` (« **totalement** indépendants »), `GLO_5` (« **toujours** » — quasi-doublon renforcé de `GLO_1`), `SOC_19` (« **uniquement** »). Un répondant modéré mais orienté est mécaniquement poussé vers le désaccord, comprimant artificiellement le centre de l'échelle et exagérant la polarisation apparente.

**3. Fausses dichotomies**
`SEC_6` (réinsertion **plutôt que** punition) et `SEC_24` (renforcement policier **plutôt que** aides sociales — redondant avec `SEC_23`) présentent comme mutuellement exclusifs deux objectifs de politique publique que beaucoup soutiennent simultanément.

**4. Présupposés idéologiques / cadrage orienté**
- **`IMM_13`** — la question la plus problématique du corpus : « Les enfants d'immigrés doivent s'identifier à la France **d'abord** » présuppose qu'ils ne le font pas déjà et impose un classement identitaire exclusif dans l'énoncé lui-même.
- `ENV_8` : « **Pour vraiment** protéger l'environnement, il faut... » disqualifie par construction les positions écologistes non-décroissantistes avant la réponse.
- `ENV_23` : présente la décroissance comme « nécessaire » face aux « limites de la planète », traitant une thèse contestée comme acquise.
- `DEM_25` : affirmation causale (concentration des médias « **nuit** » au pluralisme) présentée comme un fait plutôt que testée comme une opinion — à comparer à `DEM_13`, formulée de façon neutre sur le même terrain.

**5. Vocabulaire non neutre / vague**
- `SOC_22` : « sentiments religieux » (vs « liberté de culte »/« convictions ») minore subtilement la dimension religieuse du débat.
- `SOC_4`/`SOC_26` : formulations si génériques (« politiques d'aide », « mesures concrètes », sans mention de quotas/discrimination positive/testing) qu'elles risquent un consensus artificiel masquant un désaccord réel sur les mécanismes précis — décalage noté avec leur propre `explanation`, qui elle mentionne les quotas.
- `GLO_9` : cible spécifiquement l'influence « culturelle américaine » — cadrage daté et étroit, ignore les plateformes non-américaines (ex. TikTok), quasi-doublon de `GLO_22`.

**6. Biais dans le champ `explanation`**
Sur 162 items, la structure « certains estiment X ; d'autres estiment Y » est équilibrée dans la quasi-totalité des cas — point fort du corpus à préserver. Deux exceptions repérées : `SEC_9` et `SOC_21` (dépénalisation de la drogue) citent toutes deux le Portugal avec « des résultats positifs » sans aucun contrepoint, à rebours du reste du corpus. `SOC_19` : l'`explanation` valide implicitement la thèse inverse de celle testée par la question, créant une tension interne entre l'énoncé et son propre matériel pédagogique.

**7. Incohérence poids affiché vs poids réellement appliqué (WM)**
`ENV_1` et `PUB_1` portent un `weight` JSON de 5 (niveau CORE) mais un `status` SECONDARY. Le moteur de score (`questions.js:145`) fait passer `STATUS_WEIGHTS[status]` **avant** `raw.weight` — le poids réellement appliqué est donc 2, pas 5. Plus largement : **le champ `weight` brut n'a plus aucun effet réel sur le score dès qu'un `status` est défini** (le cas pour la totalité du corpus), ce qui en fait un piège pour toute personne éditant le contenu en pensant influencer l'importance d'une question via ce champ. Voir [04-scoring-methodology.md](04-scoring-methodology.md) pour l'analyse technique complète — c'est autant un problème éditorial (l'intention affichée dans les données ne correspond pas à l'effet réel) qu'un problème de scoring.

**8. Bonne pratique identifiée (à préserver, pas à corriger)**
`SEC_1` (« la surveillance de masse doit être arrêtée », direction=-1) et `SEC_16` (« la surveillance de masse est acceptable contre le terrorisme », direction=1) interrogent la même attitude sous deux formulations opposées avec un codage de direction cohérent — technique de contrôle de cohérence des réponses bien conçue.

## Doublons sémantiques inter-thèmes non détectés par `isDuplicate`

Le système `isDuplicate` ne semble comparer que des questions du même préfixe thématique — il capture bien les doublons intra-thème mais laisse passer 3 paires **inter-thèmes**, où une seule opinion réelle de l'utilisateur est comptée deux fois dans deux thèmes distincts, gonflant leur corrélation apparente au-delà de ce qu'une mesure indépendante donnerait :

| Paire | Sujet | Effet |
|---|---|---|
| `ECO_24` ↔ `GLO_10` | Impôt mondial minimum sur les multinationales | Compte deux fois la même position dans ECONOMY et GLOBAL |
| `ECO_27` ↔ `GLO_6` | Droits de douane / protectionnisme | Idem |
| `SEC_9` ↔ `SOC_21` | Décriminalisation de la drogue (usage personnel) | Compte deux fois la même position dans SECURITY et SOCIAL |

**Recommandation** : marquer l'une des deux questions de chaque paire `isDuplicate: true`, ou les réassigner explicitement à un seul thème.

## Réponses — couverture accord fort/modéré/désaccord/absence d'opinion

Le barème 1-5 (pas du tout d'accord → tout à fait d'accord) permet structurellement de distinguer les 5 positions demandées par la mission, **sauf** qu'il n'existe **aucune option « je ne sais pas / pas d'opinion »** distincte de la position centrale (3). Un utilisateur sans opinion et un utilisateur réellement centriste produisent la même valeur brute, alors que `Questionnaire.jsx` propose un bouton « Passer » qui, lui, exclut correctement la question du calcul (voir constat F6 dans [01-project-map.md](01-project-map.md) / rapport Subagent 1) — la distinction existe donc au niveau du produit (skip vs réponse 3) mais n'est pas explicitée à l'utilisateur au moment de répondre : rien n'indique que « passer » est la bonne action pour une absence d'opinion plutôt que choisir 3 par défaut.

## Recommandation générale

Prioriser la correction des 17 questions doubles (impact le plus large, motif le plus fréquent) et de `IMM_13` (présupposé le plus explicite) avant la bêta publique ; les questions à score 4 (« léger ») peuvent attendre une révision éditoriale post-lancement. Documenter et corriger l'écart brouillon/corpus final (égalité F/H, contrôle policier disparus sans trace) avant de considérer le questionnaire comme stable — voir [03-topic-coverage.md](03-topic-coverage.md).

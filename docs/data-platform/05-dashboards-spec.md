# 05 — Spécification des dashboards

Deux surfaces distinctes, une seule source de vérité (les fonctions `admin_*` k-anonymes du schéma v6, derrière `is_admin()` — le PIN client actuel disparaît).

## A. Cockpit fondateur (« que se passe-t-il ? ») — page 1, 30 secondes de lecture

**Bandeau vital (aujourd'hui / 7j / 30j, avec delta vs période précédente)**
1. Visiteurs → tests démarrés → tests complétés → profils consentis cloud → consentis recherche → démographie remplie (le funnel en 6 chiffres, taux de passage affichés sur les flèches).
2. Rétention : % de comptes revenus à J7/J30 ; nombre de retests (sessions ≥2 d'un même uid).
3. Qualité : % de sessions flaggées (too_fast/straightline), temps médian par question, taux de skip global.
4. Santé technique : erreurs d'écriture Supabase, latence RPC, taille des tables/partitions (simple gauge).

**Graphiques page 1**
- Courbe quotidienne inscriptions/complétions (30 j) avec annotations d'événements (lancement presse, tweet viral) — annotations saisies à la main dans une petite table `dashboard_annotations`.
- Entonnoir vertical avec les 6 étapes ci-dessus.
- Répartition par mode (16/32/64) et par device.
- Sources d'acquisition (acquisition_source des sessions).

## B. Vue produit (« où le quiz fait-il mal ? »)
- **Abandon par position** : heatmap position de question (seq) × taux d'abandon — où décroche-t-on ? (response_events + quiz_sessions non complétées).
- **Questions problématiques** : tableau trié par taux de skip, temps de réponse médian anormal (trop long = incompréhensible ; trop court = non lue), % de neutres. Chaque ligne cliquable → texte + version de la question.
- **Questions discriminantes** : variance (mv_question_stats), corrélation item-thème (la question tire-t-elle son thème ?) — les candidates à promotion CORE / rétrogradation.
- **Indicateur d'égalités** : % de profils dont top1-top2 candidats < 2 pts (pilote l'UX résultat serré).

## C. Vue politique (« que pense l'échantillon ? »)
- Boussole : nuage 2D économique×social (échantillon fiable, densité, pas de points individuels en dessous du zoom k).
- Distribution des 18 archétypes + tendance mensuelle.
- Les 8 thèmes : moyenne, distribution (violin/histogramme), évolution.
- Compatibilités candidats 2027 : % de l'échantillon à ≥60 % par candidat (jamais présenté comme intention de vote — bandeau permanent le rappelant).
- Carte de France par département (grisée sous plancher).

## D. Explorateur de segments (« les médecins de moins de 35 ans ») — l'outil d'étude
**Interface** : constructeur de filtres par facettes — chaque variable du catalogue 03 est une facette (âge, genre, commune, dept, PCS, secteur, revenu, diplôme, logement, enfants, étranger, syndiqué, intérêt politique, source d'info) + facettes calculées (archétype, quadrant, top candidat, mode de quiz, qualité).

**Comportement clé — le plancher est dans l'interface, pas dans la discipline** :
- En construisant le filtre, l'outil affiche en permanence `n = 143 répondants fiables consentants`.
- Sous `min_cell_size` (30) : les résultats ne s'affichent PAS (« Segment trop petit — élargissez »).
- Entre 30 et `min_publish_size` (200) : résultats visibles, bandeau orange « usage interne — non publiable ».
- ≥200 : bouton **« Figer pour publication »** → snapshot dans `stats_releases` (requête + résultat + versions + n), avec champ titre/canal. C'est le geste qui alimente le registre de provenance.

**Sorties par segment** : les 8 thèmes vs population totale (radar comparatif + IC 95 %), top questions d'écart vs population, distribution des archétypes, effectifs par sous-démographie, export CSV agrégé (jamais de lignes individuelles).

**Comparateur** : deux segments côte à côte (étudiants nantais vs étudiants nationaux) avec le même plancher appliqué à chacun.

**Implémentation** : chaque combinaison de facettes = un appel à une fonction `admin_segment_stats(filters jsonb)` (à écrire sur le pattern §10c du DDL) qui compose le WHERE, applique le plancher, et retourne les agrégats. Pas de SQL libre dans l'UI ; le SQL libre reste dans l'éditeur Supabase pour le fondateur.

## E. Ce que le dashboard ne fera jamais
- Afficher une ligne individuelle (réponses, profil, démographie d'UN utilisateur) — même pour l'admin, il n'y a aucun cas d'usage légitime ; l'absence d'écran = l'absence de tentation = l'argument de confiance.
- Croiser plus de 3 dimensions démographiques (au-delà, tout segment devient minuscule et ré-identifiant).
- Servir un agrégat sans son n.

## F. Phasage
- **Phase 1 (bêta privée)** : A uniquement, en réutilisant FounderDashboard.jsx migré sur les fonctions `admin_*` + login réel. ~2-3 jours de travail.
- **Phase 2 (bêta publique)** : B + C (les mv existent déjà en v6, c'est du front).
- **Phase 3 (10 k+ consentants recherche)** : D — c'est lui qui transforme la base en « machine à études ».

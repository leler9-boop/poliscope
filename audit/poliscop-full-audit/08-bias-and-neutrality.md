# Biais et neutralité

Synthèse croisée des constats de biais remontés par les 4 subagents et le coordinateur, organisée selon les 4 catégories de la mission. Chaque biais est accompagné d'un exemple précis, de son impact, d'une sévérité et d'une correction recommandée.

## 1. Biais mathématiques

| Biais | Exemple précis | Impact | Sévérité | Correction |
|---|---|---|---|---|
| Poids par défaut non égaux | `useStore.js:65`, `priorityOrder: [...THEMES_ORDER]` → poids 8→1 par ordre de déclaration si l'utilisateur ne reclasse pas ses priorités | Un écart identique sur ECONOMY (poids 8) vs PUBLIC_SERVICES (poids 1) produit 13 points de compatibilité d'écart, sans lien avec une intention de l'utilisateur | **Élevé** (POL-AUDIT-013) | Poids égaux par défaut tant que l'utilisateur n'a pas explicitement classé ses priorités |
| Valeur de référence incohérente pour un courant entier | `ideologicalCurrents.js:298`, GLOBAL=85 pour un courant souverainiste | Un utilisateur europhile matche mieux (96%) avec ce courant qu'un utilisateur réellement souverainiste (78%) | **Critique** (POL-AUDIT-010) | Corriger la valeur à ~15-20 |
| Axe GLOBAL structurellement sous-protégé | GLOBAL absent des thèmes vétoïsés ; 3 curseurs de raffinement inversés sur ce même axe | Le clivage pro-UE/souverainiste — pourtant central en France — est le seul des grands clivages identitaires à ne bénéficier d'aucun garde-fou anti-faux-positif | **Élevé** (POL-AUDIT-011, 012) | Voir [05-matchmaking-audit.md](05-matchmaking-audit.md) |
| Cumul multiplicatif du veto non documenté | Désaccord modéré sur 5 thèmes ≈ désaccord extrême sur 1 seul | Peut sur- ou sous-pénaliser selon le profil, sans que le choix soit assumé explicitement | Moyen (POL-AUDIT-015) | Documenter comme choix assumé ou plafonner |
| Trou de couverture pour le souverainisme modéré | Aucun archétype distinct du `national_populiste`/`patriote_social` pour un profil modéré mais eurosceptique | Un souverainiste modéré (type gaulliste) peut être étiqueté « extrême droite » | Moyen (POL-AUDIT-021) | Ajouter un archétype dédié |

Ces biais sont documentés en détail dans [04-scoring-methodology.md](04-scoring-methodology.md) et [05-matchmaking-audit.md](05-matchmaking-audit.md). Point positif à souligner : **aucun biais mathématique structurel favorisant systématiquement un camp politique n'a été détecté** — les biais trouvés sont soit des erreurs de données isolées (POL-AUDIT-010, 011), soit des effets de bord non documentés d'un choix de conception par ailleurs défendable (veto, exposant), pas un favoritisme construit.

## 2. Biais éditoriaux (questions)

| Biais | Exemple précis | Impact | Sévérité |
|---|---|---|---|
| Présupposé idéologique dans l'énoncé | `IMM_13` : « les enfants d'immigrés doivent s'identifier à la France d'abord » | Cadre le débat autour d'une prémisse contestée avant même la réponse | Élevé |
| Explication non équilibrée | `SEC_9`/`SOC_21` citent le Portugal favorablement sans contrepoint (seuls cas sur 162) | Rupture ponctuelle avec le standard « deux camps » sinon respecté partout ailleurs | Faible |
| Formulations absolutistes | `ENV_1`, `DEM_4`, `GLO_5`, `SOC_19` | Compriment artificiellement le centre de l'échelle, exagèrent la polarisation apparente | Moyen |

Détail complet dans [02-question-audit.md](02-question-audit.md). Aucun déséquilibre volumétrique flagrant entre thèmes associés à un camp donné n'a été détecté — les 17 questions doubles et les formulations absolutistes touchent les 8 thèmes de façon à peu près proportionnelle, pas un camp en particulier.

## 3. Biais de données

| Biais | Exemple précis | Impact | Sévérité |
|---|---|---|---|
| Profondeur documentaire inégale entre élections | `candidatePolicies.js` (contexte politique détaillé affiché quand l'utilisateur est proche d'un candidat) ne couvre que 4 des 9 élections (`fr_2022`, `fr_2027`, `paris_2026`, `us_2020`) — `de_2025`, `es_2023`, `eu_2024`, `it_2022`, `uk_2024` n'ont pas ce niveau de détail | Un utilisateur proche d'un candidat allemand/espagnol/italien/britannique reçoit une explication moins riche qu'un utilisateur proche d'un candidat français/américain, sans lien avec la qualité réelle des données de positionnement (qui, elles, sont structurellement homogènes — voir §5 de [05-matchmaking-audit.md](05-matchmaking-audit.md)) | Moyen (constat de cartographie, non re-vérifié en détail par un subagent dédié) |
| Fraîcheur inégale entre entités | Voir [06-political-data-audit.md](06-political-data-audit.md) — la fraîcheur des données n'est pas uniformément mauvaise : elle est concentrée sur les situations en mouvement rapide (verdict judiciaire, remaniement), pas sur l'ensemble du corpus | Un utilisateur ne peut pas distinguer une donnée fiable d'une donnée dépassée sans audit externe — absence de champ de fraîcheur structuré (voir [07-sources-and-freshness.md](07-sources-and-freshness.md)) | Élevé |
| Multiplicité de schémas Supabase sans source de vérité unique | `schema.sql`/`v2`/`v3`/`v4` coexistent, `DEPLOYMENT.md` ne connaît que la version 1 | Risque de divergence entre ce que le code attend et ce qui est réellement déployé | Moyen |

## 4. Biais de présentation

| Biais | Exemple précis | Impact | Sévérité | Correction |
|---|---|---|---|---|
| Taxonomie de filtre asymétrique gauche/droite | `src/pages/FrenchFigures.jsx:27-34` — filtre `FAMILIES` propose `Centre/Gauche/Droite/Extrême droite/Écologie` : une catégorie « Extrême droite » filtrable et colorée existe, **aucune catégorie « Extrême gauche »** équivalente, alors que le texte éditorial qualifie déjà Mélenchon de « gauche radicale » et le range pourtant dans le même bucket `left` que des figures PS modérées | Effet UI réel (filtre cliquable + couleur dédiée) : la droite radicale est visuellement isolée/nommée comme telle, pas la gauche radicale | **Élevé** (POL-AUDIT-035) | Ajouter une catégorie `far_left` cohérente avec le texte éditorial existant, ou uniformiser dans les deux sens |
| Couleur à connotation implicite | `THEME_COLORS.IMMIGRATION = '#ef4444'` (rouge alerte/danger) — seul thème sur 8 dans cette teinte, les 7 autres en teintes neutres à positives | Connotation de danger associée visuellement à l'immigration dans le RadarChart et partout où la palette est réutilisée, alors que SECURITY/SOCIAL (tout aussi clivants) reçoivent des teintes neutres | Moyen (POL-AUDIT-036) | Remplacer par une teinte neutre cohérente avec la palette |
| Effet de seuil (cliff effect) sur le pourcentage de compatibilité | `alignmentColorClass`/`alignmentBarColor` (seuils 70/50/30) et `alignmentLabel` (seuils 70/50/**35**/20) utilisent des paliers différents entre eux ; un score de 49 affiche ambre+« Compatibilité modérée », un score de 51 affiche bleu+« Forte compatibilité » | Un écart de 2 points — probablement sous la marge d'approximation du modèle lui-même — produit un changement complet de catégorie visuelle et textuelle, sans aucune indication d'incertitude affichée nulle part dans `MatchCard.jsx` | **Élevé** (POL-AUDIT-037) | Harmoniser les seuils des deux fonctions ; afficher une fourchette plutôt qu'un chiffre unique ; relier le champ `confidence` (déjà calculé par `scorer.js`) à l'affichage du match |
| Page « Transparence » factuellement inexacte sur son propre fonctionnement | Voir [04-scoring-methodology.md](04-scoring-methodology.md) §4 — omission du veto, affirmation fausse sur la pondération égale par défaut | Contredit directement la promesse de neutralité/simplicité du produit : la page dont la fonction est d'être honnête contient deux inexactitudes vérifiables | **Élevé** (POL-AUDIT-042) | Réécrire la section pondération + ajouter une mention du veto |
| Promesse de confidentialité inexacte | `Transparency.jsx` : « vos réponses ne quittent jamais l'appareil sauf création de compte » — contredit par `useStore.js:247-257` (réponses anonymes envoyées à Supabase dès que configuré) | Utilisateur induit en erreur sur la collecte réelle de ses données, dans le contexte spécifique d'opinions politiques (donnée sensible RGPD Art. 9) | **Élevé** (POL-AUDIT-043) | Corriger l'affirmation ou changer le comportement pour le faire correspondre |

### Vérifications négatives (pas de biais trouvé — à signaler pour la traçabilité de l'audit)

- **Couleurs de partis** : `elections.js`/`candidatePolicies.js` utilisent le branding réel des partis (RN/Reconquête en bleu marine, LFI/PCF en rouge, EELV en vert) — pas de code couleur maison assimilant un camp au danger au-delà du cas IMMIGRATION ci-dessus.
- **Longueur/qualité des biographies** : échantillon ciblé de 5 figures (Macron, Le Pen, Zemmour, Mélenchon, Jadot, Wauquiez) dans `frenchFigures.js` — gabarit strictement identique, mention critique factuelle systématique des deux côtés du spectre (condamnation judiciaire pour Le Pen/Zemmour, fonctionnement interne critiqué pour Mélenchon et Retailleau).

## 5. Verdict global sur la neutralité

Le corpus éditorial (questions + biographies) est globalement équilibré et ne présente pas de biais volumétrique ou de camp construit — les défauts trouvés (questions doubles, présupposés isolés) sont répartis sur l'ensemble du spectre politique, pas concentrés sur un camp. Les biais les plus significatifs identifiés sont **structurels et non intentionnels** : une asymétrie de taxonomie de filtre (gauche radicale non nommée alors que la droite radicale l'est), un axe (GLOBAL/souverainisme) insuffisamment protégé par le moteur mathématique, et surtout un écart entre ce que la page de méthodologie promet et ce que le système fait réellement. C'est ce dernier point — la véracité de la promesse de transparence elle-même — qui constitue le risque de neutralité perçue le plus sérieux, davantage que le contenu politique en tant que tel.

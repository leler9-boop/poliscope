# 06 — Neutralité et biais

## Le plus important d'abord
Les deux inversions de convention corrigées (rapport 02) étaient, de fait, **les plus gros biais du produit** — non idéologiques dans l'intention, mais idéologiques dans l'effet : la page /france écrasait systématiquement la compatibilité des profils tranchés (droite nationale ET gauche radicale) au bénéfice du centre-gauche modéré ; les courants pénalisaient tous les profils pro-européens. C'est corrigé.

## Analyse des changements éditoriaux récents (les 30 questions relues)
- **Vocabulaire** : neutre. Les reformulations retirent des présupposés (« dominent trop » → « doivent être encadrés » ; « Pour vraiment protéger » supprimé) — dans les deux directions politiques.
- **Équilibre pour/contre** : les 11 rééquilibrages ajoutent des contre-arguments dans les deux sens (un argument PRO-gestion privée ajouté à PUB_17, un contra à la protection des lanceurs d'alerte SEC_21, un contra aux droits des demandeurs d'asile IMM_2). Pas de motif partisan détectable.
- Résidus mineurs : SEC_5 (études vs opinions, penche anti-répressif), DEM_21/DEM_25 (diagnostic affirmé puis contre-argument) — 3 cas sur 46 lus, sans direction commune.

## Structure
- **Veto** : IMMIGRATION/GLOBAL à seuil 30 vs SOCIAL/SECURITY/PUBLIC_SERVICES à 42, DEMOCRACY/ENVIRONNEMENT sans veto. Effet : les désaccords identitaires « droite » (immigration, souveraineté) écrasent plus vite que les désaccords identitaires « gauche » (écologie n'écrase jamais). Sur le banc synthétique, l'effet net reste symétrique (chaque famille retrouve les siens), mais un écologiste radical garde des scores non-écrasés avec des productivistes là où un souverainiste voit les siens écrasés avec des europhiles. **Pas un biais démontré, mais une asymétrie de modélisation non documentée** — à assumer par écrit ou à combler (veto ENVIRONMENT ~42/0.82).
- **Taxonomie de filtre** (POL-AUDIT-035) : toujours asymétrique sur la page /france — familles « Extrême droite » (4 figures) et « Gauche » (8 figures, incluant LFI) sans catégorie « Extrême gauche ». Le choix de classement de LFI dans « left » est défendable, mais l'asymétrie de nommage demeure. Non corrigé (choix éditorial, pas mécanique).
- **Couleur rouge du thème IMMIGRATION** (THEME_COLORS `#ef4444`) : toujours en place — seul thème en rouge « danger ». Signalé par le premier audit, jamais tranché.
- **Centre avantagé par défaut** : l'attracteur central (stretchScore + profils cibles centristes nombreux) et le défaut priorityOrder favorisent mécaniquement les figures modérées pour les profils peu remplis. Mitigé par l'indicateur de confiance ; documenté ; acceptable en l'état pour une bêta.
- **Correction du bouton « comptent autant »** (`00f6d40`) : supprime un biais silencieux réel — les 8→1 donnaient à l'Économie 8× le poids des Services publics pour quiconque cliquait le skip, ce qui déformait systématiquement les matchs vers l'axe économique.

## Verdict neutralité
Aucun biais volontaire détecté ; le travail éditorial a *réduit* les biais existants. Restent 3 chantiers assumables : asymétrie du veto (documenter ou combler), taxonomie extrême droite/gauche (décision éditoriale), couleur du thème IMMIGRATION (décision design).

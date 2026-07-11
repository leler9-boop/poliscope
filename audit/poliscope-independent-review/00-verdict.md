# 00 — Verdict du contre-audit indépendant (2026-07-11)

Contre-auditeur indépendant des missions précédentes. Méthode : rapports existants comme index, vérification par diffs Git, relecture intégrale du moteur, banc de test sur le moteur réel (12 profils synthétiques × 3 jeux de cibles), relecture individuelle des 30 questions modifiées/ajoutées + échantillon stratifié de 16, re-vérification web indépendante des faits instables, parcours navigateur réels (desktop + mobile), re-vérification code des affirmations RGPD, appel API réel à Supabase.

## Conclusion honnête, en trois phrases

1. **Le travail des missions précédentes est réel, rigoureux et honnête** : sur ~40 affirmations vérifiées (commits, corrections, chiffres, comportements de code), je n'en ai trouvé **aucune fausse** — y compris l'exactitude remarquable des données Le Pen/aide à mourir/SMIC/titres de séjour, revérifiées à la source.
2. **Mais tout ce monde a raté le plus gros bug du produit** : deux fichiers de données de référence (`frenchFigures.js`, `ideologicalCurrents.js`) étaient encodés dans des conventions d'échelle incompatibles avec le moteur — la page « Figures françaises » classait Carole Delga au-dessus de Marine Le Pen pour un profil de droite nationale (34 %), et tous les profils pro-européens voyaient leur courant naturel pénalisé. Le « fix » célébré POL-AUDIT-010 (GLOBAL 85→18) n'avait corrigé qu'un symptôme d'une inversion de fichier entier.
3. **Corrigé et prouvé pendant ce contre-audit** (10 commits atomiques, garde-fou mécanique ajouté, avant/après démontré sur le moteur réel et en navigateur) — le produit est aujourd'hui **meilleur qu'il ne l'a jamais été, et pour la première fois cohérent sur toutes ses surfaces de matching**.

## Ce qui est excellent (à conserver tel quel)
- Le moteur mathématique (scorer/matcher) : tous les correctifs des lots 1-2 sont réels ; 4/4 tests de régression re-passés.
- Le travail éditorial des 8 lots : 30/30 questions modifiées/ajoutées relues sans une seule erreur de polarité ou de fait ; l'échantillon non-modifié confirme la qualité de base.
- La factualité des données instables retravaillées : exactes au détail près, sourcées, datées, avec dates de péremption tracées.
- L'architecture de consentement RGPD au niveau code : fail-closed, gating vérifié fonction par fonction, promesse UI conforme au code.
- La discipline de processus (commits atomiques, erreur du lot 1 avouée et réconciliée, tests à chaque lot).

## Ce que ce contre-audit a trouvé et corrigé (10 commits)
| Commit | Correction |
|---|---|
| `52ce639` | frenchFigures : IMMIGRATION/SECURITY inversés sur 28 figures (critique) |
| `19e4309` | ideologicalCurrents : GLOBAL inversé sur 11 courants (critique) |
| `d46ffb8` | Garde-fou anti-récidive `scripts/check-profile-conventions.mjs` |
| `4620eb0` | Étiquettes de pôles inversées (Profile + FrenchFigures) — « Très Ouverte » pour 92 restrictif |
| `00f6d40` | « Tous les thèmes comptent autant » appliquait des poids 8→1 — applique désormais l'égalité réelle |
| `a313320` | Résultat des municipales de Paris (Grégoire élu) enfin affiché |
| `5615c58` | 4 rôles périmés (Retailleau, Wauquiez, Darmanin, **Hidalgo encore « Maire de Paris »**) |
| `58d7902`+`7bac397` | Stats landing périmées (120+/40 → 160+/60, deux emplacements) |

Tout est vert après chaque commit : 4 tests de régression, lint, garde-fou conventions, build.

## Ce qui reste ouvert (détail : issues.json + rapport 10)
P0 : backend Supabase inactif (rien de testé en réel), validation juridique, versionnage des données avant première collecte. P1 : fusion hints/explications, mélange des CORE, transparence complète (veto/CORE×5/stretch), fiche Lecornu, cliff 50 %. P2-P3 : neutralité fine, a11y, discipline de publication data.

## Notes /100 (produit réel, pas effort fourni)

| Composante | Note | Justification courte |
|---|---|---|
| Qualité des questions | **84** | 166 questions relues à 100 % par la mission éditoriale, contre-vérifiées ici sans erreur ; retenues : statuts déséquilibrés (28/3/135), résidus mineurs (CTR-017) |
| Qualité des explications | **80** | Équilibrées et exactes ; retenue : les 19 hints masquent l'explication riche sur les questions les plus vues |
| Neutralité | **78** | Aucun biais volontaire ; asymétrie veto non documentée, taxonomie ED/EG et couleur IMMIGRATION ouvertes |
| Couverture politique | **72** | 4 lacunes comblées ; restent décentralisation, souverainisme modéré (archétype), Lecornu absent |
| Scoring | **85** | Sain, testé, documenté en interne ; stretch/CORE×5 non publics |
| Matchmaking | **82 (après correctifs — ~35 avant)** | 12/12 profils synthétiques cohérents sur les 3 jeux de cibles ; cliff 50 % restant |
| Explicabilité | **68** | why-match, badge candidature, indicateur serré ✓ ; Transparence incomplète (veto/pondérations) |
| Actualité | **86** | 0 erreur trouvée sur les faits vérifiés ; rôles corrigés ; mécanisme de fraîcheur en place |
| UX | **78** | Parcours solides desktop+mobile ; ton mélangé, égalités, a11y clavier |
| Code | **75** | Propre, testable ; deux sources de vérité (hints), commentaires périmés, chunk >500 kB |
| Tests | **62** | 4 tests réels + lint + garde-fou conventions ; aucun framework, aucune CI, zéro test UI |
| Supabase | **35** | Bien conçu sur le papier (v1→v5), jamais appliqué ni testé — projet INACTIVE confirmé par API |
| Protection des données | **70 (code) / 40 (global)** | Gating vérifié irréprochable au niveau code ; non testé en réel, non validé juridiquement, mineurs non traités |
| Qualité analytique | **25** | Aucun versionnage, aucune métadonnée de session, seuils de publication inexistants |
| Préparation commerciale | **15** | Stade concept ; principes énoncés bons, rien d'implémenté |
| Préparation bêta (globale) | **62** | Quiz local prêt pour bêta privée ; tout ce qui touche comptes/données ne l'est pas |

## Verdict produit, par périmètre

- **Quiz local (sans compte)** : **PRIVATE BETA READY** — après les correctifs de ce contre-audit ; conditions pour PUBLIC BETA : P1 items 4-7 du plan d'action + re-passe visuelle.
- **Comptes / sauvegarde serveur** : **INTERNAL ALPHA** — code prêt, backend jamais éprouvé, juridique non validé.
- **Contribution statistique / démographie** : **NOT READY** (versionnage + consentement à finalité distincte + age-gate d'abord).
- **Dashboard interne** : NOT READY (PIN faible + backend inactif).
- **Commercialisation des analyses** : **CONCEPT STAGE**.

## Niveau de confiance du contre-audit
Élevé sur tout ce qui a été vérifié par exécution (moteur, banc, navigateur, API Supabase, recherches web) ; moyen sur ce qui reste vérifié par lecture seule (parcours compte/consentement — invérifiable sans backend actif, comme pour les missions précédentes). Le point le plus important à retenir : **les bugs les plus graves de ce produit n'ont jamais été dans le moteur — ils sont dans la cohérence des données de référence entre fichiers.** C'est là que doit porter la vigilance (le garde-fou committé en couvre désormais l'essentiel mécaniquement).

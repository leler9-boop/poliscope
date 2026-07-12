# 10 — Plan d'action priorisé

Classement : impact × urgence, avec difficulté, risque et dépendance humaine. Les correctifs déjà appliqués par ce contre-audit (10 commits) ne figurent plus ici.

## P0 — Avant toute bêta avec comptes (dépendance humaine forte)
1. **Réactiver/recréer le projet Supabase, appliquer schema v1→v5 dans l'ordre, rejouer les parcours consentement/retrait/suppression en conditions réelles** (CTR du rapport 08 ; difficulté moyenne ; décision facturation = humaine).
2. **Validation juridique professionnelle** : base légale art. 9.2.a, mentions, mineurs (CTR-015 — age-gate par tranche ou exclusion des mineurs des comptes). Non négociable, non technique.
3. **`schema_v6_analytics.sql` : versionnage questionnaire/scoring + métadonnées de session** (CTR-008 ; difficulté faible ; à faire AVANT le premier utilisateur réel, impossible rétroactivement).

## P1 — Avant bêta publique du quiz local (faisable sans backend)
4. **Fusionner questionHints dans questions_final.json** (CTR-009 ; ~1 h ; élimine structurellement la classe de bug la plus récidivante du produit).
5. **Mélanger les CORE + rééquilibrer statuts** (CTR-010 ; 1-2 h ; corrige le déterminisme du mode Découverte et la sous-diffusion de SEC_25/SOC_27).
6. **Compléter la page Transparence** (CTR-011 : veto, CORE×5, stretchScore — ou requalifier en « description simplifiée » ; 1 h ; c'est la crédibilité de la promesse « no black box »).
7. **Unifier les seuils couleur/libellé et adoucir le cliff à 50** (CTR-012 ; 30 min).
8. **Fiche Lecornu** (CTR-014 ; rédaction éditoriale humaine + profil à estimer avec sources).
9. **Finir paris_2026** (context au passé, ajouter Knafo — CTR-006 résiduel) et purger `mergeAnonymousAnswers` morte à terme.

## P2 — Qualité et neutralité (cycle suivant)
10. Trancher l'asymétrie de taxonomie extrême droite/gauche et la couleur rouge IMMIGRATION (POL-AUDIT-035 ; décision éditoriale).
11. Documenter ou combler l'asymétrie de veto ENVIRONMENT/DEMOCRACY (CTR-013 ; attendre des données réelles pour calibrer).
12. Retouches éditoriales mineures (CTR-017) + ton unifié vouvoiement + « ex æquo » + indicateur serré sur /france (CTR-016).
13. Accessibilité : alternative clavier au drag des priorités, audit contrastes.
14. Hygiène : commentaires périmés (CTR-018), sécurité PIN du dashboard fondateur (avant tout agrégat démographie×opinions).

## P3 — Data products (stade concept, dépend de P0)
15. Adopter la discipline de publication du rapport 09 (seuils n≥200, IC, « parmi les répondants », contrôles âge/territoire/revenu, correction multi-comparaisons, registre des analyses).
16. Consentement à finalité distincte « études/observatoire » (opt-in séparé du consentement de sauvegarde).
17. Ne rien vendre/publier avant redressement méthodologique documenté.

## Règle permanente ajoutée par ce contre-audit
`node scripts/check-profile-conventions.mjs` à chaque modification d'un fichier de profils politiques (et l'ajouter à toute future CI). Les 4 tests de régression + lint + build restent le socle avant chaque commit de contenu.

# 08 — Contre-audit données / Supabase / RGPD

## État réel du backend (vérifié en direct par ce contre-audit)
`list_projects` (MCP Supabase, 2026-07-11) : projet **« Poliscop v1 » (xjpzqaqzoygcwtcpumfo), eu-west-1, statut INACTIVE** (base Postgres 17.6). Conclusion identique aux rapports précédents, mais cette fois vérifiée par appel API réussi (le projet existe et est en pause, il n'est pas supprimé). Conséquences :
- Aucun flux compte/consentement/suppression n'a JAMAIS été testé contre une vraie base — toutes les validations sont des revues de code. C'est le blocage n°1 avant toute bêta avec comptes.
- Les migrations `schema.sql`→`v5_privacy.sql` ne sont appliquées nulle part. Option : restaurer le projet (`restore_project`) ou en créer un neuf — décision humaine (facturation), non prise ici.

## Contre-vérification des affirmations RGPD (revue de code indépendante)
Toutes les affirmations clés du dossier `rgpd-remediation-2026-07` ont été re-vérifiées sur le code actuel — **toutes exactes** :
1. **Plus aucun chemin d'écriture `anonymous_answers`** : seuls subsistent un SELECT + DELETE (merge legacy) dans anonymous.js ; le merge lui-même est gaté sur `hasPoliticalDataConsent()` (auth.jsx:210). ✓
2. **Analytics fail-closed** : `_politicalDataConsent = false` par défaut ; `question_answered`, `priority_ranking_completed`, `profile_viewed`, `profile_shared` (tous porteurs d'opinion) passent par `trackIfConsented`. Les événements non gatés (landing_view…) ne portent pas d'opinion. ✓
3. **UI** : la promesse « Tes réponses restent sur cet appareil » affichée au pré-quiz correspond au comportement du code. ✓
4. `DataControlsModal` (retrait/suppression/export) et `ConsentModal` présents et câblés depuis Profile.jsx. ✓ (non testables end-to-end sans backend).

## Points restants — confirmés à l'identique
- Validation juridique professionnelle (base légale 9.2.a, mineurs, mentions) : non faite, non négociable avant bêta publique.
- Suppression du compte Auth impossible côté client (email → traitement manuel) : documenté honnêtement.
- RLS `anonymous_id` sans preuve de propriété : limite documentée, schéma v5 non appliqué.
- Données legacy pré-correctif : arbitrage humain toujours ouvert (re-consentement vs purge).
- Dashboard fondateur protégé par PIN faible : à traiter avant tout accès à des agrégats démographie×opinions.

## Mineurs (12-17 ans) — état des lieux
Le parcours sans compte est réellement local-only (aucune donnée ne part) : c'est la bonne base pour un public mineur. MAIS : aucune distinction <15/15-17/18+ dans le flux de consentement, aucun mécanisme d'âge, et le consentement d'un mineur de <15 ans à un traitement art. 9 requiert l'autorité parentale (art. 45 LIL). Tant que les comptes/cloud ne sont pas ouverts, le risque est contenu ; **avant d'ouvrir la sauvegarde cloud à un public incluant des mineurs, il faut soit un age-gate (bande d'âge, sans date de naissance exacte), soit exclure les mineurs des comptes (CGU + case), soit un flux parental — décision DPO/avocat.** Le wording actuel (tutoiement du pré-quiz) suggère d'ailleurs un ciblage jeune sans traitement juridique correspondant.

## Ambition data / exploitation commerciale (défis à retenir)
- Les données seront **pseudonymes, pas anonymes** (user_id/anonymous_id + opinions + démographie dans le même écosystème) : toute communication doit dire « pseudonymisé », et l'« anonymisation réelle » pour publication exige agrégation + seuils (voir rapport 09).
- Le consentement actuel (« données politiques ») ne couvre pas la finalité « études/baromètres/produits médiatiques » : il faudra une finalité distincte, opt-in séparé, avant toute exploitation. Créer un compte ≠ contribuer à la recherche — le code actuel respecte cette séparation, la conserver.
- Aucun échantillon Poliscop ne sera représentatif sans redressement — interdire par principe éditorial toute formulation « les Français pensent » (voir rapport 09).

## Verdict : travail RGPD **réel et bien fait au niveau code** (le contre-audit n'a trouvé aucune faille dans le gating) ; il reste **non prouvé en conditions réelles** (backend inactif) et **non validé juridiquement**. Comptes/cloud : INTERNAL ALPHA au mieux.

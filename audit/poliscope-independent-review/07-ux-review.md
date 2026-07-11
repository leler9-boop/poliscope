# 07 — Revue UX (parcours réels, navigateur, desktop 1600×900 + mobile 375×812)

## Parcours testés
Landing → Sélection de test → Priorités → Quiz (pré-modal, réponse, panneau « Comprendre cet enjeu », avancement, bannière de transition thématique) → Profil (desktop + mobile) → page France → Élections (cartes). Profils de test injectés par localStorage pour les pages de résultat.

## Ce qui fonctionne bien (vérifié)
- **Pré-modal quiz** : conseil de passer les questions sans avis + avertissement anti-réponses-au-hasard — excellente pédagogie psychométrique.
- **Notice RGPD au bon endroit** : « Tes réponses restent sur cet appareil… on te demandera ton accord séparément » affichée avant la première question. Conforme au comportement réel du code (vérifié rapport 08).
- **Panneau « Comprendre cet enjeu »** : ouverture/fermeture propre, contenu correct (hint prioritaire).
- **Avancement** : réponse → transition animée + bannière de thème ; compteur 1/32 correct ; round-robin des thèmes réel.
- **Indicateur de résultat serré** : fonctionne (« Résultat serré — à 1 point de Jordan Bardella (92 %) »).
- **Mobile 375×812** : profil rendu proprement (archétype, chips, meilleur match, axes) ; pas de troncature gênante hormis le nom dans le chip meilleur match (« Marine Le … » — acceptable).
- **Page France** : classement désormais politiquement cohérent (après correctifs), badge « Meilleure correspondance », why-match par figure.

## Problèmes trouvés (dont 3 corrigés en séance)
1. **CORRIGÉ** — Étiquettes de pôles IMMIGRATION/SECURITY inversées sur le profil (« Très Ouverte » pour 92/100 restrictif) en contradiction avec le texte de synthèse de la même page (`4620eb0`).
2. **CORRIGÉ** — Bouton « Tous les thèmes comptent autant pour moi » appliquait des poids 8→1 (`00f6d40`).
3. **CORRIGÉ** — Stats landing périmées (120+/40 → 160+/60, deux emplacements : `58d7902`, `7bac397`).
4. **Tutoiement/vouvoiement mélangés sur le même écran** : le pré-modal quiz dit « Si une question ne *vous* concerne pas… » puis « *Tes* réponses restent sur cet appareil… on *te* demandera *ton* accord ». À unifier (décision de ton globale : le reste de l'app vouvoie).
5. **Égalité parfaite** : « Résultat serré — à 0 point de Jordan Bardella (92 %) » — remplacer par « ex æquo avec Jordan Bardella (92 %) » quand la marge est 0.
6. **Cliff 49/51 %** toujours en place (couleur + libellé basculent ensemble à 50) et échelles couleur/libellé désalignées entre 30 et 35 — non corrigé (choix d'échelle à trancher, POL-AUDIT-037).
7. **Page France** : pas d'indicateur de résultat serré alors que les égalités y sont fréquentes (Le Pen/Bardella 91/91 affichés avec un seul badge « Meilleure correspondance »).
8. Non re-testé ici : création de compte/consentement (backend inactif — voir rapport 08), erreur réseau, reprise après interruption. Le rapport RGPD `02-tests-et-verification.md` les couvre par revue de code uniquement.

## Accessibilité (survol rapide)
Boutons de réponse larges (min-h 56px sur les CTA), labels textuels sous les chiffres 1-5 ✓. Non audité en profondeur : navigation clavier complète, contrastes des chips gris clair, ARIA des réorder-items (drag des priorités sans alternative clavier visible — point à traiter pour un public large).

## Verdict UX : solide pour une bêta privée après les 3 correctifs de séance ; reste du polissage (ton, égalités, cliff, a11y clavier) avant bêta publique.

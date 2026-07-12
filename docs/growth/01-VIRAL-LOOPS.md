# 01 — Boucles virales : spécifications à coder

Retour au [playbook](00-PLAYBOOK.md). Tu codes vite : voici les specs, dans l'ordre de build. Chaque boucle a son incentive, sa mécanique, son instrumentation et son garde-fou. Règle transverse : **tout lien généré porte un `ref` unique** (`/r/:shortid`) → table d'attribution → K-factor mesurable par boucle, par semaine. Sans ça, on pilote à l'aveugle.

## §1. Carte de résultat partageable — S1 septembre (le socle)

- **Mécanique** : à la fin du quiz, génération d'une image (canvas côté client ou endpoint OG) en 2 formats : story 9:16 et post 1:1. Contenu : **archétype nommé** (réutiliser les 18 archétypes existants — c'est l'équivalent du « INFJ » de 16personalities : identitaire, mémorisable, discutable) + mini-radar 8 thèmes + « poliscop.fr » + QR discret. **Jamais de candidat sur l'image** (risque politique : la carte circule hors contexte).
- **Incentive** : l'identité. On partage « qui on est », pas une pub.
- **UX critique** : le bouton « Partager mon profil » est LE CTA de l'écran de résultat (pas un icône perdu). Prévisualisation de l'image avant partage. Web Share API mobile + téléchargement desktop.
- **Instrumentation** : % quiz terminés → partage (cible ≥8 %) ; sessions arrivées par QR/lien de carte.
- **Garde-fou** : l'archétype doit être *flatteur dans tous les camps* — relire les 18 libellés avec ce filtre (personne ne partage un résultat qui le ridiculise).

## §2. « Compare avec un ami » — S2 septembre (la boucle K principale)

- **Mécanique** : après le résultat, « Découvre si ton pote pense comme toi » → lien privé unique. L'ami passe le quiz → écran de comparaison côte à côte : % de convergence global, le thème où vous êtes le plus d'accord, celui où vous divergez le plus, vos deux archétypes. L'initiateur reçoit une notification (email/push PWA) à chaque comparaison → il revient → il renvoie le lien à quelqu'un d'autre.
- **Incentive** : la curiosité relationnelle (« on est d'accord, en vrai ? ») — plus forte que l'identité seule ; c'est la mécanique des repas de famille et des couples, les deux contextes de partage les plus puissants du produit.
- **Privacy by design** : on partage le *lien*, jamais les réponses ; la comparaison ne s'affiche que si les DEUX ont terminé ; révocable.
- **Instrumentation** : invitations envoyées / acceptées / complétées ; c'est le K-factor principal. Cible : 1 quiz terminé sur 5 génère ≥1 invitation, ≥40 % d'acceptation.
- **Extension déc.** : « Compare avec tes parents » (campagne de Noël du playbook) — même feature, framing différent.

## §3. Question de la semaine — S5 septembre (le zéro-friction)

- **Mécanique** : une question Likert votable **sans inscription** sur une URL dédiée ; le résultat agrégé s'affiche *après* le vote (« 62 % des 8 342 votants pensent que… — et toi, où es-tu vraiment ? → test complet »). Version **iframe embeddable** fournie (médias étudiants, blogs de profs, newsletters → distribution + backlinks).
- **Incentive** : coût d'entrée nul + curiosité du « où est tout le monde ».
- **Garde-fou légal** : questions de fond (jamais « pour qui voteriez-vous »), terminologie « les votants Poliscop », jamais « les Français ». Pas de question électorale les week-ends de scrutin (gel codé).
- **Instrumentation** : votes → clics « test complet » (cible ≥15 %).

## §4. Mode duel « Devine mes réponses » — novembre

- **Mécanique** : A termine le quiz, défie B : B doit *prédire* les positions de A sur 8 questions clés avant de voir ; score de connaissance mutuelle en % ; puis B fait son vrai test ; révélation croisée. Format natif TikTok (couples, potes, parents-enfants filmés en split).
- **Incentive** : le jeu social (« tu me connais si mal que ça ? ») — le format vidéo se filme tout seul, c'est du contenu créateur clé en main.
- **Effort** : ~1 semaine dev. Ne le construire que si §2 confirme (K >0,3) — même muscle, version gamifiée.

## §5. Codes groupe — novembre (classe, BDE, Discord)

- **Mécanique** : quiconque crée un code ; chaque participant qui le saisit alimente un agrégat anonyme ; l'écran groupe (projetable) n'apparaît qu'à ≥10 participants : répartition des archétypes, thème prioritaire du groupe, question la plus clivante du groupe. **Répartitions, jamais de classement d'individus.**
- **Sert 3 canaux d'un coup** : profs (mode classe — même feature, flag sans candidats), soirées BDE, serveurs Discord.
- **Instrumentation** : groupes créés, participants/groupe (santé : médiane ≥12).

## §6. Challenge inter-campus — janvier

- **Mécanique** : leaderboard public du **taux de participation** par établissement (participants/effectif, auto-déclaratif à la création du groupe) — on classe l'engagement, JAMAIS les opinions (« Sciences Po Lille : 34 % de participation » et non « l'école la plus à gauche » — garde-fou absolu, un classement politique des écoles serait repris de travers en 24 h).
- **Incentive** : la fierté de campus + la compétition inter-IEP/écoles, relayée par les BDE eux-mêmes.
- **Récompense** : l'agrégat détaillé de son campus (contenu que le BDE republie).

## §7. Programme ambassadeurs — novembre (humain, pas que produit)

- **Mécanique** : lien personnel `?amb=prenom` ; dashboard perso (personnes amenées) ; paliers : 25 → carte ambassadeur numérique, 100 → accès aux agrégats en avant-première, 250 → mention au mur des ambassadeurs + lettre de recommandation du fondateur (ça compte pour un étudiant). Jamais d'argent (budget nul + ça dénaturerait la démarche civique).
- **Cible** : 30-50 étudiants motivés (recrutés via les événements BDE et les DM des plus actifs en commentaires).
- **Instrumentation** : utilisateurs/ambassadeur ; un bon programme = 20 % des ambassadeurs font 80 % du volume — c'est normal, nourrir les 20 %.

## §8. Badges — UNIQUEMENT partageables (décembre, si temps)

Pas de streaks (verdict [playbook](00-PLAYBOOK.md) mission 9). Trois badges max, tous conçus pour la story : « Édition janvier 2027 » (early adopter, rare plus tard), « 100 % — j'ai répondu aux 64 questions », « Éclaireur — j'ai fait tester 5 personnes ». Un badge est une *carte de partage de plus*, rien d'autre.

## §9. Boucles refusées (et pourquoi)

- **Classement des utilisateurs par « pureté » idéologique** : gamification toxique, presse assurée dans le mauvais sens.
- **Partage automatique** (auto-post du résultat) : dark pattern, contraire à la doctrine données.
- **Parrainage récompensé en argent/lots** : requalifiable en incitation, budget inexistant, et signal marchand sur un produit civique.
- **« Suis-je compatible avec mon crush »** en mode matching amoureux : drôle, viral… et transforme la marque en gadget — le capital « sérieux » est ce qui nous distingue des 8 concurrents.

## Tableau de bord unique (à coder en S1)

Page interne `/growth` : quiz/jour (+ cumul vs plancher/objectif du mois), K-factor par boucle, % partage, top sources UTM 7 jours, votes question de la semaine, groupes actifs, ambassadeurs actifs. Consultée chaque lundi (rituel du playbook) — si une métrique n'est pas sur cette page, elle n'existe pas.

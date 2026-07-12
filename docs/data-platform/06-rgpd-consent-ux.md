# 06 — Consentements, wording et UX de collecte

Principe produit : **la donnée se mérite**. On ne demande rien avant d'avoir donné (le résultat), on explique toujours à quoi ça sert, on rend le refus aussi confortable que l'accord. Zéro dark pattern : pas de case pré-cochée, pas de couplage, pas de bouton refus grisé/caché, pas de re-demande harcelante.

## 1. Les quatre finalités (une case chacune, jamais fusionnées)

| Finalité (`purpose` v6) | Ce que ça autorise | Quand c'est proposé |
|---|---|---|
| `cloud_save` | Sauvegarder MES réponses/profil sur mon compte (multi-appareils) | Au clic « Enregistrer » — existant, conservé |
| `research` | Compter mes réponses dans les **statistiques agrégées** publiées | Après le résultat (moment 2 ci-dessous) |
| `demographics` | Stocker mes réponses socio-démographiques (pour affiner ces statistiques) | Après acceptation de `research` uniquement |
| `marketing` | Recevoir des emails (baromètres, nouveautés) | Jamais dans le flux quiz — page compte seulement |

Découplage total : on peut sauvegarder sans contribuer, contribuer sans sauvegarder (auth anonyme v6 : un uid sans email suffit), et tout retirer indépendamment. `demographics` sans `research` n'a pas de sens produit → la carte démographie n'apparaît qu'après `research` accordé.

## 2. Les moments de collecte (UX)

**Moment 0 — avant le quiz** : rien. On garde l'encart actuel « Tes réponses restent sur cet appareil » (à harmoniser au vouvoiement).

**Moment 1 — pendant le quiz** : rien. Jamais.

**Moment 2 — après la révélation du résultat** (l'utilisateur vient de recevoir de la valeur ; il a vu des stats « X % des répondants ») : une carte discrète sous le profil, pas un modal bloquant :

> **Faire compter vos réponses ?**
> Poliscop publie des statistiques anonymisées sur ce que pensent ses répondants — jamais rien d'individuel. Vous pouvez y ajouter les vôtres.
> [ Ajouter mes réponses aux statistiques ] [ Non merci ]
> *Révocable à tout moment. Aucune donnée n'est vendue. [Comment ça marche →]*

**Moment 3 — juste après un « oui » au moment 2** (principe de l'engagement progressif) : proposer les 3-4 questions Tier 1 les plus courtes, une par écran, façon quiz (le geste que l'utilisateur vient de faire 32 fois) :

> **Pour que vos réponses comptent mieux** (facultatif, 30 secondes)
> Ces informations restent par grandes catégories et servent uniquement aux statistiques de groupe.
> Tranche d'âge → [pills] · Je préfère ne pas répondre
> *(puis genre, type de commune, département)* — à chaque écran : [Passer] aussi visible que les réponses.

**Moment 4 — quelques jours plus tard** (retour sur le profil, ou email si marketing accordé) : la relance douce unique, **une seule fois**, adossée à de la valeur rendue :

> « Votre profil vous situe parmi les répondants Poliscop. Complétez 3 informations (études, activité, logement) pour découvrir comment votre groupe pense — et affiner nos statistiques. »

**Moment 5 — au fil de l'eau** : les variables Tier 2 restantes, UNE à la fois, contextualisées à ce que l'utilisateur regarde (il consulte la carte de France → « votre département ? » ; il lit le baromètre médias → « votre source d'info principale ? »). Plafond global : jamais plus d'une sollicitation par session.

**Anti-patterns bannis** : modal de démographie avant résultat, compteur de complétude culpabilisant (« profil complété à 40 % ! »), re-demande après un « Non merci » (le refus est stocké et respecté ; seule une action volontaire de l'utilisateur — page « Mes données » — rouvre la question).

## 3. Textes proposés (v `2026-07`, à verser dans `consent_texts` après validation juridique)

**`research` (le texte au clic « Comment ça marche »)** :
> **Ce que nous faisons** : vos réponses au questionnaire rejoignent une base statistique. Nous publions uniquement des résultats de groupe (par exemple « 62 % des 18-24 ans répondants sont favorables à… ») calculés sur au moins 200 personnes, jamais moins.
> **Ce que nous ne faisons jamais** : publier ou vendre des réponses individuelles ; transmettre votre profil à des partis, entreprises ou annonceurs ; croiser vos réponses avec votre identité dans nos publications.
> **Vos droits** : retirer ce consentement à tout moment (vos réponses sortent des prochains calculs), supprimer vos données, en obtenir une copie — bouton unique dans « Mes données ».
> **Base légale** : votre consentement explicite (art. 9.2.a RGPD), car des opinions politiques sont des données sensibles. Durée : tant que votre consentement est actif.

**`demographics`** :
> Ces informations (âge, département, études…) sont enregistrées **par grandes catégories uniquement** et servent à une seule chose : rendre les statistiques de groupe plus précises. Chaque question est facultative. Elles suivent le même régime que vos réponses : retirables, supprimables, exportables, jamais vendues.

**`cloud_save`** (existant, reformulation légère) :
> Vos réponses et votre profil seront enregistrés sur votre compte pour les retrouver sur tous vos appareils. Sans cette sauvegarde, ils restent uniquement sur cet appareil. Données sensibles (opinions politiques) : nous demandons donc votre accord explicite. Révocable et supprimable à tout moment.

**Le pied de page de confiance (partout où l'on demande quelque chose)** :
> Vos données vous appartiennent. Jamais vendues, jamais individuelles, toujours révocables. [Notre engagement complet →]

## 4. Page « Mes données » (extension du DataControlsModal existant)
Un seul écran, quatre lignes-interrupteurs (état + date de décision, lisibles depuis `v_consent_current`) + trois boutons : **Exporter** (→ `export_my_data()`), **Retirer un consentement** (par ligne), **Tout supprimer** (→ `delete_my_account()`, désormais réellement self-service, compte inclus — l'e-mail au support disparaît). Texte de confirmation de suppression : sobre, sans culpabilisation (« Cette action est immédiate et irréversible. Vos réponses seront retirées des prochains calculs statistiques. »).

## 5. Mineurs — décision à prendre (options, non tranché ici)
Rappel : consentement art. 9 d'un <15 ans → autorité parentale (art. 45 LIL). Trois options :

| Option | Contenu | Coût | Risque résiduel |
|---|---|---|---|
| **A. Quiz pour tous, données 15+** *(recommandée)* | Le quiz local reste sans condition d'âge (aucune donnée ne part). Toute finalité serveur (`cloud_save`/`research`) exige de cocher « J'ai 15 ans ou plus » (case simple, pas de date de naissance — minimisation). La tranche 15-17 existe dans le schéma. | Très faible (une case) | Fausse déclaration possible — assumée et documentée (standard du marché) ; wording DPO à valider (15 = seuil français art. 45 LIL) |
| B. Données 18+ | Idem avec seuil 18, tranche 15-17 supprimée | Très faible | Perd le segment lycéen (analytiquement intéressant) ; plus simple juridiquement |
| C. Flux parental <15 | Vérification parentale réelle | Élevé (produit + juridique) | Disproportionné au stade actuel |

**À faire dans tous les cas** : unifier le ton (le tutoiement actuel du pré-quiz suggère un ciblage mineur sans le régime juridique correspondant).

## 6. Données legacy (rappel de la décision ouverte, inchangée)
Options (a) re-consentement au prochain login / (b) purge — documentées dans schema_v5. La v6 sur projet neuf rend le point théorique (pas de données réelles migrées), mais la décision reste à acter si l'ancien projet est réactivé.

## 7. Ce qui doit passer devant un professionnel avant bêta publique
1. Les 4 textes du §3 (formulation exacte des mentions art. 13).
2. Le choix mineurs (§5) et son wording.
3. L'AIPD (analyse d'impact) : traitement art. 9 à grande échelle → AIPD probablement obligatoire (art. 35). Le présent dossier (docs 01-08) en constitue la matière première technique.
4. La politique de conservation chiffrée (`platform_config.retention_*`) et sa mention dans Privacy.jsx.

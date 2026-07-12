# 04 — Stratégie académique : plan exécutable

Retour au [sommaire](02-positionnement.md). Réponse directe à l'intuition « contacter des milliers d'établissements » : **non — et voici le plan qui marche à la place.**

## 1. Les trois faits qui invalident l'emailing de masse

1. **L'unité de décision n'est pas l'établissement, c'est l'enseignant.** Un outil web gratuit, sans compte élève et sans données personnelles s'utilise dans le cadre de la liberté pédagogique du professeur (EMC, HGGSP, SES). Écrire à `ce.RNE@ac-...` = écrire au secrétariat du chef d'établissement, qui n'a ni le temps ni la compétence disciplinaire pour évaluer l'outil, et dont le réflexe face à un objet « politique » est le refus prudentiel. Conversion attendue du froid institutionnel : bien inférieure à 1 % — pour un canal dont la valeur repose sur la confiance, le rapport bénéfice/risque est mauvais.
2. **Le produit actuel n'est pas montrable en classe tel quel.** La neutralité du service public d'éducation (Code de l'éducation, art. L511-2 : pluralisme et neutralité ; stricte neutralité des personnels) pèse sur l'enseignant, pas sur l'objet étudié — étudier les candidats réels est licite (des fiches Édubase/Eduscol le font), mais un *matching individuel élève↔candidat* en collège reste explosif : un parent mécontent + un article suffisent à tuer le canal ET la marque. Nuance issue de la recherche : en **Terminale** (élèves en partie électeurs en avril 2027, programme EMC « la démocratie »), le module candidats est une zone grise défendable — d'où un mode classe **sans candidats par défaut, avec module candidats activable par le prof pour les Terminales**. Le précédent allemand confirme l'exigence de portage neutre : le Wahl-O-Mat est utilisé en classe *parce que* porté par la bpb (agence fédérale), avec kit didactique — et une étude sur 1 189 élèves documente ses effets positifs (connaissances électorales, sentiment d'efficacité politique) : l'argument pédagogique existe, sourcé.
3. **La saisonnalité scolaire est rigide — et exceptionnellement favorable cette année.** Les profs construisent leurs séquences en août-septembre. Or le **nouveau programme d'EMC de Terminale entre en vigueur à la rentrée 2026** et porte sur « la démocratie » : participation, abstention, campagnes électorales, partis — 18 h annuelles, avec pédagogie active recommandée, à 7 mois de la présidentielle. L'alignement produit/programme/actualité ne se représentera pas avant des années. (Collège : 1 h/semaine d'EMC, nouveaux programmes 6e/3e aussi à la rentrée 2026.)

**Urgence concurrentielle** : un acteur (« MonVote2027 ») propose déjà un kit enseignant présidentielle 2027 avec quiz 20 questions, matching candidat et positionnement « zéro donnée, aucun résultat enregistré ». La place « outil de la présidentielle en classe » se prend à la rentrée 2026, pas au printemps 2027. La profondeur de Poliscop (8 thèmes, 166 questions, courants, figures, méthodologie publiée) est l'argument différenciant contre un quiz de 20 questions.

## 2. Le produit à offrir : « Poliscop Classe »

Variante dédiée, dérivée du produit existant à faible coût de dev :

- **Sans matching candidats/partis.** Résultat = position sur les 8 thèmes + courants idéologiques + figures *historiques* (le recul historique désamorce l'accusation de prescription électorale). Le prof peut dire aux élèves « le site complet existe, avec les candidats, pour votre usage personnel » — la conversion vers le produit complet se fait hors les murs, pas en classe.
- **Sans compte, sans email, sans collecte.** Mode session éphémère : l'élève passe le quiz, voit son résultat, rien n'est stocké côté serveur. Pas de données de mineurs = pas de responsabilité de traitement transférée au prof/à l'établissement = pas besoin de DPO académique ni de convention. C'est LA condition qui rend l'adoption « enseignant seul » possible.
- **Un « code classe » agrégé et anonyme** (option, activable par le prof) : la répartition anonymisée de la classe s'affiche au tableau si ≥ 10 participants — support de débat idéal, aucun élève identifiable (réutilise les planchers k-anonymes du doc data 07).
- **Kit pédagogique** (PDF, 8-10 pages) : 1 séquence EMC lycée (2 h : passer le test 25 min, décrypter les axes 30 min, débat structuré 45 min), 1 séquence collège 3e (1 h, version courte), fiche « comment est calculé le score » vulgarisée, charte de neutralité 1 page (qui finance, comment les questions sont écrites, lien Transparence), FAQ objections parents/direction.

Coût de développement estimé : quelques jours (flag `classroomMode` : filtrage du matching candidats, désactivation des appels Supabase, écran code classe). À faire en août 2026.

## 3. Les dix premières classes (septembre-octobre 2026)

Pas de prospection anonyme : du recrutement chaud dans les communautés disciplinaires.

1. **Communautés en ligne de profs d'HG/EMC** : groupes Facebook de professeurs d'histoire-géographie (plusieurs dizaines de milliers de membres cumulés), comptes X/threads de profs influents, forums type Neoprofs. Format : pas une pub — un post « prof-to-prof » sollicitant des *bêta-testeurs pédagogiques* (« je cherche 10 classes pour co-construire une séquence EMC autour d'un test politique neutre et transparent — vos critiques feront l'outil »). Demander de l'aide convertit mieux que proposer un produit.
2. **Associations disciplinaires** : les Clionautes, APHG (histoire-géo), APSES (SES) — proposer un article/présentation de l'outil dans leurs canaux, en assumant la démarche de co-construction.
3. **Café pédagogique et sites de mutualisation EMC** : une brève y crédibilise durablement.
4. **Réseau personnel** : tout prof accessible à ≤ 2 degrés de séparation ; les 3-4 premiers viennent toujours de là.

Cible de sélection des pilotes : diversité assumée (public/privé, urbain/rural, lycée GT/pro, une académie ≠ Paris) — la diversité des pilotes EST un argument institutionnel futur.

**Contrat pilote informel** (1 page) : le prof s'engage à 1 séance testée + 1 questionnaire retour de 10 min + accord de citation anonymisée (« prof d'EMC, lycée public, académie de X ») ; Poliscop s'engage au support direct fondateur (visio 30 min avant la séance) et à intégrer les retours.

## 4. De 10 à 100 classes (nov. 2026 → juin 2027)

- **Témoignages** : 5 verbatims + 1 étude de cas rédigée (« 2 h d'EMC en terminale avec Poliscop Classe ») publiée sur une landing enseignants dédiée (`poliscop.fr/enseignants` : promesse, kit téléchargeable contre email professionnel — début du CRM —, témoignages, charte de neutralité).
- **La séquence présidentielle est l'aimant** : février-avril 2027, tout prof d'EMC cherche une activité élection. Pousser alors le kit via les mêmes communautés + les emails collectés. C'est là que le canal passe de 10 à 100 sans prospection froide.
- **Emailing ciblé, pas massif** : à partir de janvier 2027 seulement, 200-300 établissements *sélectionnés* (lycées avec spécialité HGGSP, gros lycées des académies des pilotes), adresses génériques publiques (annuaire open data de l'Éducation nationale — licite en prospection B2B avec objet professionnel et désinscription, à cadrer RGPD), email nominatif adressé « à l'attention du professeur coordinateur d'histoire-géographie », signé du fondateur, objet sobre : « Une séquence EMC clé en main pour la présidentielle — outil gratuit, neutre, sans données élèves ». Attente réaliste : 30-40 % d'ouverture, 2-5 % de réponse. C'est un appoint, pas le moteur.

## 5. De 100 à 1 000 : l'étage institutionnel (à partir de l'été 2027)

Ne solliciter les institutions qu'avec des preuves : n classes, n académies, verbatims, zéro incident de neutralité.

- **CLEMI** (éducation aux médias — tutelle Éducation nationale) : partenaire naturel n°1, l'angle « décoder les discours politiques » est dans son mandat. Viser une mention dans ses ressources, puis une co-construction.
- **Réseau Canopé** : référencement dans les ressources, ateliers en Atelier Canopé.
- **Édu-Up** (DGESCO) : dispositif de soutien à la production de ressources numériques éducatives — subvention jusqu'à 70 k€ (max 50 % du coût), commission 3×/an, instruction ~45 jours. Double effet financement + quasi-label. Dossier à déposer dès l'automne 2026 (sur la version « courants + figures », pas le matching candidats).
- **CLEMI — Semaine de la presse et des médias, mars 2027** : temps fort national à un mois du 1er tour ; viser une présence dans les ressources de l'édition 2027 (démarche à entamer à l'automne).
- **Educatech Expo (2-4 déc. 2026, Paris)** : y aller en visiteur pour le réseau (rectorats, Canopé, EdTech France) ; un stand ne se justifie pas encore.
- **GAR** : non requis tant que Poliscop Classe reste sans compte ni données — c'est un avantage, pas un manque. À reconsidérer après 2027 seulement.
- **Rectorats** : par les DAAC/référents citoyenneté, académie par académie, en commençant par celles des pilotes.
- **Le modèle économique de l'étage institutionnel** : l'outil élève reste gratuit pour toujours (non négociable, c'est la mission ET l'argument). Ce qui peut se financer : formations enseignants (marché de la formation continue), kits enrichis, interventions, conventions académiques — voir doc 07.

## 6. Objections anticipées (à intégrer au kit et au discours)

| Objection | Réponse |
|---|---|
| « C'est de l'orientation politique d'élèves » | Mode classe sans candidats ; résultat = compréhension d'axes, pas consigne de vote ; méthodologie publique ; charte de neutralité ; le débat en classe est le produit, pas le score. |
| « Qui vous finance ? » | Transparence totale (page dédiée) : autofinancement fondateur + subventions publiques listées + jamais de financement partisan. Cette page doit exister AVANT le premier pilote. |
| « Données de mes élèves ? » | Aucune : mode classe sans compte ni stockage. Vérifiable (pas de formulaire). |
| « Les profils/questions sont biaisés » | Grille de relecture éditoriale documentée (166 questions revues), sources publiques par question, procédure de signalement d'un biais avec engagement de réponse. |
| « Pas le temps » | Séquence 1 h prête à l'emploi, zéro préparation, zéro installation (web, sans compte). |

## 7. Funnel, CRM, indicateurs

- **Funnel** : membre communauté → visite landing enseignants → téléchargement kit (email pro) → séance réalisée → questionnaire retour → témoignage → ambassadeur (présente à ses collègues).
- **CRM** : un simple tableur/Airtable suffit jusqu'à 200 contacts (établissement, académie, discipline, statut funnel, date dernière interaction). Pas d'outil lourd en 2026.
- **KPIs** : classes actives/mois, élèves touchés (auto-déclaré prof), taux kit→séance (cible > 30 %), NPS enseignant, incidents de neutralité (cible : 0), et — mesuré honnêtement — conversion différée élèves → produit complet hors classe (UTM sur le lien « version complète » du mode classe).

## 8. Universités et supérieur (piste distincte, plus légère)

Public majeur → produit complet autorisé, pas de contrainte de neutralité scolaire. Canal : BDE/assos de débat/listes de campagne BDE, junior-entreprises, associations de sciences po ; format événementiel (« soirée boussole » pré-électorale, duel de promos, agrégat anonyme d'école si ≥ seuil). Effort faible, à traiter comme du community marketing (doc 05), pas comme le canal écoles.

## Verdict

**GO sous conditions** : (a) mode classe sans candidats par défaut (module candidats activable par le prof en Terminale) et strictement sans données, (b) recrutement communautaire et non emailing de masse, (c) charte de neutralité et page financement publiées d'abord — **ce qui impose de corriger la page Transparence avant tout contact institutionnel** (elle omet encore le système de veto du matcher et la transformation stretchScore : une contestation « méthodologie incomplète » tuerait le canal), (d) étage institutionnel seulement après preuves. Potentiel réaliste : 10-20 classes T4 2026, 100-300 classes sur la séquence présidentielle, 1 000+ à la rentrée 2027 si relais institutionnel. À ~30 élèves/classe, le canal pèse des dizaines de milliers d'élèves/an — précieux pour la mission et la crédibilité, secondaire pour le volume (le viral grand public se joue au doc 05), et **nul pour le panel data** (pas de collecte mineurs en classe) : ne jamais le justifier par la data.

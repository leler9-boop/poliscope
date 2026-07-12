# 07 — Qualité de la donnée et discipline scientifique

Objectif : que chaque chiffre publié survive à la question « comment savez-vous que ce n'est pas du bruit, des bots, ou un artefact d'échantillon ? ».

## 1. Menaces et parades

| Menace | Signal de détection | Parade (v6) |
|---|---|---|
| **Réponses bâclées** (clics au hasard) | `response_ms` médian < ~1,2 s/question ; complétion 32 q < 90 s | Flag `too_fast` (job `refresh_session_quality`, seuils à calibrer sur les vraies distributions — les valeurs initiales sont des hypothèses à revoir avec les 1 000 premières sessions) |
| **Straight-lining** (même réponse en série) | Suite ≥12 réponses identiques (`straightline_run_max`) | Flag `straightline` ; nuance : une série de « 3 » peut être une vraie neutralité — le flag pondère, n'exclut pas automatiquement |
| **Incohérence interne** | Paires de questions quasi-opposées répondues dans le même sens extrême (à définir : 4-6 paires sentinelles dans le corpus, ex. ENV_23/ENV_25) | Flag `incoherent` (job SQL simple sur response_events) |
| **Multi-comptes / doublons** | Même device → plusieurs uid anonymes ; patterns de réponses identiques à >95 % sur 30+ questions rapprochées dans le temps | Flag `duplicate_suspect`. **Choix assumé : pas de fingerprinting invasif** (contradictoire avec le positionnement confiance) — on accepte un taux de doublons résiduel et on le documente dans la méthodo publiée |
| **Bots / flood** | Rafales d'INSERT par IP (visible dans les logs Supabase), sessions sans aucun app_event de navigation | Rate limiting Supabase (config projet) + CAPTCHA invisible **uniquement** sur l'écriture serveur si abus constaté (jamais sur le quiz local) ; flag `bot_suspect` |
| **Brigading** (raid coordonné pour fausser « les stats ») | Pic d'inscriptions atypique + distribution des réponses anormalement bimodale sur une fenêtre courte + source d'acquisition concentrée | Alerte cockpit (croissance × divergence de distribution) ; en cas de raid avéré : fenêtre exclue des publications, mention méthodo. C'est LE risque spécifique d'un produit politique — le monitoring d'anomalies temporelles n'est pas optionnel |
| **VPN / hors de France** | Pas de géo-IP stockée (minimisation) | Assumé : Poliscop mesure « ses répondants », pas « les résidents français ». Une question déclarative « je réside : France / étranger » peut s'ajouter au Tier 2 si le besoin émerge |

Tous les flags convergent dans `user_quality.quality_score` (0–1). La règle d'usage : `v_research_population` exclut score < 0,5 et les suspects — **les flags dégradent silencieusement, ils ne bannissent jamais l'utilisateur du produit** (son profil local/cloud reste intact ; seule sa contribution statistique est écartée).

## 2. Représentativité : la doctrine

L'échantillon Poliscop sera durablement : plus jeune, plus diplômé, plus urbain, plus politisé que la France. Doctrine en trois niveaux :

1. **Mesurer** : tableau de bord permanent « échantillon vs recensement » sur âge×genre×commune×diplôme (les nomenclatures du doc 03 sont alignées INSEE exprès). Publié en toute transparence dans la page méthodologie.
2. **Formuler** : par défaut, tout chiffre public dit « des répondants Poliscop ». L'expression « les Français » est interdite éditorialement sans redressement.
3. **Redresser (plus tard)** : post-stratification simple sur âge×genre×commune×diplôme (ou raking si cellules creuses) quand n ≥ ~10 000 consentants recherche. Colonne de pondération calculée par job, stockée à part (`user_weights`), jamais appliquée en douce : chaque publication dit « brut » ou « redressé sur X critères ». Même redressé, un panel volontaire n'est pas un sondage aléatoire — la méthodo le dira toujours.

## 3. Protocole de publication (le contrat que chaque chiffre respecte)

1. **Population** : `v_research_population` uniquement (consentement recherche + qualité).
2. **Effectifs** : n ≥ 200 par groupe publié, n ≥ 30 pour tout usage interne, aucune cellule < 5 même dans un fichier téléchargeable. (Valeurs dans `platform_config`, modifiables en un UPDATE documenté.)
3. **Incertitude** : IC 95 % sur toute proportion/moyenne publiée ; pas de décimale au-delà de la précision réelle.
4. **Confusion** : toute corrélation démographie×opinion est contrôlée sur âge + diplôme + commune (régression simple) avant publication ; on publie l'effet brut ET l'effet ajusté s'ils divergent.
5. **Multi-comparaisons** : si l'analyse crible >10 croisements, correction FDR (Benjamini-Hochberg) ou pré-enregistrement des hypothèses du baromètre.
6. **Stabilité** : le signe de l'effet doit tenir sur deux sous-périodes disjointes de l'échantillon.
7. **Provenance** : chaque publication = une ligne `stats_releases` (requête exacte, résultat figé, n, versions questionnaire/scoring, canal).
8. **Formulation** : « parmi les répondants Poliscop » + lien méthodo permanent.

Ce protocole tient en une checklist d'une page à côté de l'explorateur de segments (doc 05 §D) — l'outil applique mécaniquement 1-2-7, l'humain valide 3-6.

## 4. Ce que le versionnage garantit (rappel, implémenté en v6)
Toute réponse porte `(question_id, question_version)` ; tout profil porte `scoring_version` ; toute session porte `questionnaire_version`. Conséquences pratiques : une reformulation de question ouvre une nouvelle version au registre et les analyses temporelles peuvent soit couper à la frontière de version, soit tester l'invariance ; un changement de moteur n'invalide aucun historique (recalculable) ; une réponse de 2026 restera interprétable en 2036 (texte exact retrouvable par hash).

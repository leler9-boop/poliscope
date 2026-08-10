# Protocole de mesure du temps par question

Implémentation : `src/lib/questionTiming.js`. Tests : `tests/lib/question-timing.test.mjs`
(13 tests, horloge injectée).

---

## 1. Ce que l'on mesure, et ce que l'on ne mesure pas

**Ce qu'il ne faut pas faire** : `answered_at − first_shown_at`. Cette différence compte
l'onglet laissé ouvert pendant le déjeuner, la modale de concept ouverte par-dessus la question,
et le temps passé sur une autre page. Elle ne mesure pas la difficulté d'une question, elle
mesure le hasard.

**Temps actif** = somme des intervalles pendant lesquels la question était *réellement visible
et au premier plan*.

Les deux sont conservés : `active_dwell_ms` et `total_elapsed_ms`. Leur **écart** est le signal
intéressant — un écart énorme dénonce un onglet oublié, ce qu'aucune des deux valeurs seule ne
permet de distinguer d'une question difficile.

---

## 2. Horloge monotone

`performance.now()`, jamais `Date.now()`.

`Date.now()` **recule** lors d'une resynchronisation NTP, d'un changement d'heure ou d'un réveil
de veille, et produit alors des durées négatives. Les horodatages absolus (`first_shown_at`,
`answered_at`) restent en `Date` parce qu'ils doivent être comparables entre appareils — mais
**aucune durée n'est calculée à partir d'eux**.

Ceinture et bretelles : un delta négatif n'est jamais soustrait d'un cumul, et le test
« aucune durée négative, même si l'horloge recule » remet volontairement l'horloge à zéro en
cours de mesure.

---

## 3. Démarrage, pause, reprise

| Événement | Effet |
|---|---|
| La question devient visible | `show()` — démarre l'intervalle |
| Changement de question, démontage, sortie de page | `hide()` — solde l'intervalle |
| Onglet caché (`visibilitychange`, `pagehide`) | `block('hidden')` — solde et suspend |
| Onglet revisible | `unblock('hidden')` — reprend |
| Modale de concept, de signalement, écran d'intro, bannière de thème | `block('modal:…')` / `unblock('modal:…')` |
| Réponse envoyée | `recordAnswer()` — solde, puis repart d'un intervalle neuf |

Les causes de masquage forment un **ensemble**, pas un booléen. Fermer une modale alors que
l'onglet est encore caché ne relance donc pas le compteur — cas explicitement testé.

`pagehide`/`pageshow` doublent `visibilitychange` : sur iOS, ce dernier n'est pas émis de façon
fiable au passage en arrière-plan.

Un onglet ouvert **en arrière-plan** ne démarre pas « visible » : l'état initial est lu au
branchement des écouteurs.

---

## 4. Retour à une question précédente

Le temps se **cumule**, le compteur de présentations s'incrémente, et le compteur de
modifications s'incrémente à partir de la **deuxième** réponse seulement — la première n'est pas
un changement d'avis.

Côté base, `private.ingest_responses` applique `greatest()` sur ces trois compteurs : un lot
arrivé dans le désordre ne peut pas faire **reculer** un cumul.

---

## 5. React Strict Mode

En développement, React monte, démonte puis remonte chaque effet. Un compteur naïf enregistre
deux présentations pour une seule question affichée, et les statistiques de « réexposition »
deviennent fausses en développement — donc invérifiables.

**Parade** : une réapparition de la *même* question moins de `STRICT_MODE_GRACE_MS` (120 ms)
après sa disparition est traitée comme la **continuation** de la même présentation.

Le choix d'un seuil déterministe plutôt que d'un `setTimeout` de contournement est délibéré :
avec une horloge injectée, la séquence exacte de Strict Mode (`show` → `hide` → `show`) est
rejouable dans un test. Un contournement asynchrone ne l'aurait pas été.

---

## 6. Valeurs aberrantes

Plafond : **10 minutes** (`MAX_ACTIVE_DWELL_MS`, miroir de `private.max_active_dwell_ms()`).

Au-delà, la valeur est **plafonnée et marquée** (`dwell_capped = true`), jamais supprimée.
L'analyse décide d'exclure ; la collecte constate. Une valeur négative reçue est ramenée à 0 et
marquée elle aussi : elle traduit un défaut de mesure côté client, qu'il vaut mieux voir que
faire disparaître.

Le plafond est appliqué **des deux côtés** — client et base — parce qu'un client peut être une
version ancienne restée en cache.

---

## 7. Analyses disponibles

`public.admin_question_health(questionnaire_version, mode)` :

- temps **p25, médiane, p75, p90** — des percentiles, jamais des moyennes ;
- taux de « sans opinion » ;
- taux de modification ;
- nombre de vues, de réponses, de valeurs plafonnées ;
- nombre de signalements sur la même question.

`public.admin_dropoff_by_position(mode)` : taux d'abandon par position dans la file, par mode
(16 / 32 / 64).

`public.admin_reexposure_comparison(questionnaire_version)` : médiane à la **première**
exposition contre médiane en **réexposition**, et part de réexposition.

> **Pourquoi des percentiles.** Une moyenne est déplacée de plusieurs minutes par un seul
> onglet laissé ouvert ; une médiane ne l'est pas. Sur une question vue 200 fois, trois
> onglets oubliés suffisent à doubler la moyenne — et à faire conclure à tort qu'une question
> est difficile.

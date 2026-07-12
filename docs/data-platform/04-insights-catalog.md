# 04 — Catalogue des analyses publiables

Ce que la plateforme pourra produire, classé par format éditorial et par exigence statistique. Chaque entrée précise : variables nécessaires, n minimal réaliste, et le piège méthodologique associé. La discipline de publication (seuils, contrôles, formulations) est dans le doc 07 — **aucune de ces analyses ne se publie sans la respecter**.

## A. Les classiques solides (publiables dès ~2 000 répondants consentants)

| Analyse | Variables | Format | Piège à contrôler |
|---|---|---|---|
| Le fossé générationnel, thème par thème | âge × 8 thèmes | Graphique en pentes, série « une génération, un thème » | L'âge se confond avec le diplôme et la retraite → toujours montrer les deux |
| Diplôme et rapport à l'Europe / à l'immigration | éducation × GLOBAL/IMMIGRATION | Article + infographie | Diplôme ↔ âge ↔ commune : montrer ajusté ET brut |
| Métropoles vs ruraux : la vraie carte des désaccords | commune_type × top questions discriminantes | Top 10 des questions qui séparent le plus | n rural suffisant ; ne pas essentialiser (« les ruraux » → « les répondants ruraux ») |
| Public vs privé : deux France du travail ? | sector × ECONOMY/PUBLIC_SERVICES | Article différenciant (peu traité ailleurs) | Confusion secteur ↔ PCS |
| Écarts femmes-hommes réels sur 166 questions | genre × questions | « Les 10 questions qui divisent le plus H/F » | Tester la stabilité (doc 07 §stabilité) |
| Propriétaires vs locataires face à la fiscalité | housing × ECO/PUB | Infographie | Patrimoine ↔ âge : ajuster |
| La carte de France des 8 thèmes | dept × thèmes | Carte interactive (le produit d'appel du site) | Planchers par département ; griser sous le seuil |

## B. Les originaux Poliscop (personne d'autre ne peut les faire)
Ces analyses exploitent ce que Poliscop a d'unique : un profil **multidimensionnel continu** (pas un sondage binaire) + la granularité question par question.

1. **« La question qui coupe la France en deux »** — question à la plus forte variance chaque mois (mv_question_stats). Rubrique récurrente auto-générable.
2. **Les incohérences assumées** — paires de questions où les mêmes répondants tiennent des positions en tension (ex. baisser les impôts ET augmenter les services). Très fort éditorialement, jamais moralisateur si bien écrit.
3. **La distance aux candidats, pas le vote** — « les répondants qui matchent X sont à 62 % d'accord avec la position Y de son rival » : le désalignement électeur/candidat, angle inaccessible aux sondages classiques.
4. **Cartographie des archétypes** — poids réel des 18 archétypes dans l'échantillon, leurs démographies, leurs zones de recouvrement (« un tiers des Libéraux-progressistes matchent aussi Social-démocratie à >70 % »).
5. **Évolution intra-individuelle** (le trésor de response_events) — au retest, qui bouge, sur quoi, dans quel sens ? « Après 6 mois, les scores Environnement des 18-24 ont glissé de… » Aucun institut ne suit les mêmes individus gratuitement.
6. **Effet de l'actualité** — les moyennes par thème datées (mv par semaine) autour d'un événement (loi aide à mourir, sommet OTAN). Prudence : échantillon changeant ≠ opinions changeantes → réserver aux cohortes stables ou l'assumer en clair.
7. **Le baromètre de la certitude** — % de « Neutre » et temps de réponse par question : sur quoi les gens n'ont-ils PAS d'avis ? Angle humble et original (« Les 10 questions où la France ne sait pas »).

## C. Les viraux à haut risque (règles renforcées)
« Les propriétaires de chiens sont plus à gauche »-type. Autorisés uniquement via mini-sondages ponctuels (doc 03 Tier 4) et après le protocole complet du doc 07 : ajustement âge/diplôme/commune, correction multi-comparaisons, test de stabilité sur deux sous-périodes, n ≥ 500 par groupe. **Si le signal survit à tout ça, il est publiable ET solide — sinon il n'existait pas.** Position par défaut : peu, tard, parfaitement sourcés.

## D. Produits récurrents (le calendrier éditorial que la donnée alimente)
- **Hebdo** : « La question de la semaine » (auto : top controverse) — tweet/LinkedIn.
- **Mensuel** : baromètre 8 thèmes (moyennes, mouvements, question du mois) — article + PDF.
- **Trimestriel** : un « Regard » thématique approfondi (Europe, sécurité…) croisé sur 3-4 démographies — rapport 15 pages, partenariat média possible.
- **Annuel** : « L'année politique des répondants Poliscop » — le rapport de référence, base des partenariats académiques.
- **Événementiel** : à chaque séquence politique majeure, la lecture Poliscop en 24-48 h (vitesse = avantage concurrentiel vs instituts).

## E. Infrastructure nécessaire (déjà prévue en v6)
Chaque produit ci-dessus se réduit à : `v_research_population` (consentement + qualité) → mv dédiée → fonction d'accès k-anonyme → `stats_releases` (provenance). La seule brique à ajouter au fil de l'eau : une mv par famille d'analyse (pattern §10b du DDL, copier-coller discipliné).

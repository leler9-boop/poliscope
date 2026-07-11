# 08 — Valorisation de l'actif data (analyse, pas décision)

Cadre invariant : **on vend des analyses, jamais des personnes.** Aucune donnée individuelle ou ré-identifiable ne sort, à aucun prix, à personne — y compris chercheurs et partis. Tout produit ci-dessous se fabrique à partir d'agrégats k-anonymes issus de `v_research_population`, tracés dans `stats_releases`.

## Produits envisageables, par maturité

### Horizon 1 — Crédibilité (ne rapporte pas d'argent, rapporte tout le reste)
1. **Observatoire Poliscope** (public, gratuit) : baromètre mensuel + carte + « question de la semaine » (doc 04 §D). C'est le produit d'appel : il crée la marque « données Poliscope », attire les médias et les répondants. À faire en premier, sans exception.
2. **Page méthodologie publique** (échantillon vs recensement, protocole du doc 07) : l'actif de confiance qui conditionne tout le reste.

### Horizon 2 — Revenus B2B éditoriaux (dès ~20-50 k consentants recherche)
3. **Partenariats médias** : exclusivités d'angle (pas de données brutes) — « la lecture Poliscope » d'une séquence politique en 48 h, co-signée. Modèle : licence éditoriale/abonnement rédaction. C'est le produit le plus naturel : rapide, récurrent, et chaque parution recrute des répondants (boucle vertueuse).
4. **Rapports thématiques sponsorisés** (think tanks, fondations, ONG) : un « Regard » trimestriel approfondi financé, avec indépendance éditoriale contractuelle (le financeur choisit le thème, pas les résultats). Risque image si financeur partisan → grille d'acceptation à écrire le moment venu.
5. **Accès chercheurs** : agrégats sur mesure ou microdonnées **anonymisées au sens fort** (agrégation/perturbation, jamais de lignes brutes pseudonymes) sous convention. Modèle : gratuit contre co-publication (crédibilité) d'abord, payant pour les instituts privés ensuite. Un comité/référent scientifique devient nécessaire à ce stade.

### Horizon 3 — Produits data récurrents (100 k+, après redressement)
6. **Abonnement API d'agrégats** (médias, instituts) : les mv exposées proprement, versionnées, avec SLA. C'est l'industrialisation de 3.
7. **Panel longitudinal** : la vraie rareté de Poliscope (response_events = les mêmes individus dans le temps). Études d'évolution d'opinion vendables aux académiques/fondations — aucun institut de sondage ne possède ça en continu.

### Lignes rouges (à écrire dans les CGV le jour venu)
- Pas de vente/location de fichiers, même « anonymisés », à des partis, candidats, ou fins de ciblage électoral. (Au-delà du RGPD : c'est la mort réputationnelle du produit si ça fuite.)
- Pas de publicité ciblée sur données politiques (interdite de toute façon — DSA art. 26.3).
- Pas d'exclusivité totale à un média unique (dépendance + soupçon de ligne éditoriale).
- Tout client accepte contractuellement les planchers de publication du doc 07.

## Ce que ça implique dès maintenant (et qui est déjà dans la v6)
La séparation `research` (finalité consentie distincte), les planchers structurels, `stats_releases` (la facture de provenance jointe à chaque livrable client) et le versionnage : sans eux, aucun de ces produits n'est vendable à un client sérieux. Autrement dit : **la conformité n'est pas un coût, c'est le prérequis du chiffre d'affaires.**

## Décisions fondateur (à trancher plus tard, rien de bloquant aujourd'hui)
- Gratuité vs paywall de l'Observatoire (recommandation : gratuit, c'est le carburant d'acquisition).
- Grille d'acceptation des financeurs (horizon 2, produit 4).
- Statut juridique de l'activité études (si CA récurrent : mentions, TVA, éventuel agrément — question comptable/juridique, pas technique).

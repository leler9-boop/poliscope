# 05 — Vérification factuelle des données instables (recherche web indépendante, 2026-07-11)

Méthode : re-vérification indépendante par recherche web des affirmations à plus fort enjeu réellement affichées, sans réutiliser les sources du travail audité.

## Vérifié EXACT (aucune correction nécessaire)

| Affirmation dans l'app | Vérification indépendante | Statut |
|---|---|---|
| Le Pen : condamnation confirmée en appel le 7/7/2026, inéligibilité réduite à 45 mois dont 30 avec sursis, 15 mois fermes déjà purgés au 30/6/2026, pas d'exécution provisoire de la nouvelle peine → **éligible 2027**, candidature déclarée le soir même sur TF1, pourvoi annoncé non confirmé déposé (délai ~17/7) | Touteleurope, RTS, France 24 : identique point par point, y compris le bracelet électronique 12 mois | ✓ EXACT — remarquablement nuancé (déclaré/investi, annoncé/déposé, suspensif une fois déposé) |
| Aide à mourir (SOC_10) : adoptée 3× par l'AN (dont 30/6), rejetée par le Sénat le 7/7/2026, sort joué « dans les prochains jours » | Public Sénat : rejet 3e lecture le 7/7 (motion 169/164), vote final AN programmé le **15 juillet** | ✓ EXACT — source marquée à re-vérifier après le 15/7, discipline correcte |
| SMIC 1 867 € brut/mois depuis juin 2026 (ECO_2 + hint) | info.gouv.fr : 1 867,02 € au 1/6/2026 (+2,41 %) | ✓ EXACT |
| 384 000 premiers titres de séjour en 2025, +11 %, record (IMM_1 + hint) | franceinfo/DGEF : 384 230, +11,2 % | ✓ EXACT |
| OTAN : objectif porté à 5 % du PIB (3,5+1,5) au sommet de La Haye, juin 2025 ; France ~2 % désormais sous l'objectif (SEC_7) | Connaissance interne (avant coupure) concordante | ✓ EXACT |
| UE 2035 : proposition Commission déc. 2025 (réduction 90 % au lieu d'interdiction totale, non encore adoptée) (ENV_7) | Concordant, statut « proposition » correctement signalé | ✓ EXACT |
| Pacte migration/asile : mécanisme de solidarité à options, sans obligation d'accueil (IMM_21) | Concordant ; nuance : le Pacte est *entré en vigueur* en juin 2024 et *s'applique* depuis le 12 juin 2026 — l'app dit « entré en vigueur le 12 juin 2026 » | ~ Quasi-exact (imprécision juridique mineure, fond correct) |
| Censure du plafond migratoire, Conseil constitutionnel janv. 2024 (IMM_16) ; Mayotte droit du sol durci 2025-2026, deux parents (IMM_23) ; Index égalité 2019, pénalité 1 %, directive à transposer avant juin 2026, écart ~4 % à poste comparable (SOC_27) ; IGPN/Défenseur des droits (SEC_25) ; AI Act 2024 + report « Digital Omnibus » (ECO_28) ; participation >50 salariés (ECO_25) ; Dunkerque/Montpellier gratuité (PUB_12) | Connaissance interne concordante | ✓ |
| Bayrou : démission 9/9/2025 après vote de confiance perdu, remplacé par Lecornu (fiche) | vie-publique : Lecornu nommé le 9/9/2025, toujours PM en juillet 2026 (Lecornu II depuis oct. 2025) | ✓ (nuance d'un jour « dès le lendemain » — cosmétique) |

## Trouvé PÉRIMÉ ou MANQUANT — corrigé par ce contre-audit

| Problème | Correction (commit) |
|---|---|
| paris_2026 : passé au passé mais **sans le vainqueur** — l'app ne disait jamais que Grégoire a été élu (2nd tour 22/3/2026, >50 %, ~9 pts devant Dati — vérifié franceinfo/paris.fr) | Résultat ajouté aux descriptions EN/FR (`a313320`) |
| Retailleau « Ministre de l'Intérieur » — parti place Beauvau le 13/10/2025 (Nuñez), président LR depuis mai 2025 | Rôle corrigé (`5615c58`) |
| Wauquiez « Président de LR, Président région AURA » — doublement périmé | → président du groupe DR à l'AN (`5615c58`) |
| Darmanin « Ancien ministre de l'Intérieur » — garde des Sceaux depuis déc. 2024, reconduit Lecornu II | → « Ministre de la Justice » (`5615c58`) |
| **Hidalgo « Maire de Paris »** — contradiction directe avec la propre page paris_2026 de l'app | → « Ancienne maire de Paris (2014-2026) » (`5615c58`) |
| Landing « 120+ questions / 40 figures historiques » (réel : 166/60) | Corrigé (`58d7902`) |

## Reste à traiter (non corrigé — dépasse la correction mécanique)
- **Lecornu absent de frenchFigures** (PM en poste depuis 10 mois) — déjà signalé partout, toujours vrai. Créer sa fiche = rédaction éditoriale + profil politique à estimer → décision humaine.
- Un « 40 dirigeants historiques mondiaux » résiduel plus bas dans la landing (section « Figures historiques », `Landing.jsx:~72`) — vu en navigateur après mon fix des stats ; correction triviale restante.
- SOC_10 et statut du pourvoi Le Pen : deux faits à re-vérifier la semaine du 15-17 juillet 2026 (déjà tracés dans sources.json avec `nextCheckDue` — le mécanisme de fraîcheur fonctionne).
- paris_2026 : les blocs `context` restent rédigés au présent pré-électoral (« Key issues for 2026 », « est candidat déclaré ») ; Sarah Knafo (10,4 % au 1er tour) absente des candidats. Cohérence à finir.

## Verdict factualité : **très bonne** sur tout ce qui a été retravaillé (0 erreur trouvée sur les faits vérifiés) ; les péremptions restantes étaient concentrées sur les champs `role` des figures — un angle mort désormais couvert.

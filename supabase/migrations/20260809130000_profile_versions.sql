-- ============================================================================
-- POLISCOP — 20260809130000_profile_versions
--
-- Ajoute au snapshot de profil la trace de la MÉTHODE qui l'a produit.
--
-- POURQUOI
-- --------
-- `user_profiles` stocke des scores thématiques sans dire comment ils ont été calculés.
-- Deux versions de scoring coexistent dans le code (v1 : thème vide = 50 + étirement 0,75 ;
-- v2 : thème vide = null, pas d'étirement). Sans ces colonnes, un profil relu depuis le cloud
-- est ininterprétable — et une bascule de version rendrait toute la table incomparable avec
-- elle-même, sans qu'aucune requête ne puisse distinguer les deux populations.
--
-- EXPAND uniquement : colonnes NULLABLES, sans DEFAULT contraignant. Un frontend antérieur
-- qui ignore ces colonnes continue de fonctionner à l'identique — c'est la condition pour
-- déployer cette migration avant la mise en ligne du client correspondant.
--
-- Aucune donnée existante n'est modifiée. Les lignes antérieures gardent `NULL`, ce qui se
-- lit « méthode inconnue » — et non « v1 » : le supposer serait une reconstruction.
-- ============================================================================

begin;

alter table public.user_profiles
  add column if not exists scoring_version       text,
  add column if not exists questionnaire_version text;

comment on column public.user_profiles.scoring_version is
  'Version du moteur de scoring ayant produit ces scores (v1 | v2). NULL = antérieur au versionnage, méthode inconnue — ne pas supposer v1.';
comment on column public.user_profiles.questionnaire_version is
  'Version de la banque de questions au moment du calcul. NULL = inconnue.';

-- Index partiel : les analyses devront systématiquement segmenter par version, sinon elles
-- mélangeraient deux méthodes de calcul incompatibles dans une même moyenne.
create index if not exists user_profiles_scoring_version_idx
  on public.user_profiles (scoring_version)
  where scoring_version is not null;

commit;

-- ============================================================================
-- ROLLBACK (sans perte : ces colonnes ne portent aucune donnée métier) :
--   drop index if exists public.user_profiles_scoring_version_idx;
--   alter table public.user_profiles
--     drop column if exists scoring_version,
--     drop column if exists questionnaire_version;
-- ============================================================================

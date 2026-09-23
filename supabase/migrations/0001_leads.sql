-- Table des demandes de démonstration issues du site vitrine.
-- Le site étant exporté en statique, l'insertion se fait directement depuis le
-- navigateur avec la clé ANON (publique par conception). C'est la RLS qui
-- protège la table, pas le secret de la clé.
--
-- ⚠️ Ne JAMAIS exposer la clé `service_role` côté navigateur : elle contourne
-- toute politique RLS et donnerait accès à l'intégralité de la base.

create table if not exists public.leads (
  id            uuid primary key default gen_random_uuid(),
  created_at    timestamptz not null default now(),
  nom           text not null,
  cabinet       text not null,
  email         text not null,
  telephone     text,
  message       text,
  consentement  boolean not null default false,
  source        text
);

create index if not exists leads_created_at_idx on public.leads (created_at desc);

alter table public.leads enable row level security;

-- Le rôle anon peut écrire, jamais lire : aucune politique SELECT n'est créée,
-- donc aucun visiteur ne peut relire les leads déposés.
grant insert on table public.leads to anon;

drop policy if exists leads_insert_public on public.leads;
create policy leads_insert_public on public.leads
  for insert
  to anon
  with check (
    char_length(nom) between 1 and 120
    and char_length(cabinet) between 1 and 160
    and char_length(email) between 5 and 200
    and email like '%_@_%.__%'
    and coalesce(char_length(telephone), 0) <= 40
    and coalesce(char_length(message), 0) <= 2000
    and consentement = true
  );

-- Uruchom ten plik jeden raz w Supabase: SQL Editor -> New query -> Run.
-- Nowe opinie są ukryte do czasu zatwierdzenia ich w Table Editor.

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 1 and 40),
  text text not null check (char_length(text) between 1 and 600),
  rating smallint not null check (rating between 1 and 5),
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.reviews enable row level security;

revoke all on table public.reviews from anon, authenticated;
grant select on table public.reviews to anon;
grant insert (name, text, rating) on table public.reviews to anon;

drop policy if exists "Public can read approved reviews" on public.reviews;
create policy "Public can read approved reviews"
on public.reviews
for select
to anon
using (approved = true);

drop policy if exists "Public can submit reviews for moderation" on public.reviews;
create policy "Public can submit reviews for moderation"
on public.reviews
for insert
to anon
with check (approved = false);

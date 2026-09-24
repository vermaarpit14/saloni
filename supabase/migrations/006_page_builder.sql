-- Run once in Supabase SQL Editor after 001-005, BEFORE deploying the new code. Safe to re-run.
alter table public.homepage_settings add column if not exists sections jsonb;
alter table public.site_settings
  add column if not exists menu jsonb,
  add column if not exists form_fields jsonb;

create table if not exists public.pages(
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  blocks jsonb not null default '[]'::jsonb,
  published boolean not null default true,
  seo_title text, seo_description text,
  sort_order int not null default 0,
  created_at timestamptz default now());
alter table public.pages enable row level security;
drop policy if exists "admin all" on public.pages;
create policy "admin all" on public.pages for all using(public.is_admin()) with check(public.is_admin());
drop policy if exists "public read" on public.pages;
create policy "public read" on public.pages for select using(published);

-- Run once in Supabase SQL Editor (after 001-003). Safe to re-run.
alter table public.site_settings
  add column if not exists logo_url text,
  add column if not exists favicon_url text,
  add column if not exists instagram_url text,
  add column if not exists facebook_url text,
  add column if not exists youtube_url text,
  add column if not exists announcement_on boolean not null default false,
  add column if not exists announcement_text text,
  add column if not exists announcement_link text,
  add column if not exists seo_title text,
  add column if not exists seo_description text,
  add column if not exists og_image_url text,
  add column if not exists texts jsonb not null default '{}'::jsonb;

alter table public.products
  add column if not exists seo_title text,
  add column if not exists seo_description text;

create table if not exists public.enquiries(
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  product text,
  message text not null,
  status text not null default 'new' check(status in('new','contacted','closed')),
  notes text,
  created_at timestamptz not null default now()
);
create index if not exists enquiries_created_idx on public.enquiries(created_at desc);
alter table public.enquiries enable row level security;
drop policy if exists "admin all" on public.enquiries;
create policy "admin all" on public.enquiries for all using(public.is_admin()) with check(public.is_admin());
drop policy if exists "anyone can enquire" on public.enquiries;
create policy "anyone can enquire" on public.enquiries for insert to anon, authenticated
  with check(status='new' and notes is null and length(name) between 1 and 200 and length(email) between 3 and 320
    and length(message) between 1 and 5000 and coalesce(length(phone),0)<=50 and coalesce(length(product),0)<=300);

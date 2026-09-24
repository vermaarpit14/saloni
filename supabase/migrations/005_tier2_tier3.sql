-- Run once in Supabase SQL Editor AFTER 001-004, and BEFORE deploying the new code. Safe to re-run.
alter table public.products
  add column if not exists price_text text,
  add column if not exists badge text,
  add column if not exists dimensions text,
  add column if not exists video_url text,
  add column if not exists model_url text;
alter table public.product_images add column if not exists alt text;
alter table public.homepage_settings
  add column if not exists hero_image_2_url text,
  add column if not exists hero_image_3_url text,
  add column if not exists hero_video_url text;
alter table public.site_settings
  add column if not exists custom_theme jsonb,
  add column if not exists show_language_toggle boolean not null default false;

create table if not exists public.testimonials(
  id uuid primary key default gen_random_uuid(),
  quote text not null, author text not null, place text,
  sort_order int not null default 0, active boolean not null default true,
  created_at timestamptz default now());
alter table public.testimonials enable row level security;
drop policy if exists "admin all" on public.testimonials;
create policy "admin all" on public.testimonials for all using(public.is_admin()) with check(public.is_admin());
drop policy if exists "public read" on public.testimonials;
create policy "public read" on public.testimonials for select using(active);

alter table public.enquiries
  add column if not exists kind text not null default 'enquiry',
  add column if not exists visit_date date,
  add column if not exists visit_time text,
  add column if not exists people int;
alter table public.enquiries drop constraint if exists enquiries_kind_check;
alter table public.enquiries add constraint enquiries_kind_check check(kind in('enquiry','visit'));
drop policy if exists "anyone can enquire" on public.enquiries;
create policy "anyone can enquire" on public.enquiries for insert to anon, authenticated
  with check(status='new' and notes is null and kind in('enquiry','visit')
    and length(name) between 1 and 200 and length(email) between 3 and 320
    and length(message) between 1 and 5000 and coalesce(length(phone),0)<=50
    and coalesce(length(product),0)<=1000 and coalesce(length(visit_time),0)<=100 and coalesce(people,1) between 1 and 100);

create table if not exists public.events(
  id bigint generated always as identity primary key,
  type text not null check(type in('view','save','enquire_click','whatsapp_click')),
  product_slug text, product_name text,
  created_at timestamptz not null default now());
create index if not exists events_created_idx on public.events(created_at desc);
alter table public.events enable row level security;
drop policy if exists "admin read" on public.events;
create policy "admin read" on public.events for select using(public.is_admin());
drop policy if exists "anyone can log" on public.events;
create policy "anyone can log" on public.events for insert to anon, authenticated
  with check(coalesce(length(product_slug),0)<=200 and coalesce(length(product_name),0)<=300);

create or replace function public.analytics_summary(days int default 30) returns jsonb
language sql security definer stable set search_path=public as $$
select case when not public.is_admin() then null else jsonb_build_object(
 'by_type',(select coalesce(jsonb_object_agg(type,c),'{}'::jsonb) from (select type,count(*) c from public.events where created_at>now()-days*interval '1 day' group by type) x),
 'top',(select coalesce(jsonb_agg(jsonb_build_object('name',name,'slug',slug,'views',views,'saves',saves,'clicks',clicks) order by views desc),'[]'::jsonb)
   from (select product_slug slug,max(product_name) name,count(*) filter(where type='view') views,count(*) filter(where type='save') saves,count(*) filter(where type in('enquire_click','whatsapp_click')) clicks
         from public.events where product_slug is not null and created_at>now()-days*interval '1 day' group by product_slug order by count(*) filter(where type='view') desc limit 10) t),
 'daily',(select coalesce(jsonb_agg(jsonb_build_object('d',d,'n',n) order by d),'[]'::jsonb) from (select created_at::date d,count(*) n from public.events where type='view' and created_at>now()-days*interval '1 day' group by 1) y),
 'enquiries',(select count(*) from public.enquiries where kind='enquiry' and created_at>now()-days*interval '1 day'),
 'visits',(select count(*) from public.enquiries where kind='visit' and created_at>now()-days*interval '1 day')
) end $$;
revoke execute on function public.analytics_summary(int) from public, anon;
grant execute on function public.analytics_summary(int) to authenticated;

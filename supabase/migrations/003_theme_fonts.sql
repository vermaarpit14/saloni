alter table public.site_settings
  add column if not exists theme text not null default 'ivory-clay',
  add column if not exists heading_font text not null default 'Cormorant Garamond',
  add column if not exists body_font text not null default 'Jost';

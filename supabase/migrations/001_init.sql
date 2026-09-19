-- Liton Steel site: run in the Supabase SQL editor (or `supabase db push`).
create table if not exists site_documents (
  id text primary key,                -- 'draft' | 'published'
  data jsonb not null,
  updated_at timestamptz not null default now()
);
create table if not exists site_versions (
  id text primary key,
  label text not null default '',
  data jsonb not null,
  created_at timestamptz not null default now()
);
create index if not exists site_versions_created_at on site_versions (created_at desc);
create table if not exists contact_messages (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  message text not null,
  locale text,
  created_at timestamptz not null default now()
);
-- Media bucket (public read). Uploads go through the server with the service-role key.
insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;
-- Lock tables down: only the service role (used server-side) can read/write.
alter table site_documents enable row level security;
alter table site_versions enable row level security;
alter table contact_messages enable row level security;

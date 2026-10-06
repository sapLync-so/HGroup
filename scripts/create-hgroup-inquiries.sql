begin;

create table public.hgroup_inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(btrim(name)) between 1 and 200),
  contact text not null check (char_length(btrim(contact)) between 1 and 200),
  note text check (char_length(note) <= 2000),
  created_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new', 'contacted', 'closed')),
  source_page text not null default '/' check (source_page in ('/', '/portfolio-preview')),
  email_status text not null default 'pending' check (email_status in ('pending', 'sent', 'failed'))
);

alter table public.hgroup_inquiries enable row level security;
revoke all on table public.hgroup_inquiries from public, anon, authenticated, service_role;
grant select, insert on table public.hgroup_inquiries to service_role;
grant update (email_status) on table public.hgroup_inquiries to service_role;

commit;

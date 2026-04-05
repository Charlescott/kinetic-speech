create table if not exists form_submissions (
  id bigserial primary key,
  kind text not null,
  name text not null,
  email text not null,
  phone text null,
  message text not null,
  page_path text null,
  created_at timestamptz not null default now()
);

create index if not exists form_submissions_kind_created_at_idx
  on form_submissions (kind, created_at desc);


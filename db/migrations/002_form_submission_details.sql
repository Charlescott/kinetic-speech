alter table if exists form_submissions
  add column if not exists details jsonb not null default '{}'::jsonb;

-- Run this once in Supabase → SQL Editor → New query → Run

create table if not exists public.ferro_progress (
  id text primary key,
  payload jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.ferro_progress enable row level security;

-- Simple public access by id (personal plan app, no auth yet).
-- For a private multi-user app later, replace with auth.uid() policies.
create policy "ferro_progress_select"
  on public.ferro_progress for select
  using (true);

create policy "ferro_progress_insert"
  on public.ferro_progress for insert
  with check (true);

create policy "ferro_progress_update"
  on public.ferro_progress for update
  using (true);

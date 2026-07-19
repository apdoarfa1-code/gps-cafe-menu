-- GPS Slot Bookings Table
-- Run this in Supabase SQL Editor

create table if not exists public.slot_bookings (
  id bigint primary key,
  type text not null check (type in ('padel','playstation','room')),
  date text not null,
  time text,
  name text,
  phone text,
  status text not null default 'available' check (status in ('available','booked')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists slot_bookings_date_idx on public.slot_bookings(date);
create index if not exists slot_bookings_status_idx on public.slot_bookings(status);
create index if not exists slot_bookings_type_idx on public.slot_bookings(type);
create unique index if not exists slot_bookings_unique_idx on public.slot_bookings(type, date, time);

-- Enable Row Level Security
alter table public.slot_bookings enable row level security;

-- Policies: public read + write (adjust as needed)
drop policy if exists "slot_bookings_read_all" on public.slot_bookings;
create policy "slot_bookings_read_all" on public.slot_bookings for select using (true);

drop policy if exists "slot_bookings_insert_all" on public.slot_bookings;
create policy "slot_bookings_insert_all" on public.slot_bookings for insert with check (true);

drop policy if exists "slot_bookings_update_all" on public.slot_bookings;
create policy "slot_bookings_update_all" on public.slot_bookings for update using (true);

drop policy if exists "slot_bookings_delete_all" on public.slot_bookings;
create policy "slot_bookings_delete_all" on public.slot_bookings for delete using (true);

-- Auto-update updated_at
create or replace function public.set_updated_at() returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;

drop trigger if exists slot_bookings_set_updated_at on public.slot_bookings;
create trigger slot_bookings_set_updated_at before update on public.slot_bookings
  for each row execute function public.set_updated_at();

-- Kaució fizetési állapot követése (Stripe webhook frissíti sikeres fizetéskor).
alter table bookings add column if not exists deposit_paid boolean not null default false;

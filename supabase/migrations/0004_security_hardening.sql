-- Biztonsági szigorítás.
--
-- 1) A `bookings_public_insert` policy lehetővé tette, hogy BÁRKI, aki ismeri a publikus
--    anon kulcsot (ami eleve nyilvános, benne van a kliens JS bundle-ben), közvetlenül a
--    Supabase PostgREST API-n keresztül tetszőleges sort szúrjon be a `bookings` táblába —
--    megkerülve az alkalmazás összes validációját (zod séma, kapacitás-ellenőrzés,
--    dátum-ellenőrzés, rate limit). Az alkalmazás saját foglalás-létrehozása mindig a
--    service role kulccsal megy (lásd src/lib/data/bookings.ts createBooking), tehát ez a
--    policy semmilyen valós funkciót nem szolgált ki — tiszta támadási felület volt.
drop policy if exists "bookings_public_insert" on bookings;

-- 2) A SECURITY DEFINER függvényeknél Postgres best practice explicit search_path-ot
--    megadni, hogy egy támadó ne tudjon "search_path hijacking"-gal saját sémájában
--    definiált objektumokkal átvenni a függvény által hivatkozott neveket.
create or replace function is_admin()
returns boolean as $$
  select exists (
    select 1 from admin_users where id = auth.uid()
  );
$$ language sql stable security definer
set search_path = public, pg_temp;

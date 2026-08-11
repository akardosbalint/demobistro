-- Demo seed data for Zöld Sarok Vegan Bistro
-- Safe to run once against a fresh database.

insert into restaurants (id, name, description, address, phone, email, hours, max_daily_guests)
values (
  '00000000-0000-0000-0000-000000000001',
  'Zöld Sarok Vegan Bistro',
  'Prémium növényi alapú bistro a belváros szívében.',
  '1053 Budapest, Kossuth Lajos utca 12.',
  '+36 1 234 5678',
  'asztal@zoldsarok.hu',
  '[
    {"day": "Hétfő", "hours": "Zárva"},
    {"day": "Kedd – Csütörtök", "hours": "12:00 – 22:00"},
    {"day": "Péntek – Szombat", "hours": "12:00 – 23:00"},
    {"day": "Vasárnap", "hours": "12:00 – 21:00"}
  ]'::jsonb,
  120
)
on conflict (id) do nothing;

-- Categories
insert into menu_categories (id, restaurant_id, name, slug, sort_order) values
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Levesek', 'levesek', 1),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Előételek', 'eloetelek', 2),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Főételek', 'foetelek', 3),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Desszertek', 'desszertek', 4),
  ('10000000-0000-0000-0000-000000000005', '00000000-0000-0000-0000-000000000001', 'Italok', 'italok', 5)
on conflict (id) do nothing;

-- Menu items
insert into menu_items
  (category_id, name, description, price, image_url, dietary_info, allergens, seasonal, is_new, portion_size, sort_order)
values
  ('10000000-0000-0000-0000-000000000001', 'Sütőtökkrémleves', 'Füstölt paprikás sütőtökkrém, pirított tökmag, kókusztejszín-örvény.', 2890, null, '{vegan,gluten-free}', '{}', true, false, '300 ml', 1),
  ('10000000-0000-0000-0000-000000000001', 'Erdei gombaleves', 'Vadgomba ragu leves, friss kakukkfűvel, tönkölybéles crostinival.', 3190, null, '{vegan}', '{gluten}', false, false, '300 ml', 2),

  ('10000000-0000-0000-0000-000000000002', 'Cékla-carpaccio', 'Vékonyra szeletelt sült cékla, kesudió-ricotta, bazsalikomolaj, gránátalma.', 3490, null, '{vegan,gluten-free}', '{nuts}', false, true, '1 adag', 1),
  ('10000000-0000-0000-0000-000000000002', 'Padlizsánkaviár', 'Füstölt padlizsánkrém, szezámmagos lepénnyel és savanyú zöldségekkel.', 2990, null, '{vegan}', '{sesame,gluten}', false, false, '1 adag', 2),

  ('10000000-0000-0000-0000-000000000003', 'Jackfruit gulyás', 'Paprikás jackfruit ragu, házi tarhonya helyett hajdinával, erős paprikakrémmel.', 5490, null, '{vegan}', '{}', false, true, '400 g', 1),
  ('10000000-0000-0000-0000-000000000003', 'Grillezett karfiolsteak', 'Egészben grillezett karfiol, kurkumás tahini szósz, pirított mandula, gránátalma.', 5290, null, '{vegan,gluten-free}', '{nuts,sesame}', true, false, '1 adag', 2),
  ('10000000-0000-0000-0000-000000000003', 'Bio zöldségrizottó', 'Szezonális zöldségek, fehérboros rizottó, kesudió-parmezán.', 4990, null, '{vegan,gluten-free}', '{nuts}', true, false, '350 g', 3),
  ('10000000-0000-0000-0000-000000000003', 'Seitan bourguignon', 'Vörösboros seitan ragu, gyökérzöldségek, petrezselymes burgonyapüré.', 5690, null, '{vegan}', '{gluten}', false, false, '400 g', 4),

  ('10000000-0000-0000-0000-000000000004', 'Csokoládé fondant', 'Folyós csokoládétorta, avokádó-krém, málnaszorbet.', 3290, null, '{vegan}', '{gluten}', false, true, '1 adag', 1),
  ('10000000-0000-0000-0000-000000000004', 'Kókusz-lime cheesecake', 'Sütés nélküli kesudiós cheesecake, lime zselé, kókuszmorzsa.', 3190, null, '{vegan,gluten-free}', '{nuts}', true, false, '1 szelet', 2),

  ('10000000-0000-0000-0000-000000000005', 'Házi kombucha', 'Erjesztett, szénsavas tea, szezonális gyümölcsökkel ízesítve.', 1690, null, '{vegan,gluten-free}', '{}', true, false, '300 ml', 1),
  ('10000000-0000-0000-0000-000000000005', 'Match latte', 'Ceremóniás matcha, zab tej, agávé szirom.', 1590, null, '{vegan,gluten-free}', '{}', false, false, '250 ml', 2)
on conflict do nothing;

-- Published reviews
insert into reviews (restaurant_id, guest_name, rating, comment, is_published) values
  ('00000000-0000-0000-0000-000000000001', 'Nagy Eszter', 5, 'A legszebb vegán étterem, ahol jártam — a karfiolsteak felejthetetlen élmény volt!', true),
  ('00000000-0000-0000-0000-000000000001', 'Kovács Bence', 5, 'Kifogástalan kiszolgálás, meghitt hangulat, és minden fogás színpompás volt.', true),
  ('00000000-0000-0000-0000-000000000001', 'Tóth Zsófia', 4, 'Nagyon finom volt a jackfruit gulyás, biztosan visszatérünk.', true)
on conflict do nothing;

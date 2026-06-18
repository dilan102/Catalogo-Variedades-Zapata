-- ============================================================
-- SCHEMA TIENDA CATÁLOGO
-- Ejecutar en: Supabase Dashboard > SQL Editor
-- ============================================================

-- Extensión para UUIDs
create extension if not exists "uuid-ossp";

-- ─────────────────────────────────────────
-- SECCIONES (Mujer, Hombre, Niños, etc.)
-- ─────────────────────────────────────────
create table sections (
  id          uuid primary key default uuid_generate_v4(),
  name        text not null,
  slug        text not null unique,
  description text,
  image_url   text,
  "order"     int  not null default 0,
  is_active   bool not null default true,
  created_at  timestamptz default now()
);

-- ─────────────────────────────────────────
-- SUBSECCIONES (Vestidos, Camisas, etc.)
-- ─────────────────────────────────────────
create table subsections (
  id          uuid primary key default uuid_generate_v4(),
  section_id  uuid not null references sections(id) on delete cascade,
  name        text not null,
  slug        text not null,
  description text,
  image_url   text,
  "order"     int  not null default 0,
  is_active   bool not null default true,
  created_at  timestamptz default now(),
  unique(section_id, slug)
);

-- ─────────────────────────────────────────
-- PRODUCTOS
-- ─────────────────────────────────────────
create table products (
  id             uuid primary key default uuid_generate_v4(),
  subsection_id  uuid not null references subsections(id) on delete cascade,
  name           text not null,
  description    text,
  price          numeric(10,2),
  images         text[]   default '{}',
  sizes          text[]   default '{}',
  colors         text[]   default '{}',
  is_active      bool     not null default true,
  is_featured    bool     not null default false,
  "order"        int      not null default 0,
  created_at     timestamptz default now()
);

-- ─────────────────────────────────────────
-- ÍNDICES
-- ─────────────────────────────────────────
create index on sections("order");
create index on subsections(section_id, "order");
create index on products(subsection_id, "order");
create index on products(is_featured);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY
-- ─────────────────────────────────────────
alter table sections    enable row level security;
alter table subsections enable row level security;
alter table products    enable row level security;

-- Lectura pública (catálogo visible a todos)
create policy "public_read_sections"    on sections    for select using (is_active = true);
create policy "public_read_subsections" on subsections for select using (is_active = true);
create policy "public_read_products"    on products    for select using (is_active = true);

-- Escritura solo para usuarios autenticados (tú, el admin)
create policy "admin_all_sections"    on sections    for all using (auth.role() = 'authenticated');
create policy "admin_all_subsections" on subsections for all using (auth.role() = 'authenticated');
create policy "admin_all_products"    on products    for all using (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- DATOS DE EJEMPLO
-- ─────────────────────────────────────────
insert into sections (name, slug, description, "order") values
  ('Mujer',       'mujer',       'Colección femenina',    1),
  ('Hombre',      'hombre',      'Colección masculina',   2),
  ('Niños',       'ninos',       'Colección infantil',    3),
  ('Accesorios',  'accesorios',  'Bolsos, cinturones...', 4);

insert into subsections (section_id, name, slug, "order")
select id, 'Vestidos',  'vestidos',  1 from sections where slug = 'mujer'
union all
select id, 'Blusas',    'blusas',    2 from sections where slug = 'mujer'
union all
select id, 'Jeans',     'jeans',     3 from sections where slug = 'mujer'
union all
select id, 'Camisas',   'camisas',   1 from sections where slug = 'hombre'
union all
select id, 'Pantalones','pantalones',2 from sections where slug = 'hombre';

insert into products (subsection_id, name, description, price, sizes, colors, is_featured, "order")
select s.id, 'Vestido Floral', 'Vestido de verano con estampado floral', 89900, array['XS','S','M','L'], array['Negro','Blanco','Rosa'], true, 1
from subsections s where s.slug = 'vestidos'
union all
select s.id, 'Vestido Midi', 'Vestido midi elegante para ocasiones especiales', 129900, array['S','M','L','XL'], array['Azul','Verde'], false, 2
from subsections s where s.slug = 'vestidos';

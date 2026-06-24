-- Script SQL para crear las nuevas categorías y subsecciones
-- Ejecutar esto en el SQL Editor de Supabase

-- Insertar categorías principales
INSERT INTO sections (id, name, slug, description, "order", is_active, created_at) VALUES
  (gen_random_uuid(), 'Dama', 'dama', 'Catálogo de dama', 0, true, NOW()),
  (gen_random_uuid(), 'Caballero', 'caballero', 'Catálogo de caballero', 1, true, NOW()),
  (gen_random_uuid(), 'Niño', 'nino', 'Catálogo de niño', 2, true, NOW()),
  (gen_random_uuid(), 'Niña', 'nina', 'Catálogo de niña', 3, true, NOW()),
  (gen_random_uuid(), 'Accesorios', 'accesorios', 'Catálogo de accesorios', 4, true, NOW()),
  (gen_random_uuid(), 'Edredones', 'edredones', 'Catálogo de edredones', 5, true, NOW()),
  (gen_random_uuid(), 'Esika', 'esika', 'Catálogo de Esika', 6, true, NOW()),
  (gen_random_uuid(), 'Avon', 'avon', 'Catálogo de Avon', 7, true, NOW());

-- Insertar subsecciones para Dama
INSERT INTO subsections (id, section_id, name, slug, description, "order", is_active, created_at)
SELECT 
  gen_random_uuid(), 
  (SELECT id FROM sections WHERE slug = 'dama'),
  unnest(ARRAY['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Vestidos', 'Ropa deportiva', 'Corsets', 'Ropa interior', 'Medias', 'Zapatos']),
  unnest(ARRAY['pantalones', 'camisas', 'chaquetas', 'sacos', 'blusas', 'vestidos', 'ropa-deportiva', 'corsets', 'ropa-interior', 'medias', 'zapatos']),
  unnest(ARRAY['Pantalones de dama', 'Camisas de dama', 'Chaquetas de dama', 'Sacos de dama', 'Blusas de dama', 'Vestidos de dama', 'Ropa deportiva de dama', 'Corsets de dama', 'Ropa interior de dama', 'Medias de dama', 'Zapatos de dama']),
  generate_series(0, 10),
  true,
  NOW();

-- Insertar subsecciones para Caballero
INSERT INTO subsections (id, section_id, name, slug, description, "order", is_active, created_at)
SELECT 
  gen_random_uuid(), 
  (SELECT id FROM sections WHERE slug = 'caballero'),
  unnest(ARRAY['Pantalones', 'Pantalonetas', 'Camisas', 'Sacos', 'Chaquetas', 'Medias', 'Zapatos', 'Ropa interior', 'Ropa deportiva']),
  unnest(ARRAY['pantalones', 'pantalonetas', 'camisas', 'sacos', 'chaquetas', 'medias', 'zapatos', 'ropa-interior', 'ropa-deportiva']),
  unnest(ARRAY['Pantalones de caballero', 'Pantalonetas de caballero', 'Camisas de caballero', 'Sacos de caballero', 'Chaquetas de caballero', 'Medias de caballero', 'Zapatos de caballero', 'Ropa interior de caballero', 'Ropa deportiva de caballero']),
  generate_series(0, 8),
  true,
  NOW();

-- Insertar subsecciones para Niño
INSERT INTO subsections (id, section_id, name, slug, description, "order", is_active, created_at)
SELECT 
  gen_random_uuid(), 
  (SELECT id FROM sections WHERE slug = 'nino'),
  unnest(ARRAY['Pantalones', 'Zapatos', 'Camisas', 'Sacos', 'Chaquetas', 'Medias', 'Ropa interior', 'Ropa deportiva']),
  unnest(ARRAY['pantalones', 'zapatos', 'camisas', 'sacos', 'chaquetas', 'medias', 'ropa-interior', 'ropa-deportiva']),
  unnest(ARRAY['Pantalones de niño', 'Zapatos de niño', 'Camisas de niño', 'Sacos de niño', 'Chaquetas de niño', 'Medias de niño', 'Ropa interior de niño', 'Ropa deportiva de niño']),
  generate_series(0, 7),
  true,
  NOW();

-- Insertar subsecciones para Niña
INSERT INTO subsections (id, section_id, name, slug, description, "order", is_active, created_at)
SELECT 
  gen_random_uuid(), 
  (SELECT id FROM sections WHERE slug = 'nina'),
  unnest(ARRAY['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Zapatos', 'Vestidos', 'Ropa deportiva', 'Corsets', 'Ropa interior', 'Medias']),
  unnest(ARRAY['pantalones', 'camisas', 'chaquetas', 'sacos', 'blusas', 'zapatos', 'vestidos', 'ropa-deportiva', 'corsets', 'ropa-interior', 'medias']),
  unnest(ARRAY['Pantalones de niña', 'Camisas de niña', 'Chaquetas de niña', 'Sacos de niña', 'Blusas de niña', 'Zapatos de niña', 'Vestidos de niña', 'Ropa deportiva de niña', 'Corsets de niña', 'Ropa interior de niña', 'Medias de niña']),
  generate_series(0, 10),
  true,
  NOW();

-- Insertar subsecciones para Accesorios
INSERT INTO subsections (id, section_id, name, slug, description, "order", is_active, created_at)
SELECT 
  gen_random_uuid(), 
  (SELECT id FROM sections WHERE slug = 'accesorios'),
  unnest(ARRAY['Gafas', 'Relojería', 'Joyería', 'Tecnología']),
  unnest(ARRAY['gafas', 'relojeria', 'joyeria', 'tecnologia']),
  unnest(ARRAY['Gafas', 'Relojería', 'Joyería', 'Tecnología']),
  generate_series(0, 3),
  true,
  NOW();

-- Insertar subsecciones para Edredones
INSERT INTO subsections (id, section_id, name, slug, description, "order", is_active, created_at)
SELECT 
  gen_random_uuid(), 
  (SELECT id FROM sections WHERE slug = 'edredones'),
  unnest(ARRAY['Sábanas', 'Almohadas', 'Cobijas', 'Cubrelechos', 'Fundas']),
  unnest(ARRAY['sabanas', 'almohadas', 'cobijas', 'cubrelechos', 'fundas']),
  unnest(ARRAY['Sábanas', 'Almohadas', 'Cobijas', 'Cubrelechos', 'Fundas']),
  generate_series(0, 4),
  true,
  NOW();

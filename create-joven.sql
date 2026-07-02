-- Script SQL para eliminar la sección Avon y crear la sección Joven.
-- Ejecútalo en el editor SQL de Supabase.

-- Eliminar productos y subsecciones relacionados con Avon primero.
DELETE FROM products
WHERE subsection_id IN (
  SELECT id FROM subsections WHERE section_id = (
    SELECT id FROM sections WHERE slug = 'avon'
  )
);

DELETE FROM subsections
WHERE section_id = (
  SELECT id FROM sections WHERE slug = 'avon'
);

DELETE FROM sections
WHERE slug = 'avon';

-- Crear la nueva sección Joven en el mismo orden aproximado que Avon.
INSERT INTO sections (id, name, slug, description, "order", is_active, created_at)
VALUES (
  gen_random_uuid(),
  'Joven',
  'joven',
  'Catálogo de joven',
  7,
  true,
  NOW()
);

-- Insertar subsecciones de Joven con los mismos nombres y slugs que Dama.
INSERT INTO subsections (id, section_id, name, slug, description, "order", is_active, created_at)
SELECT
  gen_random_uuid(),
  (SELECT id FROM sections WHERE slug = 'joven'),
  unnest(ARRAY['Pantalones', 'Camisas', 'Chaquetas', 'Sacos', 'Blusas', 'Vestidos', 'Ropa deportiva', 'Corsets', 'Ropa interior', 'Medias', 'Zapatos']),
  unnest(ARRAY['pantalones', 'camisas', 'chaquetas', 'sacos', 'blusas', 'vestidos', 'ropa-deportiva', 'corsets', 'ropa-interior', 'medias', 'zapatos']),
  unnest(ARRAY['Pantalones de joven', 'Camisas de joven', 'Chaquetas de joven', 'Sacos de joven', 'Blusas de joven', 'Vestidos de joven', 'Ropa deportiva de joven', 'Corsets de joven', 'Ropa interior de joven', 'Medias de joven', 'Zapatos de joven']),
  generate_series(0, 10),
  true,
  NOW();

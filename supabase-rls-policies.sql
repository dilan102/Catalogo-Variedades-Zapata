-- Supabase RLS policies para el catálogo
-- Ejecuta este script en el SQL Editor de Supabase.

-- Activar Row Level Security en tablas principales.
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE subsections ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Política de lectura pública solo para filas activas.
-- La rol anon podrá seleccionar únicamente registros con is_active = true.
CREATE POLICY "anon select active sections" ON sections
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "anon select active subsections" ON subsections
  FOR SELECT
  TO anon
  USING (is_active = true);

CREATE POLICY "anon select active products" ON products
  FOR SELECT
  TO anon
  USING (is_active = true);

-- Nota: no se crean políticas de INSERT, UPDATE ni DELETE para el rol anon.
-- Esto garantiza que la clave pública/anon no pueda escribir o borrar datos.
-- Todas las operaciones de escritura deben realizarse desde las API routes del backend
-- que usan la service_role key y validación de sesión admin.

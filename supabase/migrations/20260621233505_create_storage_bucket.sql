/*
# Crear bucket de Storage para imágenes de productos

1. Changes
- Crear bucket público "productos" en Supabase Storage para almacenar imágenes subidas desde el panel admin.
- Permitir lectura pública (anon) para que la carta digital pueda mostrar las imágenes sin autenticación.
- Permitir escritura solo para usuarios autenticados (admin).

2. Security
- Políticas de storage para lectura pública y escritura autenticada.
*/

-- Create the bucket if it doesn't exist (idempotent via DO block)
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name, public)
  VALUES ('productos', 'productos', true)
  ON CONFLICT (id) DO UPDATE SET public = true;
END $$;

-- Public read policy
DROP POLICY IF EXISTS "public_read_productos_storage" ON storage.objects;
CREATE POLICY "public_read_productos_storage"
  ON storage.objects FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'productos');

-- Authenticated insert policy
DROP POLICY IF EXISTS "auth_insert_productos_storage" ON storage.objects;
CREATE POLICY "auth_insert_productos_storage"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'productos');

-- Authenticated update policy
DROP POLICY IF EXISTS "auth_update_productos_storage" ON storage.objects;
CREATE POLICY "auth_update_productos_storage"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'productos')
  WITH CHECK (bucket_id = 'productos');

-- Authenticated delete policy
DROP POLICY IF EXISTS "auth_delete_productos_storage" ON storage.objects;
CREATE POLICY "auth_delete_productos_storage"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'productos');

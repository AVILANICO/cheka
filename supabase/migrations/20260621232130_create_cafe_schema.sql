/*
# Crear esquema de base de datos para Cheka La Actitud

1. New Tables
- `categorias`: Almacena las categorías de productos del menú
  - `id` (uuid, primary key)
  - `nombre` (text, not null)
  - `orden` (integer, default 0)
  - `activa` (boolean, default true)
  - `created_at` (timestamp)
- `productos`: Almacena los productos del menú
  - `id` (uuid, primary key)
  - `nombre` (text, not null)
  - `descripcion` (text)
  - `precio` (numeric, not null)
  - `categoria_id` (uuid, references categorias)
  - `imagen` (text)
  - `destacado` (boolean, default false)
  - `nuevo` (boolean, default false)
  - `recomendado` (boolean, default false)
  - `mas_vendido` (boolean, default false)
  - `activo` (boolean, default true)
  - `created_at` (timestamp)
- `configuracion`: Almacena los datos generales del negocio
  - `id` (uuid, primary key)
  - `nombre_negocio` (text)
  - `slogan` (text)
  - `direccion` (text)
  - `horarios` (text)
  - `telefono` (text)
  - `whatsapp` (text)
  - `wifi_nombre` (text)
  - `wifi_password` (text)
  - `logo_url` (text)
  - `portada_url` (text)
  - `created_at` (timestamp)

2. Security
- Enable RLS on all three tables.
- Public read access for categorias, productos, and configuracion (menu is public).
- Admin-only write access for all tables (authenticated users only).
*/

CREATE TABLE IF NOT EXISTS categorias (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  orden integer NOT NULL DEFAULT 0,
  activa boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS productos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  descripcion text,
  precio numeric NOT NULL,
  categoria_id uuid REFERENCES categorias(id) ON DELETE SET NULL,
  imagen text,
  destacado boolean NOT NULL DEFAULT false,
  nuevo boolean NOT NULL DEFAULT false,
  recomendado boolean NOT NULL DEFAULT false,
  mas_vendido boolean NOT NULL DEFAULT false,
  activo boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS configuracion (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre_negocio text,
  slogan text,
  direccion text,
  horarios text,
  telefono text,
  whatsapp text,
  wifi_nombre text,
  wifi_password text,
  logo_url text,
  portada_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categorias ENABLE ROW LEVEL SECURITY;
ALTER TABLE productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion ENABLE ROW LEVEL SECURITY;

-- Public read policies
DROP POLICY IF EXISTS "public_read_categorias" ON categorias;
CREATE POLICY "public_read_categorias"
  ON categorias FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_productos" ON productos;
CREATE POLICY "public_read_productos"
  ON productos FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_read_configuracion" ON configuracion;
CREATE POLICY "public_read_configuracion"
  ON configuracion FOR SELECT
  TO anon, authenticated USING (true);

-- Admin write policies (authenticated only)
DROP POLICY IF EXISTS "admin_insert_categorias" ON categorias;
CREATE POLICY "admin_insert_categorias"
  ON categorias FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_categorias" ON categorias;
CREATE POLICY "admin_update_categorias"
  ON categorias FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_categorias" ON categorias;
CREATE POLICY "admin_delete_categorias"
  ON categorias FOR DELETE
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_productos" ON productos;
CREATE POLICY "admin_insert_productos"
  ON productos FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_productos" ON productos;
CREATE POLICY "admin_update_productos"
  ON productos FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_productos" ON productos;
CREATE POLICY "admin_delete_productos"
  ON productos FOR DELETE
  TO authenticated USING (true);

DROP POLICY IF EXISTS "admin_insert_configuracion" ON configuracion;
CREATE POLICY "admin_insert_configuracion"
  ON configuracion FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "admin_update_configuracion" ON configuracion;
CREATE POLICY "admin_update_configuracion"
  ON configuracion FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "admin_delete_configuracion" ON configuracion;
CREATE POLICY "admin_delete_configuracion"
  ON configuracion FOR DELETE
  TO authenticated USING (true);

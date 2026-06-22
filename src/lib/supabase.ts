import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Categoria = {
  id: string;
  nombre: string;
  orden: number;
  activa: boolean;
  created_at: string;
};

export type Producto = {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  categoria_id: string | null;
  imagen: string | null;
  destacado: boolean;
  nuevo: boolean;
  recomendado: boolean;
  mas_vendido: boolean;
  activo: boolean;
  created_at: string;
  categorias?: Categoria | null;
};

export type Configuracion = {
  id: string;
  nombre_negocio: string | null;
  slogan: string | null;
  direccion: string | null;
  horarios: string | null;
  telefono: string | null;
  whatsapp: string | null;
  wifi_nombre: string | null;
  wifi_password: string | null;
  logo_url: string | null;
  portada_url: string | null;
  created_at: string;
};

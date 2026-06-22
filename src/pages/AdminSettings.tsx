import { useState, useEffect, useRef } from 'react';
import { Save, Upload, Link, X } from 'lucide-react';
import { supabase, type Configuracion } from '../lib/supabase';

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

function getPublicUrl(path: string) {
  const { data } = supabase.storage.from('productos').getPublicUrl(path);
  return data.publicUrl;
}

type ImageField = 'logo_url' | 'portada_url';

export default function AdminSettings() {
  const [config, setConfig] = useState<Configuracion | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const [uploadError, setUploadError] = useState('');
  const logoRef = useRef<HTMLInputElement>(null);
  const portadaRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<Partial<Configuracion>>({});
  const [imageSource, setImageSource] = useState<Record<ImageField, 'file' | 'url'>>({
    logo_url: 'url',
    portada_url: 'url',
  });

  useEffect(() => {
    async function fetchConfig() {
      const { data } = await supabase.from('configuracion').select('*').limit(1).maybeSingle();
      setConfig(data);
      setForm({
        nombre_negocio: data?.nombre_negocio || '',
        slogan: data?.slogan || '',
        direccion: data?.direccion || '',
        horarios: data?.horarios || '',
        telefono: data?.telefono || '',
        whatsapp: data?.whatsapp || '',
        wifi_nombre: data?.wifi_nombre || '',
        wifi_password: data?.wifi_password || '',
        logo_url: data?.logo_url || '',
        portada_url: data?.portada_url || '',
      });
      setImageSource({
        logo_url: data?.logo_url && data.logo_url.includes('/storage/v1/object/public/productos/') ? 'file' : 'url',
        portada_url: data?.portada_url && data.portada_url.includes('/storage/v1/object/public/productos/') ? 'file' : 'url',
      });
      setLoading(false);
    }
    fetchConfig();
  }, []);

  const handleFileSelect = async (field: ImageField, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError('');

    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Formato no permitido. Usa JPG, JPEG, PNG o WEBP.');
      return;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setUploadError(`El archivo excede ${MAX_SIZE_MB}MB.`);
      return;
    }

    setUploadingField(field);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('productos').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) {
      setUploadError('Error al subir la imagen. Intenta de nuevo.');
      setUploadingField(null);
      return;
    }

    const publicUrl = getPublicUrl(path);
    setForm((prev) => ({ ...prev, [field]: publicUrl }));
    setImageSource((prev) => ({ ...prev, [field]: 'file' }));
    setUploadingField(null);
  };

  const handleRemoveImage = async (field: ImageField) => {
    const url = form[field];
    if (url && url.includes('/storage/v1/object/public/productos/')) {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/productos\/(.*)/);
      if (pathMatch) {
        await supabase.storage.from('productos').remove([pathMatch[1]]);
      }
    }
    setForm((prev) => ({ ...prev, [field]: '' }));
    setImageSource((prev) => ({ ...prev, [field]: 'url' }));
    if (field === 'logo_url' && logoRef.current) logoRef.current.value = '';
    if (field === 'portada_url' && portadaRef.current) portadaRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    if (config) {
      await supabase.from('configuracion').update(form).eq('id', config.id);
    } else {
      await supabase.from('configuracion').insert(form);
    }
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return <div className="py-8 text-center text-sm text-stone-400">Cargando...</div>;
  }

  const renderImageField = (field: ImageField, label: string, previewClass: string) => {
    const source = imageSource[field];
    const url = form[field] || '';

    return (
      <div>
        <label className="mb-1 block text-xs font-medium text-stone-700">{label}</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setImageSource((prev) => ({ ...prev, [field]: 'file' }))}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              source === 'file'
                ? 'border-stone-800 bg-stone-800 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Upload className="h-4 w-4" />
            Subir archivo
          </button>
          <button
            type="button"
            onClick={() => setImageSource((prev) => ({ ...prev, [field]: 'url' }))}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
              source === 'url'
                ? 'border-stone-800 bg-stone-800 text-white'
                : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
            }`}
          >
            <Link className="h-4 w-4" />
            URL externa
          </button>
        </div>

        {source === 'file' && (
          <div className="mt-2">
            <input
              ref={field === 'logo_url' ? logoRef : portadaRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={(e) => handleFileSelect(field, e)}
              className="hidden"
            />
            {!url ? (
              <button
                type="button"
                onClick={() => (field === 'logo_url' ? logoRef : portadaRef).current?.click()}
                disabled={uploadingField === field}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 py-6 text-stone-500 transition hover:border-stone-400 hover:bg-stone-100"
              >
                <Upload className="h-6 w-6" />
                <span className="text-xs font-medium">
                  {uploadingField === field ? 'Subiendo...' : 'Haz clic para seleccionar imagen'}
                </span>
                <span className="text-[10px] text-stone-400">JPG, PNG, WEBP hasta {MAX_SIZE_MB}MB</span>
              </button>
            ) : (
              <div className="relative">
                <img
                  src={url}
                  alt="Vista previa"
                  className={previewClass}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(field)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            {uploadingField === field && uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
          </div>
        )}

        {source === 'url' && (
          <div className="mt-2 space-y-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setForm({ ...form, [field]: e.target.value })}
              placeholder="https://..."
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
            />
            {url && (
              <div className="relative">
                <img
                  src={url}
                  alt="Vista previa"
                  className={previewClass}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(field)}
                  className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-stone-800">Configuración General</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-stone-700">Información del negocio</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-700">Nombre del negocio</label>
              <input
                value={form.nombre_negocio || ''}
                onChange={(e) => setForm({ ...form, nombre_negocio: e.target.value })}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-700">Eslogan</label>
              <input
                value={form.slogan || ''}
                onChange={(e) => setForm({ ...form, slogan: e.target.value })}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-stone-700">Dirección</label>
              <input
                value={form.direccion || ''}
                onChange={(e) => setForm({ ...form, direccion: e.target.value })}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium text-stone-700">Horarios</label>
              <input
                value={form.horarios || ''}
                onChange={(e) => setForm({ ...form, horarios: e.target.value })}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-700">Teléfono</label>
              <input
                value={form.telefono || ''}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-700">WhatsApp</label>
              <input
                value={form.whatsapp || ''}
                onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-stone-700">WiFi</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-700">Nombre de red</label>
              <input
                value={form.wifi_nombre || ''}
                onChange={(e) => setForm({ ...form, wifi_nombre: e.target.value })}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-stone-700">Contraseña</label>
              <input
                value={form.wifi_password || ''}
                onChange={(e) => setForm({ ...form, wifi_password: e.target.value })}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-stone-200 bg-white p-4">
          <h3 className="mb-3 text-sm font-semibold text-stone-700">Imágenes</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {renderImageField('logo_url', 'Logo del negocio', 'h-16 w-16 rounded-full object-cover')}
            {renderImageField('portada_url', 'Imagen de portada', 'h-20 w-full rounded-lg object-cover')}
          </div>
          {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          {saved && <span className="text-sm font-medium text-emerald-600">Guardado correctamente</span>}
        </div>
      </form>
    </div>
  );
}

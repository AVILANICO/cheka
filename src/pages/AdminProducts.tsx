import { useState, useEffect, useRef } from 'react';
import { Plus, Pencil, Trash2, Search, Star, Eye, EyeOff, Upload, Link, X } from 'lucide-react';
import { supabase, type Producto, type Categoria } from '../lib/supabase';
import { getProductImage } from '../lib/images';

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(n);
}

const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const MAX_SIZE_MB = 5;

function getPublicUrl(path: string) {
  const { data } = supabase.storage.from('productos').getPublicUrl(path);
  return data.publicUrl;
}

export default function AdminProducts() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Producto | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    categoria_id: '',
    imagen: '',
    imagenSource: 'url' as 'file' | 'url',
    destacado: false,
    nuevo: false,
    recomendado: false,
    mas_vendido: false,
    activo: true,
  });

  const fetchData = async () => {
    setLoading(true);
    const [{ data: prods }, { data: cats }] = await Promise.all([
      supabase.from('productos').select('*, categorias(*)').order('created_at', { ascending: false }),
      supabase.from('categorias').select('*').eq('activa', true).order('orden', { ascending: true }),
    ]);
    setProductos(prods || []);
    setCategorias(cats || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({
      nombre: '',
      descripcion: '',
      precio: '',
      categoria_id: categorias[0]?.id || '',
      imagen: '',
      imagenSource: 'url',
      destacado: false,
      nuevo: false,
      recomendado: false,
      mas_vendido: false,
      activo: true,
    });
    setUploadError('');
    setModalOpen(true);
  };

  const openEdit = (p: Producto) => {
    setEditing(p);
    const isStorage = p.imagen ? p.imagen.includes('/storage/v1/object/public/productos/') : false;
    setForm({
      nombre: p.nombre,
      descripcion: p.descripcion || '',
      precio: String(p.precio),
      categoria_id: p.categoria_id || '',
      imagen: p.imagen || '',
      imagenSource: isStorage ? 'file' : 'url',
      destacado: p.destacado,
      nuevo: p.nuevo,
      recomendado: p.recomendado,
      mas_vendido: p.mas_vendido,
      activo: p.activo,
    });
    setUploadError('');
    setModalOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setUploading(true);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await supabase.storage.from('productos').upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    });

    if (uploadError) {
      setUploadError('Error al subir la imagen. Intenta de nuevo.');
      setUploading(false);
      return;
    }

    const publicUrl = getPublicUrl(path);
    setForm((prev) => ({ ...prev, imagen: publicUrl, imagenSource: 'file' }));
    setUploading(false);
  };

  const handleRemoveImage = async () => {
    if (form.imagen && form.imagen.includes('/storage/v1/object/public/productos/')) {
      const urlObj = new URL(form.imagen);
      const pathMatch = urlObj.pathname.match(/\/productos\/(.*)/);
      if (pathMatch) {
        await supabase.storage.from('productos').remove([pathMatch[1]]);
      }
    }
    setForm((prev) => ({ ...prev, imagen: '', imagenSource: 'url' }));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      nombre: form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      precio: Number(form.precio),
      categoria_id: form.categoria_id || null,
      imagen: form.imagen.trim() || null,
      destacado: form.destacado,
      nuevo: form.nuevo,
      recomendado: form.recomendado,
      mas_vendido: form.mas_vendido,
      activo: form.activo,
    };

    if (editing) {
      await supabase.from('productos').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('productos').insert(payload);
    }
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto?')) return;
    const prod = productos.find((p) => p.id === id);
    if (prod?.imagen && prod.imagen.includes('/storage/v1/object/public/productos/')) {
      const urlObj = new URL(prod.imagen);
      const pathMatch = urlObj.pathname.match(/\/productos\/(.*)/);
      if (pathMatch) {
        await supabase.storage.from('productos').remove([pathMatch[1]]);
      }
    }
    await supabase.from('productos').delete().eq('id', id);
    fetchData();
  };

  const filtered = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      (p.descripcion || '').toLowerCase().includes(search.toLowerCase())
  );

  const previewUrl = form.imagen || '';

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-bold text-stone-800">Productos</h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo producto
        </button>
      </div>

      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar producto..."
          className="w-full rounded-lg border border-stone-200 bg-white py-2 pl-9 pr-4 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
        />
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-stone-400">Cargando...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">Imagen</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Categoría</th>
                <th className="px-4 py-3 font-medium">Precio</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium">Etiquetas</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <img
                      src={getProductImage(p)}
                      alt={p.nombre}
                      className="h-10 w-10 rounded-lg object-cover"
                      loading="lazy"
                    />
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-800">{p.nombre}</td>
                  <td className="px-4 py-3 text-stone-600">
                    {(p.categorias as any)?.nombre || '-'}
                  </td>
                  <td className="px-4 py-3 text-stone-800">{formatPrice(p.precio)}</td>
                  <td className="px-4 py-3">
                    {p.activo ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                        <Eye className="h-3 w-3" /> Activo
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">
                        <EyeOff className="h-3 w-3" /> Inactivo
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {p.destacado && <Star className="h-3.5 w-3.5 text-amber-500" />}
                      {p.nuevo && <span className="text-[10px] font-medium text-emerald-600">Nuevo</span>}
                      {p.recomendado && <span className="text-[10px] font-medium text-amber-600">Recomendado</span>}
                      {p.mas_vendido && <span className="text-[10px] font-medium text-rose-600">Más vendido</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="rounded-lg p-1.5 text-stone-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-stone-400">
                    No se encontraron productos.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-stone-800">
              {editing ? 'Editar producto' : 'Nuevo producto'}
            </h3>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-700">Nombre</label>
                <input
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-stone-700">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  rows={2}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-700">Precio</label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={0.01}
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-stone-700">Categoría</label>
                  <select
                    value={form.categoria_id}
                    onChange={(e) => setForm({ ...form, categoria_id: e.target.value })}
                    className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                  >
                    <option value="">Sin categoría</option>
                    {categorias.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Image section */}
              <div>
                <label className="mb-2 block text-xs font-medium text-stone-700">Imagen del producto</label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imagenSource: 'file' }))}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      form.imagenSource === 'file'
                        ? 'border-stone-800 bg-stone-800 text-white'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Upload className="h-4 w-4" />
                    Subir archivo
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, imagenSource: 'url' }))}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition ${
                      form.imagenSource === 'url'
                        ? 'border-stone-800 bg-stone-800 text-white'
                        : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    <Link className="h-4 w-4" />
                    URL externa
                  </button>
                </div>

                {form.imagenSource === 'file' && (
                  <div className="mt-3">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.webp"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    {!form.imagen ? (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-stone-300 bg-stone-50 py-6 text-stone-500 transition hover:border-stone-400 hover:bg-stone-100"
                      >
                        <Upload className="h-6 w-6" />
                        <span className="text-xs font-medium">
                          {uploading ? 'Subiendo...' : 'Haz clic para seleccionar imagen'}
                        </span>
                        <span className="text-[10px] text-stone-400">JPG, PNG, WEBP hasta {MAX_SIZE_MB}MB</span>
                      </button>
                    ) : (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Vista previa"
                          className="h-40 w-full rounded-xl object-cover"
                        />
                        <button
                          type="button"
                          onClick={handleRemoveImage}
                          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                    {uploadError && <p className="mt-2 text-xs text-red-600">{uploadError}</p>}
                  </div>
                )}

                {form.imagenSource === 'url' && (
                  <div className="mt-3 space-y-2">
                    <input
                      type="url"
                      value={form.imagen}
                      onChange={(e) => setForm({ ...form, imagen: e.target.value })}
                      placeholder="https://..."
                      className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                    />
                    {previewUrl && (
                      <div className="relative">
                        <img
                          src={previewUrl}
                          alt="Vista previa"
                          className="h-40 w-full rounded-xl object-cover"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = 'none';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setForm((prev) => ({ ...prev, imagen: '' }));
                          }}
                          className="absolute right-2 top-2 rounded-full bg-black/60 p-1.5 text-white transition hover:bg-black/80"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                {([
                  { key: 'destacado', label: 'Destacado' },
                  { key: 'nuevo', label: 'Nuevo' },
                  { key: 'recomendado', label: 'Recomendado' },
                  { key: 'mas_vendido', label: 'Más vendido' },
                ] as const).map((opt) => (
                  <label key={opt.key} className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700">
                    <input
                      type="checkbox"
                      checked={form[opt.key as keyof typeof form] as boolean}
                      onChange={(e) => setForm({ ...form, [opt.key]: e.target.checked })}
                      className="h-4 w-4 rounded border-stone-300 text-stone-800"
                    />
                    {opt.label}
                  </label>
                ))}
                <label className="flex items-center gap-2 rounded-lg border border-stone-200 px-3 py-2 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={form.activo}
                    onChange={(e) => setForm({ ...form, activo: e.target.checked })}
                    className="h-4 w-4 rounded border-stone-300 text-stone-800"
                  />
                  Activo
                </label>
              </div>
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="flex-1 rounded-lg border border-stone-200 bg-white py-2.5 text-sm font-medium text-stone-700 transition hover:bg-stone-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 rounded-lg bg-stone-800 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { supabase, type Categoria } from '../lib/supabase';

export default function AdminCategories() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Categoria | null>(null);
  const [form, setForm] = useState({ nombre: '', orden: 0, activa: true });

  const fetchData = async () => {
    setLoading(true);
    const { data } = await supabase.from('categorias').select('*').order('orden', { ascending: true });
    setCategorias(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm({ nombre: '', orden: categorias.length + 1, activa: true });
    setModalOpen(true);
  };

  const openEdit = (c: Categoria) => {
    setEditing(c);
    setForm({ nombre: c.nombre, orden: c.orden, activa: c.activa });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = { nombre: form.nombre.trim(), orden: Number(form.orden), activa: form.activa };
    if (editing) {
      await supabase.from('categorias').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('categorias').insert(payload);
    }
    setModalOpen(false);
    fetchData();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría? Los productos asociados quedarán sin categoría.')) return;
    await supabase.from('categorias').delete().eq('id', id);
    fetchData();
  };

  const move = async (index: number, direction: -1 | 1) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= categorias.length) return;
    const updated = [...categorias];
    const [item] = updated.splice(index, 1);
    updated.splice(newIndex, 0, item);

    const reordered = updated.map((c, i) => ({ ...c, orden: i + 1 }));
    setCategorias(reordered);

    for (const c of reordered) {
      await supabase.from('categorias').update({ orden: c.orden }).eq('id', c.id);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold text-stone-800">Categorías</h2>
        <button
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-lg bg-stone-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-stone-700"
        >
          <Plus className="h-4 w-4" />
          Nueva categoría
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-sm text-stone-400">Cargando...</div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-stone-50 text-stone-600">
              <tr>
                <th className="px-4 py-3 font-medium">Orden</th>
                <th className="px-4 py-3 font-medium">Nombre</th>
                <th className="px-4 py-3 font-medium">Estado</th>
                <th className="px-4 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {categorias.map((c, i) => (
                <tr key={c.id} className="hover:bg-stone-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 disabled:opacity-30"
                      >
                        <ArrowUp className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs text-stone-500">{c.orden}</span>
                      <button
                        onClick={() => move(i, 1)}
                        disabled={i === categorias.length - 1}
                        className="rounded p-1 text-stone-400 hover:bg-stone-100 hover:text-stone-600 disabled:opacity-30"
                      >
                        <ArrowDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-800">{c.nombre}</td>
                  <td className="px-4 py-3">
                    {c.activa ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">Activa</span>
                    ) : (
                      <span className="rounded-full bg-stone-100 px-2 py-0.5 text-xs font-medium text-stone-500">Inactiva</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => openEdit(c)}
                        className="rounded-lg p-1.5 text-stone-500 transition hover:bg-stone-100 hover:text-stone-700"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(c.id)}
                        className="rounded-lg p-1.5 text-stone-500 transition hover:bg-red-50 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {categorias.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-stone-400">
                    No hay categorías.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="text-base font-bold text-stone-800">
              {editing ? 'Editar categoría' : 'Nueva categoría'}
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
                <label className="mb-1 block text-xs font-medium text-stone-700">Orden</label>
                <input
                  type="number"
                  required
                  min={0}
                  value={form.orden}
                  onChange={(e) => setForm({ ...form, orden: Number(e.target.value) })}
                  className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm outline-none focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-stone-700">
                <input
                  type="checkbox"
                  checked={form.activa}
                  onChange={(e) => setForm({ ...form, activa: e.target.checked })}
                  className="h-4 w-4 rounded border-stone-300 text-stone-800"
                />
                Activa
              </label>
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
                  className="flex-1 rounded-lg bg-stone-800 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700"
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

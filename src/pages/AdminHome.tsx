import { useEffect, useState } from 'react';
import { Package, List, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function AdminHome() {
  const [counts, setCounts] = useState({ productos: 0, categorias: 0 });

  useEffect(() => {
    async function fetchCounts() {
      const [{ count: p }, { count: c }] = await Promise.all([
        supabase.from('productos').select('*', { count: 'exact', head: true }),
        supabase.from('categorias').select('*', { count: 'exact', head: true }),
      ]);
      setCounts({ productos: p || 0, categorias: c || 0 });
    }
    fetchCounts();
  }, []);

  const cards = [
    { label: 'Productos', count: counts.productos, to: '/admin/productos', icon: Package, color: 'bg-stone-100 text-stone-700' },
    { label: 'Categorías', count: counts.categorias, to: '/admin/categorias', icon: List, color: 'bg-stone-100 text-stone-700' },
    { label: 'Configuración', count: null, to: '/admin/configuracion', icon: Settings, color: 'bg-stone-100 text-stone-700' },
  ];

  return (
    <div>
      <h2 className="mb-4 text-lg font-bold text-stone-800">Dashboard</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.to}
            to={card.to}
            className="flex items-center gap-4 rounded-xl border border-stone-200 bg-white p-4 transition hover:shadow-sm"
          >
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
              <card.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-stone-600">{card.label}</p>
              {card.count !== null && <p className="text-xl font-bold text-stone-900">{card.count}</p>}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

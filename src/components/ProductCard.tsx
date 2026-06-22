import { useState } from 'react';
import { Star, Sparkles, ThumbsUp, Award } from 'lucide-react';
import type { Producto } from '../lib/supabase';
import { getProductImage, GENERIC_FOOD } from '../lib/images';

function formatPrice(n: number) {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(n);
}

export function ProductCard({ producto, compact = false }: { producto: Producto; compact?: boolean }) {
  const [imgSrc, setImgSrc] = useState(getProductImage(producto));
  const [loaded, setLoaded] = useState(false);

  const badges = [];
  if (producto.nuevo) badges.push({ label: 'Nuevo', icon: Sparkles, color: 'bg-emerald-600' });
  if (producto.recomendado) badges.push({ label: 'Recomendado', icon: Award, color: 'bg-amber-600' });
  if (producto.mas_vendido) badges.push({ label: 'Más vendido', icon: ThumbsUp, color: 'bg-rose-600' });
  if (producto.destacado) badges.push({ label: 'Destacado', icon: Star, color: 'bg-stone-700' });

  const handleError = () => {
    setImgSrc(GENERIC_FOOD);
  };

  if (compact) {
    return (
      <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
          {!loaded && (
            <div className="absolute inset-0 animate-pulse bg-stone-200" />
          )}
          <img
            src={imgSrc}
            alt={producto.nombre}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setLoaded(true)}
            onError={handleError}
          />
          {badges.length > 0 && (
            <div className="absolute left-2 top-2 flex flex-wrap gap-1">
              {badges.slice(0, 2).map((b) => (
                <span
                  key={b.label}
                  className={`inline-flex items-center gap-0.5 rounded-full ${b.color} px-1.5 py-0.5 text-[9px] font-medium text-white shadow-sm`}
                >
                  <b.icon className="h-2.5 w-2.5" />
                  {b.label}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="p-2.5">
          <h3 className="text-xs font-semibold leading-tight text-stone-900 line-clamp-1">{producto.nombre}</h3>
          <p className="mt-1 text-sm font-bold text-stone-800">{formatPrice(producto.precio)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-stone-200" />
        )}
        <img
          src={imgSrc}
          alt={producto.nombre}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
        {badges.length > 0 && (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {badges.map((b) => (
              <span
                key={b.label}
                className={`inline-flex items-center gap-0.5 rounded-full ${b.color} px-2 py-0.5 text-[10px] font-medium text-white shadow-sm`}
              >
                <b.icon className="h-3 w-3" />
                {b.label}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm font-semibold text-stone-900">{producto.nombre}</h3>
        {producto.descripcion && (
          <p className="mt-0.5 text-xs text-stone-500 line-clamp-2">{producto.descripcion}</p>
        )}
        <p className="mt-2 text-base font-bold text-stone-800">{formatPrice(producto.precio)}</p>
      </div>
    </div>
  );
}

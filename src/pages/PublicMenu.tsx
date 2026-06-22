import { useState, useEffect, useMemo, useRef } from 'react';
import { MapPin, Clock, Phone, Wifi, Search, ChevronDown } from 'lucide-react';
import { supabase, type Configuracion, type Categoria, type Producto } from '../lib/supabase';
import { ProductCard } from '../components/ProductCard';
import { WhatsAppButton } from '../components/WhatsAppButton';
import { SEO } from '../components/SEO';
import { DEFAULT_HERO } from '../lib/images';

export default function PublicMenu() {
  const [config, setConfig] = useState<Configuracion | null>(null);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [showStickyBar, setShowStickyBar] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [{ data: cfg }, { data: cats }, { data: prods }] = await Promise.all([
        supabase.from('configuracion').select('*').limit(1).maybeSingle(),
        supabase.from('categorias').select('*').eq('activa', true).order('orden', { ascending: true }),
        supabase.from('productos').select('*, categorias(*)').eq('activo', true),
      ]);
      setConfig(cfg);
      setCategorias(cats || []);
      setProductos(prods || []);
      setLoading(false);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setShowStickyBar(window.scrollY > 280);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const filtered = useMemo(() => {
    let list = productos;
    if (activeCategory) {
      list = list.filter((p) => p.categoria_id === activeCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          (p.descripcion || '').toLowerCase().includes(q)
      );
    }
    return list;
  }, [productos, activeCategory, search]);

  const destacados = useMemo(
    () => productos.filter((p) => p.destacado && p.activo).slice(0, 6),
    [productos]
  );

  const scrollToCategory = (id: string | null) => {
    setActiveCategory(id);
    if (!id) {
      menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    const el = document.getElementById(`cat-${id}`);
    if (el) {
      const offset = showStickyBar ? 120 : 0;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  const scrollToMenu = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-stone-700" />
      </div>
    );
  }

  const heroImage = config?.portada_url || DEFAULT_HERO;
  const hasLogo = !!config?.logo_url;

  return (
    <div className="min-h-screen bg-[#FAF7F2] pb-24">
      <SEO config={config} />

      {/* Hero */}
      <div className="relative h-[280px] w-full overflow-hidden sm:h-[380px]">
        <img src={heroImage} alt="Portada" className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/80" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center text-white">
          {hasLogo && (
            <div className="mb-3 flex h-[72px] w-[72px] items-center justify-center overflow-hidden rounded-2xl bg-white/90 shadow-lg sm:h-[90px] sm:w-[90px]">
              <img
                src={config.logo_url!}
                alt="Logo"
                className="h-full w-full object-contain p-1"
              />
            </div>
          )}
          <h1 className="text-2xl font-bold tracking-tight drop-shadow-lg sm:text-3xl">
            {config?.nombre_negocio || 'Cheka La Actitud'}
          </h1>
          <p className="mt-1.5 text-xs font-light tracking-wide opacity-90 drop-shadow sm:text-sm">
            {config?.slogan || 'Café con buena onda, siempre.'}
          </p>
          <button
            onClick={scrollToMenu}
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2 text-xs font-medium backdrop-blur-md transition hover:bg-white/30"
          >
            Ver Carta
            <ChevronDown className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Info bar */}
      <div className="mx-auto max-w-5xl px-4 pt-4">
        <div className="rounded-2xl bg-white p-3.5 shadow-sm">
          <div className="grid grid-cols-1 gap-2.5 text-[11px] text-stone-600 sm:grid-cols-2">
            {config?.direccion && (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F5EDE4]">
                  <MapPin className="h-3 w-3 text-[#8B6914]" />
                </div>
                <span>{config.direccion}</span>
              </div>
            )}
            {config?.horarios && (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F5EDE4]">
                  <Clock className="h-3 w-3 text-[#8B6914]" />
                </div>
                <span>{config.horarios}</span>
              </div>
            )}
            {config?.telefono && (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F5EDE4]">
                  <Phone className="h-3 w-3 text-[#8B6914]" />
                </div>
                <span>{config.telefono}</span>
              </div>
            )}
            {config?.wifi_nombre && (
              <div className="flex items-center gap-2">
                <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-[#F5EDE4]">
                  <Wifi className="h-3 w-3 text-[#8B6914]" />
                </div>
                <span>
                  WiFi: {config.wifi_nombre}
                  {config.wifi_password && ` / ${config.wifi_password}`}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mx-auto max-w-5xl px-4 pt-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setActiveCategory(null); }}
            placeholder="Buscar producto..."
            className="w-full rounded-xl border border-stone-200 bg-white py-2.5 pl-9 pr-4 text-sm text-stone-800 shadow-sm outline-none transition focus:border-[#C4A77D] focus:ring-2 focus:ring-[#C4A77D]/20"
          />
        </div>
      </div>

      {/* Category bar - single, sticky when scrolled */}
      <div
        ref={menuRef}
        className={`mx-auto max-w-5xl px-4 pt-3 transition-all ${
          showStickyBar
            ? 'sticky top-0 z-40 pt-0'
            : ''
        }`}
      >
        <div className={`flex gap-2 overflow-x-auto py-2.5 scrollbar-hide ${
          showStickyBar
            ? 'rounded-none border-b border-stone-200/80 bg-white/95 px-4 shadow-sm backdrop-blur-md'
            : ''
        }`}>
          <button
            onClick={() => scrollToCategory(null)}
            className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
              activeCategory === null && !search
                ? 'bg-[#5C4033] text-white'
                : showStickyBar
                  ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  : 'bg-white text-stone-600 shadow-sm hover:bg-stone-100'
            }`}
          >
            Todo
          </button>
          {categorias.map((c) => (
            <button
              key={c.id}
              onClick={() => scrollToCategory(c.id)}
              className={`flex-shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition ${
                activeCategory === c.id
                  ? 'bg-[#5C4033] text-white'
                  : showStickyBar
                    ? 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    : 'bg-white text-stone-600 shadow-sm hover:bg-stone-100'
              }`}
            >
              {c.nombre}
            </button>
          ))}
        </div>
      </div>

      {/* Destacados */}
      {destacados.length > 0 && !search && !activeCategory && (
        <div className="mx-auto max-w-5xl px-4 pt-4">
          <div className="flex items-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C4A77D] to-transparent" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B6914]">Recomendados</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C4A77D] to-transparent" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {destacados.map((p) => (
              <ProductCard key={p.id} producto={p} compact />
            ))}
          </div>
        </div>
      )}

      {/* Menu by category */}
      <div className="mx-auto max-w-5xl px-4 pt-4">
        {categorias.map((cat) => {
          const catProducts = filtered.filter((p) => p.categoria_id === cat.id);
          if (catProducts.length === 0) return null;
          return (
            <div key={cat.id} id={`cat-${cat.id}`} className="pt-2 pb-5">
              <div className="flex items-center gap-2">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C4A77D]/50 to-transparent" />
                <h2 className="text-[10px] font-bold uppercase tracking-widest text-[#8B6914]">{cat.nombre}</h2>
                <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C4A77D]/50 to-transparent" />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {catProducts.map((p) => (
                  <ProductCard key={p.id} producto={p} compact />
                ))}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="py-12 text-center text-sm text-stone-400">No se encontraron productos.</div>
        )}
      </div>

      <WhatsAppButton phone={config?.whatsapp || null} />
    </div>
  );
}

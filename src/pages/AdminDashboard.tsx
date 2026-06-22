import { useEffect, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  List,
  Settings,
  LogOut,
  Coffee,
} from 'lucide-react';
import { supabase } from '../lib/supabase';

function Sidebar({ onNavigate }: { onNavigate: () => void }) {
  const location = useLocation();
  const items = [
    { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/admin/productos', label: 'Productos', icon: Package },
    { to: '/admin/categorias', label: 'Categorías', icon: List },
    { to: '/admin/configuracion', label: 'Configuración', icon: Settings },
  ];

  return (
    <nav className="flex gap-1 overflow-x-auto px-2 py-2 sm:flex-col sm:gap-1 sm:overflow-visible sm:px-0 sm:py-0">
      {items.map((item) => {
        const active = location.pathname === item.to;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? 'bg-stone-800 text-white'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            <item.icon className="h-4 w-4" />
            <span className="whitespace-nowrap">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default function AdminDashboard({ children }: { children?: React.ReactNode }) {
  const navigate = useNavigate();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) navigate('/admin/login');
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (!session) navigate('/admin/login');
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin/login');
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-stone-50">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-stone-300 border-t-stone-700" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="flex min-h-screen flex-col bg-stone-50 sm:flex-row">
      {/* Mobile header */}
      <div className="flex items-center justify-between border-b border-stone-200 bg-white px-4 py-3 sm:hidden">
        <div className="flex items-center gap-2">
          <Coffee className="h-5 w-5 text-stone-700" />
          <span className="text-sm font-bold text-stone-800">Admin</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="rounded-lg p-2 text-stone-600 hover:bg-stone-100"
        >
          <List className="h-5 w-5" />
        </button>
      </div>

      {/* Sidebar */}
      <aside
        className={`${
          mobileMenuOpen ? 'block' : 'hidden'
        } border-b border-stone-200 bg-white px-3 py-3 sm:block sm:w-60 sm:border-b-0 sm:border-r`}
      >
        <div className="mb-4 hidden items-center gap-2 px-3 sm:flex">
          <Coffee className="h-5 w-5 text-stone-700" />
          <span className="text-sm font-bold text-stone-800">Admin</span>
        </div>
        <Sidebar onNavigate={() => setMobileMenuOpen(false)} />
        <div className="mt-4 border-t border-stone-200 pt-3 sm:mt-auto">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 p-4 sm:p-6">{children}</main>
    </div>
  );
}

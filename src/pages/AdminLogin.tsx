import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (signInError) {
      setError('Credenciales incorrectas. Solo administradores pueden acceder.');
      return;
    }
    navigate('/admin');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4">
      <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-lg">
        <div className="flex flex-col items-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-stone-800 text-white">
            <Coffee className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-lg font-bold text-stone-900">Panel Administrador</h1>
          <p className="text-xs text-stone-500">Cheka La Actitud</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-700">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
              placeholder="admin@cheka.com"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-stone-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 pr-10 text-sm text-stone-800 outline-none transition focus:border-stone-400 focus:ring-2 focus:ring-stone-200"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
              >
                {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {error && <p className="text-xs text-red-600">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-stone-800 py-2.5 text-sm font-medium text-white transition hover:bg-stone-700 disabled:opacity-50"
          >
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}

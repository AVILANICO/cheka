import { useEffect } from 'react';
import type { Configuracion } from '../lib/supabase';

export function SEO({ config }: { config: Configuracion | null }) {
  useEffect(() => {
    if (!config) return;

    const title = config.nombre_negocio || 'Cheka La Actitud';
    const desc = config.slogan || 'Café con buena onda, siempre.';

    document.title = title;

    const setMeta = (selector: string, content: string) => {
      let el = document.querySelector(selector) as HTMLMetaElement | null;
      if (!el) {
        el = document.createElement('meta');
        if (selector.includes('property=')) {
          el.setAttribute('property', selector.match(/property="([^"]+)"/)?.[1] || '');
        } else if (selector.includes('name=')) {
          el.setAttribute('name', selector.match(/name="([^"]+)"/)?.[1] || '');
        }
        document.head.appendChild(el);
      }
      el.setAttribute('content', content);
    };

    setMeta('meta[name="description"]', desc);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', desc);
    setMeta('meta[property="og:type"]', 'website');
    if (config.portada_url) {
      setMeta('meta[property="og:image"]', config.portada_url);
    }
  }, [config]);

  return null;
}

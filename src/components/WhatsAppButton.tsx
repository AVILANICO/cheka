import { MessageCircle } from 'lucide-react';

export function WhatsAppButton({ phone }: { phone: string | null }) {
  if (!phone) return null;

  const clean = phone.replace(/\D/g, '');
  const href = `https://wa.me/${clean}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-white shadow-lg shadow-emerald-900/20 transition-all hover:scale-105 hover:shadow-xl active:scale-95"
      aria-label="Consultar por WhatsApp"
    >
      <MessageCircle className="h-5 w-5" />
      <span className="text-sm font-medium">Consultar</span>
    </a>
  );
}

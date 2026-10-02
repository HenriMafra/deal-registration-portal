"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { supabaseBrowser } from "@/lib/supabase/client";
import { LogIn, LogOut } from "lucide-react";

// Frame LEVE do MAPPER no modo "só RO" (pedido da gestão, 2026-06-29): substitui o Shell pesado
// (sidebar com toda a navegação, notificações, realtime, helpbot…) por um cabeçalho enxuto.
// Usado tanto no registro público quanto na visão do Administrador — visual limpo para todos.
// As demais páginas continuam existindo e funcionando; só não aparecem por aqui.
export function RoShell({ title, subtitle, mode, children }:
  { title?: string; subtitle?: string; mode: "publico" | "admin"; children: React.ReactNode }) {
  const router = useRouter();
  async function sair() { try { await supabaseBrowser().auth.signOut(); } catch {} router.push("/login"); router.refresh(); }
  const largura = mode === "admin" ? "max-w-5xl" : "max-w-3xl";
  return (
    <div className="min-h-screen bg-gradient-to-br from-surface2 via-surface2 to-brand/10 text-fg">
      <header className="sticky top-0 z-30 backdrop-blur bg-surface/80 border-b border-line">
        <div className={`${largura} mx-auto px-4 h-14 flex items-center gap-3`}>
          <span className="font-extrabold tracking-tight text-lg">MAPPER</span>
          <span className="text-xs text-muted hidden sm:inline">· {mode === "admin" ? "Registros (administrador)" : "Registro de Oportunidade"}</span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            {mode === "admin" && (
              <button onClick={sair} className="inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg">
                <LogOut size={15} /> Sair
              </button>
            )}
          </div>
        </div>
      </header>
      <main className={`${largura} mx-auto px-4 py-6`}>
        {(title || subtitle) && (
          <div className="mb-5">
            {title && <h1 className="text-2xl font-extrabold text-fg">{title}</h1>}
            {subtitle && <p className="text-sm text-muted mt-1">{subtitle}</p>}
          </div>
        )}
        {children}
      </main>
      <footer className="text-center text-xs text-muted py-6">
        developed by{" "}
        {mode === "publico" ? (
          <Link href="/login?admin=1" className="text-muted hover:text-muted cursor-default select-none">
            Henri Mafra
          </Link>
        ) : (
          <span>Henri Mafra</span>
        )}
      </footer>
    </div>
  );
}

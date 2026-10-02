import { supabaseAdmin } from "@/lib/supabase/admin";

// Fabricantes pré-mapeados (o AM só seleciona). Campos específicos configuráveis.
export async function getFabricantes() {
  try {
    const { data, error } = await supabaseAdmin().from("ro_fabricantes").select("*").eq("ativo", true).order("ordem").order("nome");
    if (error) {
      console.error("getFabricantes database error:", error);
    }
    return data || [];
  } catch (e: any) {
    console.error("getFabricantes thrown exception:", e);
    return [];
  }
}

// Sales Engineers (Pré-vendas) ativos — para o AM atribuir a parte técnica de um RO.
export async function getSalesEngineers() {
  try {
    const { data } = await supabaseAdmin().from("perfis").select("user_id,nome").eq("role", "Sales Engineer").eq("ativo", true).order("nome");
    return (data || []).map((p: any) => ({ id: p.user_id, nome: p.nome || "(sem nome)" }));
  } catch { return []; }
}

// Lista de processos (DEALs) com seus registros (ROs) — para o painel/lista.
export async function getProcessos() {
  try {
    const sb = supabaseAdmin();
    const { data: procs } = await sb.from("ro_processos").select("*").order("id", { ascending: false }).limit(500);
    const ids = (procs || []).map((p: any) => p.id);
    let regs: any[] = [];
    if (ids.length) { const { data } = await sb.from("ro_registros").select("*").in("processo_id", ids).order("id"); regs = data || []; }
    const byProc: Record<number, any[]> = {};
    regs.forEach((r: any) => { (byProc[r.processo_id] ||= []).push(r); });
    return (procs || []).map((p: any) => ({ ...p, registros: byProc[p.id] || [] }));
  } catch { return []; }
}

// Um processo + seus registros + eventos (linha do tempo).
export async function getProcesso(id: string | number) {
  try {
    const sb = supabaseAdmin();
    const { data: procs } = await sb.from("ro_processos").select("*").eq("id", id).limit(1);
    const proc = procs?.[0]; if (!proc) return null;
    const { data: regs } = await sb.from("ro_registros").select("*").eq("processo_id", proc.id).order("id");
    const regIds = (regs || []).map((r: any) => r.id);
    let eventos: any[] = [];
    if (regIds.length) { const { data } = await sb.from("ro_eventos").select("*").in("registro_id", regIds).order("id", { ascending: false }).limit(500); eventos = data || []; }
    // anexa o e-mail de RO do fabricante (definido pelo Intern) a cada registro, p/ exibir na ficha
    const fabIds = Array.from(new Set((regs || []).map((r: any) => r.fabricante_id).filter(Boolean)));
    const emailByFab: Record<number, string> = {};
    if (fabIds.length) {
      const { data: fabs } = await sb.from("ro_fabricantes").select("id,email_ro").in("id", fabIds);
      (fabs || []).forEach((f: any) => { if (f.email_ro) emailByFab[f.id] = f.email_ro; });
    }
    const registros = (regs || []).map((r: any) => ({ ...r, fab_email_ro: r.fabricante_id ? (emailByFab[r.fabricante_id] || null) : null }));
    return { proc, registros, eventos };
  } catch { return null; }
}

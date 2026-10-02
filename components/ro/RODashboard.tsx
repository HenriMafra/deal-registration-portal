"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, CardPad, Empty, Input } from "@/components/ui/primitives";
import { Plus, Handshake, Search, Factory, CheckCircle2, Clock, FileText, ChevronRight, SlidersHorizontal, ChevronDown } from "lucide-react";
import { ROCreate } from "./ROCreate";
import { RO_STATUS, RO_STATUS_TONE } from "@/lib/ro/copyblock";
import { cn, semAcento } from "@/lib/utils/format";

function fmtD(d: any): string { if (!d) return "—"; try { return new Date(d).toLocaleDateString("pt-BR"); } catch { return "—"; } }

export function RODashboard({ processos, fabricantes, salesEngineers = [], podeCriar, meId, role }:
  { processos: any[]; fabricantes: any[]; salesEngineers?: { id: string; nome: string }[]; podeCriar: boolean; meId: string; role: string }) {
  const router = useRouter();
  const [criando, setCriando] = useState(false);
  const [q, setQ] = useState("");
  const [statusF, setStatusF] = useState("");
  const [periodo, setPeriodo] = useState<"all" | "7" | "30" | "custom">("all");
  const [dataBase, setDataBase] = useState<"criacao" | "conclusao">("criacao");
  const [de, setDe] = useState(""); const [ate, setAte] = useState("");
  const [fabF, setFabF] = useState(""); const [amF, setAmF] = useState("");
  const [filtrosAbertos, setFiltrosAbertos] = useState(false);

  // achata: cada RO (registro) vira uma linha, levando o contexto do DEAL
  const todas = useMemo(() => {
    const out: any[] = [];
    for (const p of processos || []) for (const r of (p.registros || [])) out.push({ ...r, _proc: p });
    return out;
  }, [processos]);

  // filtro por PAPEL
  const ehIntern = role === "Intern" || role === "Sales Engineer";
  const ehSE = role === "Sales Engineer";
  // um RO só está "pronto p/ o Intern" quando NÃO está aguardando o Pré-vendas
  const prontoIntern = (r: any) => r.handoff_status !== "aguardando_prevendas";
  // tarefas em que EU sou o Pré-vendas e preciso completar a parte técnica
  const minhasPrevendas = useMemo(() => ehSE ? todas.filter((r) => r.pre_vendas_id === meId && r.handoff_status === "aguardando_prevendas") : [], [todas, ehSE, meId]);
  const minhas = useMemo(() => {
    if (role === "Account Manager") return todas.filter((r) => r._proc?.criado_por_id === meId);
    if (ehIntern) return todas.filter((r) => r.intern_id === meId || (!r.feito && prontoIntern(r))); // a fazer (pool pronto) + os que eu fiz
    return todas; // Administrador / Diretoria veem tudo
  }, [todas, role, meId, ehIntern]);

  const nq = semAcento(q);
  const filtradas = useMemo(() => {
    const dataRef = (r: any) => dataBase === "conclusao" ? (r.feito_em || null) : (r.created_at || r._proc?.created_at || null);
    const noPeriodo = (r: any) => {
      if (periodo === "all") return true;
      const d = dataRef(r); if (!d) return false;
      const t = new Date(d).getTime();
      if (periodo === "custom") {
        const from = de ? new Date(de).getTime() : -Infinity;
        const to = ate ? new Date(ate).getTime() + 86400000 : Infinity;
        return t >= from && t <= to;
      }
      return t >= Date.now() - (periodo === "7" ? 7 : 30) * 86400000;
    };
    return minhas.filter((r) =>
      (!statusF || r.status === statusF) &&
      (!fabF || r.fabricante_nome === fabF) &&
      (!amF || r._proc?.criado_por === amF) &&
      noPeriodo(r) &&
      (!nq || semAcento(`${r.fabricante_nome || ""} ${r._proc?.nome_oportunidade || ""} ${r._proc?.empresa || ""} ${r.numero_ro || ""} ${r._proc?.deal_id_bitrix || ""} ${r._proc?.criado_por || ""} ${r.intern_nome || ""}`).includes(nq))
    ).sort((a: any, b: any) => (b._proc?.urgente ? 1 : 0) - (a._proc?.urgente ? 1 : 0)); // urgentes fixados no topo
  }, [minhas, nq, statusF, fabF, amF, periodo, dataBase, de, ate]);
  const fabOptions = useMemo(() => Array.from(new Set(minhas.map((r: any) => r.fabricante_nome).filter(Boolean))).sort(), [minhas]);
  const amOptions = useMemo(() => Array.from(new Set(minhas.map((r: any) => r._proc?.criado_por).filter(Boolean))).sort(), [minhas]);
  const algumFiltro = periodo !== "all" || !!fabF || !!amF || !!statusF || !!q;
  function limparFiltros() { setPeriodo("all"); setDataBase("criacao"); setDe(""); setAte(""); setFabF(""); setAmF(""); setStatusF(""); setQ(""); }

  const contagem = useMemo(() => {
    const c: Record<string, number> = {};
    minhas.forEach((r) => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [minhas]);

  if (criando) return <ROCreate fabricantes={fabricantes} salesEngineers={salesEngineers} onCancel={() => setCriando(false)} />;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {podeCriar && <Button onClick={() => setCriando(true)}><Plus size={16} /> Novo Registro de Oportunidade</Button>}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted" />
          <Input value={q} onChange={(e: any) => setQ(e.target.value)} placeholder="Buscar por projeto, empresa, fabricante, nº do RO, quem pediu…" className="pl-8" />
        </div>
        <span className="text-xs text-muted ml-auto">{filtradas.length} RO(s){ehIntern ? " · seus / a fazer" : role === "Account Manager" ? " · que você emitiu" : ""}</span>
      </div>

      {/* painel de filtros avançados (período, base de data, fabricante, AM) */}
      <div className="rounded-xl border border-line bg-surface">
        <button onClick={() => setFiltrosAbertos((v) => !v)} className="w-full flex items-center gap-2 px-3 py-2 text-sm font-semibold text-fg">
          <SlidersHorizontal size={15} className="text-brand" /> Filtros{algumFiltro && <span className="text-[11px] text-brand font-normal">· ativos</span>}
          <ChevronDown size={16} className={"ml-auto text-muted transition " + (filtrosAbertos ? "rotate-180" : "")} />
        </button>
        {filtrosAbertos && (
          <div className="px-3 pb-3 pt-1 space-y-3 border-t border-line">
            <div>
              <div className="text-[11px] uppercase tracking-wide text-muted font-semibold mb-1.5">Período</div>
              <div className="flex flex-wrap items-center gap-1.5">
                {([["all", "Todos"], ["7", "Últimos 7 dias"], ["30", "Últimos 30 dias"], ["custom", "Personalizado"]] as const).map(([v, l]) => (
                  <button key={v} onClick={() => setPeriodo(v)} className={cn("text-xs px-2.5 py-1 rounded-full border transition", periodo === v ? "border-brand bg-brand/10 text-brand font-semibold" : "border-line text-muted hover:text-fg")}>{l}</button>
                ))}
                <select value={dataBase} onChange={(e) => setDataBase(e.target.value as any)} className="text-xs rounded-lg border border-line bg-surface px-2 py-1 text-fg">
                  <option value="criacao">por data de criação</option>
                  <option value="conclusao">por data de conclusão (feito)</option>
                </select>
                {periodo === "custom" && (
                  <span className="inline-flex items-center gap-1.5">
                    <input type="date" value={de} onChange={(e) => setDe(e.target.value)} className="text-xs rounded-lg border border-line bg-surface px-2 py-1 text-fg" />
                    <span className="text-xs text-muted">até</span>
                    <input type="date" value={ate} onChange={(e) => setAte(e.target.value)} className="text-xs rounded-lg border border-line bg-surface px-2 py-1 text-fg" />
                  </span>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted font-semibold mb-1">Fabricante</div>
                <select value={fabF} onChange={(e) => setFabF(e.target.value)} className="w-full text-sm rounded-lg border border-line bg-surface px-2 py-1.5 text-fg">
                  <option value="">Todos</option>
                  {fabOptions.map((f) => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wide text-muted font-semibold mb-1">Quem pediu (AM)</div>
                <select value={amF} onChange={(e) => setAmF(e.target.value)} className="w-full text-sm rounded-lg border border-line bg-surface px-2 py-1.5 text-fg">
                  <option value="">Todos</option>
                  {amOptions.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            {algumFiltro && <button onClick={limparFiltros} className="text-xs text-brand hover:underline">Limpar todos os filtros</button>}
          </div>
        )}
      </div>

      {/* filtros rápidos por status (com contagem) */}
      <div className="flex flex-wrap gap-1.5">
        <button onClick={() => setStatusF("")} className={cn("text-xs px-2.5 py-1 rounded-full border transition", !statusF ? "border-brand bg-brand/10 text-brand font-semibold" : "border-line text-muted hover:text-fg")}>Todos ({minhas.length})</button>
        {RO_STATUS.filter((s) => contagem[s]).map((s) => (
          <button key={s} onClick={() => setStatusF(statusF === s ? "" : s)}
            className={cn("text-xs px-2.5 py-1 rounded-full border transition font-semibold", statusF === s ? "border-brand " + (RO_STATUS_TONE[s] || "") : "border-line text-muted hover:text-fg")}>
            {s} ({contagem[s]})
          </button>
        ))}
      </div>

      {ehSE && minhasPrevendas.length > 0 && (
        <Card><CardPad>
          <div className="text-sm font-bold text-amber-700 dark:text-amber-400 mb-2 flex items-center gap-2"><Handshake size={16} /> Aguardando você (Pré-vendas) — {minhasPrevendas.length} tarefa(s) técnica(s)</div>
          <div className="space-y-2">
            {minhasPrevendas.map((r) => (
              <button key={"pv-" + r.id} onClick={() => router.push(`/deal-reg/${r._proc.id}`)} className="w-full text-left rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5 hover:border-amber-500 transition flex items-center gap-3">
                <Factory size={16} className="text-amber-600 shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="font-semibold text-fg truncate">{r.fabricante_nome || "(fabricante)"} <span className="text-xs text-muted">· {r._proc?.nome_oportunidade || r._proc?.empresa || "(deal)"}</span></div>
                  <div className="text-[11px] text-muted">Complete a parte técnica e libere para o Intern.</div>
                </div>
                <ChevronRight size={16} className="text-muted shrink-0" />
              </button>
            ))}
          </div>
        </CardPad></Card>
      )}

      {ehIntern && <p className="text-xs text-muted">Você vê os ROs <b>a fazer</b> (abertos e já liberados pelo Pré-vendas) e os que <b>você já registrou</b>. Quando o fabricante responder por e-mail, abra o RO e marque <b>Aprovado/Rejeitado</b>.</p>}

      {filtradas.length === 0 ? (
        <Card><CardPad><Empty>{q || statusF ? "Nenhum RO com esse filtro." : podeCriar ? "Nenhum RO ainda. Clique em “Novo Registro de Oportunidade”." : "Nenhum RO para você no momento."}</Empty></CardPad></Card>
      ) : (
        <div className="space-y-2">
          {filtradas.map((r) => {
            const codigo = r.numero_ro ? `Nº ${r.numero_ro}` : (r.feito ? "sem código (fabricante não retorna)" : "—");
            const urgente = r._proc?.urgente;
            return (
              <button key={r.id} onClick={() => router.push(`/deal-reg/${r._proc.id}`)}
                className={cn("w-full text-left rounded-xl border p-3 shadow-soft hover:shadow-md transition flex items-center gap-3", urgente ? "border-red-500/50 bg-red-500/5 hover:border-red-500" : "border-line bg-surface hover:border-brand")}>
                <div className={cn("w-9 h-9 rounded-lg grid place-items-center shrink-0", urgente ? "bg-red-500/15 text-red-600" : "bg-brand/15 text-brand")}><Factory size={17} /></div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
                    {urgente && <span className="text-[11px] px-1.5 py-0.5 rounded-full font-bold bg-red-600 text-white shrink-0">🔴 URGENTE</span>}
                    <span className="font-bold text-fg truncate">{r.fabricante_nome || "(fabricante)"}</span>
                    <span className={cn("text-[11px] px-1.5 py-0.5 rounded-full font-semibold shrink-0", RO_STATUS_TONE[r.status] || "bg-surface2 text-muted")}>{r.status}</span>
                    <span className="text-xs text-muted truncate">· {r._proc?.nome_oportunidade || "(sem nome)"}{r._proc?.empresa ? ` · ${r._proc.empresa}` : ""}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1 text-[11px] text-muted">
                    <span className={cn("inline-flex items-center gap-1", !r.numero_ro && "italic")}><FileText size={11} /> {codigo}</span>
                    <span className="inline-flex items-center gap-1"><Clock size={11} /> Pedido {fmtD(r._proc?.created_at)}{r._proc?.criado_por ? ` · ${r._proc.criado_por}` : ""}</span>
                    {r.feito
                      ? <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400"><CheckCircle2 size={11} /> Feito {fmtD(r.feito_em || r.updated_at)}{r.intern_nome ? ` · ${r.intern_nome}` : ""}</span>
                      : <span className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-400">a fazer</span>}
                  </div>
                </div>
                <ChevronRight size={18} className="text-muted shrink-0" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

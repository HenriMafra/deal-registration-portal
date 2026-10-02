"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Input, Card, CardPad, Badge, Select } from "@/components/ui/primitives";
import { Combobox } from "@/components/ui/Combobox";
import { MultiCombobox } from "@/components/ui/MultiCombobox";
import { ArrowLeft, ExternalLink, CheckCircle2, AlertTriangle, RefreshCw, XCircle, Trash2, Factory, ClipboardCheck, Flag, Mail, Link2, UserCheck, Send } from "lucide-react";
import { ROCopyBlock } from "./ROCopyBlock";
import { RO_STATUS_TONE } from "@/lib/ro/copyblock";
import { fabFieldsFor, type FabField } from "@/lib/ro/fields";
import { ProdutosQtd } from "./ProdutosQtd";
import { LenovoProdutosQtd } from "./LenovoProdutosQtd";
import { useConfirm } from "@/components/ui/ConfirmDialog";

async function callApi(body: any) {
  const r = await fetch("/api/ro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const j = await r.json().catch(() => ({}));
  return { ok: r.ok, j };
}

function StatusBadge({ status }: { status: string }) {
  return <span className={"text-xs px-2 py-0.5 rounded-full font-semibold " + (RO_STATUS_TONE[status] || "bg-surface2 text-muted")}>{status}</span>;
}

const taSmall = "w-full rounded-lg border border-line bg-surface text-fg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-y min-h-[56px]";

// Um controle de campo de fabricante (reusa os mesmos tipos do ROCreate) — usado pelo Pré-vendas.
function ControlField({ d, value, onChange }: { d: FabField; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label className="block text-[11px] text-muted font-semibold mb-0.5">{d.label}</label>
      {d.tipo === "multiselect" ? (
        <MultiCombobox value={value ? value.split(", ") : []} onChange={(arr: string[]) => onChange(arr.join(", "))} options={d.options || []} label={d.label} allLabel="Selecionar…" allowCustom />
      ) : d.tipo === "produtos_qtd" ? (
        <ProdutosQtd value={value} onChange={onChange} options={d.options || []} />
      ) : d.tipo === "lenovo_produtos_qtd" ? (
        <LenovoProdutosQtd value={value} onChange={onChange} options={d.options || []} />
      ) : d.tipo === "select" ? (
        <Combobox value={value} onChange={onChange} options={d.options || []} allLabel="Selecionar…" allowCustom />
      ) : d.tipo === "bool" ? (
        <Select value={value} onChange={(e: any) => onChange(e.target.value)}><option value="">—</option><option value="Sim">Sim</option><option value="Não">Não</option></Select>
      ) : d.tipo === "textarea" ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} className={taSmall} />
      ) : (
        <Input value={value} onChange={(e: any) => onChange(e.target.value)} />
      )}
      {d.hint && <p className="text-[10px] text-muted mt-0.5">{d.hint}</p>}
    </div>
  );
}

// Área de colaboração de UM registro: handoff do Pré-vendas (completa o que falta + conclui),
// copiar link interno p/ o Pré-vendas, e o e-mail de RO do fabricante (definido pelo Intern, #4).
function HandoffArea({ reg, meId, role, podeExecutar, onChanged }: { reg: any; meId: string; role: string; podeExecutar: boolean; onChanged: () => void }) {
  const fields = fabFieldsFor(reg.fabricante_nome || "");
  const [campos, setCampos] = useState<Record<string, string>>({ ...(reg.campos || {}) });
  const [email, setEmail] = useState<string>(reg.fab_email_ro || "");
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");
  const [okMsg, setOkMsg] = useState("");
  const [copiado, setCopiado] = useState(false);
  const souPrevendas = reg.pre_vendas_id && reg.pre_vendas_id === meId;
  const podeConcluir = souPrevendas || role === "Administrador";
  const aguardando = reg.handoff_status === "aguardando_prevendas";
  const setCampo = (k: string, v: string) => setCampos((c) => ({ ...c, [k]: v }));
  const visiveis = fields.filter((d) => !d.showIf || campos[d.showIf.key] === d.showIf.equals);
  const faltando = visiveis.filter((d) => !String(campos[d.key] || "").trim());

  async function concluir() {
    setBusy(true); setErro("");
    const { ok, j } = await callApi({ action: "concluir_prevendas", registro_id: reg.id, campos });
    setBusy(false);
    if (ok) onChanged(); else setErro(j.error || "Falha ao concluir.");
  }
  async function salvarEmail() {
    setBusy(true); setOkMsg(""); setErro("");
    const { ok, j } = await callApi({ action: "set_fab_email", fabricante_id: reg.fabricante_id, email_ro: email });
    setBusy(false);
    if (ok) setOkMsg("E-mail salvo para este fabricante ✓"); else setErro(j.error || "Falha ao salvar e-mail.");
  }
  function copiarLink() {
    try { navigator.clipboard?.writeText(`${location.origin}/deal-reg/${reg.processo_id}`); setCopiado(true); setTimeout(() => setCopiado(false), 2000); } catch {}
  }

  return (
    <div className="mt-3 space-y-2">
      {aguardando && (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-2.5">
          <div className="flex flex-wrap items-center gap-2 text-sm">
            <UserCheck size={15} className="text-amber-600 shrink-0" />
            <span className="text-amber-800 dark:text-amber-300">Aguardando <b>{reg.pre_vendas_nome || "o Pré-vendas"}</b> completar a parte técnica.</span>
            <button onClick={copiarLink} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold rounded-lg border border-amber-500/40 text-amber-700 dark:text-amber-300 px-2 py-1 hover:bg-amber-500/10"><Link2 size={12} /> {copiado ? "Link copiado!" : "Copiar link p/ o Pré-vendas"}</button>
          </div>
          {podeConcluir && (
            <div className="mt-2 border-t border-amber-500/20 pt-2 space-y-2">
              <div className="text-xs font-semibold text-amber-800 dark:text-amber-300">Sua parte (Pré-vendas){faltando.length ? ` — faltam ${faltando.length} campo(s) que o AM não preencheu` : " — o AM preencheu tudo; confira e conclua"}:</div>
              {faltando.map((d) => <ControlField key={d.key} d={d} value={campos[d.key] || ""} onChange={(v) => setCampo(d.key, v)} />)}
              {erro && <div className="text-xs text-red-600">{erro}</div>}
              <Button className="h-8" disabled={busy} onClick={concluir}><Send size={13} /> Concluir parte técnica (liberar p/ o Intern)</Button>
            </div>
          )}
          {!podeConcluir && <p className="text-[11px] text-muted mt-1">Só o Pré-vendas atribuído vê e preenche a parte técnica por aqui.</p>}
        </div>
      )}

      {podeExecutar && (
        <div className="rounded-lg border border-line bg-surface2/40 p-2.5">
          <div className="flex flex-wrap items-end gap-2">
            <div className="flex-1 min-w-[200px]">
              <label className="text-[11px] text-muted font-semibold flex items-center gap-1"><Mail size={12} /> E-mail para envio do RO — {reg.fabricante_nome}</label>
              <Input value={email} onChange={(e: any) => setEmail(e.target.value)} placeholder="ex.: dealreg@fabricante.com (fica salvo p/ os próximos RO deste fabricante)" />
            </div>
            <Button className="h-8" variant="ghost" disabled={busy || !reg.fabricante_id} onClick={salvarEmail}>Salvar e-mail</Button>
          </div>
          {okMsg && <div className="text-xs text-emerald-600 mt-1">{okMsg}</div>}
          {erro && !aguardando && <div className="text-xs text-red-600 mt-1">{erro}</div>}
        </div>
      )}
    </div>
  );
}

function RegistroCard({ proc, reg, eventos, podeExecutar, meId, role }: { proc: any; reg: any; eventos: any[]; podeExecutar: boolean; meId: string; role: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");
  const [form, setForm] = useState<string | null>(null);
  const [f, setF] = useState<any>({ numero_ro: "", comprovante: "", semNumero: false, data_vencimento: "", numero_aprov: "", tipo_renovacao: "manual", venc_renov: "" });
  const meus = eventos.filter((e) => e.registro_id === reg.id);
  const { confirm, dialog } = useConfirm();

  async function run(body: any, validate?: () => string) {
    const v = validate ? validate() : "";
    if (v) { setErro(v); return; }
    setBusy(true); setErro("");
    const { ok, j } = await callApi(body);
    setBusy(false);
    if (ok) { setForm(null); router.refresh(); } else setErro(j.error || "Falha.");
  }

  const st = reg.status;
  return (
    <Card>
      <CardPad>
        {/* cabeçalho do RO */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Factory size={18} className="text-brand" />
          <span className="font-bold text-fg">{reg.fabricante_nome || "Fabricante"}</span>
          <StatusBadge status={st} />
          {reg.numero_ro && <span className="text-xs text-muted">Nº RO: <b className="text-fg">{reg.numero_ro}</b></span>}
          {reg.data_vencimento && <span className="text-xs text-muted">vence: <b className="text-fg">{reg.data_vencimento}</b></span>}
          {reg.tipo_renovacao && <span className="text-xs text-muted">renov.: <b className="text-fg">{reg.tipo_renovacao}</b></span>}
          {reg.handoff_status === "aguardando_prevendas" && <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-amber-500/15 text-amber-700 dark:text-amber-400">⏳ Pré-vendas: {reg.pre_vendas_nome || "atribuído"}</span>}
          {reg.handoff_status === "concluido_prevendas" && <span className="text-[11px] px-2 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">✓ Pré-vendas concluído</span>}
          <div className="ml-auto">
            {reg.portal_url
              ? <a href={reg.portal_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-brand text-white px-2.5 py-1 hover:bg-brand-600"><ExternalLink size={13} /> Ir ao site de RO</a>
              : <span className="text-xs text-muted italic">portal do fabricante [a mapear]</span>}
          </div>
        </div>

        {/* checklist do Bitrix (reaparece a cada mudança) */}
        {reg.bitrix_pendente && (
          <div className="mb-3 rounded-lg border border-amber-500/40 bg-amber-500/10 p-2.5">
            <div className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300">
              <ClipboardCheck size={16} className="shrink-0 mt-0.5" />
              <div className="flex-1">
                <b>Checklist do Bitrix:</b> atualize a tarefa no Bitrix com o status atual (<b>{st}</b>){reg.numero_ro ? <>, número <b>{reg.numero_ro}</b></> : ""}{reg.data_vencimento ? <> e vencimento <b>{reg.data_vencimento}</b></> : ""}.
              </div>
            </div>
            {podeExecutar && (
              <button disabled={busy} onClick={() => run({ action: "confirmar_bitrix", registro_id: reg.id })}
                className="mt-2 inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-amber-600 text-white px-2.5 py-1 hover:bg-amber-700 disabled:opacity-50">
                <CheckCircle2 size={13} /> Confirmar que atualizei o Bitrix
              </button>
            )}
          </div>
        )}

        {/* bloco de cópia */}
        <ROCopyBlock proc={proc} reg={reg} />

        {/* colaboração: handoff do Pré-vendas + e-mail do fabricante (Intern) */}
        <HandoffArea reg={reg} meId={meId} role={role} podeExecutar={podeExecutar} onChanged={() => router.refresh()} />

        {reg.comprovante && <div className="text-xs text-muted mt-2">Comprovante: <span className="text-fg break-all">{reg.comprovante}</span></div>}

        {/* aviso quando o RO ainda está com o Pré-vendas (Intern não registra ainda) */}
        {reg.handoff_status === "aguardando_prevendas" && (
          <div className="mt-3 text-xs text-amber-700 dark:text-amber-400 border-t border-line pt-3">Este RO só fica disponível para o Intern registrar <b>depois</b> que o Pré-vendas concluir a parte técnica.</div>
        )}

        {/* ações (máquina de estados) — só quem executa, e só depois do handoff do Pré-vendas */}
        {podeExecutar && reg.handoff_status !== "aguardando_prevendas" && (
          <div className="mt-3 border-t border-line pt-3">
            {erro && <div className="text-xs text-red-600 mb-2">{erro}</div>}

            {/* A registrar -> marcar feito -> Pendente */}
            {st === "A registrar" && (form !== "feito" ? (
              <Button className="h-8" onClick={() => { setForm("feito"); setErro(""); }}><CheckCircle2 size={14} /> Marcar como feito (registrei no portal)</Button>
            ) : (
              <div className="space-y-2 rounded-lg bg-surface2/50 p-2.5">
                <div className="text-xs font-semibold text-muted">Confirme o registro no portal do fabricante:</div>
                {!f.semNumero ? (
                  <Input placeholder="Número do RO" value={f.numero_ro} onChange={(e: any) => setF({ ...f, numero_ro: e.target.value })} />
                ) : (
                  <Input placeholder="Link/observação do print (comprovante)" value={f.comprovante} onChange={(e: any) => setF({ ...f, comprovante: e.target.value })} />
                )}
                <label className="flex items-center gap-2 text-xs text-muted"><input type="checkbox" checked={f.semNumero} onChange={(e) => setF({ ...f, semNumero: e.target.checked })} /> Este fabricante não gerou número de RO — vou anexar um print</label>
                <div className="flex gap-2">
                  <Button className="h-8" disabled={busy} onClick={() => run({ action: "marcar_feito", registro_id: reg.id, numero_ro: f.semNumero ? "" : f.numero_ro, comprovante: f.semNumero ? f.comprovante : "" }, () => (!f.semNumero && !f.numero_ro.trim()) ? "Informe o número do RO (ou marque que não há número)." : (f.semNumero && !f.comprovante.trim()) ? "Informe o link/observação do print." : "")}>Confirmar</Button>
                  <Button className="h-8" variant="ghost" onClick={() => setForm(null)}>cancelar</Button>
                </div>
              </div>
            ))}

            {/* Pendente -> Aprovado / Rejeitado */}
            {st === "Pendente" && (form !== "aprovar" && form !== "rejeitar" ? (
              <div className="flex gap-2">
                <Button className="h-8" onClick={() => { setForm("aprovar"); setErro(""); }}><CheckCircle2 size={14} /> Aprovar (chegou o e-mail)</Button>
                <Button className="h-8" variant="ghost" onClick={() => { setForm("rejeitar"); setErro(""); }}><XCircle size={14} /> Rejeitar</Button>
              </div>
            ) : form === "rejeitar" ? (
              <div className="space-y-2 rounded-lg bg-surface2/50 p-2.5">
                <div className="text-xs font-semibold text-muted">Motivo da rejeição (opcional):</div>
                <textarea value={f.motivo_rejeicao ?? ""} onChange={(e) => setF({ ...f, motivo_rejeicao: e.target.value })} placeholder="Ex.: fabricante negou por conflito de canal…" className="w-full rounded-lg border border-line bg-surface text-fg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-y min-h-[56px]" />
                <div className="flex gap-2">
                  <Button className="h-8" disabled={busy} onClick={() => run({ action: "set_status", registro_id: reg.id, status: "Rejeitado", motivo: f.motivo_rejeicao })}><XCircle size={14} /> Confirmar rejeição</Button>
                  <Button className="h-8" variant="ghost" onClick={() => setForm(null)}>cancelar</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2 rounded-lg bg-surface2/50 p-2.5">
                <div className="text-xs font-semibold text-muted">Aprovação do RO:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><label className="text-xs text-muted">Data de vencimento *</label><Input type="date" value={f.data_vencimento} onChange={(e: any) => setF({ ...f, data_vencimento: e.target.value })} /></div>
                  <div><label className="text-xs text-muted">Número do RO (deixe vazio p/ manter o atual)</label><Input value={f.numero_aprov} onChange={(e: any) => setF({ ...f, numero_aprov: e.target.value })} placeholder={reg.numero_ro ? `atual: ${reg.numero_ro}` : "ex.: RO-12345"} /></div>
                </div>
                <div className="flex gap-2">
                  <Button className="h-8" disabled={busy} onClick={() => run({ action: "set_status", registro_id: reg.id, status: "Aprovado", data_vencimento: f.data_vencimento, numero_ro: f.numero_aprov }, () => !f.data_vencimento ? "Informe a data de vencimento." : "")}>Aprovar</Button>
                  <Button className="h-8" variant="ghost" onClick={() => setForm(null)}>cancelar</Button>
                </div>
              </div>
            ))}

            {/* Aprovado / Renovado -> Renovar / Descartar */}
            {(st === "Aprovado" || st === "Renovado") && (form !== "renovar" ? (
              <div className="flex gap-2">
                <Button className="h-8" onClick={() => { setForm("renovar"); setErro(""); }}><RefreshCw size={14} /> Renovar</Button>
                <Button className="h-8" variant="danger" disabled={busy} onClick={() => confirm({ title: "Descartar este RO?", danger: true, confirmLabel: "Sim, descartar", description: <>Isto <b>encerra</b> o RO (vencido, sem renovação) e <b>não pode ser desfeito</b>.</> }, () => run({ action: "set_status", registro_id: reg.id, status: "Descartado" }))}><Trash2 size={14} /> Descartar</Button>
              </div>
            ) : (
              <div className="space-y-2 rounded-lg bg-surface2/50 p-2.5">
                <div className="text-xs font-semibold text-muted">Renovação do RO:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div><label className="text-xs text-muted">Tipo de renovação *</label><Select value={f.tipo_renovacao} onChange={(e: any) => setF({ ...f, tipo_renovacao: e.target.value })}><option value="manual">Manual</option><option value="automatica">Automática</option></Select></div>
                  <div><label className="text-xs text-muted">Nova data de vencimento *</label><Input type="date" value={f.venc_renov} onChange={(e: any) => setF({ ...f, venc_renov: e.target.value })} /></div>
                </div>
                <div className="flex gap-2">
                  <Button className="h-8" disabled={busy} onClick={() => run({ action: "set_status", registro_id: reg.id, status: "Renovado", tipo_renovacao: f.tipo_renovacao, data_vencimento: f.venc_renov }, () => !f.venc_renov ? "Informe a nova data de vencimento." : "")}>Confirmar renovação</Button>
                  <Button className="h-8" variant="ghost" onClick={() => setForm(null)}>cancelar</Button>
                </div>
              </div>
            ))}

            {(st === "Rejeitado" || st === "Descartado") && <div className="text-xs text-muted">RO encerrado ({st}).</div>}
          </div>
        )}

        {/* linha do tempo */}
        {meus.length > 0 && (
          <details className="mt-3 group">
            <summary className="list-none cursor-pointer text-xs text-muted hover:text-fg">Histórico deste RO ({meus.length}) ▾</summary>
            <ol className="mt-2 space-y-1.5">
              {meus.map((e: any, i: number) => (
                <li key={i} className="text-xs text-muted flex gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-brand mt-1 shrink-0" />
                  <span><b className="text-fg/80">{e.para_status || e.tipo}</b>{e.detalhe ? ` — ${e.detalhe}` : ""} · {e.usuario || "—"}{e.created_at ? " · " + new Date(e.created_at).toLocaleString("pt-BR") : ""}</span>
                </li>
              ))}
            </ol>
          </details>
        )}
        {dialog}
      </CardPad>
    </Card>
  );
}

export function ROProcessoView({ proc, registros, eventos, podeExecutar, novo, meId, role }: { proc: any; registros: any[]; eventos: any[]; podeExecutar: boolean; novo?: boolean; meId: string; role: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [erro, setErro] = useState("");
  const todosFeitos = registros.length > 0 && registros.every((r) => r.feito);
  const finalizado = proc.status_conjunto === "finalizado";

  async function finalizarConjunto() {
    setBusy(true); setErro("");
    const { ok, j } = await callApi({ action: "finalizar_conjunto", processo_id: proc.id });
    setBusy(false);
    if (ok) router.refresh(); else setErro(j.error || "Falha.");
  }

  const cce = proc.campos_comuns_extra || {};
  const comuns: [string, any][] = [
    ["Empresa", proc.empresa], ["CNPJ", cce.cnpj], ["CEP", cce.cep], ["Endereço", proc.endereco_empresa], ["Responsável", proc.responsavel_nome],
    ["E-mail", proc.responsavel_email], ["Telefone", proc.responsavel_telefone],
    ["Economic Buyer", proc.economic_buyer], ["Champion", proc.champion],
    ["Fechamento", cce.fechamento_quarter || proc.data_fechamento],
  ];

  return (
    <div className="space-y-4">
      <div className="text-xs text-muted"><Link href="/deal-reg" className="hover:text-brand inline-flex items-center gap-1"><ArrowLeft size={13} /> Registro de Oportunidade</Link> › {proc.nome_oportunidade || `DEAL ${proc.deal_id_bitrix || proc.id}`}</div>

      <Card><CardPad>
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="text-xl font-extrabold text-fg">{proc.nome_oportunidade || "(sem nome)"}</h1>
          {proc.deal_id_bitrix && <Badge>DEAL {proc.deal_id_bitrix}</Badge>}
          {proc.urgente && <Badge className="bg-red-600 text-white">🔴 URGENTE</Badge>}
          {finalizado ? <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">conjunto finalizado</Badge> : <Badge className="bg-amber-500/15 text-amber-700 dark:text-amber-400">tarefa aberta</Badge>}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1.5 mt-3">
          {comuns.filter(([, v]) => v).map(([k, v]) => (
            <div key={k}><div className="text-[11px] uppercase tracking-wide text-muted font-semibold">{k}</div><div className="text-sm text-fg break-words">{String(v)}</div></div>
          ))}
        </div>
        {proc.dor_cliente && <div className="mt-2 text-sm"><span className="text-muted">Dor do cliente: </span><span className="text-fg">{proc.dor_cliente}</span></div>}
      </CardPad></Card>

      {/* alerta global do fluxo Bitrix */}
      <div className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
        <AlertTriangle size={16} className="shrink-0 mt-0.5" />
        <span>{novo ? "Pronto! " : ""}Para cada fabricante abaixo, <b>copie o bloco</b>, abra o <b>modelo de RO no Bitrix</b>, cole e <b>crie uma tarefa por fabricante</b> — cada uma vinculada ao DEAL{proc.deal_id_bitrix ? <> <b>{proc.deal_id_bitrix}</b></> : ""}. O Bitrix é atualizado manualmente.</span>
      </div>

      {registros.some((r) => r.fabricante_nome?.toLowerCase().includes("lenovo")) && (
        <div className="flex items-start gap-2 text-sm text-red-800 dark:text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-600" />
          <span><b>Atenção (Lenovo):</b> Como o fabricante Lenovo foi selecionado, lembre-se de que é obrigatório enviar uma evidência de contato com o cliente ou de negociação (e-mail, conversa de chat, etc.) no chat da tarefa correspondente no Bitrix.</span>
        </div>
      )}

      <div className="text-xs text-muted bg-surface2/40 border border-line rounded-lg px-3 py-2">
        <b className="text-fg">Fluxo de cada RO:</b> A registrar → Pendente (registrado, aguardando fabricante) → Aprovado → Renovado · ou Rejeitado / Descartado (encerra).
      </div>
      <div className="space-y-3">
        {registros.map((reg) => <RegistroCard key={reg.id} proc={proc} reg={reg} eventos={eventos} podeExecutar={podeExecutar} meId={meId} role={role} />)}
      </div>

      {/* finalizar conjunto */}
      {podeExecutar && !finalizado && (
        <Card><CardPad>
          <div className="flex flex-wrap items-center gap-3">
            <Flag size={16} className={todosFeitos ? "text-emerald-500" : "text-muted"} />
            <div className="text-sm text-fg flex-1">
              {todosFeitos ? "Todos os ROs foram registrados — você pode finalizar o conjunto." : `Finalize cada RO (marque “feito”) antes de fechar o conjunto. Faltam ${registros.filter((r) => !r.feito).length}.`}
            </div>
            <Button disabled={busy || !todosFeitos} onClick={finalizarConjunto}><CheckCircle2 size={15} /> Finalizar conjunto</Button>
          </div>
          {erro && <div className="text-xs text-red-600 mt-2">{erro}</div>}
        </CardPad></Card>
      )}
    </div>
  );
}

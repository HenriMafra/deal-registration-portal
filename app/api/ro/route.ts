import { NextResponse } from "next/server";
import { requireApi } from "@/lib/api/guard";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { audit } from "@/lib/audit";
import { createNotifications } from "@/lib/notifications/actions";
export const dynamic = "force-dynamic";

const ok = (extra: any = {}) => NextResponse.json({ ok: true, ...extra });
const err = (msg: string, code = 400) => NextResponse.json({ error: msg }, { status: code });

async function evento(sb: any, registro_id: number, tipo: string, de: string | null, para: string | null, detalhe: string, usuario: string) {
  try { await sb.from("ro_eventos").insert({ registro_id, tipo, de_status: de, para_status: para, detalhe, usuario }); } catch {}
}

export async function POST(req: Request) {
  const b = await req.json().catch(() => ({}));
  const action = String(b.action || "");

  // ---- SITE ABERTO: registro de oportunidade PÚBLICO (sem login) ----
  // A gestão pediu o site aberto para qualquer pessoa registrar uma oportunidade. Este caminho
  // NÃO exige autenticação; grava o processo + registros marcados como origem pública. A lista
  // só é visível ao Administrador (página /deal-reg). Reverter: tag site-com-login-2026-06-29.
  if (action === "create_publico") {
    const p = b.processo || {};
    const fabricantes = Array.isArray(b.fabricantes) ? b.fabricantes : [];
    if (!String(p.nome_oportunidade || "").trim() && !String(p.deal_id_bitrix || "").trim())
      return err("Informe ao menos o nome ou o ID do DEAL no Bitrix.");
    if (!fabricantes.length) return err("Selecione ao menos um fabricante.");
    const sb = supabaseAdmin();
    const { data: procIns, error: e1 } = await sb.from("ro_processos").insert({
      deal_id_bitrix: p.deal_id_bitrix || null, nome_oportunidade: p.nome_oportunidade || null, empresa: p.empresa || null,
      responsavel_nome: p.responsavel_nome || null, responsavel_email: p.responsavel_email || null,
      responsavel_cargo: p.responsavel_cargo || null, responsavel_telefone: p.responsavel_telefone || null,
      endereco_empresa: p.endereco_empresa || null, economic_buyer: p.economic_buyer || null, champion: p.champion || null,
      dor_cliente: p.dor_cliente || null, produtos: null,
      valor_estimado_usd: p.valor_estimado_usd === "" || p.valor_estimado_usd == null ? null : Number(p.valor_estimado_usd),
      data_fechamento: p.data_fechamento || null, campos_comuns_extra: p.campos_comuns_extra || {},
      status_conjunto: "aberto", urgente: false, criado_por: "Registro público (sem login)", criado_por_id: null,
    }).select("*").limit(1);
    if (e1) return err(e1.message, 500);
    const processo_id = procIns?.[0]?.id;
    const regs = fabricantes.map((f: any) => ({
      processo_id, fabricante_id: f.fabricante_id || null, fabricante_nome: f.nome || null,
      portal_url: f.portal_url || null, campos: f.campos || {}, status: "A registrar", feito: false, bitrix_pendente: false,
      pre_vendas_id: null, pre_vendas_nome: null, handoff_status: "nao_definido", handoff_token: null,
    }));
    const { data: regIns, error: e2 } = await sb.from("ro_registros").insert(regs).select("*");
    if (e2) return err(e2.message, 500);
    // avisa os administradores que chegou um registro público para revisão
    try {
      await createNotifications([{
        tipo: "ro_publico", nivel: "info", escopo: "role", perfil_destino: "Administrador",
        titulo: "Novo registro de oportunidade (público)",
        mensagem: `${p.nome_oportunidade || p.empresa || "Sem nome"} · ${regs.length} fabricante(s)`,
        link_url: `/deal-reg/${processo_id}`, criada_por: "Registro público",
      }]);
    } catch {}
    try { await audit({ usuario: "Registro público", perfil: "Público", acao: "ro_create_publico", detalhes: `${p.nome_oportunidade || ""} · ${regs.length} RO(s)` }); } catch {}
    return ok({ processo_id, processo: procIns?.[0], registros: regIns, n: regs.length });
  }

  // criação exige ro_criar; o resto (execução) exige ro_executar
  const perm = action === "create" ? "ro_criar" : "ro_executar";
  const { user, error } = await requireApi(perm);
  if (error) return error;
  const quem = user!.nome || user!.email || "—";
  const sb = supabaseAdmin();

  // ---- AM cria o processo (DEAL) + N registros (1 por fabricante) ----
  if (action === "create") {
    const p = b.processo || {};
    const fabricantes = Array.isArray(b.fabricantes) ? b.fabricantes : [];
    if (!String(p.nome_oportunidade || "").trim() && !String(p.deal_id_bitrix || "").trim())
      return err("Informe ao menos o nome ou o ID do DEAL no Bitrix.");
    if (!fabricantes.length) return err("Selecione ao menos um fabricante.");
    const { data: procIns, error: e1 } = await sb.from("ro_processos").insert({
      deal_id_bitrix: p.deal_id_bitrix || null, nome_oportunidade: p.nome_oportunidade || null, empresa: p.empresa || null,
      responsavel_nome: p.responsavel_nome || null, responsavel_email: p.responsavel_email || null,
      responsavel_cargo: p.responsavel_cargo || null, responsavel_telefone: p.responsavel_telefone || null,
      endereco_empresa: p.endereco_empresa || null, economic_buyer: p.economic_buyer || null, champion: p.champion || null,
      dor_cliente: p.dor_cliente || null, produtos: null,
      valor_estimado_usd: p.valor_estimado_usd === "" || p.valor_estimado_usd == null ? null : Number(p.valor_estimado_usd),
      data_fechamento: p.data_fechamento || null, campos_comuns_extra: p.campos_comuns_extra || {},
      status_conjunto: "aberto", urgente: p.urgente === true, criado_por: quem, criado_por_id: user!.id || null,
    }).select("*").limit(1);
    if (e1) return err(e1.message, 500);
    const processo_id = procIns?.[0]?.id;
    const regs = fabricantes.map((f: any) => {
      const preId = f.pre_vendas_id || null;
      return {
        processo_id, fabricante_id: f.fabricante_id || null, fabricante_nome: f.nome || null,
        portal_url: f.portal_url || null, campos: f.campos || {}, status: "A registrar", feito: false, bitrix_pendente: false,
        pre_vendas_id: preId, pre_vendas_nome: f.pre_vendas_nome || null,
        handoff_status: preId ? "aguardando_prevendas" : "nao_definido",
        handoff_token: preId ? crypto.randomUUID() : null,
      };
    });
    const { data: regIns, error: e2 } = await sb.from("ro_registros").insert(regs).select("*");
    if (e2) return err(e2.message, 500);
    // notifica cada Pré-vendas atribuído (tarefa cai na visão de RO dele)
    try {
      const rows = (regIns || []).filter((r: any) => r.pre_vendas_id).map((r: any) => ({
        tipo: "ro_handoff", nivel: "info", escopo: "user", usuario_destino_id: r.pre_vendas_id,
        titulo: "RO aguardando sua validação técnica (Pré-vendas)",
        mensagem: `${r.fabricante_nome || "Fabricante"} — ${p.nome_oportunidade || p.empresa || "novo deal"}`,
        link_url: `/deal-reg/${processo_id}`, criada_por: quem,
      }));
      if (rows.length) await createNotifications(rows);
    } catch {}
    // RO urgente: avisa o pool de Intern/SE (além de ficar fixado no topo da fila)
    if (p.urgente === true) {
      try {
        await createNotifications(["Intern", "Sales Engineer"].map((perfil) => ({
          tipo: "ro_urgente", nivel: "warning", escopo: "role", perfil_destino: perfil,
          titulo: "⚠ RO URGENTE aberto", mensagem: `${p.nome_oportunidade || p.empresa || "Novo RO"} — marcado como urgente por ${quem}.`,
          link_url: `/deal-reg/${processo_id}`, criada_por: quem,
        })));
      } catch {}
    }
    await audit({ usuario: user!.nome || user!.email, perfil: user!.role, acao: "ro_create", detalhes: `DEAL ${p.deal_id_bitrix || ""} (${p.nome_oportunidade || ""}) · ${regs.length} RO(s)${p.urgente ? " · URGENTE" : ""}` });
    return ok({ processo_id, processo: procIns?.[0], registros: regIns, n: regs.length });
  }

  // ---- Intern marca um RO como feito (submeteu no portal) -> Pendente ----
  if (action === "marcar_feito") {
    if (!b.registro_id) return err("registro_id obrigatório.");
    const numero = String(b.numero_ro || "").trim();
    const comprovante = String(b.comprovante || "").trim();
    if (!numero && !comprovante) return err("Informe o número do RO ou anexe um comprovante (print/link).");
    // trava do handoff: não registrar enquanto o Pré-vendas não concluiu a parte técnica
    const { data: hs } = await sb.from("ro_registros").select("handoff_status").eq("id", b.registro_id).limit(1);
    if (hs?.[0]?.handoff_status === "aguardando_prevendas")
      return err("Este RO aguarda o Pré-vendas concluir a parte técnica antes de ser registrado.");
    const { error: e } = await sb.from("ro_registros").update({
      feito: true, status: "Pendente", numero_ro: numero || null, comprovante: comprovante || null,
      intern_id: user!.id || null, intern_nome: quem, bitrix_pendente: true,
      feito_em: new Date().toISOString(), updated_at: new Date().toISOString(),
    }).eq("id", b.registro_id);
    if (e) return err(e.message, 500);
    await evento(sb, b.registro_id, "feito", "A registrar", "Pendente", numero ? `Nº RO: ${numero}` : "Comprovante anexado", quem);
    return ok();
  }

  // ---- Mudança de status (Aprovado/Rejeitado/Renovado/Descartado) ----
  if (action === "set_status") {
    if (!b.registro_id || !b.status) return err("registro_id e status obrigatórios.");
    const { data: cur } = await sb.from("ro_registros").select("status").eq("id", b.registro_id).limit(1);
    const de = cur?.[0]?.status || null;
    const novo = String(b.status);
    const patch: any = { status: novo, bitrix_pendente: true, updated_at: new Date().toISOString() };
    let detalhe = "";
    if (novo === "Aprovado") {
      if (!b.data_vencimento) return err("Informe a data de vencimento do RO ao aprovar.");
      patch.data_vencimento = b.data_vencimento;
      if (String(b.numero_ro || "").trim()) patch.numero_ro = String(b.numero_ro).trim();
      detalhe = `Vence em ${b.data_vencimento}${patch.numero_ro ? ` · Nº ${patch.numero_ro}` : ""}`;
    } else if (novo === "Renovado") {
      if (!b.tipo_renovacao) return err("Escolha renovação automática ou manual.");
      if (!b.data_vencimento) return err("Informe a nova data de vencimento.");
      patch.tipo_renovacao = b.tipo_renovacao; patch.data_vencimento = b.data_vencimento;
      detalhe = `Renovação ${b.tipo_renovacao} · nova validade ${b.data_vencimento}`;
    } else if (novo === "Rejeitado") {
      detalhe = b.motivo ? `RO rejeitado — ${b.motivo}` : "RO rejeitado";
    } else if (novo === "Descartado") {
      detalhe = "RO descartado (vencido, sem renovação)";
    }
    const { error: e } = await sb.from("ro_registros").update(patch).eq("id", b.registro_id);
    if (e) return err(e.message, 500);
    await evento(sb, b.registro_id, "status", de, novo, detalhe, quem);
    return ok();
  }

  // ---- Confirma que atualizou o Bitrix (some o checklist até a próxima mudança) ----
  if (action === "confirmar_bitrix") {
    if (!b.registro_id) return err("registro_id obrigatório.");
    const { error: e } = await sb.from("ro_registros").update({ bitrix_pendente: false, bitrix_confirmado_em: new Date().toISOString() }).eq("id", b.registro_id);
    if (e) return err(e.message, 500);
    await evento(sb, b.registro_id, "bitrix_confirmado", null, null, "Bitrix atualizado (confirmado)", quem);
    return ok();
  }

  // ---- Intern finaliza o CONJUNTO (só quando todos os ROs estão feitos) ----
  if (action === "finalizar_conjunto") {
    if (!b.processo_id) return err("processo_id obrigatório.");
    const { data: regs } = await sb.from("ro_registros").select("feito").eq("processo_id", b.processo_id);
    const total = (regs || []).length;
    const feitos = (regs || []).filter((r: any) => r.feito).length;
    if (total === 0) return err("Este conjunto não tem ROs.");
    if (feitos < total) return err(`Ainda há ${total - feitos} RO(s) não registrado(s). Finalize cada RO antes de fechar o conjunto.`);
    const { error: e } = await sb.from("ro_processos").update({ status_conjunto: "finalizado", updated_at: new Date().toISOString() }).eq("id", b.processo_id);
    if (e) return err(e.message, 500);
    await audit({ usuario: user!.nome || user!.email, perfil: user!.role, acao: "ro_finalizar_conjunto", detalhes: `processo ${b.processo_id} (${total} ROs)` });
    return ok();
  }

  // ---- AM (ou admin) atribui/troca/remove o Pré-vendas de um registro já criado ----
  if (action === "set_prevendas") {
    if (!b.registro_id) return err("registro_id obrigatório.");
    const preId = b.pre_vendas_id || null;
    const patch: any = {
      pre_vendas_id: preId, pre_vendas_nome: b.pre_vendas_nome || null,
      handoff_status: preId ? "aguardando_prevendas" : "nao_definido", updated_at: new Date().toISOString(),
    };
    if (preId) patch.handoff_token = crypto.randomUUID();
    const { error: e } = await sb.from("ro_registros").update(patch).eq("id", b.registro_id);
    if (e) return err(e.message, 500);
    await evento(sb, b.registro_id, "handoff", null, patch.handoff_status, preId ? `Pré-vendas atribuído: ${b.pre_vendas_nome || ""}` : "Pré-vendas removido (AM preenche tudo)", quem);
    if (preId) {
      try {
        const { data: reg } = await sb.from("ro_registros").select("fabricante_nome,processo_id").eq("id", b.registro_id).limit(1);
        const r0 = reg?.[0];
        const { data: proc } = r0 ? await sb.from("ro_processos").select("nome_oportunidade,empresa").eq("id", r0.processo_id).limit(1) : ({ data: null } as any);
        const pp = proc?.[0];
        await createNotifications([{
          tipo: "ro_handoff", nivel: "info", escopo: "user", usuario_destino_id: preId,
          titulo: "RO aguardando sua validação técnica (Pré-vendas)",
          mensagem: `${r0?.fabricante_nome || "Fabricante"} — ${pp?.nome_oportunidade || pp?.empresa || "deal"}`,
          link_url: `/deal-reg/${r0?.processo_id || ""}`, criada_por: quem,
        }]);
      } catch {}
    }
    return ok();
  }

  // ---- Pré-vendas conclui a parte técnica -> libera o RO para o Intern ----
  if (action === "concluir_prevendas") {
    if (!b.registro_id) return err("registro_id obrigatório.");
    const { data: cur } = await sb.from("ro_registros").select("campos,pre_vendas_id,fabricante_nome,processo_id").eq("id", b.registro_id).limit(1);
    const reg = cur?.[0];
    if (!reg) return err("Registro não encontrado.");
    if (reg.pre_vendas_id && reg.pre_vendas_id !== user!.id && user!.role !== "Administrador")
      return err("Apenas o Pré-vendas atribuído (ou um admin) pode concluir esta tarefa.", 403);
    const campos = { ...(reg.campos || {}), ...(b.campos || {}) };
    const { error: e } = await sb.from("ro_registros").update({
      campos, handoff_status: "concluido_prevendas", handoff_em: new Date().toISOString(), updated_at: new Date().toISOString(),
    }).eq("id", b.registro_id);
    if (e) return err(e.message, 500);
    await evento(sb, b.registro_id, "handoff", "aguardando_prevendas", "concluido_prevendas", "Pré-vendas concluiu a parte técnica", quem);
    try {
      const { data: proc } = await sb.from("ro_processos").select("criado_por_id,nome_oportunidade,empresa").eq("id", reg.processo_id).limit(1);
      const pp = proc?.[0];
      const prontoMsg = `${reg.fabricante_nome || "Fabricante"} — ${pp?.nome_oportunidade || pp?.empresa || "deal"} (parte técnica concluída).`;
      // o "pool" que registra inclui Intern E Sales Engineer (RODashboard) — avisa os dois papéis
      const rows: any[] = ["Intern", "Sales Engineer"].map((perfil) => ({
        tipo: "ro_handoff", nivel: "success", escopo: "role", perfil_destino: perfil,
        titulo: "RO pronto para registrar", mensagem: prontoMsg,
        link_url: `/deal-reg/${reg.processo_id}`, criada_por: quem,
      }));
      if (pp?.criado_por_id) rows.push({
        tipo: "ro_handoff", nivel: "info", escopo: "user", usuario_destino_id: pp.criado_por_id,
        titulo: "Pré-vendas concluiu a parte técnica",
        mensagem: `${reg.fabricante_nome || "Fabricante"} — pronto para o Intern registrar.`,
        link_url: `/deal-reg/${reg.processo_id}`, criada_por: quem,
      });
      await createNotifications(rows);
    } catch {}
    return ok();
  }

  // ---- Intern define o e-mail de envio do RO daquele fabricante (fica salvo p/ os próximos) ----
  if (action === "set_fab_email") {
    if (!b.fabricante_id) return err("fabricante_id obrigatório.");
    const email = String(b.email_ro || "").trim();
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return err("E-mail inválido.");
    const { error: e } = await sb.from("ro_fabricantes").update({ email_ro: email || null }).eq("id", b.fabricante_id);
    if (e) return err(e.message, 500);
    return ok();
  }

  return err("Ação desconhecida.");
}

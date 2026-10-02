import { NextResponse } from "next/server";
import { requireApi } from "@/lib/api/guard";
import { bitrixConfigured, bitrixCall } from "@/lib/bitrix";
import { audit } from "@/lib/audit";

export const dynamic = "force-dynamic";

/** Envia um Registro de Oportunidade direto ao Bitrix24 (substitui o copia-cola):
 *  cria 1 DEAL (crm.deal.add) e 1 TAREFA por fabricante (tasks.task.add).
 *  Só funciona quando BITRIX_WEBHOOK_URL estiver definido — senão retorna 503 e a UI
 *  segue mostrando os blocos para colar manualmente. Usa apenas campos PADRÃO do Bitrix. */
export async function POST(req: Request) {
  const { user, error } = await requireApi("ro_view");
  if (error) return error;
  if (!bitrixConfigured()) {
    return NextResponse.json({ error: "Integração Bitrix ainda não ativada. Defina a variável BITRIX_WEBHOOK_URL.", configured: false }, { status: 503 });
  }
  const b = await req.json().catch(() => ({} as any));
  const p = b.processo || {};
  const fabs: any[] = Array.isArray(b.fabricantes) ? b.fabricantes : [];
  try {
    const dealId = await bitrixCall("crm.deal.add", {
      fields: {
        TITLE: `RO ${p.empresa || p.nome_oportunidade || ""} — ${fabs.map((f) => f.nome).filter(Boolean).join(", ")}`.trim(),
        CURRENCY_ID: "BRL",
        COMMENTS: [
          p.endereco_empresa && `Endereço: ${p.endereco_empresa}`,
          p.responsavel_nome && `Contato: ${p.responsavel_nome}${p.responsavel_email ? ` (${p.responsavel_email})` : ""}`,
          p.economic_buyer && `Economic Buyer: ${p.economic_buyer}`,
          p.champion && `Champion: ${p.champion}`,
          (p.campos_comuns_extra?.fechamento_quarter) && `Fechamento: ${p.campos_comuns_extra.fechamento_quarter}`,
        ].filter(Boolean).join("\n"),
      },
    });
    const tasks: any[] = [];
    for (const f of fabs) {
      const desc = Object.entries(f.campos || {}).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
      const t = await bitrixCall("tasks.task.add", {
        fields: { TITLE: `RO ${p.empresa || ""} · ${f.nome}`.trim(), DESCRIPTION: desc, UF_CRM_TASK: [`D_${dealId}`] },
      });
      tasks.push(t?.task?.id ?? t);
    }
    await audit({ usuario: user!.nome || user!.email, perfil: user!.role, acao: "ro_bitrix", detalhes: `deal ${dealId} + ${tasks.length} tarefa(s)` });
    return NextResponse.json({ ok: true, dealId, tasks });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Falha ao enviar ao Bitrix." }, { status: 502 });
  }
}

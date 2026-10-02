// Integração Bitrix24 via Webhook de ENTRADA (inbound). A URL é um SEGREDO e fica em
// process.env.BITRIX_WEBHOOK_URL (ex.: https://<portal>.bitrix24.com/rest/<user_id>/<token>/).
// Enquanto não estiver definida, bitrixConfigured() => false e a UI mantém o copia-cola.
const BX = (process.env.BITRIX_WEBHOOK_URL || "").trim();

export function bitrixConfigured(): boolean {
  return /^https?:\/\/.+\/rest\/.+/i.test(BX);
}

/** Chama um método REST do Bitrix24. Lança erro com a mensagem do Bitrix em caso de falha. */
export async function bitrixCall(method: string, params: any): Promise<any> {
  if (!bitrixConfigured()) throw new Error("BITRIX_WEBHOOK_URL não configurado.");
  const base = BX.replace(/\/+$/, "");
  const r = await fetch(`${base}/${method}.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });
  const j = await r.json().catch(() => ({} as any));
  if (j && j.error) throw new Error(j.error_description || String(j.error));
  return j.result;
}

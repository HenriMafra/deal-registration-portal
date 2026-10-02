"use client";
import { useState } from "react";
import { Copy, Check, ExternalLink, AlertTriangle } from "lucide-react";
import { gerarBlocoCopia, BITRIX_RO_LINK } from "@/lib/ro/copyblock";

// Bloco de texto pronto p/ colar no modelo de RO do Bitrix (1 por fabricante).
export function ROCopyBlock({ proc, reg }: { proc: any; reg: any }) {
  const [copied, setCopied] = useState(false);
  const texto = gerarBlocoCopia(proc, reg);
  async function copiar() {
    try { await navigator.clipboard.writeText(texto); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch {}
  }
  return (
    <div className="rounded-lg border border-line bg-surface2/40 p-3">
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-bold text-fg">Bloco p/ colar no Bitrix — {reg.fabricante_nome || "fabricante"}</span>
        <button onClick={copiar} className="ml-auto inline-flex items-center gap-1 text-xs font-semibold rounded-lg border border-line bg-surface px-2.5 py-1 hover:bg-surface2">
          {copied ? <><Check size={13} className="text-emerald-500" /> copiado</> : <><Copy size={13} /> copiar bloco</>}
        </button>
        <a href={BITRIX_RO_LINK} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs font-semibold rounded-lg bg-brand text-white px-2.5 py-1 hover:bg-brand-600">
          <ExternalLink size={13} /> abrir modelo no Bitrix
        </a>
      </div>
      <pre className="text-xs text-fg whitespace-pre-wrap font-mono bg-surface border border-line rounded-md p-2.5 max-h-72 overflow-auto leading-relaxed">{texto}</pre>
      <div className="mt-2 flex items-start gap-1.5 text-xs text-amber-700 dark:text-amber-400 bg-amber-500/10 rounded-md px-2.5 py-1.5">
        <AlertTriangle size={14} className="shrink-0 mt-0.5" />
        <span>Crie <b>uma tarefa separada por fabricante</b> no Bitrix (copie o bloco → abra o modelo → cole) e <b>vincule a tarefa ao DEAL</b>{proc.deal_id_bitrix ? <> <b>{proc.deal_id_bitrix}</b></> : ""}.</span>
      </div>
    </div>
  );
}

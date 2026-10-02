"use client";
import { useState } from "react";
import { Combobox } from "@/components/ui/Combobox";
import { Input, Button } from "@/components/ui/primitives";
import { X, Plus } from "lucide-react";

// Controle "produto + quantidade de licenças", um a um, com busca inline (igual à do fabricante).
// Guarda como string legível: "Produto A ×10; Produto B ×5" (entra direto no bloco do Bitrix).
type Item = { produto: string; qtd: string };
function parse(v: string): Item[] {
  if (!v) return [];
  return v.split(/;\s*/).map((s) => s.trim()).filter(Boolean).map((s) => {
    const m = s.match(/^(.*?)\s*×\s*(\d+)\s*$/);
    return m ? { produto: m[1].trim(), qtd: m[2] } : { produto: s, qtd: "" };
  });
}
function serialize(items: Item[]): string {
  return items.filter((i) => i.produto.trim()).map((i) => (i.qtd ? `${i.produto} ×${i.qtd}` : i.produto)).join("; ");
}

export function ProdutosQtd({ value, onChange, options, onSuggest }: {
  value: string; onChange: (v: string) => void; options: string[]; onSuggest?: (v: string) => void;
}) {
  const items = parse(value);
  const [prod, setProd] = useState("");
  const [qtd, setQtd] = useState("");
  function add() {
    if (!prod.trim()) return;
    onChange(serialize([...items, { produto: prod.trim(), qtd: qtd.replace(/[^\d]/g, "") }]));
    setProd(""); setQtd("");
  }
  function remove(i: number) { onChange(serialize(items.filter((_, j) => j !== i))); }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-[150px]"><Combobox value={prod} onChange={setProd} options={options} allLabel="Buscar produto…" allowCustom onSuggest={onSuggest} /></div>
        <Input value={qtd} onChange={(e: any) => setQtd(e.target.value)} inputMode="numeric" placeholder="qtd licenças" className="w-32" />
        <Button className="h-9" onClick={add} disabled={!prod.trim()}><Plus size={14} /> Adicionar</Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((it, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-line bg-surface text-xs text-fg">
              <b>{it.produto}</b>{it.qtd ? <span className="text-muted">× {it.qtd} lic.</span> : null}
              <button type="button" onClick={() => remove(i)} className="text-muted hover:text-red-600" aria-label="remover"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

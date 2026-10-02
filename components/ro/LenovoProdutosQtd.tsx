"use client";
import { useState } from "react";
import { Combobox } from "@/components/ui/Combobox";
import { Input, Button } from "@/components/ui/primitives";
import { X, Plus } from "lucide-react";

type Item = { produto: string; qtd: string; receita: string };

function parse(v: string): Item[] {
  if (!v) return [];
  return v.split(/;\s*/).map((s) => s.trim()).filter(Boolean).map((s) => {
    // Ex: "ThinkSystem Rack Server (Qtd: 10, Receita: BRL 15000)" ou "ThinkSystem Rack Server"
    const m = s.match(/^(.*?)\s*\((.*?)\)$/);
    if (m) {
      const prod = m[1].trim();
      const details = m[2];
      let qtd = "";
      let receita = "";
      const mqtd = details.match(/Qtd:\s*(\d+)/);
      if (mqtd) qtd = mqtd[1];
      const mrec = details.match(/Receita:\s*(?:BRL\s*)?([\d.,]+)/);
      if (mrec) receita = mrec[1];
      return { produto: prod, qtd, receita };
    }
    return { produto: s, qtd: "", receita: "" };
  });
}

function serialize(items: Item[]): string {
  return items.filter((i) => i.produto.trim()).map((i) => {
    const parts = [];
    if (i.qtd) parts.push(`Qtd: ${i.qtd}`);
    if (i.receita) parts.push(`Receita: BRL ${i.receita}`);
    if (parts.length > 0) {
      return `${i.produto} (${parts.join(", ")})`;
    }
    return i.produto;
  }).join("; ");
}

export function LenovoProdutosQtd({ value, onChange, options }: {
  value: string; onChange: (v: string) => void; options: string[];
}) {
  const items = parse(value);
  const [prod, setProd] = useState("");
  const [qtd, setQtd] = useState("");
  const [receita, setReceita] = useState("");

  function add() {
    if (!prod.trim()) return;
    onChange(serialize([...items, {
      produto: prod.trim(),
      qtd: qtd.replace(/[^\d]/g, ""),
      receita: receita.trim()
    }]));
    setProd(""); setQtd(""); setReceita("");
  }

  function remove(i: number) {
    onChange(serialize(items.filter((_, j) => j !== i)));
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end gap-2">
        <div className="flex-1 min-w-[200px]">
          <Combobox value={prod} onChange={setProd} options={options} allLabel="Buscar produto Lenovo…" allowCustom />
        </div>
        <Input value={qtd} onChange={(e: any) => setQtd(e.target.value)} inputMode="numeric" placeholder="quantidade" className="w-28" />
        <Input value={receita} onChange={(e: any) => setReceita(e.target.value)} placeholder="receita BRL (NÃO DÓLAR)" className="w-48" />
        <Button className="h-9" onClick={add} disabled={!prod.trim()}><Plus size={14} /> Adicionar</Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {items.map((it, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-line bg-surface text-xs text-fg">
              <b>{it.produto}</b>
              {it.qtd && <span className="text-muted">· {it.qtd} un.</span>}
              {it.receita && <span className="text-muted">· BRL {it.receita}</span>}
              <button type="button" onClick={() => remove(i)} className="text-muted hover:text-red-600" aria-label="remover"><X size={12} /></button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

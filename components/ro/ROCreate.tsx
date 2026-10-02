"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Input, Card, CardPad, Select } from "@/components/ui/primitives";
import { Combobox } from "@/components/ui/Combobox";
import { MultiCombobox } from "@/components/ui/MultiCombobox";
import { useConfirm } from "@/components/ui/ConfirmDialog";
import { ROCopyBlock } from "@/components/ro/ROCopyBlock";
import { type FabField, fabFieldsFor } from "@/lib/ro/fields";
import { ProdutosQtd } from "./ProdutosQtd";
import { LenovoProdutosQtd } from "./LenovoProdutosQtd";
import { dividirTippingPoint } from "@/lib/ro/trendmicro";
import { Factory, X, ArrowLeft, ArrowRight, Plus, Check, Loader2, MapPin, Building2, ClipboardCheck, UserRound, AlertTriangle } from "lucide-react";
import { supabaseBrowser } from "@/lib/supabase/client";

type Fab = { id: number; nome: string; portal_url?: string; campos_especificos?: any[] };
type FabSel = { fabricante_id: number | null; nome: string; portal_url: string | null; campos: Record<string, string>; pre_vendas_id: string | null; pre_vendas_nome: string | null };

// Trend Micro: TippingPoint exige RO próprio. Expande a lista — se um Trend Micro misturar
// TippingPoint com outros produtos, vira 2 tarefas (TippingPoint e "demais produtos").
function expandirFabs(fabs: FabSel[]): FabSel[] {
  const out: FabSel[] = [];
  for (const f of fabs) {
    const div = (f.nome || "").toLowerCase().includes("trend") ? dividirTippingPoint(f.campos.tm_product || "") : null;
    if (div) {
      out.push({ ...f, nome: `${f.nome} · TippingPoint`, campos: { ...f.campos, tm_product: div.tipping } });
      out.push({ ...f, nome: `${f.nome} · demais produtos`, campos: { ...f.campos, tm_product: div.outros } });
    } else out.push(f);
  }
  return out;
}

// Campos por fabricante (tipo FabField, FAB_FIELDS_* e fabFieldsFor) agora ficam em lib/ro/fields.ts
// — compartilhados entre o AM (aqui) e o Pré-vendas (ROProcessoView).
const QUARTER_FIM: Record<string, string> = { Q1: "03-31", Q2: "06-30", Q3: "09-30", Q4: "12-31" };
const ANOS = [0, 1, 2, 3].map((d) => 2026 + d);
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const taArea = "w-full rounded-lg border border-line bg-surface text-fg px-3 py-2 text-sm placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand resize-y min-h-[64px]";

// Campos obrigatórios do Passo 1 (não dá pra avançar sem preencher tudo).
const REQ: [string, string][] = [
  ["nome_oportunidade", "Nome da oportunidade"], ["deal_id_bitrix", "ID do DEAL"], ["empresa", "Empresa"],
  ["cnpj", "CNPJ"], ["cep", "CEP"], ["endereco_empresa", "Endereço"], ["responsavel_nome", "Nome do responsável"],
  ["responsavel_email", "E-mail"], ["responsavel_cargo", "Cargo"], ["responsavel_telefone", "Telefone"],
  ["economic_buyer", "Economic Buyer"], ["champion", "Champion"],
];

function Campo({ label, sub, children, hint }: { label: string; sub?: string; children: React.ReactNode; hint?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-muted mb-1">
        {label}{sub && <span className="font-normal text-brand/70"> ({sub})</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-muted mt-0.5">{hint}</p>}
    </div>
  );
}
function Grupo({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <Card><CardPad>
      <div className="text-xs uppercase tracking-wider text-brand font-bold mb-3">{titulo}</div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{children}</div>
    </CardPad></Card>
  );
}

const FALLBACK_FABRICANTES: Fab[] = [
  { id: 1, nome: "Aruba (HPE)", portal_url: "" },
  { id: 2, nome: "Check Point", portal_url: "" },
  { id: 3, nome: "Cisco", portal_url: "" },
  { id: 4, nome: "Cloudflare", portal_url: "" },
  { id: 5, nome: "Cohesity", portal_url: "" },
  { id: 6, nome: "CrowdStrike", portal_url: "" },
  { id: 7, nome: "CyberArk", portal_url: "" },
  { id: 8, nome: "Elastic", portal_url: "" },
  { id: 9, nome: "F5 Networks", portal_url: "" },
  { id: 10, nome: "Fortinet", portal_url: "" },
  { id: 11, nome: "Fortinet SASE", portal_url: "" },
  { id: 12, nome: "Gigamon", portal_url: "" },
  { id: 13, nome: "HPE", portal_url: "" },
  { id: 14, nome: "Lenovo", portal_url: "" },
  { id: 15, nome: "Microsoft", portal_url: "" },
  { id: 16, nome: "Nutanix", portal_url: "" },
  { id: 17, nome: "Palo Alto Networks", portal_url: "" },
  { id: 18, nome: "Pure Storage", portal_url: "" },
  { id: 19, nome: "SonicWall", portal_url: "" },
  { id: 20, nome: "Sophos", portal_url: "" },
  { id: 21, nome: "Tenable", portal_url: "" },
  { id: 22, nome: "Trend Micro", portal_url: "" },
  { id: 23, nome: "Varonis", portal_url: "" },
  { id: 24, nome: "Vectra", portal_url: "" },
  { id: 25, nome: "Veeam", portal_url: "" },
  { id: 26, nome: "VMware", portal_url: "" },
  { id: 27, nome: "Zscaler", portal_url: "" },
  { id: 28, nome: "Outro / a mapear", portal_url: "" }
];

export function ROCreate({ fabricantes: propFabricantes, onCancel, salesEngineers = [], publico = false }: { fabricantes: Fab[]; onCancel?: () => void; salesEngineers?: { id: string; nome: string }[]; publico?: boolean }) {
  const router = useRouter();
  const { confirm, dialog } = useConfirm();
  const [listaFabricantes, setListaFabricantes] = useState<Fab[]>(propFabricantes && propFabricantes.length > 0 ? propFabricantes : FALLBACK_FABRICANTES);

  useEffect(() => {
    if (propFabricantes && propFabricantes.length > 0) {
      setListaFabricantes(propFabricantes);
    }
  }, [propFabricantes]);

  useEffect(() => {
    if (!propFabricantes || propFabricantes.length === 0) {
      console.log("ROCreate: lista de fabricantes vazia no servidor. Buscando via client-side fallback...");
      const sb = supabaseBrowser();
      sb.from("ro_fabricantes")
        .select("*")
        .eq("ativo", true)
        .order("ordem")
        .order("nome")
        .then(({ data, error }) => {
          if (error) {
            console.error("Erro no client-side fallback de fabricantes:", error);
          } else if (data && data.length > 0) {
            console.log("ROCreate: fallback client-side carregou", data.length, "fabricantes com sucesso!");
            setListaFabricantes(data);
          }
        });
    }
  }, [propFabricantes]);

  const [step, setStep] = useState<"comum" | "fab" | "revisao">("comum");
  const [enviado, setEnviado] = useState(false); // tela de agradecimento (fluxo público)
  const [createdData, setCreatedData] = useState<{ processo: any; registros: any[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const [cnpjBusy, setCnpjBusy] = useState(false);
  const [cnpjInfo, setCnpjInfo] = useState<any>(null); // resultado do cruzamento das 5 fontes de CNPJ
  const [manual, setManual] = useState(false);          // pessoa optou por preencher sem buscar pelo CNPJ
  // Busca de órgão por NOME (typeahead sobre os órgãos do site) — caminho inverso ao CNPJ.
  const [orgQ, setOrgQ] = useState("");
  const [orgResults, setOrgResults] = useState<any[]>([]);
  const [orgOpen, setOrgOpen] = useState(false);
  const [orgBusy, setOrgBusy] = useState(false);
  const [urgente, setUrgente] = useState(false);         // AM abre o RO como urgente (com aviso anti-abuso)
  const [cepBusy, setCepBusy] = useState(false);
  const [tentouAvancar, setTentouAvancar] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; t: string } | null>(null);

  const [c, setC] = useState<any>({
    nome_oportunidade: "", deal_id_bitrix: "", empresa: "", cnpj: "", cep: "", endereco_empresa: "",
    responsavel_nome: "", responsavel_email: "", responsavel_cargo: "", responsavel_telefone: "",
    economic_buyer: "", champion: "", fechamento_q: "", fechamento_ano: "", _municipio: "", _uf: "",
    // dados comerciais (comuns) — geram a "Descrição do Deal" para todos os fabricantes
    dor_cliente: "", distribuidor: "", produtos: "", quantidade_licencas: "", concorrente: "",
    valor_estimado_usd: "", descricao_proposta: "",
  });
  const [fabs, setFabs] = useState<FabSel[]>([]);
  const [cur, setCur] = useState<FabSel>({ fabricante_id: null, nome: "", portal_url: null, campos: {}, pre_vendas_id: null, pre_vendas_nome: null });
  const [orgContatos, setOrgContatos] = useState<any[]>([]); // contatos já registrados do órgão (pelo CNPJ)
  const [salvandoCt, setSalvandoCt] = useState(false);
  // Câmbio USD→BRL ao vivo (AwesomeAPI). O valor do RO segue em US$; BRL é só visualização.
  const [moedaView, setMoedaView] = useState<"USD" | "BRL">("USD");
  const [fx, setFx] = useState<{ rate: number; ts: string } | null>(null);
  const [fxBusy, setFxBusy] = useState(false);
  async function carregarCotacao() {
    if (fx || fxBusy) return;
    setFxBusy(true);
    try {
      const r = await fetch("https://economia.awesomeapi.com.br/last/USD-BRL");
      const j = await r.json();
      const rate = Number(j?.USDBRL?.bid);
      if (rate > 0) setFx({ rate, ts: j?.USDBRL?.create_date || "" });
    } catch {}
    setFxBusy(false);
  }

  const set = (k: string) => (e: any) => setC((p: any) => ({ ...p, [k]: e.target.value }));
  const fabByNome = (nome: string) => listaFabricantes.find((f) => f.nome === nome);

  // Campos que faltam no Passo 1 (rótulos), para bloquear o "Avançar".
  // Regra do valor: todo RO deve ficar entre US$ 40.000 e US$ 100.000 (não dá pra avançar fora disso).
  const valNum = Number(String(c.valor_estimado_usd ?? "").replace(/[^\d]/g, ""));
  const valorErro = !String(c.valor_estimado_usd ?? "").trim()
    ? "Valor estimado (US$ 40 mil–100 mil)"
    : !Number.isFinite(valNum) || valNum === 0 ? "Valor inválido (só números)"
    : valNum < 40000 ? "Valor mínimo US$ 40.000"
    : valNum > 100000 ? "Valor máximo US$ 100.000" : "";
  const faltando: string[] = [
    ...REQ.filter(([k]) => !String(c[k] ?? "").trim()).map(([, lbl]) => lbl),
    ...(c.responsavel_email && !EMAIL_RE.test(c.responsavel_email) ? ["E-mail válido"] : []),
    ...(valorErro ? [valorErro] : []),
    ...(!c.fechamento_q ? ["Quarter"] : []), ...(!c.fechamento_ano ? ["Ano de fechamento"] : []),
  ];
  const podeAvancar = faltando.length === 0;

  async function buscarCnpj(raw: string) {
    const cnpj = String(raw).replace(/\D/g, "");
    setC((p: any) => ({ ...p, cnpj }));
    if (manual || cnpj.length !== 14) return;
    setCnpjBusy(true); setMsg(null); setCnpjInfo(null);
    try {
      // cruza 5 fontes no servidor (consenso + divergências), tolerante a falhas
      const r = await fetch(`/api/cnpj?cnpj=${cnpj}`);
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.encontrado) {
        const cs = j.consenso || {};
        const endereco = [cs.logradouro, cs.numero, cs.bairro].filter(Boolean).join(", ") + (cs.municipio ? ` — ${cs.municipio}/${cs.uf}` : "");
        setC((p: any) => ({
          ...p, empresa: cs.razao_social || cs.nome_fantasia || p.empresa, endereco_empresa: endereco || p.endereco_empresa,
          cep: cs.cep || p.cep, _municipio: cs.municipio || p._municipio, _uf: cs.uf || p._uf,
        }));
        setCnpjInfo({ fontes: j.fontes || [], divergencias: j.divergencias || [] });
      } else setMsg({ ok: false, t: "CNPJ não encontrado nas fontes — marque “preencher manualmente” e digite os dados." });
    } catch { setMsg({ ok: false, t: "Não consegui consultar o CNPJ agora — preencha manualmente." }); }
    finally { setCnpjBusy(false); }
    // puxa os contatos já registrados deste órgão (pelo CNPJ) para seleção rápida
    try {
      const rc = await fetch("/api/orgao-contatos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "list", cnpj }) });
      const jc = await rc.json().catch(() => ({}));
      setOrgContatos(Array.isArray(jc?.contatos) ? jc.contatos : []);
    } catch { setOrgContatos([]); }
  }
  async function buscarCep(raw: string) {
    const cep = String(raw).replace(/\D/g, "");
    setC((p: any) => ({ ...p, cep }));
    if (cep.length !== 8) return;
    setCepBusy(true);
    try {
      const r = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
      const j = await r.json();
      if (j && !j.erro) {
        const endereco = [j.logradouro, j.bairro].filter(Boolean).join(", ") + (j.localidade ? `${j.logradouro || j.bairro ? " — " : ""}${j.localidade}/${j.uf}` : "");
        setC((p: any) => ({ ...p, endereco_empresa: endereco || p.endereco_empresa, _municipio: j.localidade || p._municipio, _uf: j.uf || p._uf }));
      }
    } catch { /* offline: segue manual */ } finally { setCepBusy(false); }
  }

  // Typeahead de órgão por NOME: busca no banco do site (debounce 300ms).
  useEffect(() => {
    const q = orgQ.trim();
    if (q.length < 3) { setOrgResults([]); setOrgOpen(false); return; }
    setOrgBusy(true);
    const t = setTimeout(async () => {
      try {
        const r = await fetch(`/api/orgaos/search?q=${encodeURIComponent(q)}`);
        const j = await r.json().catch(() => ({}));
        setOrgResults(Array.isArray(j?.orgaos) ? j.orgaos : []);
        setOrgOpen(true);
      } catch { setOrgResults([]); } finally { setOrgBusy(false); }
    }, 300);
    return () => clearTimeout(t);
  }, [orgQ]);

  // Ao trocar de passo (DEAL → fabricantes → revisão), volta ao topo — senão a tela fica rolada
  // onde o botão estava e a pessoa precisa subir manualmente para ver a próxima parte.
  useEffect(() => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  // Escolheu um órgão da lista → preenche nome + CNPJ e cruza as 5 fontes (verifica o nome).
  function escolherOrgao(o: any) {
    setOrgQ(o.nome || ""); setOrgOpen(false); setOrgResults([]);
    setC((p: any) => ({ ...p, empresa: o.nome || p.empresa }));
    const cnpj = String(o.cnpj || "").replace(/\D/g, "");
    if (cnpj.length === 14) { setManual(false); buscarCnpj(cnpj); }
    else setMsg({ ok: false, t: "Esse órgão não tem CNPJ na base — digite o CNPJ pra cruzar as fontes." });
  }

  // preenche os campos do "Contato do cliente" com um contato já registrado do órgão
  function preencherContato(ct: any) {
    setC((p: any) => ({ ...p,
      responsavel_nome: ct.pessoa_contatada || p.responsavel_nome,
      responsavel_email: ct.email || p.responsavel_email,
      responsavel_cargo: ct.cargo || p.responsavel_cargo,
      responsavel_telefone: ct.telefone || p.responsavel_telefone,
    }));
    setMsg({ ok: true, t: `Contato "${ct.pessoa_contatada}" preenchido.` });
  }
  // salva o contato digitado como um contato NOVO do órgão (com confirmação)
  function salvarContatoOrgao() {
    const nome = String(c.responsavel_nome || "").trim();
    const cnpj = String(c.cnpj || "").replace(/\D/g, "");
    if (!nome) { setMsg({ ok: false, t: "Preencha o nome do responsável antes de salvar o contato." }); return; }
    if (cnpj.length !== 14) { setMsg({ ok: false, t: "Informe o CNPJ do órgão antes de salvar o contato." }); return; }
    confirm({
      title: "Salvar este contato no órgão?",
      confirmLabel: "Salvar contato",
      description: <>Vamos registrar <b>{nome}</b>{c.responsavel_cargo ? <> ({c.responsavel_cargo})</> : null} como contato deste órgão (CNPJ {c.cnpj}). Ele passa a aparecer como opção em ROs futuros deste órgão.</>,
    }, async () => {
      setSalvandoCt(true); setMsg(null);
      try {
        const r = await fetch("/api/orgao-contatos", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "create", cnpj, pessoa_contatada: nome, cargo: c.responsavel_cargo, email: c.responsavel_email, telefone: c.responsavel_telefone }) });
        const j = await r.json().catch(() => ({}));
        if (r.ok && j.contato) {
          setOrgContatos((prev) => [j.contato, ...prev.filter((x) => x.id !== j.contato.id)]);
          setMsg({ ok: true, t: "Contato registrado no órgão ✓" });
        } else setMsg({ ok: false, t: j.error || "Não foi possível salvar o contato." });
      } catch { setMsg({ ok: false, t: "Erro de rede ao salvar o contato." }); }
      finally { setSalvandoCt(false); }
    });
  }

  function pickFab(nome: string) {
    const f = fabByNome(nome);
    setCur((cur) => ({ ...cur, fabricante_id: f?.id ?? null, nome, portal_url: f?.portal_url ?? null }));
  }
  function setCampoCur(key: string, val: string) { setCur((cur) => ({ ...cur, campos: { ...cur.campos, [key]: val } })); }
  // quando a pessoa usa um valor que não estava na lista (produto/distribuidor/fabricante…),
  // abrimos uma sugestão para a equipe incluí-lo oficialmente. O valor já fica usável na hora.
  async function sugerirOpcao(campo: string, texto: string) {
    try {
      await fetch("/api/feedback", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "create", tipo: "sugestao", titulo: `RO: incluir "${texto}" em ${campo}`,
          descricao: `No formulário de RO, o campo "${campo}" não tinha a opção "${texto}". Foi usada como texto livre; sugerir incluir na lista oficial.`, pagina: "/deal-reg" }) });
      setMsg({ ok: true, t: `"${texto}" adicionado e enviado como sugestão à equipe.` });
    } catch { /* o valor já foi usado mesmo se a sugestão falhar */ }
  }

  function avancar() {
    setTentouAvancar(true);
    if (!podeAvancar) { setMsg(null); return; }
    setMsg(null); setStep("fab");
  }
  function curValido(): boolean {
    if (!cur.nome.trim()) return true;
    const fields = fabFieldsFor(cur.nome).filter((d) => !d.showIf || cur.campos[d.showIf.key] === d.showIf.equals);
    for (const d of fields) {
      if (d.hint?.toLowerCase().includes("obrigatório")) {
        const val = cur.campos[d.key];
        if (!val || String(val).trim() === "" || (Array.isArray(val) && val.length === 0)) {
          setMsg({ ok: false, t: `O campo "${d.label}" é obrigatório para ${cur.nome}.` });
          return false;
        }
      }
    }
    return true;
  }

  function addOutro() {
    if (!cur.fabricante_id && !cur.nome.trim()) { setMsg({ ok: false, t: "Selecione o fabricante antes de adicionar outro." }); return; }
    if (!curValido()) return;
    setFabs((fs) => [...fs, cur]); setCur({ fabricante_id: null, nome: "", portal_url: null, campos: {}, pre_vendas_id: null, pre_vendas_nome: null }); setMsg(null);
  }
  function removerFab(i: number) { setFabs((fs) => fs.filter((_, j) => j !== i)); }
  function irRevisar() {
    const todos = [...fabs];
    if (cur.fabricante_id || cur.nome.trim()) {
      if (!curValido()) return;
      todos.push(cur); setFabs(todos); setCur({ fabricante_id: null, nome: "", portal_url: null, campos: {}, pre_vendas_id: null, pre_vendas_nome: null });
    }
    if (todos.length === 0) { setMsg({ ok: false, t: "Adicione ao menos um fabricante." }); return; }
    setMsg(null); setStep("revisao");
  }

  const fechamento_quarter = c.fechamento_q && c.fechamento_ano ? `${c.fechamento_q}/${c.fechamento_ano}` : "";
  const procPreview = {
    nome_oportunidade: c.nome_oportunidade, deal_id_bitrix: c.deal_id_bitrix, empresa: c.empresa,
    cnpj: c.cnpj, cep: c.cep,
    responsavel_nome: c.responsavel_nome, responsavel_email: c.responsavel_email, responsavel_cargo: c.responsavel_cargo,
    responsavel_telefone: c.responsavel_telefone, endereco_empresa: c.endereco_empresa,
    economic_buyer: c.economic_buyer, champion: c.champion, urgente,
    campos_comuns_extra: { fechamento_quarter, urgente, cnpj: c.cnpj, cep: c.cep, dor_cliente: c.dor_cliente, distribuidor: c.distribuidor, produtos: c.produtos, quantidade_licencas: c.quantidade_licencas, concorrente: c.concorrente, valor_estimado_usd: c.valor_estimado_usd, descricao_proposta: c.descricao_proposta },
  };

  async function finalizar() {
    setBusy(true); setMsg(null);
    const data_fechamento = c.fechamento_q && c.fechamento_ano && QUARTER_FIM[c.fechamento_q] ? `${c.fechamento_ano}-${QUARTER_FIM[c.fechamento_q]}` : null;
    const processo = {
      nome_oportunidade: c.nome_oportunidade, deal_id_bitrix: c.deal_id_bitrix, empresa: c.empresa,
      endereco_empresa: c.endereco_empresa, responsavel_nome: c.responsavel_nome, responsavel_email: c.responsavel_email,
      responsavel_cargo: c.responsavel_cargo, responsavel_telefone: c.responsavel_telefone,
      economic_buyer: c.economic_buyer, champion: c.champion, data_fechamento, urgente,
      campos_comuns_extra: { fechamento_quarter, urgente, cnpj: c.cnpj, cep: c.cep, municipio: c._municipio, uf: c._uf, dor_cliente: c.dor_cliente, distribuidor: c.distribuidor, produtos: c.produtos, quantidade_licencas: c.quantidade_licencas, concorrente: c.concorrente, valor_estimado_usd: c.valor_estimado_usd, descricao_proposta: c.descricao_proposta },
    };
    const fabricantesPayload = expandirFabs(fabs).map((f) => ({ fabricante_id: f.fabricante_id, nome: f.nome, portal_url: f.portal_url, campos: f.campos, pre_vendas_id: f.pre_vendas_id || null, pre_vendas_nome: f.pre_vendas_nome || null }));
    try {
      const r = await fetch("/api/ro", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: publico ? "create_publico" : "create", processo, fabricantes: fabricantesPayload }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.processo_id) {
        // público não enxerga a ficha (só o admin) → exibe os blocos diretamente; logado vai para a ficha
        if (publico) {
          setCreatedData({ processo: j.processo, registros: j.registros });
          setBusy(false);
          setEnviado(true);
          if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
        }
        else router.push(`/deal-reg/${j.processo_id}?novo=1`);
      }
      else { setMsg({ ok: false, t: j.error || "Falha ao criar." }); setBusy(false); }
    } catch { setMsg({ ok: false, t: "Erro de rede." }); setBusy(false); }
  }
  function confirmarEnvio() {
    confirm({
      title: `Enviar este Registro de Oportunidade?`,
      confirmLabel: "Sim, enviar e gerar blocos",
      description: <>Serão criadas <b>{expandirFabs(fabs).length} tarefa(s)</b> com os blocos prontos p/ colar no Bitrix. Confira se está tudo certo — você ainda poderá registrar/atualizar cada RO depois.</>,
    }, finalizar);
  }

  const fabNames = listaFabricantes.map((f) => f.nome);
  const erroBox = msg ? <div className={"text-sm px-3 py-2 rounded-lg " + (msg.ok ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" : "bg-red-500/10 text-red-600")}>{msg.t}</div> : null;

  // Fluxo público: registro enviado → blocos de cópia e instruções para o Bitrix (sem expor a ficha, que é só do admin).
  if (enviado && createdData) {
    const temLenovo = createdData.registros.some((r) => r.fabricante_nome?.toLowerCase().includes("lenovo"));
    return (
      <div className="max-w-2xl mx-auto space-y-4 py-6">
        <div className="text-center space-y-2">
          <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/15 flex items-center justify-center">
            <Check size={26} className="text-emerald-600" />
          </div>
          <h2 className="text-xl font-bold text-fg">Registro Concluído no Sistema!</h2>
          <p className="text-sm text-muted max-w-lg mx-auto">
            A oportunidade foi registrada com sucesso. Agora você <strong>deve copiar o bloco de cada fabricante abaixo e colá-lo no modelo de tarefa correspondente no Bitrix</strong> para dar andamento ao processo.
          </p>
        </div>

        {temLenovo && (
          <div className="rounded-lg border-2 border-red-500/50 bg-red-500/10 p-3.5 text-sm text-red-800 dark:text-red-300">
            <div className="font-bold flex items-center gap-2 mb-1.5">
              <AlertTriangle size={16} className="text-red-600" />
              Atenção: Ação Obrigatória (Lenovo)
            </div>
            <p className="leading-relaxed">
              Como você escolheu a <strong>Lenovo</strong>, lembre-se de que é obrigatório enviar uma evidência de contato com o cliente ou de negociação (e-mail, conversa de chat, etc.) no chat da tarefa correspondente no Bitrix.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {createdData.registros.map((reg, idx) => (
            <div key={reg.id || idx} className="space-y-1">
              <ROCopyBlock proc={createdData.processo} reg={reg} />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-2 pt-4 border-t border-line">
          <Button onClick={() => {
            setCreatedData(null);
            setEnviado(false);
            setStep("comum");
            setFabs([]);
            setCur({ fabricante_id: null, nome: "", portal_url: null, campos: {}, pre_vendas_id: null, pre_vendas_nome: null });
            setC({
              nome_oportunidade: "", deal_id_bitrix: "", empresa: "", cnpj: "", cep: "", endereco_empresa: "",
              responsavel_nome: "", responsavel_email: "", responsavel_cargo: "", responsavel_telefone: "",
              economic_buyer: "", champion: "", fechamento_q: "", fechamento_ano: "", _municipio: "", _uf: "",
              dor_cliente: "", distribuidor: "", produtos: "", quantidade_licencas: "", concorrente: "",
              valor_estimado_usd: "", descricao_proposta: ""
            });
          }}><Plus size={15} /> Registrar outra oportunidade</Button>
          {onCancel && <Button variant="ghost" onClick={onCancel}>Sair</Button>}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 w-full">
      <div className="flex items-center gap-2">
        {onCancel && <button onClick={onCancel} className="text-sm text-muted hover:text-fg inline-flex items-center gap-1"><ArrowLeft size={15} /> sair</button>}
        <h2 className="font-bold text-fg text-lg">Novo Registro de Oportunidade</h2>
        <span className="ml-auto text-xs text-muted">{step === "comum" ? "Passo 1 de 3 · dados do DEAL" : step === "fab" ? "Passo 2 de 3 · fabricantes" : "Passo 3 de 3 · revisão"}</span>
      </div>

      {/* ───────── PASSO 1: dados do DEAL ───────── */}
      {step === "comum" && (
        <>
          <Grupo titulo="Oportunidade (Bitrix)">
            <Campo label="Nome da oportunidade no Bitrix"><Input value={c.nome_oportunidade} onChange={set("nome_oportunidade")} placeholder="Ex.: Firewall Órgão X" /></Campo>
            <Campo label="ID da oportunidade (DEAL)"><Input value={c.deal_id_bitrix} onChange={set("deal_id_bitrix")} placeholder="Ex.: 12345" /></Campo>
          </Grupo>

          <Grupo titulo="Empresa / cliente">
            <div className="sm:col-span-2 flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
                <input type="checkbox" checked={manual} onChange={(e) => { setManual(e.target.checked); if (e.target.checked) setCnpjInfo(null); }} /> Preencher manualmente (não buscar pelo CNPJ)
              </label>
              {cnpjInfo && !manual && (
                <span className="text-[11px] text-emerald-600">✓ {cnpjInfo.fontes.filter((f: any) => f.ok).length} de {cnpjInfo.fontes.length} fontes confirmaram</span>
              )}
            </div>
            <Campo label="CNPJ" sub={manual ? "manual (sem busca)" : "preenchimento principal — completa a seção"}>
              <div className="relative">
                <Input value={c.cnpj} onChange={(e: any) => buscarCnpj(e.target.value)} inputMode="numeric" maxLength={18} placeholder="00.000.000/0000-00" className="pr-8" />
                {cnpjBusy ? <Loader2 size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand animate-spin" /> : <Building2 size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />}
              </div>
            </Campo>
            <Campo label="CEP" sub="completa o endereço">
              <div className="relative">
                <Input value={c.cep} onChange={(e: any) => buscarCep(e.target.value)} inputMode="numeric" maxLength={9} placeholder="00000-000" className="pr-8" />
                {cepBusy ? <Loader2 size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand animate-spin" /> : <MapPin size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />}
              </div>
            </Campo>
            <Campo label="Empresa / órgão"><Input value={c.empresa} onChange={set("empresa")} placeholder="Nome (vem do CNPJ; pode ajustar)" /></Campo>
            <Campo label="Endereço da empresa"><Input value={c.endereco_empresa} onChange={set("endereco_empresa")} placeholder="Rua, nº, bairro — Cidade/UF" /></Campo>
            {/* TEMPORÁRIO (site aberto, 2026-06-29): a busca de órgão por NOME usa API que exige
                login (RLS por UF) → no público sempre vem vazia. Escondida no modo público; o
                preenchimento por CNPJ continua. Volta no modelo fechado. Ver ONDE-ESTA-TUDO.md §3. */}
            {!manual && !publico && (
              <div className="sm:col-span-2 relative">
                <label className="block text-xs font-semibold text-muted mb-1">Ou busque o órgão por nome <span className="font-normal text-brand/70">(digite e escolha — preenche o CNPJ automaticamente)</span></label>
                <div className="relative">
                  <Input value={orgQ} onChange={(e: any) => setOrgQ(e.target.value)} onFocus={() => { if (orgResults.length) setOrgOpen(true); }} placeholder="Ex.: Tribunal de Justiça de Goiás" className="pr-8" autoComplete="off" />
                  {orgBusy ? <Loader2 size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand animate-spin" /> : <Building2 size={15} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted" />}
                </div>
                {orgOpen && orgResults.length > 0 && (
                  <ul className="absolute z-20 mt-1 w-full max-h-64 overflow-auto rounded-lg border border-line bg-surface shadow-lg">
                    {orgResults.map((o: any, i: number) => (
                      <li key={o.cnpj || i}>
                        <button type="button" onMouseDown={(e) => { e.preventDefault(); escolherOrgao(o); }} className="w-full text-left px-3 py-2 hover:bg-surface2 border-b border-line/40 last:border-0">
                          <div className="text-sm text-fg font-medium leading-snug">{o.nome}</div>
                          <div className="text-[11px] text-muted">{o.municipio ? `${o.municipio}/${o.uf} · ` : ""}CNPJ {o.cnpj}</div>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                {orgOpen && !orgBusy && orgResults.length === 0 && orgQ.trim().length >= 3 && (
                  <div className="text-[11px] text-muted mt-1">Nenhum órgão com esse nome na base — use o CNPJ acima.</div>
                )}
              </div>
            )}
          </Grupo>

          <Grupo titulo="Contato do cliente">
            {/* TEMPORÁRIO (site aberto, 2026-06-29): contatos já salvos do órgão dependem de login
                (API com ro_view) → no público vêm vazios. Travado fora do modo público. Volta no
                modelo fechado. Ver ONDE-ESTA-TUDO.md §3. */}
            {!publico && orgContatos.length > 0 && (
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-muted mb-1">Contatos já registrados deste órgão <span className="font-normal text-brand/70">(opcional — clique para preencher)</span></label>
                <div className="flex flex-wrap gap-1.5">
                  {orgContatos.map((ct) => (
                    <button type="button" key={ct.id} onClick={() => preencherContato(ct)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-line bg-surface text-xs text-fg hover:border-brand hover:bg-brand/5 transition"
                      title={[ct.email, ct.telefone].filter(Boolean).join(" · ") || undefined}>
                      <UserRound size={12} className="text-brand" /> {ct.pessoa_contatada}{ct.cargo ? <span className="text-muted"> · {ct.cargo}</span> : null}
                    </button>
                  ))}
                </div>
              </div>
            )}
            <Campo label="Nome do responsável"><Input value={c.responsavel_nome} onChange={set("responsavel_nome")} /></Campo>
            <Campo label="E-mail do responsável"><Input type="email" value={c.responsavel_email} onChange={set("responsavel_email")} placeholder="nome@empresa.com" /></Campo>
            <Campo label="Cargo"><Input value={c.responsavel_cargo} onChange={set("responsavel_cargo")} /></Campo>
            <Campo label="Telefone"><Input inputMode="tel" value={c.responsavel_telefone} onChange={set("responsavel_telefone")} placeholder="(61) 99999-9999" /></Campo>
            {/* TEMPORÁRIO (site aberto, 2026-06-29): "salvar contato no órgão p/ reutilizar em ROs
                futuros" não faz sentido sem usuários/persistência por equipe — escondido no modo
                público. Volta automaticamente no modelo fechado (publico=false). Ver ONDE-ESTA-TUDO.md §3. */}
            {!publico && (
              <div className="sm:col-span-2">
                <button type="button" onClick={salvarContatoOrgao} disabled={salvandoCt}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand hover:underline disabled:opacity-50">
                  <Plus size={13} /> {salvandoCt ? "Salvando…" : "Salvar este contato no órgão (para reutilizar em ROs futuros)"}
                </button>
              </div>
            )}
          </Grupo>

          <Grupo titulo="Decisão & prazo">
            <div className="sm:col-span-2">
              <button type="button" disabled={!c.responsavel_nome?.trim()}
                onClick={() => setC((p: any) => ({ ...p, economic_buyer: p.responsavel_nome || p.economic_buyer, champion: p.responsavel_nome || p.champion }))}
                className="text-xs inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-brand/40 text-brand hover:bg-brand/5 disabled:opacity-50 disabled:cursor-not-allowed">
                <UserRound size={13} /> Usar o responsável{c.responsavel_nome ? ` (${c.responsavel_nome})` : ""} como Economic Buyer e Champion
              </button>
              <p className="text-[11px] text-muted mt-1">Costuma ser a mesma pessoa — um clique preenche os dois campos abaixo.</p>
            </div>
            <Campo label="Economic Buyer" sub="aprovação final"><Input value={c.economic_buyer} onChange={set("economic_buyer")} /></Campo>
            <Campo label="Champion" sub="mentor da venda / Coach"><Input value={c.champion} onChange={set("champion")} /></Campo>
            <Campo label="Data de fechamento (quarter)">
              <div className="flex gap-2">
                <Select value={c.fechamento_q} onChange={set("fechamento_q")}>
                  <option value="" disabled hidden>Quarter</option>
                  <option value="Q1">Q1</option><option value="Q2">Q2</option><option value="Q3">Q3</option><option value="Q4">Q4</option>
                </Select>
                <Select value={c.fechamento_ano} onChange={set("fechamento_ano")}>
                  <option value="" disabled hidden>Ano</option>
                  {ANOS.map((a) => <option key={a} value={String(a)}>{a}</option>)}
                </Select>
              </div>
            </Campo>
          </Grupo>

          <Grupo titulo="Detalhes comerciais (entram na Descrição do RO)">
            <div className="sm:col-span-2"><Campo label="Dor do cliente" sub="o que o projeto resolve"><textarea value={c.dor_cliente} onChange={set("dor_cliente")} className={taArea} placeholder="O problema/necessidade que a solução vai atender" /></Campo></div>
            <div className="sm:col-span-2"><Campo label="Valor estimado">
              <div className="flex items-center gap-2 mb-2">
                {(["USD", "BRL"] as const).map((m) => (
                  <button type="button" key={m} onClick={() => { setMoedaView(m); if (m === "BRL") carregarCotacao(); }}
                    className={"h-8 px-3 rounded-lg border text-xs font-semibold transition " + (moedaView === m ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:bg-surface2")}>
                    {m === "USD" ? "US$ Dólar" : "R$ Real"}
                  </button>
                ))}
              </div>
              {(() => {
                const rate = fx?.rate || 0;
                const emBRL = moedaView === "BRL" && rate > 0;
                const min = emBRL ? Math.round(40000 * rate) : 40000;
                const max = emBRL ? Math.round(100000 * rate) : 100000;
                const disp = emBRL ? Math.round(valNum * rate) : valNum;
                const simbolo = emBRL ? "R$" : "US$";
                const guardar = (x: number) => { const usd = emBRL && rate ? Math.round(x / rate) : x; setC((p: any) => ({ ...p, valor_estimado_usd: usd ? String(usd) : "" })); };
                return (
                  <>
                    <div className="relative">
                      <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted pointer-events-none">{simbolo}</span>
                      <Input value={disp ? String(disp) : ""} onChange={(e: any) => guardar(Number(String(e.target.value).replace(/[^\d]/g, "")))} inputMode="numeric" className="pl-11" />
                    </div>
                    <input type="range" min={min} max={max} step={emBRL ? Math.max(1000, Math.round(1000 * rate)) : 1000}
                      value={Math.min(max, Math.max(min, disp || min))} onChange={(e) => guardar(Number(e.target.value))} className="w-full mt-2 accent-brand" />
                    <div className="flex justify-between text-xs text-muted mt-0.5"><span>{simbolo} {min.toLocaleString("pt-BR")}</span><span>{simbolo} {max.toLocaleString("pt-BR")}</span></div>
                    {moedaView === "BRL" && (rate ? <div className="text-[12px] text-muted mt-1">≈ US$ {valNum.toLocaleString("pt-BR")}</div> : <div className="text-[12px] text-muted mt-1">Buscando a cotação…</div>)}
                  </>
                );
              })()}
            </Campo></div>
            <div className="sm:col-span-2"><Campo label="Descrição da proposta"><textarea value={c.descricao_proposta} onChange={set("descricao_proposta")} className={taArea} /></Campo></div>
          </Grupo>

          <Grupo titulo="Prioridade">
            <div className="sm:col-span-2 space-y-2">
              <label className="flex items-center gap-2 text-sm font-semibold text-fg cursor-pointer">
                <input type="checkbox" checked={urgente} onChange={(e) => setUrgente(e.target.checked)} />
                Abrir este RO como <span className="text-red-600 font-bold">URGENTE</span>
              </label>
              {/* TEMPORÁRIO (site aberto, 2026-06-29): no modelo aberto a urgência NÃO controla fila;
                  ela apenas entra DESTACADA no bloco que se cola no CRM. No modelo fechado, volta o
                  aviso anti-abuso (fila/topo/auditoria) — ver ONDE-ESTA-TUDO.md, seção 3. */}
              {urgente && publico && (
                <div className="rounded-lg border-2 border-red-500/50 bg-red-500/10 p-3 text-sm">
                  <div className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-1"><AlertTriangle size={16} /> Marcado como URGENTE</div>
                  <p className="text-red-800 dark:text-red-300 leading-relaxed">
                    Um destaque de <b>PRIORIDADE MÁXIMA</b> vai no <b>topo do texto</b> que você copia para colar no CRM, para a equipe tratar primeiro. Use apenas quando for de fato prioritário.
                  </p>
                </div>
              )}
              {urgente && !publico && (
                <div className="rounded-lg border-2 border-red-500/60 bg-red-500/10 p-3 text-sm">
                  <div className="font-bold text-red-700 dark:text-red-400 flex items-center gap-2 mb-1"><AlertTriangle size={16} /> Pare e leia antes de marcar urgente</div>
                  <p className="text-red-800 dark:text-red-300 leading-relaxed">
                    Este RO será <b>fixado no TOPO</b> da fila dos Interns, <b>na frente de todos os outros</b>, e o time será <b>notificado na hora</b>. A urgência fica <b>registrada em seu nome</b>, com <b>data e hora</b>, e é <b>auditável</b> — dá pra ver exatamente quem abriu o quê como urgente. Abrir urgência sem necessidade real <b>atrapalha todo o time</b> e <b>será cobrado de você</b>. Marque <b>somente</b> se for de fato prioritário.
                  </p>
                </div>
              )}
            </div>
          </Grupo>

          {tentouAvancar && !podeAvancar && (
            <div className="text-sm px-3 py-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400">
              Preencha tudo para avançar. Faltam: <b>{faltando.join(", ")}</b>.
            </div>
          )}
          {erroBox}
          <div className="flex items-center gap-2">
            <Button onClick={avancar}>Avançar para fabricantes <ArrowRight size={15} /></Button>
            {onCancel && <Button variant="ghost" onClick={onCancel}><X size={15} /> Cancelar</Button>}
          </div>
        </>
      )}

      {/* ───────── PASSO 2: fabricantes (um por vez) ───────── */}
      {step === "fab" && (
        <>
          {fabs.length > 0 && (
            <Card><CardPad>
              <div className="text-xs uppercase tracking-wider text-muted font-bold mb-2">Fabricantes já adicionados ({fabs.length})</div>
              <div className="flex flex-wrap gap-2">
                {fabs.map((f, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-brand/40 bg-brand/10 text-sm text-fg">
                    <Factory size={13} className="text-brand" /> {f.nome}
                    <button onClick={() => removerFab(i)} className="text-muted hover:text-red-500" title="Remover"><X size={13} /></button>
                  </span>
                ))}
              </div>
            </CardPad></Card>
          )}

          <div className="flex items-start gap-2 text-sm text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
            <UserRound size={16} className="shrink-0 mt-0.5" />
            {/* TEMPORÁRIO (site aberto, 2026-06-29): no modelo aberto não há atribuição de Pré-vendas.
                A mensagem só orienta a consultar. Quando voltar ao modelo fechado, retorna o texto de
                atribuição ("Você pode atribuir um Pré-vendas…") — ver ONDE-ESTA-TUDO.md, seção 3. */}
            {publico ? (
              <span><b>Dúvida técnica em algum campo?</b> Preencha o que souber. Em caso de dúvida, <b>consulte o Pré-vendas responsável pelo deal</b> — é ele quem valida a parte técnica de cada fabricante. Não precisa travar o registro: envie com o que tiver e a equipe complementa.</span>
            ) : (
              <span><b>Dúvida técnica em algum campo?</b> Preencha o que souber e acione o <b>Pré-vendas responsável pelo deal</b> — é ele quem valida a parte técnica de cada fabricante. Você pode atribuir um Pré-vendas a esta tarefa e enviá-la para ele completar antes de salvá-la.</span>
            )}
          </div>

          <Card><CardPad>
            <div className="text-xs uppercase tracking-wider text-brand font-bold mb-3">Adicionar fabricante {fabs.length > 0 ? `(${fabs.length + 1}º)` : ""}</div>
            <Campo label="Fabricante" sub="digite para buscar">
              {/* TEMPORÁRIO (site aberto, 2026-06-29): no público a sugestão "à equipe" não chega
                  a ninguém (API exige login) → onSuggest desligado (segue podendo digitar valor livre).
                  Volta no modelo fechado. Ver ONDE-ESTA-TUDO.md §3. */}
              <Combobox value={cur.nome} onChange={pickFab} options={fabNames} allLabel="Selecione o fabricante…" allowCustom onSuggest={publico ? undefined : (v) => sugerirOpcao("Fabricante", v)} />
            </Campo>
            {cur.nome?.toLowerCase().includes("lenovo") && (
              <div className="mt-3 rounded-lg border-2 border-red-500/50 bg-red-500/10 p-3 text-sm text-red-800 dark:text-red-300">
                <div className="font-bold flex items-center gap-2 mb-1">
                  <AlertTriangle size={15} className="text-red-600" />
                  Atenção (Lenovo)
                </div>
                <p className="leading-relaxed">
                  Como você escolheu a <strong>Lenovo</strong>, lembre-se de que é obrigatório enviar uma evidência de contato com o cliente ou de negociação (e-mail, conversa de chat, etc.) no chat da tarefa correspondente no Bitrix.
                </p>
              </div>
            )}
            {(cur.fabricante_id || cur.nome.trim()) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                {fabFieldsFor(cur.nome).filter((d) => !d.showIf || cur.campos[d.showIf.key] === d.showIf.equals).map((d) => {
                  const val = cur.campos[d.key] || "";
                  return (
                    <div key={d.key} className={(d.tipo === "textarea" || d.tipo === "multiselect" || d.tipo === "produtos_qtd" || d.tipo === "lenovo_produtos_qtd") ? "sm:col-span-2" : ""}>
                      <Campo label={d.label} hint={d.hint}>
                        {d.tipo === "multiselect" ? (
                          <MultiCombobox value={val ? val.split(", ") : []} onChange={(arr) => setCampoCur(d.key, arr.join(", "))} options={d.options || []} label={d.label} allLabel="Selecionar…" allowCustom onSuggest={publico ? undefined : (v) => sugerirOpcao(d.label, v)} />
                        ) : d.tipo === "produtos_qtd" ? (
                          <ProdutosQtd value={val} onChange={(v) => setCampoCur(d.key, v)} options={d.options || []} onSuggest={publico ? undefined : (v) => sugerirOpcao(d.label, v)} />
                        ) : d.tipo === "lenovo_produtos_qtd" ? (
                          <LenovoProdutosQtd value={val} onChange={(v) => setCampoCur(d.key, v)} options={d.options || []} />
                        ) : d.tipo === "bool" ? (
                          <div className="flex gap-2">
                            {["Sim", "Não"].map((v) => (
                              <button type="button" key={v} onClick={() => setCampoCur(d.key, v)}
                                className={"h-9 px-4 rounded-lg border text-sm font-semibold transition " + (val === v ? "border-brand bg-brand/10 text-brand" : "border-line text-muted hover:bg-surface2")}>{v}</button>
                            ))}
                          </div>
                        ) : d.tipo === "select" ? (
                          <Combobox value={val} onChange={(v) => setCampoCur(d.key, v)} options={d.options || []} allLabel="Selecionar…" allowCustom onSuggest={publico ? undefined : (v) => sugerirOpcao(d.label, v)} />
                        ) : d.tipo === "textarea" ? (
                          <textarea value={val} onChange={(e) => setCampoCur(d.key, e.target.value)} className={taArea} />
                        ) : (
                          <Input value={val} onChange={(e: any) => setCampoCur(d.key, e.target.value)} placeholder={d.key === "valor_estimado_usd" ? "Ex.: 50000 (apenas números, em US$)" : undefined} />
                        )}
                      </Campo>
                    </div>
                  );
                })}
              </div>
            )}
            {(cur.fabricante_id || cur.nome.trim()) && salesEngineers.length > 0 && (
              <div className="mt-3 pt-3 border-t border-line">
                <Campo label="Pré-vendas responsável (parte técnica)" hint="se você não conseguir preencher a parte técnica, escolha um Pré-vendas: ele recebe esta tarefa, completa só o que faltar e libera para o Intern. Deixe em “Ainda não definido” para preencher tudo você mesmo.">
                  <Select value={cur.pre_vendas_id || ""} onChange={(e: any) => { const id = e.target.value; const se = salesEngineers.find((s) => s.id === id); setCur((c) => ({ ...c, pre_vendas_id: id || null, pre_vendas_nome: se?.nome || null })); }}>
                    <option value="">Ainda não definido — eu (AM) preencho tudo</option>
                    {salesEngineers.map((s) => <option key={s.id} value={s.id}>{s.nome}</option>)}
                  </Select>
                </Campo>
              </div>
            )}
          </CardPad></Card>

          {erroBox}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" onClick={() => { setMsg(null); setStep("comum"); }}><ArrowLeft size={15} /> Voltar ao DEAL</Button>
            <Button variant="ghost" onClick={addOutro}><Plus size={15} /> Salvar e adicionar outro</Button>
            <Button onClick={irRevisar} className="ml-auto">Salvar e revisar <ArrowRight size={15} /></Button>
          </div>
          <p className="text-xs text-muted">Os dois botões <b>salvam o fabricante atual</b>. “Salvar e adicionar outro” abre um novo em branco; “Salvar e revisar” inclui este e abre a conferência final.</p>
        </>
      )}

      {/* ───────── PASSO 3: revisão + confirmação ───────── */}
      {step === "revisao" && (
        <>
          <div className="flex items-start gap-2 text-sm text-brand bg-brand/10 border border-brand/30 rounded-lg px-3 py-2">
            <ClipboardCheck size={16} className="shrink-0 mt-0.5" />
            <span>Confira tudo abaixo. Ao confirmar, o Mapper gera <b>{expandirFabs(fabs).length} bloco(s)</b> (1 tarefa por fabricante) prontos p/ colar no Bitrix.</span>
          </div>
          {fabs.some((f) => f.nome?.toLowerCase().includes("lenovo")) && (
            <div className="flex items-start gap-2 text-sm text-red-800 dark:text-red-300 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
              <AlertTriangle size={16} className="shrink-0 mt-0.5 text-red-600" />
              <span><b>Atenção (Lenovo):</b> Como você selecionou a Lenovo, lembre-se de que é obrigatório enviar uma evidência de contato com o cliente ou de negociação (e-mail, conversa, etc.) no chat da tarefa correspondente no Bitrix.</span>
            </div>
          )}
          {expandirFabs(fabs).length > fabs.length && (
            <div className="flex items-start gap-2 text-xs text-amber-800 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 rounded-lg px-3 py-2">
              <Factory size={14} className="shrink-0 mt-0.5" />
              <span><b>Trend Micro:</b> o <b>TippingPoint</b> exige RO próprio (regra do portal), então o Mapper separou os produtos em <b>tarefas diferentes</b> — uma só com TippingPoint e outra com o restante.</span>
            </div>
          )}

          <Card><CardPad>
            <div className="text-xs uppercase tracking-wider text-brand font-bold mb-3">Dados do DEAL</div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
              {([
                ["Oportunidade", c.nome_oportunidade], ["ID DEAL", c.deal_id_bitrix], ["Empresa", c.empresa],
                ["CNPJ", c.cnpj], ["Endereço", c.endereco_empresa], ["Responsável", c.responsavel_nome],
                ["E-mail", c.responsavel_email], ["Cargo", c.responsavel_cargo], ["Telefone", c.responsavel_telefone],
                ["Economic Buyer", c.economic_buyer], ["Champion", c.champion], ["Fechamento", fechamento_quarter],
              ] as [string, any][]).map(([k, v]) => (
                <div key={k}><div className="text-[11px] uppercase tracking-wide text-muted font-semibold">{k}</div><div className="text-sm text-fg break-words">{v || <span className="text-red-500">— vazio</span>}</div></div>
              ))}
            </div>
          </CardPad></Card>

          {expandirFabs(fabs).map((f, i) => (
            <Card key={i}><CardPad>
              <div className="font-bold text-fg mb-2 inline-flex items-center gap-2 flex-wrap"><Factory size={16} className="text-brand" /> {f.nome}
                {f.pre_vendas_nome
                  ? <span className="text-xs font-semibold text-amber-600">· Pré-vendas: {f.pre_vendas_nome}</span>
                  : <span className="text-xs font-normal text-muted">· você (AM) preenche tudo</span>}
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2">
                {fabFieldsFor(f.nome).filter((d) => !d.showIf || f.campos[d.showIf.key] === d.showIf.equals).map((d) => (
                  <div key={d.key}><div className="text-[11px] uppercase tracking-wide text-muted font-semibold">{d.label}</div><div className="text-sm text-fg break-words">{f.campos[d.key] || <span className="text-muted">—</span>}</div></div>
                ))}
              </div>
              <div className="mt-3">
                <ROCopyBlock proc={procPreview} reg={{ fabricante_nome: f.nome, campos: f.campos }} />
              </div>
            </CardPad></Card>
          ))}

          {erroBox}
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" onClick={() => { setMsg(null); setStep("fab"); }}><ArrowLeft size={15} /> Voltar e editar</Button>
            <Button disabled={busy} onClick={confirmarEnvio} className="ml-auto"><Check size={15} /> {busy ? "Enviando…" : "Finalizar e enviar"}</Button>
          </div>
        </>
      )}
      {dialog}
    </div>
  );
}

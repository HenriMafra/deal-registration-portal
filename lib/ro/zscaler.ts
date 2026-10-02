// Dados do Deal Registration da ZSCALER — mapeados do portal. BANT e Submission Type têm
// rótulo bilíngue (EN — PT); Role/Title, Competitor e Product Family ficam verbatim (descrições /
// nomes próprios / nomes de produto). Usados no Passo 2 do RO quando o fabricante é "Zscaler".
//
// Campos comuns do Passo 1 NÃO se repetem: Customer Contact Email -> responsavel_email,
// Customer Name -> empresa, Street/City/State/Zip -> endereco_empresa, First/Last Name ->
// responsavel_nome, Phone -> responsavel_telefone, Estimated Deal Amount (USD) -> valor_estimado_usd,
// Expected Close Date -> data_fechamento.

// "Submit a Deal" — tipo de submissão (radio).
export const ZSCALER_SUBMISSION_TYPE: string[] = [
  "Deal Registration — registro de novo negócio",
  "Renewal Deal Registration — registro de renovação",
];

// B.A.N.T Qualification — dual-list (marque PELO MENOS UMA).
export const ZSCALER_BANT: string[] = [
  "Budget — Orçamento (o cliente tem orçamento estimado em mente)",
  "Authority — Autoridade (o contato tem autoridade para decidir pelo cliente)",
  "Need — Necessidade (o cliente tem uma necessidade identificada para o projeto)",
  "Timing — Prazo (o cliente tem um prazo estimado para concluir o projeto)",
];

// Role/Title — cargo do contato primário do cliente (verbatim do portal).
export const ZSCALER_ROLE_TITLE: string[] = [
  "Business Exec - CEO/CFO",
  "IT Exec - CIO/CTO/VP/Director of IT/Technology",
  "Security Exec - CISO/CSO/VP/Director of Security",
  "Network Exec - VP/Director Of Networking",
  "Security Influencer - Security Analyst/Architect/Manager",
  "IT Influencer - IT Analyst/Architect/Manager/Technology",
  "Network Influencer - Network Analyst/Architect/Manager",
  "Other",
];

// Is the Customer replacing a Zscaler Competitor? — concorrente substituído (verbatim).
export const ZSCALER_COMPETITOR: string[] = [
  "Palo Alto Networks",
  "Netskope",
  "Skyhigh Security / McAfee",
  "Cisco",
  "Cloudflare",
  "Broadcom",
  "Forcepoint",
  "iBoss",
  "Microsoft",
  "Other",
  "None",
];

// Product Family — dual-list (multisseleção). Nomes de produto verbatim do portal.
export const ZSCALER_PRODUCT_FAMILY: string[] = [
  "AI Security",
  "Data Security",
  "Digital Experience",
  "Emerging Products (ZT Cell, ZT Browser, etc.)",
  "Internet Access",
  "Post-sales (Deployment and Pro Services)",
  "Private Access",
  "SecOps",
  "Zero Trust Branch",
  "Zero Trust Cloud",
];

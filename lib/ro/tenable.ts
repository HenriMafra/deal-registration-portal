// Dados do Deal Registration da TENABLE — mapeados do portal. Produtos, faixas de orçamento e
// tipo de deal ficam verbatim (nomes próprios / valores do portal). Usados no Passo 2 do RO
// quando o fabricante é "Tenable".
//
// Campos comuns do Passo 1 NÃO se repetem: Title -> responsavel_cargo, First/Last Name ->
// responsavel_nome, Phone -> responsavel_telefone, Email -> responsavel_email, Company -> empresa,
// Street/City/State/Zip -> endereco_empresa, Estimated Close Date -> data_fechamento.

// Is this an MSSP or Reseller Deal Registration? (seleção única)
export const TENABLE_DEAL_REG_TYPE: string[] = [
  "Reseller Deal Registration",
  "MSSP Partner Owned Deal Registration",
  "MSSP Customer Owned Deal Registration",
];

// Product Interest — dual-list (multisseleção). Nomes de produto verbatim do portal.
export const TENABLE_PRODUCTS: string[] = [
  "Tenable Lumin",
  "Tenable One",
  "Tenable Security Center Plus",
  "Tenable Vulnerability Management",
  "Tenable Identity Exposure",
  "Tenable Attack Surface Management",
  "Tenable Cloud Security",
  "Tenable Web App Scanning",
  "Tenable OT Security",
  "Tenable Security Center",
  "Tenable AI Security",
];

// Approved Budget Amount — faixa de orçamento aprovado (verbatim).
export const TENABLE_BUDGET: string[] = [
  "$1MM",
  "$500K-$1MM",
  "$250K-$499K",
  "$100K-$249K",
  "$50K-$99K",
  "<$50K",
];

// Country — deve vir preenchido automaticamente como BR (padrão ENTERPRISECORE).
export const TENABLE_COUNTRY: string[] = [
  "BR",
];

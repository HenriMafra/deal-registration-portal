// Dados do Deal Registration da FORTINET — mapeados do portal. Listas verbatim (valores do portal;
// inclui faixas de valor com vírgula de milhar e nomes de solução). Usados no Passo 2 do RO quando
// o fabricante é "Fortinet" (também vale para "Fortinet SASE" — mesmo portal).
//
// Campos comuns do Passo 1 NÃO se repetem: Company -> empresa, Address/Country/State/City/Postal ->
// endereco_empresa, First/Last Name -> responsavel_nome, Email -> responsavel_email, Title ->
// responsavel_cargo, Phone -> responsavel_telefone, Estimated Close Date -> data_fechamento.
// "Description" recebe o bloco-modelo do Bitrix. O aceite dos T&Cs NÃO entra no RO (resolvido no portal).

// Deal Reg Type (seleção única).
export const FORTINET_DEAL_REG_TYPE: string[] = [
  "Resale",
  "Managed Service (MSSP)",
  "Marketplace",
];

// Is this a Deal Reg for new product? (seleção única; verbatim — "Deal reg" com r minúsculo no portal).
export const FORTINET_NEW_PRODUCT: string[] = [
  "Deal reg",
  "Deal Reg Renewal",
];

// Estimated Value in $USD — faixa (verbatim, com vírgula de milhar e espaços do portal).
export const FORTINET_VALUE: string[] = [
  "10,000 - 24,999",
  "25,000 - 49,999",
  "50,000 - 99,999",
  "100,000 - 499,999",
  "500,000 - 999,999",
  "1,000,000 +",
];

// Is this an IT or OT Opportunity? (seleção única).
export const FORTINET_IT_OT: string[] = [
  "Information Technology (IT)",
  "Operational Technology (OT)",
  "Converged IT & OT",
];

// Which Security Solutions are included? (multisseleção; nomes verbatim do portal).
export const FORTINET_SECURITY_SOLUTIONS: string[] = [
  "Advanced Threat Protection",
  "Application and Saas Security",
  "Business Communications",
  "Dynamic Cloud Security",
  "Email Security",
  "End Point Protection",
  "Endpoint Security",
  "Management/Analytics",
  "Multi-Cloud Security",
  "Network Security",
  "OT",
  "OT Control",
  "Other",
  "OT Other",
  "OT Situational Awareness",
  "OT Visibility",
  "SD-WAN",
  "Secure Unified Access",
  "Security Operations",
  "Small Business",
  "Small Business Cloud Security",
  "Small Business Networking Security",
  "Small Business Security Operations",
  "Small Infrastructure",
  "Web Application Security",
  "Zero-TrustNetwork Access",
];

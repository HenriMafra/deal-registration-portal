// Dados do Deal Registration da CYBERARK — mapeados do portal (identificado pelos produtos:
// EPM/IGA/MIM/Secrets/Privilege/Machine Identity Security). Currency tem rótulo bilíngue (EN — PT);
// Primary Solution fica verbatim (agrupamentos de produto). Usados no Passo 2 do RO quando o
// fabricante é "CyberArk".
//
// Campos comuns do Passo 1 NÃO se repetem: Project Description -> descricao_proposta,
// Expected Close Date -> data_fechamento, Project Budget -> valor_estimado_usd, Company Name ->
// empresa, Address/City/State/Country/Postal -> endereco_empresa, Contact Title -> responsavel_cargo,
// First/Last Name -> responsavel_nome, Contact Email -> responsavel_email, Contact Phone -> responsavel_telefone.

// Primary Solution — solução principal (verbatim do portal; agrupamentos de produto CyberArk).
export const CYBERARK_PRIMARY_SOLUTION: string[] = [
  "Workforce (EPM / IGA)",
  "Machine (MIM / Secrets / Machine Identity Security)",
  "IT / Developer (Access / Cloud / Privilege)",
  "Platform",
];

// Currency — moeda do orçamento (EN — PT; a parte EN bate com a opção do portal).
export const CYBERARK_CURRENCY: string[] = [
  "British Pound — Libra esterlina (GBP)",
  "Euro — Euro (EUR)",
  "U.S. Dollar — Dólar dos EUA (USD)",
];

// Customer Status — opções confirmadas pelo henri (portal CyberArk).
export const CYBERARK_CUSTOMER_STATUS: string[] = [
  "Existing Customer",
  "Prospective Customer",
];

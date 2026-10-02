// Dados do Deal Registration da ELASTIC — mapeados do portal. Listas verbatim (valores do portal).
// Usados no Passo 2 do RO quando o fabricante é "Elastic".
//
// Campos comuns do Passo 1 NÃO se repetem: Prospect Company Name -> empresa, Street/City/State/Country/
// Postal -> endereco_empresa, Prospect First/Last Name -> responsavel_nome, Prospect Email -> responsavel_email,
// Prospect Contact Title -> responsavel_cargo, Prospect Contact Phone -> responsavel_telefone.

// Transaction Type (seleção única).
export const ELASTIC_TRANSACTION_TYPE: string[] = [
  "Referral",
  "Reseller",
  "Influence",
  "MSP Single-Tenant",
];

// Prospect Contact Role (seleção única).
export const ELASTIC_CONTACT_ROLE: string[] = [
  "Business",
  "Technical",
  "Procurement",
];

// Use cases (multisseleção; verbatim do portal).
export const ELASTIC_USE_CASES: string[] = [
  "Website search",
  "Workplace search",
  "Search Application",
  "Ecommerce search",
  "Customer support search",
  "Log Monitoring",
  "Cloud and Infrastructure Monitoring",
  "Application Performance Monitoring",
  "Customer / User Experience Monitoring",
  "Monitoring Tools Consolidation",
  "Security analytics (SIEM)",
  "Threat protection (endpoint)",
  "Incident investigation and response",
  "Threat hunting",
  "Cloud security",
  "Business analytics",
  "Geospatial analytics",
  "Fraud detection",
  "Risk & compliance monitoring (e.g. AML)",
  "Other",
  "Database Offloading",
  "GenAI / Vector Search / ML Search",
];

// Primary Solution (seleção única).
export const ELASTIC_PRIMARY_SOLUTION: string[] = [
  "Elastic Enterprise Search",
  "Elastic Observability",
  "Elastic Security",
];

// Delivery type (seleção única).
export const ELASTIC_DELIVERY_TYPE: string[] = [
  "Self-Managed",
  "Cloud",
  "Both",
];

// Estimated deal size in USD (seleção única; verbatim — usa en-dash "–" em algumas faixas).
export const ELASTIC_DEAL_SIZE: string[] = [
  "<$50k",
  "50k–100k",
  "100k–250k",
  "$250k",
  "Not Sure",
];

// What steps did you take to qualify this opportunity? (seleção única).
export const ELASTIC_QUALIFY_STEPS: string[] = [
  "Early prospect lead",
  "Conducted discovery",
  "Conducted demonstration of Elastic",
  "Conducted POC",
  "Planning POC",
  "Other, please specify",
];

// How Elastic can help you move forward (seleção única).
export const ELASTIC_HELP_FORWARD: string[] = [
  "POC Support",
  "Presales Support",
  "Quote/Discount Support",
  "Professional Services Engagement",
  "No support needed - we have the necessary capabilities",
];

// Select Why Customer Contacted (seleção única; NÃO obrigatório).
export const ELASTIC_WHY_CONTACTED: string[] = [
  "This is a complete managed service",
  "This is a government customer",
  "Other / Please Specify",
];

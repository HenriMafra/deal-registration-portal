// Dados do Deal Registration da TREND MICRO — mapeados do portal. Os dados de cliente/contato
// comuns já vêm do Passo 1; aqui ficam só os campos específicos do fabricante. Opções verbatim.

export const TM_DEAL_TYPE: string[] = ["Reselling deal", "Referral deal"];

export const TM_INDUSTRY: string[] = [
  "Other", "Agriculture", "Apparel", "Banking", "Biotechnology", "Chemicals", "Communications", "Construction",
  "Consulting", "Defence", "Education", "Electronics", "Energy", "Engineering", "Entertainment",
  "Environmental", "Finance", "Food & Beverage", "Government", "Healthcare", "Hospitality", "Insurance",
  "Machinery", "Manufacturing", "Media", "Not for Profit", "Recreation", "Retail", "Shipping",
  "Technology", "Telecommunications", "Transportation", "Utilities",
];

export const TM_COMPANY_SIZE: string[] = ["1-100", "101-500", "501-1000", "1001-5000", "5000+"];

export const TM_PRODUCTS: string[] = [
  "AI Security",
  "Cloud Security",
  "Cyber Risk Exposure Management",
  "Data Security",
  "Email and Collaboration Security",
  "Endpoint Security",
  "Network Security - Deep Discovery Appliance",
  "Network Security - Deep Discovery Software",
  "Network Security - IPS (TippingPoint)",
  "Network Security - Threat Detection",
  "Network Security - ZTSA",
  "On-Premises Deep Security",
  "Security Operations (XDR, Agentic SIEM, Agentic SOAR)",
  "Threat Intelligence",
  "TrendAI Vision One™ Services",
  "TrendAI Vision One™ Services - MDR",
];

export const TM_DISTRIBUTORS: string[] = [
  "TD SYNNEX Brasil Ltda",
  "Aplidigital Comercio e Servicos de Tecnologia LTDA",
  "Ingram Micro Brasil LTDA",
  "Scansource Brasil Distribuidora De Tecnologias Ltda",
];

export const TM_COMPETITORS: string[] = [
  "Other", "AlertLogic", "Barracuda", "Bitdefender", "Blue Coat", "Broadcom/Symantec", "Check Point", "Cisco",
  "CrowdStrike", "Cybereason", "Cylance", "Dell", "EMC", "ESET", "FireEye", "Fortinet", "Huawei", "IBM",
  "Juniper", "Kaspersky", "Microsoft", "Orca Security", "Palo Alto", "Proofpoint", "Qualys", "RSA",
  "SentinelOne", "Sophos", "Trellix", "VMware Carbon Black", "Watchguard", "Wiz", "Zscaler",
];

export const TM_INFRA: string[] = [
  "Other", "AWS", "Cisco", "HP", "IBM", "Microsoft Azure", "Office 365", "VMware",
];

export const TM_CAMPAIGNS: string[] = [
  "Agentic SIEM",
  "AI Predict Opportunity",
  "Legacy SaaS Migration to TrendAI Vision One™ Program",
  "Partner Locator",
  "Prospect Scores",
  "TrendAI Vision One™ Platform Demos",
  "TrendAI™ Cyber Risk Assessments Service",
  "TrendAI™ marketing funded activity",
  "Windows 10 EOL",
  "Wiz Migrate",
  "Other",
];

// Regra do portal Trend Micro: TippingPoint (Network Security - IPS) exige RO SEPARADO —
// não pode misturar com outros produtos no mesmo deal registration. Recebe a string do campo
// de produtos ("A ×10; B ×5") e, se houver mistura, devolve as duas partes (TippingPoint ×
// demais) para virarem tarefas distintas; se não houver mistura, devolve null (não divide).
export function dividirTippingPoint(produtosStr: string): { tipping: string; outros: string } | null {
  const itens = String(produtosStr || "").split(/;\s*/).map((s) => s.trim()).filter(Boolean);
  const tipping = itens.filter((i) => /tippingpoint/i.test(i));
  const outros = itens.filter((i) => !/tippingpoint/i.test(i));
  if (tipping.length && outros.length) return { tipping: tipping.join("; "), outros: outros.join("; ") };
  return null;
}

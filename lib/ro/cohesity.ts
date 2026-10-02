// Dados do Deal Registration da COHESITY — mapeados do portal (D:\Mapeamentos\mapeamento-deal-reg.md,
// seção "FABRICANTE: COHESITY"). Cobre as 5 seções do RO da Cohesity: Deal Contacts, End Customer,
// Deployment Location, Deal Identification and Transaction e Deal Details.
// Rótulos das opções são BILÍNGUES (termo em inglês — explicação em PT) para o AM/Intern entender
// mesmo sem dominar inglês. Usados no Passo 2 do RO quando o fabricante é "Cohesity".
//
// Para os campos de país (Country / Region) reutilizamos a const PAISES do checkpoint.ts —
// NÃO recriamos a lista de países aqui.

// Os 6 dropdowns Yes/No da Seção 4 (Deal Identification) são mapeados como FabField tipo "bool"
// (renderiza Sim/Não), então NÃO há const de opções Yes/No aqui — seria lista morta.

// SEÇÃO 4 — campo 7) Preferred Distributor — distribuidor preferido (verbatim do portal).
export const COHESITY_DISTRIBUTORS: string[] = [
  "Legacy Agreement LAM — acordo legado (LAM)",
  "ScanSource Brasil Distribuidora de Tecnologias LTDA — distribuidor",
  "Ingram Micro Brasil LTDA — distribuidor",
  "ENTERPRISECORE SOLUCOES EM TELEINFORMATICA LTDA — distribuidor (a própria ENTERPRISECORE)",
  "Adistec Brasil Informatica — distribuidor",
  "LOL Brasil Informatica LTDA — distribuidor",
];

// SEÇÃO 5 — campo 3) Products — lista "Available" → "Chosen" (dual-list, multisseleção).
// Lista COMPLETA do portal (28 itens), na ordem original.
export const COHESITY_PRODUCTS: string[] = [
  "DataProtect — backup e recuperação de dados",
  "SiteContinuity — disaster recovery automatizado",
  "FortKnox — cofre isolado/imutável (cyber vault, anti-ransomware)",
  "SmartFiles — armazenamento de arquivos e objetos definido por software",
  "DataGovern — governança e segurança de dados",
  "DataHawk — proteção contra ameaças e classificação (SaaS)",
  "ThreatProtection — detecção de ameaças/ransomware",
  "Classification — classificação de dados sensíveis",
  "DataCloud — plataforma de dados em nuvem",
  "DataInsights — análise e insights sobre os dados",
  "Gaia — busca/IA generativa sobre os dados (Cohesity Gaia)",
  "DataCloud-RAP — Ransomware Assessment Program (avaliação de ransomware)",
  "ETBACKUP SAAS PROTECTION — proteção de SaaS (backup como serviço)",
  "Access — Veritas Access (armazenamento de arquivos/objetos)",
  "Access Appliance — appliance Veritas Access",
  "Flex Appliance — appliance Veritas Flex",
  "Flex Software — software Veritas Flex",
  "NetBackup — Veritas NetBackup (backup corporativo)",
  "NetBackup Appliance — appliance NetBackup",
  "NetBackup Appliance Software — software do appliance NetBackup",
  "NetBackup Data Mover — Data Mover do NetBackup",
  "NetBackup Enterprise — NetBackup Enterprise",
  "NetBackup Flex Scale — NetBackup Flex Scale (escala horizontal)",
  "NetBackup IT Analytics — analytics de TI do NetBackup",
  "NetBackup Virtual Appliance — appliance virtual NetBackup",
  "Veritas Alta Data Protection — proteção de dados na nuvem (Veritas Alta)",
  "Veritas Alta Recovery Vault — cofre de recuperação na nuvem (Veritas Alta)",
  "Veritas Alta SaaS Protection — proteção de SaaS (Veritas Alta)",
];

// SEÇÃO 5 — campo 4) Opportunity Origin — origem da oportunidade (placeholder "Select an Option").
export const COHESITY_OPPORTUNITY_ORIGIN: string[] = [
  "Partner Existing Account — conta já existente do parceiro (cliente atual)",
  "Partner New Account — conta nova do parceiro (cliente novo)",
];

// SEÇÃO 5 — campo 5) Reasons For Purchase — motivos da compra (dual-list, multisseleção).
export const COHESITY_REASONS_FOR_PURCHASE: string[] = [
  "Cost Savings — redução de custos",
  "Reduce Complexity — reduzir complexidade",
  "Scale Out — escalar horizontalmente",
  "Consolidation — consolidação de ambientes",
  "Single Pane of Glass — gestão unificada (painel único)",
  "Other — outros motivos (detalhar no Project Description)",
];

// SEÇÃO 5 — campo 6) Primary Use Case — caso de uso principal (inclui "--None--" como placeholder).
export const COHESITY_PRIMARY_USE_CASE: string[] = [
  "--None-- — (selecione)",
  "Backup & Recovery — backup e recuperação",
  "Backup Target — destino de backup (alvo)",
  "File & Object — arquivos e objetos",
  "Automated Disaster Recovery — disaster recovery automatizado",
  "Dev & Test — desenvolvimento e teste",
  "FortKnox — cofre isolado/imutável (cyber vault)",
];

// SEÇÃO 5 — campo 7) Preferred Consumption Model — modelo de consumo preferido.
export const COHESITY_CONSUMPTION_MODEL: string[] = [
  "On Premise — no data center do cliente (CapEx)",
  "Cohesity aaS Offering — oferta como serviço da própria Cohesity",
  "Partner-Delivered aaS Offering — oferta como serviço entregue pelo parceiro",
  "No Preference — sem preferência",
];

// SEÇÃO 5 — campo 8) Existing Production Use Storage Vendors — storages em produção hoje
// (dual-list, multisseleção). Lista COMPLETA do portal (inclui "Other (please specify)..." e "None").
export const COHESITY_STORAGE_VENDORS: string[] = [
  "Dell (0 - 50 TB) — Dell, até 50 TB",
  "Dell (50+ TB) — Dell, mais de 50 TB",
  "EMC (0 - 50 TB) — EMC, até 50 TB",
  "EMC (50+ TB) — EMC, mais de 50 TB",
  "Hitachi (0 - 50 TB) — Hitachi, até 50 TB",
  "Hitachi (50+ TB) — Hitachi, mais de 50 TB",
  "Hewlett Packard Enterprise (0 - 50 TB) — HPE, até 50 TB",
  "Hewlett Packard Enterprise (50+ TB) — HPE, mais de 50 TB",
  "Lenovo (0 - 50 TB) — Lenovo, até 50 TB",
  "Lenovo (50+ TB) — Lenovo, mais de 50 TB",
  "NetApp (0 - 50 TB) — NetApp, até 50 TB",
  "NetApp (50+ TB) — NetApp, mais de 50 TB",
  "Nimble Storage (0 - 50 TB) — Nimble Storage, até 50 TB",
  "Nimble Storage (50+ TB) — Nimble Storage, mais de 50 TB",
  "Nutanix (0 - 50 TB) — Nutanix, até 50 TB",
  "Nutanix (50+ TB) — Nutanix, mais de 50 TB",
  "Pure Storage (0 - 50 TB) — Pure Storage, até 50 TB",
  "Pure Storage (50+ TB) — Pure Storage, mais de 50 TB",
  "Solidfire (0 - 50 TB) — SolidFire, até 50 TB",
  "Solidfire (50+ TB) — SolidFire, mais de 50 TB",
  "Tegile (0 - 50 TB) — Tegile, até 50 TB",
  "Tegile (50+ TB) — Tegile, mais de 50 TB",
  "Tintri (0 - 50TB) — Tintri, até 50 TB",
  "Tintri (50+ TB) — Tintri, mais de 50 TB",
  "None — nenhum",
];

// O portal da Cohesity tem um bug de validação exigindo um campo "Other Primary Storage" 
// invisível quando se marca "Other". Para evitar que o registro trave, removemos a opção "Other".

// SEÇÃO 4 — campo 6) Was This Customer Engaged In A Cohesity Supported Marketing Activity?
// Portal tem 3 opções (NÃO é bool simples).
export const COHESITY_MARKETING_ACTIVITY: string[] = [
  "Yes — sim",
  "No — não",
  "Do not know — não sabe / não tenho essa informação",
];


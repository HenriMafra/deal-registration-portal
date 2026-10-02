// Dados do Deal Registration da NUTANIX — mapeados do portal. Rótulos das opções de PRODUTO
// e GEO são bilíngues (termo EN — explicação PT); distribuidores e hardware ficam verbatim
// (nomes próprios). Usados no Passo 2 do RO quando o fabricante é "Nutanix".
//
// Campos comuns do Passo 1 (Opportunity Name, Description, CRM ID, Sales Rep, End Customer
// Company/Contact, Estimated Close Date = data_fechamento, Estimated Revenue = valor_estimado_usd)
// NÃO se repetem aqui.

// Lista A — Which Nutanix Software Products is the Customer Interested In? (multisseleção)
export const NUTANIX_SOFTWARE_PRODUCTS: string[] = [
  "Nutanix Cloud Infrastructure (NCI) — infraestrutura hiperconvergente (compute + storage + virtualização)",
  "Nutanix Cloud Manager (NCM) — gestão, automação e governança de nuvem",
  "Nutanix Unified Storage (NUS) — storage unificado (arquivos, objetos e blocos)",
  "Nutanix Database Service (NDB) — banco de dados como serviço (ex-Era)",
  "Nutanix Kubernetes Platform (NKP) — plataforma de contêineres Kubernetes",
  "None — nenhum produto de software Nutanix",
  "Undetermined — ainda indefinido",
];

// Lista B — What Third Party Hardware Are You Selling? (seleção única)
export const NUTANIX_THIRD_PARTY_HW: string[] = [
  "Cisco UCS",
  "Crystal",
  "Curtiss-Wright / PacStar Rugged Platforms",
  "Dell PowerEdge",
  "Dell XC Core",
  "Dell PowerFlex",
  "Dell Hardware",
  "Dell Private Cloud",
  "Fujitsu XF",
  "Hitachi HA8000V Servers (Japan)",
  "HPE",
  "Intel Data Center Blocks",
  "Klas",
  "KTNF Servers (South Korea)",
  "Lenovo HX Certified Nodes",
  "NEC Express5800 Servers (Japan)",
  "Nutanix NX (Supermicro)",
  "Nutanix Software Only",
];

// What GEO are you located in? (seleção única; normalmente Americas)
export const NUTANIX_GEO: string[] = [
  "Americas — América (padrão ENTERPRISECORE)",
  "EMEA — Europa, Oriente Médio e África",
  "APAC — Ásia-Pacífico",
];

// Lista C — Who is your preferred Distributor? (seleção única; nomes verbatim do portal)
export const NUTANIX_DISTRIBUTORS: string[] = [
  "Adistec",
  "Adistec - Chile",
  "ADISTEC BRASIL INFORMATICA LTDA",
  "Adistec Mexico, S.A. de C.V.",
  "Afina Venezuela, C.A",
  "Afina, S.R.L.",
  "Arrow ECS - NAM",
  "ARROW ECS CANADA",
  "Authorized Direct Reseller with Nutanix – No Disty Required",
  "Carahsoft Technology Corp",
  "CLM Software Chile SPA",
  "CLM Software Comercio Importacao Exportacao Ltda.",
  "CLM SOFTWARE DEL PERÚ S.A.C",
  "CLMX Corporation",
  "Datec Ltda",
  "Distecna.com S.A",
  "Equanet S.A.",
  "GRUPO DICE SA DE CV",
  "ImmixGroup – An Arrow Company",
  "Ingram Micro - Ecuador",
  "Ingram Micro - Mexico",
  "Ingram Micro - Peru",
  "Ingram Micro - Uruguay",
  "Ingram Micro Canada",
  "Ingram Micro Chile S.A.",
  "Ingram Micro Do Brazil LTD",
  "Ingram Micro Inc., Miami Export Division",
  "Ingram Micro S.A.S.",
  "Ingram Micro US",
  "Lenovo Direct Resale",
  "MAYORISTAS DE PARTES Y SERVICIOS SA DE CV",
  "Network1 Colombia",
  "Nexsys de Chile SPA",
  "TD SYNNEX ARGENTINA",
  "TD SYNNEX Brasil Ltda.",
  "TD SYNNEX CALA, Inc.",
  "TD SYNNEX Chile Limitada",
  "TD SYNNEX Colombia Ltda.",
  "TD SYNNEX Corporation (US)",
  "TD SYNNEX COSTA RICA",
  "TD SYNNEX Ecuador Cia. Ltda.",
  "TD SYNNEX GUATEMALA",
  "TD SYNNEX PANAMÁ",
  "TD SYNNEX PARAGUAY",
  "TD SYNNEX Peru, S.A.C.",
  "TD SYNNEX URUGUAY",
  "TENVA TS CANADA ULC",
  "The KR Group Inc",
  "Westcon Mexico, S.A. de C.V.",
];

// Opportunity Status — opção única, já vem marcada.
export const NUTANIX_OPP_STATUS: string[] = [
  "1 - Qualifying",
];

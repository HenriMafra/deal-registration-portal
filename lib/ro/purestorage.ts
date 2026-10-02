// Dados do Deal Registration da PURE STORAGE — mapeados do portal. Rótulos das opções
// são BILÍNGUES (termo em inglês — explicação em PT) para o AM/Intern entender mesmo
// sem dominar inglês. Usados no Passo 2 do RO quando o fabricante é "Pure Storage".

// 1) Deal Type — modelo de consumo (obrigatório)
export const PURE_DEAL_TYPE: string[] = [
  "Standard — venda tradicional de hardware (CapEx)",
  "Pure-as-a-Service — assinatura/consumo (OpEx, Evergreen//One)",
  "Portworx — software de contêineres (Kubernetes)",
];

// 2) Delivery Owner — responsável pela entrega/instalação
export const PURE_DELIVERY_OWNER: string[] = [
  "Pure Branded — instalação e serviços pela própria Pure",
  "Partner Branded — instalação e serviços pela revenda certificada",
  "Pure SE — apoio básico de engenharia de pré-vendas",
  "Both Pure and Partner Branded — entrega híbrida (Pure + parceiro)",
  "Customer to install — o próprio cliente final instala",
  "Renewal only — apenas renovação de contrato existente",
];

// 3) Opportunity Capacity — capacidade da oportunidade (obrigatório)
export const PURE_CAPACITY: string[] = [
  "<10TB", "11-20TB", "21-50TB", "51-100TB", "101-200TB", "201-500TB", "500TB-1PB", ">1PB",
];

// 4) Proposed Products — produtos propostos (multiseleção, obrigatório)
export const PURE_PRODUCTS: string[] = [
  "FlashArray — storage de bloco (produção, bancos, VMs)",
  "FlashBlade — storage de arquivo/objeto (IA, analytics, não estruturado)",
  "Marketplace - ArrowSphere — integração de nuvem via distribuidor",
  "Portworx — software para Kubernetes",
  "Pure-as-a-Service — contratos de assinatura/consumo",
  "Subscription renewal — renovação de contrato Evergreen",
  "Upgrade capacity — expansão apenas de capacidade de disco",
  "Upgrade controllers — upgrade só das controladoras (cérebro do storage)",
];

// 5) Solution Category — categoria da solução (multiseleção, obrigatório)
export const PURE_SOLUTION_CATEGORY: string[] = [
  "Cyber Resilience — proteção de dados, imutabilidade x ransomware, backup",
  "AI — projetos de Inteligência Artificial",
  "Database — bancos estruturados (Oracle, SQL, SAP)",
  "DevOps & Custom Apps — desenvolvimento e contêineres",
  "EHR/PACs/VNA (Healthcare) — sistemas de saúde / imagens médicas",
  "End User Compute (EUC) — virtualização de desktops (VDI)",
  "Enterprise Content Management — gestão de conteúdo corporativo",
  "General Purpose File — servidores de arquivo gerais",
  "HPC, Data Engineering & Analytics — alta performance e Big Data",
  "Media & Entertainment — edição/transmissão de vídeo e mídia",
];

// 6) Compelling Events — evento motivador / gatilho (obrigatório)
export const PURE_COMPELLING_EVENTS: string[] = [
  "New Environment — novo ambiente criado do zero",
  "Technology Refresh — substituição de hardware antigo",
  "End of Life (EOL) — fim da vida útil / suporte do hardware atual",
  "Lease Expiration — fim do contrato de locação/leasing",
  "Service Expiration — fim do contrato de suporte atual",
  "Budget Cycle — ciclo orçamentário específico do cliente",
  "Migration / Relocation — migração de data center ou mudança física",
  "Merger / Acquisition — fusão ou aquisição de empresas",
  "Other — outros motivos não listados",
];

// 7) Budget Status — status do orçamento (obrigatório)
export const PURE_BUDGET_STATUS: string[] = [
  "Budget Approved — verba aprovada e liberada",
  "Budget Identified (not approved yet) — valor mapeado, sem aprovação final",
  "Budget Not Identified — cliente não possui orçamento previsto",
];

// 8) Distributor Account — distribuidor parceiro (obrigatório; permite digitar outro)
export const PURE_DISTRIBUTORS: string[] = [
  "Arrow", "TD Synnex", "Ingram Micro", "ScanSource", "Westcon",
];

// 9) Competitive Takeout Vendor — concorrente a ser substituído (condicional)
export const PURE_TAKEOUT_VENDORS: string[] = [
  "AWS",
  "Azure",
  "Ceph (native)",
  "Cisco Hyperflex",
  "Cloud/Other",
  "Cloud AWS EBS",
  "Cloud AWS Outposts",
  "Cloud Azure Disks",
  "Cloud Azure Stock HCI",
  "Cloud Dell Cloud Storage Services",
  "Cloud Dell Unity Cloud Edition",
  "Cloud Google",
  "Cloud HPE Cloud Volumes",
  "Cloudian",
  "Cloudian HyperFile",
  "Cloudian HyperStoreCloudian HyperStore - Hybrid",
  "Cloud IBM",
  "Cloud Infinidat Elastic Data Fabric",
  "Cloud Infinidat Neutrix Cloud",
  "Cloud NetApp (Cloud Volumes ONTAP - CVO-block)",
  "Cloud Nutanix Xi Cloud",
  "Cloud Other",
  "Cloud VCF on VxRail",
  "Cohesity",
  "Cray",
  "DataCore",
  "DDN A3I",
  "DDN EXAScaler",
  "DDN GRIDScaler",
  "DDN IntelliFlash (Tegile)",
  "DDN Lustre",
  "DDN SFA",
  "Dell",
  "Dell Cloud",
  "Dell ECS",
  "Dell PowerFlex",
  "Dell PowerMax",
  "Dell PowerProtect (Data Domain)",
  "Dell PowerScale Isilon",
  "Dell PowerStore",
  "Dell PowerVault",
  "Dell SC Series",
  "Dell Unity",
  "Dell VxRail",
  "Diamanti",
  "Druva",
  "Fujitsu",
  "Google Cloud Platform",
  "Hammerspace",
  "Hitachi HCP (object)",
  "Hitachi HNAS (file)",
  "Hitachi VSP",
  "HPE",
  "HPE 3PAR",
  "HPE Alletra",
  "HPE Cloud",
  "HPE Primera",
  "HP Nimble",
  "Huawei",
  "IBM",
  "IBM Cloud",
  "IBM Red Hat Ceph",
  "Infinidat Cloud",
  "Kasten",
  "Lenovo",
  "Lenovo NetApp Technology",
  "MinIO",
  "Nasuni",
  "NetApp",
  "NetApp AFF A-Series - All-flash",
  "NetApp Cloud",
  "NetApp C-Series",
  "NetApp E-Series",
  "NetApp FAS - Hybrid",
  "NetApp FlexPod",
  "NetApp StorageGRID",
  "No Competition",
  "No Incumbent",
  "Nutanix",
  "Nutanix Cloud",
  "Open EBS",
  "Oracle Exadata",
  "Other",
  "Other Cloud",
  "Panasas",
  "Pure Storage",
  "Quantum",
  "Qumulo",
  "Qumulo Cloud",
  "Red Hat OCS",
  "Robin Systems",
  "Rook w/ Ceph",
  "Rubrik",
  "Scality",
  "Silk (Kaminario)",
  "StorageOS",
  "StorOne",
  "Unknown",
  "VAST Data",
  "VMware",
  "Wasabi Technologies",
  "Whitebox DAS"
];

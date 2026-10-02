// Dados do Deal Registration da VARONIS — mapeados do portal. Industry e Deal Reg Type têm
// rótulo bilíngue (EN — PT); Salutation e Company Size ficam verbatim (honoríficos / faixas).
// Usados no Passo 2 do RO quando o fabricante é "Varonis".
//
// Campos comuns do Passo 1 NÃO se repetem: First/Last Name -> responsavel_nome, Job Title ->
// responsavel_cargo, Company -> empresa, Email -> responsavel_email, Business Phone ->
// responsavel_telefone, Address -> endereco_empresa, Deal Reg Estimated Closed Date -> data_fechamento.

// Salutation — tratamento do contato (PT/EN/alemão/francês). Verbatim (valor do portal).
export const VARONIS_SALUTATION: string[] = [
  "--None--",
  "Mr.",
  "Ms.",
  "Mrs.",
  "Dr.",
  "Prof.",
  "Sr.",
  "Sra.",
  "Frau",
  "Herr",
  "M.",
  "Mme",
];

// Deal Reg Type — tipo de registro de oportunidade.
export const VARONIS_DEAL_REG_TYPE: string[] = [
  "New Business — novo negócio (cliente/projeto novo)",
  "Upsell — expansão/venda adicional em cliente existente",
];

// Company Size — porte da empresa (nº de funcionários). Verbatim (faixas do portal).
export const VARONIS_COMPANY_SIZE: string[] = [
  "0-250",
  "251-500",
  "501-750",
  "751-1,000",
  "1,001-1,500",
];

// Industry — setor do cliente (rótulo EN — PT; a parte EN bate com a opção do portal).
export const VARONIS_INDUSTRY: string[] = [
  "Aerospace — Aeroespacial",
  "Agriculture — Agricultura",
  "Automotive — Automotivo",
  "Business Services — Serviços empresariais",
  "Communications — Comunicações",
  "Construction & Engineering — Construção e Engenharia",
  "Education - Higher Education — Educação - Ensino Superior",
  "Education - K-12 — Educação - Básica (K-12)",
  "Education — Educação",
  "Energy - Utilities - Mining — Energia - Utilities - Mineração",
  "Entertainment & Media — Entretenimento e Mídia",
  "Financial Services — Serviços Financeiros",
  "Food & Beverage — Alimentos e Bebidas",
  "Gaming — Jogos",
  "Government - Non U.S. — Governo - Fora dos EUA",
  "Government - Federal — Governo - Federal",
  "Government - State and Local — Governo - Estadual e Municipal",
  "Healthcare — Saúde",
  "Insurance — Seguros",
  "Legal — Jurídico",
  "Manufacturing & Chemical — Indústria e Química",
  "Marketing & Design — Marketing e Design",
  "Non-Profit — Sem fins lucrativos",
  "Other — Outro",
  "Pharmaceuticals — Farmacêutico",
  "Real Estate — Imobiliário",
  "Retail — Varejo",
  "Technology & Research — Tecnologia e Pesquisa",
  "Transportation — Transporte",
  "Travel & Leisure — Viagem e Lazer",
];

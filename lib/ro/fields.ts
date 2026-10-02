// Definições dos campos POR FABRICANTE do RO — compartilhadas entre o AM (ROCreate)
// e o Pré-vendas (ROProcessoView, que completa a parte técnica). Centralizado aqui para
// reuso e para o toggle de idioma PT/EN.
import { PAISES, CHECKPOINT_DISTRIBUIDORES, CHECKPOINT_PRODUCT_INTEREST, CHECKPOINT_CONCORRENTES, CHECKPOINT_LEAD_SOURCES, CHECKPOINT_CONTACT_TYPE } from "@/lib/ro/checkpoint";
import { PURE_DEAL_TYPE, PURE_DELIVERY_OWNER, PURE_CAPACITY, PURE_PRODUCTS, PURE_SOLUTION_CATEGORY, PURE_COMPELLING_EVENTS, PURE_BUDGET_STATUS, PURE_DISTRIBUTORS, PURE_TAKEOUT_VENDORS } from "@/lib/ro/purestorage";
import { TM_DEAL_TYPE, TM_INDUSTRY, TM_COMPANY_SIZE, TM_PRODUCTS, TM_DISTRIBUTORS, TM_COMPETITORS, TM_INFRA, TM_CAMPAIGNS } from "@/lib/ro/trendmicro";
import { HPE_MOEDA, HPE_NUMERO_USUARIOS, HPE_FUNCAO_CONTATO } from "@/lib/ro/hpe";
import { COHESITY_DISTRIBUTORS, COHESITY_PRODUCTS, COHESITY_OPPORTUNITY_ORIGIN, COHESITY_REASONS_FOR_PURCHASE, COHESITY_PRIMARY_USE_CASE, COHESITY_CONSUMPTION_MODEL, COHESITY_STORAGE_VENDORS, COHESITY_MARKETING_ACTIVITY } from "@/lib/ro/cohesity";
import { NUTANIX_SOFTWARE_PRODUCTS, NUTANIX_THIRD_PARTY_HW, NUTANIX_GEO, NUTANIX_DISTRIBUTORS, NUTANIX_OPP_STATUS } from "@/lib/ro/nutanix";
import { VARONIS_SALUTATION, VARONIS_DEAL_REG_TYPE, VARONIS_COMPANY_SIZE, VARONIS_INDUSTRY } from "@/lib/ro/varonis";
import { ZSCALER_SUBMISSION_TYPE, ZSCALER_BANT, ZSCALER_ROLE_TITLE, ZSCALER_COMPETITOR, ZSCALER_PRODUCT_FAMILY } from "@/lib/ro/zscaler";
import { CYBERARK_PRIMARY_SOLUTION, CYBERARK_CURRENCY, CYBERARK_CUSTOMER_STATUS } from "@/lib/ro/cyberark";
import { TENABLE_DEAL_REG_TYPE, TENABLE_PRODUCTS, TENABLE_BUDGET, TENABLE_COUNTRY } from "@/lib/ro/tenable";
import { FORTINET_DEAL_REG_TYPE, FORTINET_NEW_PRODUCT, FORTINET_VALUE, FORTINET_IT_OT, FORTINET_SECURITY_SOLUTIONS } from "@/lib/ro/fortinet";
import { CLOUDFLARE_SOLUTIONS, CLOUDFLARE_USE_CASE, CLOUDFLARE_BUDGET_DISCUSSED } from "@/lib/ro/cloudflare";
import { GIGAMON_COMPETITORS, GIGAMON_DEAL_REG_SOURCE, GIGAMON_PRODUCT_FAMILY, GIGAMON_CURRENT_ENVIRONMENT } from "@/lib/ro/gigamon";
import { ELASTIC_TRANSACTION_TYPE, ELASTIC_CONTACT_ROLE, ELASTIC_USE_CASES, ELASTIC_PRIMARY_SOLUTION, ELASTIC_DELIVERY_TYPE, ELASTIC_DEAL_SIZE, ELASTIC_QUALIFY_STEPS, ELASTIC_HELP_FORWARD, ELASTIC_WHY_CONTACTED } from "@/lib/ro/elastic";
import { VECTRA_DISTRIBUTOR } from "@/lib/ro/vectra";

// Tipos: text | textarea | bool (Sim/Não) | multiselect (com options) | select.
// label vem como "Termo EN — explicação PT" para entender sem dominar inglês (toggle PT/EN usa isso).
// showIf: renderiza o campo só quando outro campo tem um valor (ex.: concorrente substituído).
export type FabField = { key: string; label: string; tipo: "text" | "textarea" | "bool" | "multiselect" | "select" | "produtos_qtd" | "lenovo_produtos_qtd"; options?: string[]; hint?: string; showIf?: { key: string; equals: string } };

// Genérico (fabricante sem mapeamento específico): nada além do Passo 1 comum.
export const FAB_FIELDS_GENERICO: FabField[] = [];

// F5 NETWORKS — Partner Central (Deal Registration). End User Info já vem do Passo 1.
const F5_PRODUCTS = [
  "AI Guardrails", "AI Red Team", "Aspen Mesh",
  "BIG-IP Access Policy Manager APM", "BIG-IP Advanced Firewall Manager AFM", "BIG-IP Advanced WAF",
  "BIG-IP DNS", "BIG-IP iSeries Appliances", "BIG-IP LTM", "BIG-IP VELOS", "BIG-IP VIPRION",
  "BIG-IP Virtual Edition", "BIG-IP rSeries Appliances", "BIG-IQ",
  "Distributed Cloud Account Protection", "Distributed Cloud App Stack", "Distributed Cloud Aggregator Management",
  "Distributed Cloud Authentication Intelligence", "Distributed Cloud Bot Defense", "Distributed Cloud Client-Side Defense",
  "Distributed Cloud Mesh", "Distributed Cloud WAAP", "F5 MobileSafe", "F5 WebSafe",
  "NGINX Controller", "NGINX App Protect", "NGINX Plus", "NGINX Unit", "Silverline", "SSL Orchestrator",
  "Advanced WAF", "Beacon", "BIG-IP Application Security Manager ASM", "BIG-IP Cloud Edition CE",
  "DDoS Hybrid Defender", "F5 Cloud Services", "F5 DataSafe", "IP Intelligence Services IPI",
  "NGINX Open Source", "Secure Web Gateway SWG", "Shape DeviceID+", "Shape Security", "Volterra",
];
export const FAB_FIELDS_F5: FabField[] = [
  { key: "registered_products", label: "Registered Products — produtos F5", tipo: "multiselect", options: F5_PRODUCTS },
  { key: "f5_marketing_funding", label: "F5 Marketing Funding — resultado de verba de marketing?", tipo: "bool" },
  { key: "f5_joint_visit", label: "F5 Joint Visit — requer visita conjunta com a F5?", tipo: "bool" },
];

// CHECK POINT — Deal Registration. Empresa/e-mail e valor já vêm do Passo 1.
export const FAB_FIELDS_CHECKPOINT: FabField[] = [
  { key: "product_interest", label: "Product Interest — tipos de deal (marque um ou mais)", tipo: "multiselect", options: CHECKPOINT_PRODUCT_INTEREST },
  { key: "cp_lead_source", label: "Deal Registration source — origem do lead", tipo: "select", options: CHECKPOINT_LEAD_SOURCES },
  { key: "cp_distributor", label: "Distributor — distribuidor Check Point", tipo: "select", options: CHECKPOINT_DISTRIBUIDORES },
  { key: "cp_country", label: "Country — país", tipo: "select", options: PAISES },
  { key: "cp_competitive_replacement", label: "Competitive Replacement — concorrente substituído (se houver)", tipo: "select", options: CHECKPOINT_CONCORRENTES },
  { key: "cp_budget", label: "Budget — orçamento aprovado e valor estimado", tipo: "textarea" },
  { key: "cp_authority", label: "Authority — tomador de decisão (nome, cargo, papel)", tipo: "textarea" },
  { key: "cp_need", label: "Need — desafio de negócio, dor do cliente ou caso de uso", tipo: "textarea" },
  { key: "cp_timeline", label: "Timeline — prazo esperado, marcos e datas críticas", tipo: "textarea" },
  { key: "cp_partner_contact_type_1", label: "Primary Partner Contact Type", tipo: "select", options: CHECKPOINT_CONTACT_TYPE },
  { key: "cp_partner_email_1", label: "Primary Partner Contact Email", tipo: "text", hint: "obrigatório" },
  { key: "cp_partner_first_name_1", label: "Primary Partner Contact First Name", tipo: "text", hint: "obrigatório" },
  { key: "cp_partner_last_name_1", label: "Primary Partner Contact Last Name", tipo: "text", hint: "obrigatório" },
  { key: "cp_partner_country_1", label: "Primary Partner Contact Country", tipo: "select", options: PAISES },
  { key: "cp_partner_phone_1", label: "Primary Partner Contact Phone Number", tipo: "text" },
  { key: "cp_partner_contact_type_2", label: "Secondary Partner Contact Type", tipo: "select", options: CHECKPOINT_CONTACT_TYPE },
  { key: "cp_partner_email_2", label: "Secondary Partner Contact Email", tipo: "text" },
  { key: "cp_partner_first_name_2", label: "Secondary Partner Contact First Name", tipo: "text" },
  { key: "cp_partner_last_name_2", label: "Secondary Partner Contact Last Name", tipo: "text" },
  { key: "cp_partner_country_2", label: "Secondary Partner Contact Country", tipo: "select", options: PAISES },
  { key: "cp_partner_phone_2", label: "Secondary Partner Contact Phone Number", tipo: "text" },
];

// PURE STORAGE — Deal Registration. Rótulos bilíngues (EN — explicação PT).
export const FAB_FIELDS_PURESTORAGE: FabField[] = [
  { key: "pure_deal_type", label: "Deal Type — tipo de negócio", tipo: "select", options: PURE_DEAL_TYPE, hint: "obrigatório" },
  { key: "pure_delivery_owner", label: "Delivery Owner — responsável pela entrega/instalação", tipo: "select", options: PURE_DELIVERY_OWNER },
  { key: "pure_capacity", label: "Opportunity Capacity — capacidade da oportunidade", tipo: "select", options: PURE_CAPACITY, hint: "obrigatório" },
  { key: "pure_products", label: "Proposed Products — produtos propostos", tipo: "multiselect", options: PURE_PRODUCTS, hint: "obrigatório — pode marcar vários" },
  { key: "pure_solution_category", label: "Solution Category — categoria da solução", tipo: "multiselect", options: PURE_SOLUTION_CATEGORY, hint: "obrigatório — pode marcar vários" },
  { key: "pure_compelling_event", label: "Compelling Event — gatilho do projeto", tipo: "select", options: PURE_COMPELLING_EVENTS, hint: "obrigatório" },
  { key: "pure_budget_status", label: "Budget Status — status do orçamento", tipo: "select", options: PURE_BUDGET_STATUS, hint: "obrigatório" },
  { key: "pure_notes", label: "Notes to PAM or AE — notas p/ gerente de canais/executivo", tipo: "textarea", hint: "justifique a autoria do negócio, as dores do cliente, softwares correlatos (hipervisor/backup) e pedido de margem" },
  { key: "pure_partner_ae", label: "Partner AE — executivo de vendas da revenda", tipo: "text", hint: "obrigatório" },
  { key: "pure_partner_se", label: "Partner SE — engenheiro técnico da revenda", tipo: "text" },
  { key: "pure_distributor", label: "Distributor Account — distribuidor parceiro", tipo: "select", options: PURE_DISTRIBUTORS, hint: "obrigatório — ex.: Arrow, TD Synnex" },
  { key: "pure_channel_am", label: "Channel Account Manager — PAM da Pure que atende seu canal", tipo: "text" },
  { key: "pure_takeout", label: "Request for Competitive Takeout — vai substituir um concorrente?", tipo: "bool", hint: "marque Sim se o projeto remove um hardware concorrente ativo do cliente" },
  { key: "pure_takeout_vendor", label: "Competitive Takeout Vendor — concorrente a ser substituído", tipo: "select", options: PURE_TAKEOUT_VENDORS, showIf: { key: "pure_takeout", equals: "Sim" } },
  { key: "pure_most_wanted", label: "Attach Most Wanted Appointment — vincular à campanha Most Wanted?", tipo: "bool" },
];

// TREND MICRO — Deal Registration. Dados de cliente/contato comuns vêm do Passo 1; aqui o que é
// exclusivo do fabricante (incluindo Industry/Company size/Website, que o portal da Trend exige).
export const FAB_FIELDS_TRENDMICRO: FabField[] = [
  { key: "tm_deal_type", label: "Deal type — tipo de deal", tipo: "select", options: TM_DEAL_TYPE, hint: "obrigatório" },
  { key: "tm_website", label: "Website — site do cliente", tipo: "text", hint: "obrigatório" },
  { key: "tm_industry", label: "Industry — setor do cliente", tipo: "select", options: TM_INDUSTRY, hint: "obrigatório" },
  { key: "tm_company_size", label: "Company size — porte (nº de funcionários)", tipo: "select", options: TM_COMPANY_SIZE, hint: "obrigatório" },
  { key: "tm_distributor", label: "Distributor — distribuidor", tipo: "select", options: TM_DISTRIBUTORS, hint: "obrigatório" },
  { key: "tm_product", label: "Product — produtos Trend Micro (um a um, com licenças)", tipo: "produtos_qtd", options: TM_PRODUCTS, hint: "busque o produto, informe as licenças e Adicionar. Pode juntar TippingPoint com outros — o Mapper separa em tarefas diferentes automaticamente (regra da Trend Micro)" },
  { key: "tm_infra", label: "Infrastructure/Cloud applications — infraestrutura/nuvem do cliente", tipo: "select", options: TM_INFRA, hint: "obrigatório" },
  { key: "tm_competitor", label: "Competitor — concorrente no deal", tipo: "select", options: TM_COMPETITORS, hint: "obrigatório" },
  { key: "tm_campaign", label: "Campaign — campanha", tipo: "select", options: TM_CAMPAIGNS, hint: "obrigatório" },
  { key: "tm_partner_first", label: "Partner — nome (responsável ENTERPRISECORE pelo deal)", tipo: "text", hint: "obrigatório — futuramente: selecionar da equipe" },
  { key: "tm_partner_last", label: "Partner — sobrenome", tipo: "text", hint: "obrigatório" },
  { key: "tm_partner_email", label: "Partner — e-mail", tipo: "text", hint: "obrigatório" },
  { key: "tm_partner_phone", label: "Partner — telefone", tipo: "text", hint: "obrigatório" },
  { key: "tm_partner_extra_emails", label: "Additional inform list — e-mails extras a notificar (vários)", tipo: "multiselect", options: [], hint: "digite cada e-mail e tecle Enter para adicionar" },
];

// HPE — Deal Registration. Etapa 1 (Criação da Conta/Cliente) + Etapa 2 (Registro da
// Oportunidade). Dados comuns (nome da oportunidade, empresa, responsável, endereço, EB,
// champion, dor, valor, data de fechamento, descrição) já vêm do Passo 1; aqui o que é
// EXCLUSIVO do portal HPE. "Site do Cliente" e "Razão Social" da Etapa 2 são read-only
// (auto-preenchidos do "Nome do cliente"), por isso não viram campo editável.
export const FAB_FIELDS_HPE: FabField[] = [
  { key: "hpe_pais", label: "País — país do cliente (Etapa 1)", tipo: "select", options: PAISES, hint: "obrigatório — Selecione um país" },
  { key: "hpe_city", label: "City — cidade do cliente (Etapa 1)", tipo: "text", hint: "obrigatório" },
  { key: "hpe_estado", label: "Estado — estado/UF do cliente (Etapa 1)", tipo: "text", hint: "opcional — no portal é um dropdown que depende do País; digite o estado/UF" },
  { key: "hpe_cep", label: "CEP/Código Postal — código postal do cliente (Etapa 1)", tipo: "text" },
  { key: "hpe_site_conta", label: "Site (relacionado ao nome e endereço da Conta que você deseja criar) — site/URL da conta (Etapa 1)", tipo: "text", hint: "obrigatório" },
  { key: "hpe_identificador_fiscal", label: "Identificadores fiscais ou externos — ex.: CNPJ (Etapa 1)", tipo: "text", hint: "ex.: CNPJ ou outro identificador fiscal/externo" },
  { key: "hpe_moeda", label: "Moeda — moeda da oportunidade (Etapa 2)", tipo: "select", options: HPE_MOEDA, hint: "padrão USD - Dólar dos EUA" },
  { key: "hpe_numero_usuarios", label: "Número de usuários — faixa de usuários do cliente (Etapa 2)", tipo: "select", options: HPE_NUMERO_USUARIOS },
  { key: "hpe_msp_opportunity", label: "MSP Opportunity — produto será usado na entrega de serviços gerenciados? (Etapa 2)", tipo: "bool", hint: "By selecting this you acknowledge that the product(s) will be used in the delivery of your managed services, and you will retain title for a minimum of two (2) years. HPE reserves the right to audit." },
  { key: "hpe_funcao_contato", label: "Função do contato — papel do contato no cliente (Etapa 2)", tipo: "select", options: HPE_FUNCAO_CONTATO, hint: "Select Role" },
];

// COHESITY — Deal Registration. Dados comuns de cliente/contato/valor/datas vêm do Passo 1;
// aqui só o que é EXCLUSIVO do portal Cohesity (5 seções: Deal Contacts, End Customer extras,
// Deployment Location, Deal Identification and Transaction e Deal Details).
// NB: Contact Title NÃO entra aqui — já é o campo comum responsavel_cargo (Cargo) do Passo 1.
// NB: Region/State e Deployment Region/State são Dropdown dependente de país no portal, mas como
//     não há lista estática de estados/regiões mapeada, ficam como "text" (desvio consciente do doc).
export const FAB_FIELDS_COHESITY: FabField[] = [
  // SEÇÃO 1 — DEAL CONTACTS (pessoas da PRÓPRIA INTEGRADORA/PARCEIRO, não do cliente final)
  { key: "coh_partner_sales_rep", label: "Partner Sales Representative — AM (Account Manager) da integradora", tipo: "text", hint: "obrigatório — contato engajado no deal; se aplicável, qualifica para incentivos" },
  { key: "coh_partner_solution_engineer", label: "Partner Solution Engineer — Pré-venda/Engenheiro de Soluções da integradora", tipo: "text", hint: "obrigatório — contato engajado no deal" },
  { key: "coh_additional_partner_contact", label: "Additional Partner Contact — outro contato da integradora a acompanhar o deal", tipo: "text", hint: "opcional — pessoas que devem saber do status; aceita alias" },
  { key: "coh_cohesity_sales_rep", label: "Cohesity Sales Rep/System Engineer — rep. de vendas/eng. da própria Cohesity", tipo: "text", hint: "opcional" },
  // SEÇÃO 2 — END CUSTOMER INFORMATION (extras além dos campos comuns do Passo 1)
  // First/Last Name, Company Name, Contact Email/Phone e Contact Title vêm do Passo 1 (responsavel_*, empresa).
  { key: "coh_company_website", label: "Company Website — site da empresa cliente", tipo: "text", hint: "opcional" },
  { key: "coh_division", label: "Division — divisão/departamento/entidade do cliente", tipo: "text", hint: "obrigatório — ajuda a identificar a oportunidade" },
  { key: "coh_country", label: "Country — país do cliente final", tipo: "select", options: PAISES, hint: "obrigatório" },
  { key: "coh_region_state", label: "Region/State — região/estado (dropdown dependente do país no portal)", tipo: "text", hint: "opcional — no portal é lista dependente do Country" },
  { key: "coh_town_city", label: "Town/City — cidade do cliente final", tipo: "text", hint: "opcional" },
  { key: "coh_postal_code", label: "Postal/Zip Code — código postal do cliente final", tipo: "text", hint: "opcional" },
  { key: "coh_street_address", label: "Contact Street Address — logradouro do contato", tipo: "textarea", hint: "obrigatório" },
  // SEÇÃO 3 — DEPLOYMENT LOCATION (local de implantação)
  { key: "coh_deploy_same_address", label: "Same Address As Above? — usar o mesmo endereço do cliente final?", tipo: "bool", hint: "ao marcar, copia o endereço da Seção 2 para os campos de deployment" },
  { key: "coh_deploy_country", label: "Deployment Country — país de implantação", tipo: "select", options: PAISES, hint: "opcional" },
  { key: "coh_deploy_region_state", label: "Deployment Region/State — região/estado de implantação (dropdown dependente do país no portal)", tipo: "text", hint: "opcional — no portal é lista dependente do Deployment Country" },
  { key: "coh_deploy_town_city", label: "Deployment Town/City — cidade de implantação", tipo: "text", hint: "opcional" },
  { key: "coh_deploy_postal_code", label: "Deployment Postal/Zip Code — código postal de implantação", tipo: "text", hint: "opcional" },
  { key: "coh_deploy_street", label: "Deployment Street — logradouro de implantação", tipo: "textarea", hint: "obrigatório" },
  // SEÇÃO 4 — DEAL IDENTIFICATION AND TRANSACTION (6 perguntas Yes/No + distribuidor)
  { key: "coh_lead_identified_by_you", label: "Was This Lead Identified By You (Cohesity Partner)? — você (parceiro) identificou este lead?", tipo: "bool", hint: "obrigatório" },
  { key: "coh_already_engaged", label: "Are You Already Engaged With Cohesity On This Lead? — já está engajado com a Cohesity neste lead?", tipo: "bool", hint: "obrigatório" },
  { key: "coh_customer_rfi_rfp", label: "Is The Customer Asking For An RFI/RFP? — o cliente está pedindo RFI/RFP?", tipo: "bool", hint: "obrigatório" },
  { key: "coh_registering_other_vendors", label: "Have You Or Are You Planning On Registering This Opportunity With Any Other Vendors? — registrou/vai registrar esta oportunidade com outros fabricantes?", tipo: "bool", hint: "obrigatório" },
  { key: "coh_special_contract", label: "Will This Opportunity Require A Special Contract And/Or Purchasing Vehicle? — vai exigir contrato/veículo de compra especial?", tipo: "bool", hint: "obrigatório" },
  { key: "coh_marketing_activity", label: "Was This Customer Engaged In A Cohesity Supported Marketing Activity? — o cliente participou de ação de marketing apoiada pela Cohesity?", tipo: "select", options: COHESITY_MARKETING_ACTIVITY, hint: "obrigatório" },
  { key: "coh_preferred_distributor", label: "Preferred Distributor — distribuidor preferido", tipo: "select", options: COHESITY_DISTRIBUTORS, hint: "opcional" },
  // SEÇÃO 5 — DEAL DETAILS (detalhes do negócio; Estimated Close Date e Project Description vêm do Passo 1)
  { key: "coh_products", label: "Products — produtos Cohesity (lista Available → Chosen)", tipo: "multiselect", options: COHESITY_PRODUCTS, hint: "obrigatório — pode escolher vários" },
  { key: "coh_opportunity_origin", label: "Opportunity Origin — origem da oportunidade", tipo: "select", options: COHESITY_OPPORTUNITY_ORIGIN, hint: "obrigatório" },
  { key: "coh_reasons_for_purchase", label: "Reasons For Purchase — motivos da compra (Available → Chosen)", tipo: "multiselect", options: COHESITY_REASONS_FOR_PURCHASE, hint: "obrigatório — pode escolher vários" },
  { key: "coh_primary_use_case", label: "Primary Use Case — caso de uso principal", tipo: "select", options: COHESITY_PRIMARY_USE_CASE, hint: "obrigatório" },
  { key: "coh_consumption_model", label: "Preferred Consumption Model — modelo de consumo preferido", tipo: "select", options: COHESITY_CONSUMPTION_MODEL, hint: "obrigatório" },
  { key: "coh_storage_vendors", label: "Existing Production Use Storage Vendors — storages em produção hoje (Available → Chosen)", tipo: "multiselect", options: COHESITY_STORAGE_VENDORS, hint: "obrigatório — selecione os existentes ou 'None'; se houver outros, cite na Descrição" },
];

// NUTANIX — Deal Registration. Campos comuns do Passo 1 (oportunidade, empresa, responsável,
// data de fechamento = Estimated Close Date, valor = Estimated Revenue) NÃO se repetem.
// "Other Notes / Comments" é onde se cola o bloco-modelo do Bitrix (a tool já gera esse bloco no topo do copyblock).
export const FAB_FIELDS_NUTANIX: FabField[] = [
  { key: "nut_engaged", label: "Are you or your partner actively engaged with the end customer? — você/parceiro está ativamente engajado com o cliente final?", tipo: "bool", hint: "obrigatório" },
  { key: "nut_engagement_desc", label: "Briefly describe the engagement — descreva brevemente o engajamento", tipo: "textarea", hint: "obrigatório" },
  { key: "nut_met_customer", label: "Have you met with the Customer to discuss this opportunity? — você já se reuniu com o cliente sobre esta oportunidade?", tipo: "bool", hint: "obrigatório" },
  { key: "nut_challenge", label: "Has the customer expressed a specific challenge or goal Nutanix can address? — o cliente expressou um desafio/objetivo que a Nutanix resolve?", tipo: "bool", hint: "obrigatório" },
  { key: "nut_challenge_summary", label: "Summarize in one sentence — resuma em uma frase", tipo: "textarea", hint: "obrigatório" },
  { key: "nut_reviewed_reqs", label: "Have you reviewed Nutanix product/service requirements with the customer? — você revisou os requisitos de produto/serviço Nutanix com o cliente?", tipo: "bool", hint: "obrigatório" },
  { key: "nut_key_requirements", label: "List key requirements — liste os principais requisitos", tipo: "textarea", hint: "obrigatório" },
  { key: "nut_budget", label: "Does the customer have the budget to make this purchase? — o cliente tem orçamento para esta compra?", tipo: "bool", hint: "obrigatório" },
  { key: "nut_public_tender", label: "Is this deal a Public Tender? — este negócio é uma licitação pública?", tipo: "bool", hint: "obrigatório" },
  { key: "nut_software_products", label: "Which Nutanix Software Products is the Customer Interested In? — quais produtos de software Nutanix interessam ao cliente", tipo: "multiselect", options: NUTANIX_SOFTWARE_PRODUCTS, hint: "obrigatório — pode marcar vários" },
  { key: "nut_third_party_hw", label: "What Third Party Hardware Are You Selling? — qual hardware de terceiros você está vendendo", tipo: "select", options: NUTANIX_THIRD_PARTY_HW, hint: "obrigatório" },
  { key: "nut_geo", label: "What GEO are you located in? — em qual região você está", tipo: "select", options: NUTANIX_GEO, hint: "obrigatório — normalmente Americas" },
  { key: "nut_distributor", label: "Who is your preferred Distributor? — distribuidor preferido", tipo: "select", options: NUTANIX_DISTRIBUTORS, hint: "obrigatório" },
  { key: "nut_opp_status", label: "Opportunity Status — status da oportunidade", tipo: "select", options: NUTANIX_OPP_STATUS, hint: "já vem marcado como 1 - Qualifying" },
  { key: "nut_se_first", label: "Partner SE First Name — nome do SE (engenheiro) do parceiro", tipo: "text", hint: "obrigatório" },
  { key: "nut_se_last", label: "Partner SE Last Name — sobrenome do SE do parceiro", tipo: "text", hint: "obrigatório" },
  { key: "nut_se_email", label: "Partner SE Email — e-mail do SE do parceiro", tipo: "text", hint: "obrigatório" },
  { key: "nut_se_phone", label: "Partner SE Phone Number — telefone do SE do parceiro", tipo: "text", hint: "obrigatório" },
  { key: "nut_other_notes", label: "Other Notes / Comments — observações (cole aqui o bloco-modelo do Bitrix)", tipo: "textarea", hint: "junta as infos do processo: empresa, responsável, EB, champion, dor, distribuidor, produtos, qtd, concorrente, valor, data, descrição" },
];

// VARONIS — Deal Registration. Comuns do Passo 1 NÃO se repetem: First/Last Name -> responsavel_nome,
// Job Title -> responsavel_cargo, Company -> empresa, Email -> responsavel_email, Business Phone ->
// responsavel_telefone, Address -> endereco_empresa, Deal Reg Estimated Closed Date -> data_fechamento.
// "Deal Reg Comments" recebe o bloco-modelo do Bitrix (gerado no topo do copyblock).
export const FAB_FIELDS_VARONIS: FabField[] = [
  { key: "var_salutation", label: "Salutation — tratamento do contato (Mr./Ms./Sr./Sra./Frau...)", tipo: "select", options: VARONIS_SALUTATION },
  { key: "var_deal_reg_type", label: "Deal Reg Type — tipo de registro (novo negócio ou upsell)", tipo: "select", options: VARONIS_DEAL_REG_TYPE },
  { key: "var_company_size", label: "Company Size — porte da empresa (nº de funcionários)", tipo: "select", options: VARONIS_COMPANY_SIZE, hint: "obrigatório" },
  { key: "var_industry", label: "Industry — setor do cliente", tipo: "select", options: VARONIS_INDUSTRY, hint: "obrigatório" },
  { key: "var_meeting_date", label: "Partner Proposed Meeting Date — data de reunião proposta pelo parceiro", tipo: "text", hint: "opcional — dd/mm/aaaa" },
  { key: "var_deal_comments", label: "Deal Reg Comments — observações (cole aqui o bloco-modelo do Bitrix)", tipo: "textarea", hint: "junta as infos do processo: empresa, responsável, EB, champion, dor, distribuidor, produtos, qtd, concorrente, valor, data, descrição" },
];

// ZSCALER — Deal Registration. Comuns do Passo 1 NÃO se repetem: Customer Contact Email ->
// responsavel_email, Customer Name -> empresa, endereço -> endereco_empresa, First/Last Name ->
// responsavel_nome, Phone -> responsavel_telefone, Estimated Deal Amount -> valor_estimado_usd,
// Expected Close Date -> data_fechamento. "Deal Description" recebe o bloco-modelo do Bitrix.
export const FAB_FIELDS_ZSCALER: FabField[] = [
  { key: "zs_submission_type", label: "Submit a Deal — tipo de submissão", tipo: "select", options: ZSCALER_SUBMISSION_TYPE },
  { key: "zs_bant", label: "BANT Qualification — confirme o que o cliente tem (Budget/Authority/Need/Timing)", tipo: "multiselect", options: ZSCALER_BANT, hint: "obrigatório — marque pelo menos uma" },
  { key: "zs_role_title", label: "Role/Title — cargo do contato primário do cliente", tipo: "select", options: ZSCALER_ROLE_TITLE },
  { key: "zs_seats", label: "Number of Seats — número de assentos/licenças", tipo: "text", hint: "número" },
  { key: "zs_competitor_replacement", label: "Is the Customer replacing a Zscaler Competitor? — está substituindo um concorrente?", tipo: "select", options: ZSCALER_COMPETITOR },
  { key: "zs_product_family", label: "Product Family — famílias de produto Zscaler", tipo: "multiselect", options: ZSCALER_PRODUCT_FAMILY, hint: "pode marcar vários" },
  { key: "zs_rep_name", label: "Rep Name — nome do representante (parceiro ENTERPRISECORE)", tipo: "text" },
  { key: "zs_rep_email", label: "Rep Email — e-mail do representante", tipo: "text" },
  { key: "zs_se_name", label: "Sales Engineer Name — nome do SE (parceiro)", tipo: "text" },
  { key: "zs_se_email", label: "Sales Engineer Email — e-mail do SE", tipo: "text" },
  { key: "zs_alt_email1", label: "Partner Alternate Email 1 — e-mail alternativo do parceiro (opcional)", tipo: "text", hint: "opcional" },
  { key: "zs_alt_email2", label: "Partner Alternate Email 2 — e-mail alternativo do parceiro (opcional)", tipo: "text", hint: "opcional" },
  { key: "zs_alt_email3", label: "Partner Alternate Email 3 — e-mail alternativo do parceiro (opcional)", tipo: "text", hint: "opcional" },
  { key: "zs_deal_description", label: "Deal Description — observações (cole aqui o bloco-modelo do Bitrix)", tipo: "textarea", hint: "junta as infos do processo: empresa, responsável, EB, champion, dor, distribuidor, produtos, qtd, concorrente, valor, data, descrição" },
];

// CYBERARK — Deal Registration. Comuns do Passo 1 NÃO se repetem: Project Description ->
// descricao_proposta, Expected Close Date -> data_fechamento, Project Budget -> valor_estimado_usd,
// Company Name -> empresa, endereço -> endereco_empresa, Contact Title -> responsavel_cargo,
// First/Last Name -> responsavel_nome, Contact Email -> responsavel_email, Contact Phone -> responsavel_telefone.
export const FAB_FIELDS_CYBERARK: FabField[] = [
  { key: "ca_primary_solution", label: "Primary Solution — solução principal CyberArk", tipo: "select", options: CYBERARK_PRIMARY_SOLUTION, hint: "obrigatório" },
  { key: "ca_currency", label: "Currency — moeda do orçamento", tipo: "select", options: CYBERARK_CURRENCY, hint: "obrigatório" },
  { key: "ca_servers", label: "Number of Servers — número de servidores", tipo: "text", hint: "obrigatório — número" },
  { key: "ca_users", label: "Number of Users — número de usuários", tipo: "text", hint: "obrigatório — número" },
  { key: "ca_customer_status", label: "Customer Status — status do cliente", tipo: "select", options: CYBERARK_CUSTOMER_STATUS, hint: "obrigatório" },
];

// TENABLE — Deal Registration. Comuns do Passo 1 NÃO se repetem: Title -> responsavel_cargo,
// First/Last Name -> responsavel_nome, Phone -> responsavel_telefone, Email -> responsavel_email,
// Company -> empresa, Street/City/State/Zip -> endereco_empresa, Estimated Close Date -> data_fechamento.
// "Description" recebe o bloco-modelo do Bitrix.
export const FAB_FIELDS_TENABLE: FabField[] = [
  { key: "ten_deal_reg_type", label: "Is this an MSSP or Reseller Deal Registration? — tipo de registro", tipo: "select", options: TENABLE_DEAL_REG_TYPE, hint: "obrigatório" },
  { key: "ten_mobile_phone", label: "Mobile Phone — celular do contato", tipo: "text", hint: "obrigatório" },
  { key: "ten_website", label: "Website — site da empresa cliente", tipo: "text", hint: "obrigatório" },
  { key: "ten_country", label: "Country — país do cliente", tipo: "select", options: TENABLE_COUNTRY, hint: "já vem BR (padrão ENTERPRISECORE)" },
  { key: "ten_products", label: "Product Interest — produtos Tenable de interesse", tipo: "multiselect", options: TENABLE_PRODUCTS, hint: "pode marcar vários" },
  { key: "ten_ip_asset_count", label: "IP/Asset Count — quantidade de IPs/ativos", tipo: "text", hint: "obrigatório — número" },
  { key: "ten_budget", label: "Approved Budget Amount — faixa de orçamento aprovado", tipo: "select", options: TENABLE_BUDGET, hint: "obrigatório" },
  { key: "ten_proserv", label: "Will Partner provide ProServ? — o parceiro vai prestar serviços profissionais?", tipo: "bool", hint: "obrigatório" },
  { key: "ten_reseller_contact", label: "Reseller Sales Contact — contato de vendas do revendedor (ENTERPRISECORE)", tipo: "text", hint: "obrigatório" },
  { key: "ten_reseller_email", label: "Reseller Sales Email Address — e-mail de vendas do revendedor", tipo: "text", hint: "obrigatório" },
  { key: "ten_reseller_phone", label: "Reseller Sales Contact Phone — telefone de vendas do revendedor", tipo: "text", hint: "obrigatório" },
  { key: "ten_description", label: "Description — observações (cole aqui o bloco-modelo do Bitrix)", tipo: "textarea", hint: "junta as infos do processo: empresa, responsável, EB, champion, dor, distribuidor, produtos, qtd, concorrente, valor, data, descrição" },
];

// FORTINET — Deal Registration (também cobre "Fortinet SASE", mesmo portal). Comuns do Passo 1
// NÃO se repetem: Company -> empresa, endereço/Country -> endereco_empresa, First/Last Name ->
// responsavel_nome, Email -> responsavel_email, Title -> responsavel_cargo, Phone ->
// responsavel_telefone, Estimated Close Date -> data_fechamento. "Description" recebe o bloco-modelo.
// O aceite dos T&Cs do portal NÃO entra no RO.
export const FAB_FIELDS_FORTINET: FabField[] = [
  { key: "ft_oot", label: "Does it have products bound for countries outside of your country? — produtos destinados a fora do seu país?", tipo: "bool", hint: "ATENÇÃO: se houver produtos/serviços p/ re-exportação ou consumo fora do país de faturamento do parceiro, o deal NÃO pode ser submetido aqui — solicitar exceção Out-of-Territory (OOT) por e-mail a outofterritory@fortinet.com (nome do end user, países, BOM por país, distribuidor desejado)." },
  { key: "ft_website", label: "Website — site da empresa cliente", tipo: "text", hint: "obrigatório" },
  { key: "ft_deal_reg_type", label: "Deal Reg Type — tipo de registro", tipo: "select", options: FORTINET_DEAL_REG_TYPE, hint: "obrigatório" },
  { key: "ft_new_product", label: "Is this a Deal Reg for new product? — novo registro ou renovação?", tipo: "select", options: FORTINET_NEW_PRODUCT, hint: "obrigatório" },
  { key: "ft_value", label: "Estimated Value in $USD — faixa de valor estimado (US$)", tipo: "select", options: FORTINET_VALUE, hint: "obrigatório" },
  { key: "ft_sdwan", label: "Is this an SD-WAN Opportunity? — é uma oportunidade de SD-WAN?", tipo: "bool", hint: "obrigatório" },
  { key: "ft_it_ot", label: "Is this an IT or OT Opportunity? — oportunidade de TI, OT ou convergente?", tipo: "select", options: FORTINET_IT_OT, hint: "obrigatório" },
  { key: "ft_security_solutions", label: "Which Security Solutions are included? — soluções de segurança incluídas", tipo: "multiselect", options: FORTINET_SECURITY_SOLUTIONS, hint: "obrigatório — pode marcar várias" },
  { key: "ft_distributor", label: "Distributor — distribuidor (digite o nome)", tipo: "text", hint: "obrigatório" },
  { key: "ft_description", label: "Description — observações (cole aqui o bloco-modelo do Bitrix)", tipo: "textarea", hint: "junta as infos do processo: empresa, responsável, EB, champion, dor, distribuidor, produtos, qtd, concorrente, valor, data, descrição" },
];

// CLOUDFLARE — Deal Registration. Comuns do Passo 1 NÃO se repetem: Company -> empresa, endereço ->
// endereco_empresa, contato -> responsavel_*, Estimated Deal Value -> valor_estimado_usd, Expected
// Close Date -> data_fechamento. (Cloudflare não tem campo de "comments/modelo" próprio mapeado; se
// houver após o botão "Next", incluir depois — por ora o bloco-modelo fica no topo do copyblock.)
export const FAB_FIELDS_CLOUDFLARE: FabField[] = [
  { key: "cf_through_distributor", label: "Are you transacting through Distributor for this deal? — vai transacionar via distribuidor?", tipo: "bool", hint: "obrigatório" },
  { key: "cf_reseller_first", label: "Reseller Sales Rep First Name — nome do rep de vendas do revendedor", tipo: "text", hint: "obrigatório" },
  { key: "cf_reseller_last", label: "Reseller Sales Rep Last Name — sobrenome do rep", tipo: "text", hint: "obrigatório" },
  { key: "cf_reseller_email", label: "Reseller Sales Rep Email — e-mail do rep", tipo: "text", hint: "obrigatório" },
  { key: "cf_reseller_se", label: "Was a Reseller SE involved in this deal? — houve SE do revendedor envolvido?", tipo: "bool", hint: "obrigatório" },
  { key: "cf_website", label: "Website — site da empresa cliente", tipo: "text", hint: "obrigatório" },
  { key: "cf_under_attack", label: "Is the Customer Under Attack? — o cliente está sob ataque?", tipo: "bool", hint: "obrigatório" },
  { key: "cf_solutions", label: "What type of solution have you discussed with the customer? — soluções discutidas", tipo: "multiselect", options: CLOUDFLARE_SOLUTIONS, hint: "obrigatório — pode marcar várias" },
  { key: "cf_public_sector", label: "Is this deal registration for a public sector opportunity? — é oportunidade de setor público?", tipo: "bool", hint: "obrigatório" },
  { key: "cf_primary_use_case", label: "Primary Use case — caso de uso principal", tipo: "select", options: CLOUDFLARE_USE_CASE, hint: "obrigatório" },
  { key: "cf_use_case_detail", label: "Primary Use Case Detail — detalhe do caso de uso", tipo: "textarea", hint: "obrigatório" },
  { key: "cf_budget_discussed", label: "Was budget discussed? — orçamento foi discutido?", tipo: "select", options: CLOUDFLARE_BUDGET_DISCUSSED, hint: "obrigatório" },
  { key: "cf_marketing_spiff", label: "Did a marketing campaign or SPIFF contribute to this opportunity? — campanha de marketing/SPIFF contribuiu?", tipo: "bool", hint: "obrigatório" },
];

// GIGAMON — Deal Registration. Comuns do Passo 1 NÃO se repetem: Project Name -> nome_oportunidade,
// Project Budget Amount -> valor_estimado_usd, Project Description -> descricao_proposta, Estimated
// Close Date -> data_fechamento, Company -> empresa, contato -> responsavel_*, endereço -> endereco_empresa.
// "Gigamon Product Family" (select) e "Customer's Current Environment" (multiselect) já com as opções do portal (ambos opcionais).
export const FAB_FIELDS_GIGAMON: FabField[] = [
  { key: "gig_ecosystem_partner", label: "Is Ecosystem Partner Involved? — há parceiro de ecossistema envolvido?", tipo: "bool", hint: "obrigatório" },
  { key: "gig_ecosystem_partner_who", label: "Ecosystem Partner Involved — qual parceiro de ecossistema", tipo: "text", hint: "se sim, qual" },
  { key: "gig_interest_driver", label: "What is Driving the Customer's Interest in Gigamon? — o que motiva o interesse do cliente", tipo: "textarea" },
  { key: "gig_product_family", label: "Gigamon Product Family — família de produto", tipo: "select", options: GIGAMON_PRODUCT_FAMILY, hint: "opcional" },
  { key: "gig_competitors", label: "Gigamon Competitors — concorrentes no deal", tipo: "multiselect", options: GIGAMON_COMPETITORS, hint: "obrigatório — pode marcar vários" },
  { key: "gig_current_environment", label: "Customer's Current Environment — ambiente atual do cliente", tipo: "multiselect", options: GIGAMON_CURRENT_ENVIRONMENT, hint: "opcional — pode marcar vários" },
  { key: "gig_deal_reg_source", label: "Deal Registration Source — origem do registro", tipo: "select", options: GIGAMON_DEAL_REG_SOURCE, hint: "obrigatório" },
  { key: "gig_website", label: "Website — site da empresa cliente", tipo: "text", hint: "obrigatório" },
  { key: "gig_reseller_salesperson", label: "Reseller Salesperson — vendedor do revendedor (ENTERPRISECORE)", tipo: "text", hint: "obrigatório" },
  { key: "gig_distributor", label: "Distributor — distribuidor (ex.: TD SYNNEX Brasil Ltda.)", tipo: "text" },
  { key: "gig_distributor_contact", label: "Distributor Contact — contato no distribuidor", tipo: "text" },
  { key: "gig_marketing_campaign", label: "Gigamon Marketing Campaign — campanha de marketing (se houver)", tipo: "text" },
];

// ELASTIC — Deal Registration. Comuns do Passo 1 NÃO se repetem: Prospect Company Name -> empresa,
// endereço -> endereco_empresa, First/Last Name -> responsavel_nome, Email -> responsavel_email,
// Contact Title -> responsavel_cargo, Contact Phone -> responsavel_telefone.
export const FAB_FIELDS_ELASTIC: FabField[] = [
  { key: "el_transaction_type", label: "Transaction Type — tipo de transação", tipo: "select", options: ELASTIC_TRANSACTION_TYPE, hint: "obrigatório" },
  { key: "el_elastic_rep", label: "Are you in touch with an Elastic Representative? If so, input name — está em contato com um rep da Elastic? qual?", tipo: "text" },
  { key: "el_public_sector", label: "Is Prospect Public Sector customer? — o prospect é cliente do setor público?", tipo: "bool", hint: "obrigatório (True/False)" },
  { key: "el_rfp_tender", label: "Is the registration related to RFP/Tender? — o registro é relacionado a RFP/licitação?", tipo: "bool", hint: "obrigatório" },
  { key: "el_renewal", label: "Is this a Renewal Deal? — é um deal de renovação?", tipo: "bool", hint: "True/False" },
  { key: "el_num_employees", label: "Number of Employees — número de funcionários do prospect", tipo: "text", hint: "número" },
  { key: "el_contact_role", label: "Prospect Contact Role — papel do contato", tipo: "select", options: ELASTIC_CONTACT_ROLE, hint: "obrigatório" },
  { key: "el_willing_to_speak", label: "Is the prospect willing to speak with Elastic? If no, please list why — o prospect topa falar com a Elastic? se não, por quê", tipo: "text", hint: "obrigatório" },
  { key: "el_why_contacted_select", label: "Select Why Customer Contacted — por que o cliente foi contatado (selecione)", tipo: "select", options: ELASTIC_WHY_CONTACTED },
  { key: "el_why_contacted_reason", label: "Reason Why Customer Contacted — motivo (texto livre)", tipo: "text" },
  { key: "el_dnb_number", label: "End-customer's D&B number (if known) — número D&B do cliente final, se souber", tipo: "text" },
  { key: "el_use_cases", label: "Use cases — casos de uso", tipo: "multiselect", options: ELASTIC_USE_CASES, hint: "pode marcar vários" },
  { key: "el_primary_solution", label: "Primary Solution — solução principal", tipo: "select", options: ELASTIC_PRIMARY_SOLUTION, hint: "obrigatório" },
  { key: "el_delivery_type", label: "Delivery type — tipo de entrega", tipo: "select", options: ELASTIC_DELIVERY_TYPE, hint: "obrigatório" },
  { key: "el_deal_size", label: "Estimated deal size in USD — tamanho estimado do deal (US$)", tipo: "select", options: ELASTIC_DEAL_SIZE, hint: "obrigatório" },
  { key: "el_qualify_steps", label: "What steps did you take to qualify this opportunity? — passos para qualificar a oportunidade", tipo: "select", options: ELASTIC_QUALIFY_STEPS, hint: "obrigatório" },
  { key: "el_help_forward", label: "How Elastic can help you move forward — como a Elastic pode ajudar (POC, quote, serviços...)", tipo: "select", options: ELASTIC_HELP_FORWARD },
];

// VECTRA — Deal Registration. Comuns do Passo 1 NÃO se repetem: Deal Name -> nome_oportunidade,
// Amount (NACV) -> valor_estimado_usd, Close Date -> data_fechamento, Champion -> champion,
// Economic Buyer -> economic_buyer, End User Account -> cliente comum (Search Customer List).
// "Include additional details" recebe o bloco-modelo do Bitrix.
export const FAB_FIELDS_VECTRA: FabField[] = [
  { key: "vec_use_distributor", label: "Select Distributor — vai usar distribuidor?", tipo: "bool", hint: "obrigatório" },
  { key: "vec_distributor", label: "Distributor — distribuidor", tipo: "select", options: VECTRA_DISTRIBUTOR, hint: "se Sim, a única opção é CLM Tech", showIf: { key: "vec_use_distributor", equals: "Sim" } },
  { key: "vec_partner_se_name", label: "Partner technical sales contact name — contato técnico de vendas do parceiro (First & Last)", tipo: "text" },
  { key: "vec_partner_owns_license", label: "Partner owns HW/SW Title/License — o parceiro detém o título/licença de HW/SW?", tipo: "bool" },
  { key: "vec_partner_managed_service", label: "Partner Providing Managed Service — parceiro presta serviço gerenciado?", tipo: "bool" },
  { key: "vec_tech_decision_maker", label: "Technical Decision Maker — decisor técnico", tipo: "text" },
  { key: "vec_concurrent_ips", label: "Number of Concurrent IPs — número de IPs concorrentes", tipo: "text", hint: "número" },
  { key: "vec_azure_ad_accounts", label: "Number of Azure AD Accounts — número de contas Azure AD", tipo: "text", hint: "número" },
  { key: "vec_us_fed_gov", label: "US Federal Government account — conta do governo federal dos EUA?", tipo: "bool" },
  { key: "vec_partner_gov_contract", label: "Partner Holds Government Contract Vehicle — parceiro tem veículo de contrato com governo?", tipo: "bool" },
  { key: "vec_additional_details", label: "Include additional details on the opportunity — detalhes adicionais (cole aqui o bloco-modelo do Bitrix)", tipo: "textarea", hint: "junta as infos do processo: empresa, responsável, EB, champion, dor, distribuidor, produtos, qtd, concorrente, valor, data, descrição" },
];

// LENOVO — Deal Registration.
export const LENOVO_DISTRIBUIDORES = [
  "AGIS EQUIPAMENTOS - 1216325421",
  "SND DISTRIBUICAO - 1213219200",
  "MAZER DISTRIBUICAO - 1213219170",
  "CLM SOFTWARE - 1217812547",
  "SND DISTRIBUICAO - 1216325422",
  "INGRAM MICRO BRASIL - 1216325428",
  "ADISTEC BRASIL - 1217710633"
];

export const LENOVO_PRODUCTS = [
  "Hyperscale ThinkSystem Networking Switch",
  "Juniper TOR Switches",
  "Juniper VLH 25GbE Switch PSE",
  "Lenovo RackSwitches",
  "Networking Resell Offering",
  "OEM Fabric Switches",
  "Diamanti",
  "GeoComputing",
  "Pivot3",
  "Scale Computing",
  "Storage Options Carbonite",
  "ThinkSystem (HV Rack Server) for Geo",
  "Adapters",
  "Backplane / RAID Kits",
  "Cable Options",
  "Expansion Options",
  "Hyperscale Options",
  "Infinidat",
  "Memory",
  "Networking",
  "Old PNs",
  "Other",
  "Other Options",
  "Power",
  "Processor",
  "Racking Options",
  "Special Bid Options",
  "Storage - Brocade",
  "Storage - Common",
  "Storage - DE Series",
  "Storage - DM Series",
  "Storage - DS Series",
  "Storage - Servers",
  "Storage - V3700",
  "Storage - V5/V7",
  "VLH",
  "Racks and Power Systems",
  "Racks, Power Systems",
  "Large AI Optimized",
  "Edge Servers",
  "Mission-Critical",
  "Multi-Node",
  "Rack and Tower Servers",
  "Supercomputing",
  "ThinkSystem (Workstation Rack Server)",
  "VLH Server Intel",
  "Committed Service Repair",
  "Committed Service Repair - Drivepack",
  "Deployment",
  "Enterprise Software Support (RTS)",
  "Hardware Installation",
  "Health Check",
  "Health Check - ThinkAgile",
  "Internal Only PN",
  "Keep Your Components",
  "Keep Your Drive",
  "Keep Your Drive - Drivepack",
  "LSCS",
  "Managed Services",
  "Post Warranty - Committed Service Repair",
  "Post Warranty - Committed Service Repair - Drivepack",
  "Post Warranty - Health Check",
  "Post Warranty - Keep Your Components",
  "Post Warranty - Keep Your Drive",
  "Post Warranty - Service for Software",
  "Post Warranty Services",
  "Post Warranty Services - Catalog",
  "Post Warranty Services - Drivepack",
  "Professional Services",
  "SW Maintenance - Drivepack",
  "Service for Software",
  "Sustainability",
  "Warranty Service Upgrades",
  "Warranty Service Upgrades - Catalog",
  "Warranty Service Upgrades - Drivepack",
  "Acuutech",
  "BeeGFS",
  "Brocade",
  "Canonical Ubuntu",
  "Centerity Software",
  "Cisco Switch",
  "Cloud",
  "CloudSino",
  "Cloudian Software",
  "Cohesity",
  "Commvault",
  "Cumulus",
  "DCM software SnS",
  "DCM software license",
  "DCM software on site service",
  "DE Series",
  "DG Series",
  "DM Series",
  "DM Series for Brazil SW",
  "DS Series",
  "DataCore Software",
  "Diamanti SW",
  "Excelero",
  "GeoComputing",
  "HIPO",
  "IBM",
  "IBM Storwize Family SW",
  "Intel",
  "Lenovo HPC AI Software Stack",
  "Lenovo Open Cloud Automation",
  "Lenovo Software",
  "Lenovo Storage",
  "Leostream",
  "Local Unique Bid",
  "Microsoft",
  "Microsoft Azure",
  "Microsoft HCI",
  "Microsoft Perpetual License",
  "Microsoft ROK",
  "Microsoft Subscription",
  "Morpheus",
  "NVIDIA",
  "NVIDIA Cumulus Linux",
  "Nutanix Software",
  "Old SW",
  "Pivot 3 SW",
  "ProLion",
  "Red Hat",
  "Red Hat w/ Lenovo Support",
  "SUSE",
  "SUSE w/Lenovo Support",
  "SW Others",
  "Scale Computing SW",
  "StorMagic",
  "Storage SW",
  "Systems Management Upgrade",
  "ThinkAgile CP Software",
  "TidalScale",
  "VLS",
  "VMware",
  "Veeam",
  "WEKA",
  "XClarity",
  "Arista Border Switch 7260X for ThinkAgile",
  "Cisco Nexus Switch",
  "Citrix Netscaler Load Balancer Switch",
  "Converged Infrastructure Solutions",
  "HyperConverged Infrastructure",
  "Turnkey Cloud Platforms",
  "DE Series",
  "DG Series",
  "DM Series",
  "DS Series",
  "Expansion Enclosure",
  "Hyperscale Storage",
  "SAN/DAS",
  "Software Defined",
  "Software Defined Storage",
  "Storage Networking",
  "Tape Archive"
];

export const FAB_FIELDS_LENOVO: FabField[] = [
  { key: "len_iaas_opp", label: "Iaas Opportunity — Oportunidade de IaaS?", tipo: "bool", hint: "obrigatório" },
  { key: "len_substituindo_concorrencia", label: "Substituindo Produtos Da Concorrência?", tipo: "bool", hint: "obrigatório" },
  { key: "len_produtos_concorrencia", label: "Produtos Da Concorrência", tipo: "textarea", hint: "caixa livre — pode colocar alguns ou nenhum", showIf: { key: "len_substituindo_concorrencia", equals: "Sim" } },
  { key: "len_compra_distribuicao", label: "Deseja Comprar Via Distribuição?", tipo: "select", options: ["Via distribuição", "Direto"], hint: "obrigatório" },
  { key: "len_distribuidor", label: "Distribuidor", tipo: "select", options: LENOVO_DISTRIBUIDORES, showIf: { key: "len_compra_distribuicao", equals: "Via distribuição" } },
  { key: "len_cliente_existente", label: "Cliente existente para sua empresa?", tipo: "bool" },
  { key: "len_valor_total_brl", label: "Valor Total Do Registro De Oportunidade (BRL — Em Real brasileiro, NÃO DÓLAR)", tipo: "text", hint: "digite o valor em Reais (R$)" },
  { key: "len_produtos_lenovo", label: "Produtos Lenovo — especifique quantidade e receita por produto (em BRL — Real brasileiro, NÃO DÓLAR)", tipo: "lenovo_produtos_qtd", options: LENOVO_PRODUCTS },
  { key: "len_atividades_preliminares", label: "Análise De Investimento: Atividades Preliminares", tipo: "textarea", hint: "Obrigatório. Descreva brevemente as atividades preliminares que sua empresa realizou para identificar e qualificar esta oportunidade." },
  { key: "len_principais_acoes", label: "Análise De Investimento: Principais Ações", tipo: "textarea", hint: "Obrigatório. Descreva as principais ações e investimentos planejados para fechar esta oportunidade dentro do período de registro." },
  { key: "len_justificativa", label: "Análise De Investimento: Justificativa", tipo: "textarea", hint: "Obrigatório. Forneça qualquer justificativa adicional que considere relevante para ajudar a Lenovo a tomar uma decisão." },
  { key: "len_description", label: "Descrição Do Registro De Oportunidade — observações (cole aqui o bloco-modelo do Bitrix)", tipo: "textarea", hint: "junta as infos do processo: empresa, responsável, EB, champion, dor, distribuidor, produtos, qtd, concorrente, valor, data, descrição" },
];

// Escolhe o conjunto de campos conforme o fabricante (por nome). Cresce conforme mapeamos outros.
export function fabFieldsFor(nome: string): FabField[] {
  const n = (nome || "").toLowerCase();
  if (n.includes("f5")) return FAB_FIELDS_F5;
  if (n.includes("cloudflare")) return FAB_FIELDS_CLOUDFLARE;
  if (n.includes("gigamon")) return FAB_FIELDS_GIGAMON;
  if (n.includes("elastic")) return FAB_FIELDS_ELASTIC;
  if (n.includes("vectra")) return FAB_FIELDS_VECTRA;
  if (n.includes("check")) return FAB_FIELDS_CHECKPOINT;
  if (n.includes("pure")) return FAB_FIELDS_PURESTORAGE;
  if (n.includes("trend")) return FAB_FIELDS_TRENDMICRO;
  if (n.includes("cohesity")) return FAB_FIELDS_COHESITY;
  if (n.includes("nutanix")) return FAB_FIELDS_NUTANIX;
  if (n.includes("varonis")) return FAB_FIELDS_VARONIS;
  if (n.includes("zscaler")) return FAB_FIELDS_ZSCALER;
  if (n.includes("cyberark")) return FAB_FIELDS_CYBERARK;
  if (n.includes("tenable")) return FAB_FIELDS_TENABLE;
  if (n.includes("fortinet")) return FAB_FIELDS_FORTINET; // cobre "Fortinet" e "Fortinet SASE"
  if (n.includes("aruba")) return FAB_FIELDS_GENERICO; // "Aruba (HPE)" = redes, portal diferente do HPE deal reg
  if (n.includes("hpe")) return FAB_FIELDS_HPE;
  if (n.includes("lenovo")) return FAB_FIELDS_LENOVO;
  return FAB_FIELDS_GENERICO;
}

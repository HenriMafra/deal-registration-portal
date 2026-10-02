// Gerador do "bloco de cópia" do RO — texto pronto para colar no modelo de RO do Bitrix.
// Combina campos COMUNS (do processo/DEAL) + campos POR FABRICANTE (do registro).
// O Bitrix é 100% manual: este texto é copiado e colado pela pessoa; não há API.

export const BITRIX_RO_LINK =
  "https://api.example.com";

const s = (x: any) => (x === null || x === undefined ? "" : String(x));

/** Formata yyyy-mm-dd → dd/mm/yyyy para exibição no Bitrix. */
function fmtDataBR(d: any): string {
  if (!d) return "";
  const str = String(d).trim();
  const m = str.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return str;
}

// Resolve um campo "por fabricante" — primeiro no registro, depois (se foi movido p/ comum)
// em campos_comuns_extra do processo. Mantém a divisão comum × por-fabricante configurável.
export function valorCampoFab(proc: any, reg: any, key: string): string {
  const c = (reg && reg.campos) || {};
  if (c[key] !== undefined && c[key] !== null && String(c[key]).trim() !== "") return String(c[key]);
  const extra = (proc && proc.campos_comuns_extra) || {};
  if (extra[key] !== undefined && extra[key] !== null && String(extra[key]).trim() !== "") return String(extra[key]);
  return "";
}

// Texto exato do bloco (ordem fixa do modelo do Bitrix — seção 7 do spec).
export function gerarBlocoCopia(proc: any, reg: any): string {
  const f = (k: string) => valorCampoFab(proc, reg, k);
  // TEMPORÁRIO (site aberto, 2026-06-29): no modelo aberto não há atribuição de Pré-vendas e o
  // "urgente" não controla a fila dos Interns — então a urgência viaja DENTRO do bloco que a
  // pessoa cola no CRM, bem destacada. Quando o RO voltar ao modelo fechado, a urgência volta a
  // ser funcional (fixa no topo da fila + notifica o time) — ver ONDE-ESTA-TUDO.md, seção 3.
  const ce = (proc && proc.campos_comuns_extra) || {};
  const ehUrgente = proc?.urgente === true || ce.urgente === true || ce.urgente === "true";
  const linhas: string[] = [];

  if (ehUrgente) linhas.push(
    "🔴🔴🔴  OPORTUNIDADE URGENTE — PRIORIDADE MÁXIMA  🔴🔴🔴",
    "⚠ Registrar e dar follow-up com prioridade. Não deixar para depois.",
    "────────────────────────────────────────────────────",
    "",
  );

  // ── IDENTIFICAÇÃO DO DEAL ──────────────────────────────────────────────────
  linhas.push(
    `NOME DA OPORTUNIDADE NO BITRIX: ${s(proc.nome_oportunidade)}`,
    `ID DA OPORTUNIDADE NO BITRIX: ${s(proc.deal_id_bitrix)}`,
    `Fabricante: ${s(reg?.fabricante_nome)}`,
    "",
  );

  // ── CLIENTE ────────────────────────────────────────────────────────────────
  linhas.push(
    `Empresa: ${s(proc.empresa)}`,
    `CNPJ: ${s(proc.campos_comuns_extra?.cnpj || proc.cnpj)}`,
    `CEP: ${s(proc.campos_comuns_extra?.cep || proc.cep)}`,
    `Endereço da empresa: ${s(proc.endereco_empresa)}`,
    "",
  );

  // ── RESPONSÁVEL / CONTATO ──────────────────────────────────────────────────
  linhas.push(
    `Nome do responsável na empresa: ${s(proc.responsavel_nome)}`,
    `E-mail do Responsável: ${s(proc.responsavel_email)}`,
    `Cargo: ${s(proc.responsavel_cargo)}`,
    `Telefone do Responsável: ${s(proc.responsavel_telefone)}`,
    "",
  );

  // ── QUALIFICAÇÃO DO DEAL ───────────────────────────────────────────────────
  linhas.push(
    `Economic Buyer (responsável pela aprovação final do processo): ${s(proc.economic_buyer)}`,
    `Champion (mentor do processo de venda/Coach): ${s(proc.champion)}`,
    `Dor do cliente (o que o projeto vai resolver): ${f("dor_cliente")}`,
    `Valor Estimado (US$): ${f("valor_estimado_usd")}`,
    `Data de fechamento: ${s((proc.campos_comuns_extra || {}).fechamento_quarter) || fmtDataBR(proc.data_fechamento)}`,
    `Descrição da Proposta: ${f("descricao_proposta")}`,
    "",
  );

  // ── CAMPOS ESPECÍFICOS DO FABRICANTE ──────────────────────────────────────
  const fabLinhas: string[] = [];
  // F5
  if (f("registered_products")) fabLinhas.push(`Produtos (F5): ${f("registered_products")}`);
  if (f("f5_marketing_funding")) fabLinhas.push(`Resultado de F5 Marketing Funding?: ${f("f5_marketing_funding")}`);
  if (f("f5_joint_visit")) fabLinhas.push(`Requer F5 Joint Visit?: ${f("f5_joint_visit")}`);
  // Check Point
  if (f("product_interest")) fabLinhas.push(`Product Interest: ${f("product_interest")}`);
  if (f("cp_lead_source")) fabLinhas.push(`Deal Registration source: ${f("cp_lead_source")}`);
  if (f("cp_distributor")) fabLinhas.push(`Distributor (Check Point): ${f("cp_distributor")}`);
  if (f("cp_country")) fabLinhas.push(`Country: ${f("cp_country")}`);
  if (f("cp_competitive_replacement")) fabLinhas.push(`Competitive Replacement: ${f("cp_competitive_replacement")}`);
  if (f("cp_budget")) fabLinhas.push(`Budget: ${f("cp_budget")}`);
  if (f("cp_authority")) fabLinhas.push(`Authority: ${f("cp_authority")}`);
  if (f("cp_need")) fabLinhas.push(`Need: ${f("cp_need")}`);
  if (f("cp_timeline")) fabLinhas.push(`Timeline: ${f("cp_timeline")}`);
  if (f("cp_partner_contact_type_1")) fabLinhas.push(`Primary Partner Contact Type: ${f("cp_partner_contact_type_1")}`);
  if (f("cp_partner_first_name_1")) fabLinhas.push(`Primary Partner Contact First Name: ${f("cp_partner_first_name_1")}`);
  if (f("cp_partner_last_name_1")) fabLinhas.push(`Primary Partner Contact Last Name: ${f("cp_partner_last_name_1")}`);
  if (f("cp_partner_email_1")) fabLinhas.push(`Primary Partner Contact Email: ${f("cp_partner_email_1")}`);
  if (f("cp_partner_country_1")) fabLinhas.push(`Primary Partner Contact Country: ${f("cp_partner_country_1")}`);
  if (f("cp_partner_phone_1")) fabLinhas.push(`Primary Partner Contact Phone: ${f("cp_partner_phone_1")}`);
  if (f("cp_partner_contact_type_2")) fabLinhas.push(`Secondary Partner Contact Type: ${f("cp_partner_contact_type_2")}`);
  if (f("cp_partner_first_name_2")) fabLinhas.push(`Secondary Partner Contact First Name: ${f("cp_partner_first_name_2")}`);
  if (f("cp_partner_last_name_2")) fabLinhas.push(`Secondary Partner Contact Last Name: ${f("cp_partner_last_name_2")}`);
  if (f("cp_partner_email_2")) fabLinhas.push(`Secondary Partner Contact Email: ${f("cp_partner_email_2")}`);
  if (f("cp_partner_country_2")) fabLinhas.push(`Secondary Partner Contact Country: ${f("cp_partner_country_2")}`);
  if (f("cp_partner_phone_2")) fabLinhas.push(`Secondary Partner Contact Phone: ${f("cp_partner_phone_2")}`);
  // Pure Storage
  if (f("pure_deal_type")) fabLinhas.push(`Deal Type: ${f("pure_deal_type")}`);
  if (f("pure_delivery_owner")) fabLinhas.push(`Delivery Owner: ${f("pure_delivery_owner")}`);
  if (f("pure_capacity")) fabLinhas.push(`Opportunity Capacity: ${f("pure_capacity")}`);
  if (f("pure_products")) fabLinhas.push(`Proposed Products: ${f("pure_products")}`);
  if (f("pure_solution_category")) fabLinhas.push(`Solution Category: ${f("pure_solution_category")}`);
  if (f("pure_compelling_event")) fabLinhas.push(`Compelling Event: ${f("pure_compelling_event")}`);
  if (f("pure_budget_status")) fabLinhas.push(`Budget Status: ${f("pure_budget_status")}`);
  if (f("pure_notes")) fabLinhas.push(`Notes to PAM/AE: ${f("pure_notes")}`);
  if (f("pure_partner_ae")) fabLinhas.push(`Partner AE: ${f("pure_partner_ae")}`);
  if (f("pure_partner_se")) fabLinhas.push(`Partner SE: ${f("pure_partner_se")}`);
  if (f("pure_distributor")) fabLinhas.push(`Distributor Account: ${f("pure_distributor")}`);
  if (f("pure_channel_am")) fabLinhas.push(`Channel Account Manager: ${f("pure_channel_am")}`);
  if (f("pure_takeout")) fabLinhas.push(`Competitive Takeout: ${f("pure_takeout")}`);
  if (f("pure_takeout_vendor")) fabLinhas.push(`Competitive Takeout Vendor: ${f("pure_takeout_vendor")}`);
  if (f("pure_most_wanted")) fabLinhas.push(`Attach Most Wanted: ${f("pure_most_wanted")}`);
  // Trend Micro
  if (f("tm_deal_type")) fabLinhas.push(`Deal type: ${f("tm_deal_type")}`);
  if (f("tm_website")) fabLinhas.push(`Website: ${f("tm_website")}`);
  if (f("tm_industry")) fabLinhas.push(`Industry: ${f("tm_industry")}`);
  if (f("tm_company_size")) fabLinhas.push(`Company size: ${f("tm_company_size")}`);
  if (f("tm_distributor")) fabLinhas.push(`Distributor (Trend Micro): ${f("tm_distributor")}`);
  if (f("tm_product")) fabLinhas.push(`Product: ${f("tm_product")}`);
  if (f("tm_infra")) fabLinhas.push(`Infrastructure/Cloud applications: ${f("tm_infra")}`);
  if (f("tm_competitor")) fabLinhas.push(`Competitor (Trend Micro): ${f("tm_competitor")}`);
  if (f("tm_campaign")) fabLinhas.push(`Campaign: ${f("tm_campaign")}`);
  const tmPartner = [f("tm_partner_first"), f("tm_partner_last")].filter(Boolean).join(" ");
  if (tmPartner) fabLinhas.push(`Partner: ${tmPartner}`);
  if (f("tm_partner_email")) fabLinhas.push(`Partner e-mail: ${f("tm_partner_email")}`);
  if (f("tm_partner_phone")) fabLinhas.push(`Partner telefone: ${f("tm_partner_phone")}`);
  if (f("tm_partner_extra_emails")) fabLinhas.push(`Additional inform list: ${f("tm_partner_extra_emails")}`);
  // HPE
  if (f("hpe_pais")) fabLinhas.push(`País: ${f("hpe_pais")}`);
  if (f("hpe_city")) fabLinhas.push(`City: ${f("hpe_city")}`);
  if (f("hpe_estado")) fabLinhas.push(`Estado: ${f("hpe_estado")}`);
  if (f("hpe_cep")) fabLinhas.push(`CEP/Código Postal: ${f("hpe_cep")}`);
  if (f("hpe_site_conta")) fabLinhas.push(`Site (Conta HPE): ${f("hpe_site_conta")}`);
  if (f("hpe_identificador_fiscal")) fabLinhas.push(`Identificadores fiscais ou externos: ${f("hpe_identificador_fiscal")}`);
  if (f("hpe_moeda")) fabLinhas.push(`Moeda: ${f("hpe_moeda")}`);
  if (f("hpe_numero_usuarios")) fabLinhas.push(`Número de usuários: ${f("hpe_numero_usuarios")}`);
  if (f("hpe_msp_opportunity")) fabLinhas.push(`MSP Opportunity: ${f("hpe_msp_opportunity")}`);
  if (f("hpe_funcao_contato")) fabLinhas.push(`Função do contato: ${f("hpe_funcao_contato")}`);
  // Cohesity
  if (f("coh_partner_sales_rep")) fabLinhas.push(`Partner Sales Representative: ${f("coh_partner_sales_rep")}`);
  if (f("coh_partner_solution_engineer")) fabLinhas.push(`Partner Solution Engineer: ${f("coh_partner_solution_engineer")}`);
  if (f("coh_additional_partner_contact")) fabLinhas.push(`Additional Partner Contact: ${f("coh_additional_partner_contact")}`);
  if (f("coh_cohesity_sales_rep")) fabLinhas.push(`Cohesity Sales Rep/System Engineer: ${f("coh_cohesity_sales_rep")}`);
  if (f("coh_company_website")) fabLinhas.push(`Company Website: ${f("coh_company_website")}`);
  if (f("coh_division")) fabLinhas.push(`Division: ${f("coh_division")}`);
  if (f("coh_country")) fabLinhas.push(`Country: ${f("coh_country")}`);
  if (f("coh_region_state")) fabLinhas.push(`Region/State: ${f("coh_region_state")}`);
  if (f("coh_town_city")) fabLinhas.push(`Town/City: ${f("coh_town_city")}`);
  if (f("coh_postal_code")) fabLinhas.push(`Postal/Zip Code: ${f("coh_postal_code")}`);
  if (f("coh_street_address")) fabLinhas.push(`Contact Street Address: ${f("coh_street_address")}`);
  if (f("coh_deploy_same_address")) fabLinhas.push(`Same Address As Above?: ${f("coh_deploy_same_address")}`);
  if (f("coh_deploy_country")) fabLinhas.push(`Deployment Country: ${f("coh_deploy_country")}`);
  if (f("coh_deploy_region_state")) fabLinhas.push(`Deployment Region/State: ${f("coh_deploy_region_state")}`);
  if (f("coh_deploy_town_city")) fabLinhas.push(`Deployment Town/City: ${f("coh_deploy_town_city")}`);
  if (f("coh_deploy_postal_code")) fabLinhas.push(`Deployment Postal/Zip Code: ${f("coh_deploy_postal_code")}`);
  if (f("coh_deploy_street")) fabLinhas.push(`Deployment Street: ${f("coh_deploy_street")}`);
  if (f("coh_lead_identified_by_you")) fabLinhas.push(`Was This Lead Identified By You (Cohesity Partner)?: ${f("coh_lead_identified_by_you")}`);
  if (f("coh_already_engaged")) fabLinhas.push(`Are You Already Engaged With Cohesity On This Lead?: ${f("coh_already_engaged")}`);
  if (f("coh_customer_rfi_rfp")) fabLinhas.push(`Is The Customer Asking For An RFI/RFP?: ${f("coh_customer_rfi_rfp")}`);
  if (f("coh_registering_other_vendors")) fabLinhas.push(`Have You Or Are You Planning On Registering This Opportunity With Any Other Vendors?: ${f("coh_registering_other_vendors")}`);
  if (f("coh_special_contract")) fabLinhas.push(`Will This Opportunity Require A Special Contract And/Or Purchasing Vehicle?: ${f("coh_special_contract")}`);
  if (f("coh_marketing_activity")) fabLinhas.push(`Was This Customer Engaged In A Cohesity Supported Marketing Activity?: ${f("coh_marketing_activity")}`);
  if (f("coh_preferred_distributor")) fabLinhas.push(`Preferred Distributor: ${f("coh_preferred_distributor")}`);
  if (f("coh_products")) fabLinhas.push(`Products: ${f("coh_products")}`);
  if (f("coh_opportunity_origin")) fabLinhas.push(`Opportunity Origin: ${f("coh_opportunity_origin")}`);
  if (f("coh_reasons_for_purchase")) fabLinhas.push(`Reasons For Purchase: ${f("coh_reasons_for_purchase")}`);
  if (f("coh_primary_use_case")) fabLinhas.push(`Primary Use Case: ${f("coh_primary_use_case")}`);
  if (f("coh_consumption_model")) fabLinhas.push(`Preferred Consumption Model: ${f("coh_consumption_model")}`);
  if (f("coh_storage_vendors")) fabLinhas.push(`Existing Production Use Storage Vendors: ${f("coh_storage_vendors")}`);
  // Nutanix
  if (f("nut_engaged")) fabLinhas.push(`Engaged with end customer?: ${f("nut_engaged")}`);
  if (f("nut_engagement_desc")) fabLinhas.push(`Engagement description: ${f("nut_engagement_desc")}`);
  if (f("nut_met_customer")) fabLinhas.push(`Met with customer?: ${f("nut_met_customer")}`);
  if (f("nut_challenge")) fabLinhas.push(`Customer expressed challenge/goal?: ${f("nut_challenge")}`);
  if (f("nut_challenge_summary")) fabLinhas.push(`Challenge summary: ${f("nut_challenge_summary")}`);
  if (f("nut_reviewed_reqs")) fabLinhas.push(`Reviewed Nutanix requirements?: ${f("nut_reviewed_reqs")}`);
  if (f("nut_key_requirements")) fabLinhas.push(`Key requirements: ${f("nut_key_requirements")}`);
  if (f("nut_budget")) fabLinhas.push(`Has budget?: ${f("nut_budget")}`);
  if (f("nut_public_tender")) fabLinhas.push(`Public Tender?: ${f("nut_public_tender")}`);
  if (f("nut_software_products")) fabLinhas.push(`Nutanix Software Products: ${f("nut_software_products")}`);
  if (f("nut_third_party_hw")) fabLinhas.push(`Third Party Hardware: ${f("nut_third_party_hw")}`);
  if (f("nut_geo")) fabLinhas.push(`GEO: ${f("nut_geo")}`);
  if (f("nut_distributor")) fabLinhas.push(`Preferred Distributor: ${f("nut_distributor")}`);
  if (f("nut_opp_status")) fabLinhas.push(`Opportunity Status: ${f("nut_opp_status")}`);
  const nutSE = [f("nut_se_first"), f("nut_se_last")].filter(Boolean).join(" ");
  if (nutSE) fabLinhas.push(`Partner SE: ${nutSE}`);
  if (f("nut_se_email")) fabLinhas.push(`Partner SE Email: ${f("nut_se_email")}`);
  if (f("nut_se_phone")) fabLinhas.push(`Partner SE Phone: ${f("nut_se_phone")}`);
  if (f("nut_other_notes")) fabLinhas.push(`Other Notes / Comments: ${f("nut_other_notes")}`);
  // Varonis
  if (f("var_salutation")) fabLinhas.push(`Salutation: ${f("var_salutation")}`);
  if (f("var_deal_reg_type")) fabLinhas.push(`Deal Reg Type: ${f("var_deal_reg_type")}`);
  if (f("var_company_size")) fabLinhas.push(`Company Size: ${f("var_company_size")}`);
  if (f("var_industry")) fabLinhas.push(`Industry: ${f("var_industry")}`);
  if (f("var_meeting_date")) fabLinhas.push(`Partner Proposed Meeting Date: ${f("var_meeting_date")}`);
  if (f("var_deal_comments")) fabLinhas.push(`Deal Reg Comments: ${f("var_deal_comments")}`);
  // Zscaler
  if (f("zs_submission_type")) fabLinhas.push(`Submit a Deal: ${f("zs_submission_type")}`);
  if (f("zs_bant")) fabLinhas.push(`BANT Qualification: ${f("zs_bant")}`);
  if (f("zs_role_title")) fabLinhas.push(`Role/Title: ${f("zs_role_title")}`);
  if (f("zs_seats")) fabLinhas.push(`Number of Seats: ${f("zs_seats")}`);
  if (f("zs_competitor_replacement")) fabLinhas.push(`Replacing a Zscaler Competitor?: ${f("zs_competitor_replacement")}`);
  if (f("zs_product_family")) fabLinhas.push(`Product Family: ${f("zs_product_family")}`);
  if (f("zs_rep_name")) fabLinhas.push(`Rep Name: ${f("zs_rep_name")}`);
  if (f("zs_rep_email")) fabLinhas.push(`Rep Email: ${f("zs_rep_email")}`);
  if (f("zs_se_name")) fabLinhas.push(`Sales Engineer Name: ${f("zs_se_name")}`);
  if (f("zs_se_email")) fabLinhas.push(`Sales Engineer Email: ${f("zs_se_email")}`);
  if (f("zs_alt_email1")) fabLinhas.push(`Partner Alternate Email 1: ${f("zs_alt_email1")}`);
  if (f("zs_alt_email2")) fabLinhas.push(`Partner Alternate Email 2: ${f("zs_alt_email2")}`);
  if (f("zs_alt_email3")) fabLinhas.push(`Partner Alternate Email 3: ${f("zs_alt_email3")}`);
  if (f("zs_deal_description")) fabLinhas.push(`Deal Description: ${f("zs_deal_description")}`);
  // CyberArk
  if (f("ca_primary_solution")) fabLinhas.push(`Primary Solution: ${f("ca_primary_solution")}`);
  if (f("ca_currency")) fabLinhas.push(`Currency: ${f("ca_currency")}`);
  if (f("ca_servers")) fabLinhas.push(`Number of Servers: ${f("ca_servers")}`);
  if (f("ca_users")) fabLinhas.push(`Number of Users: ${f("ca_users")}`);
  if (f("ca_customer_status")) fabLinhas.push(`Customer Status: ${f("ca_customer_status")}`);
  // Tenable
  if (f("ten_deal_reg_type")) fabLinhas.push(`MSSP/Reseller Deal Registration: ${f("ten_deal_reg_type")}`);
  if (f("ten_mobile_phone")) fabLinhas.push(`Mobile Phone: ${f("ten_mobile_phone")}`);
  if (f("ten_website")) fabLinhas.push(`Website: ${f("ten_website")}`);
  if (f("ten_country")) fabLinhas.push(`Country: ${f("ten_country")}`);
  if (f("ten_products")) fabLinhas.push(`Product Interest: ${f("ten_products")}`);
  if (f("ten_ip_asset_count")) fabLinhas.push(`IP/Asset Count: ${f("ten_ip_asset_count")}`);
  if (f("ten_budget")) fabLinhas.push(`Approved Budget Amount: ${f("ten_budget")}`);
  if (f("ten_proserv")) fabLinhas.push(`Will Partner provide ProServ?: ${f("ten_proserv")}`);
  if (f("ten_reseller_contact")) fabLinhas.push(`Reseller Sales Contact: ${f("ten_reseller_contact")}`);
  if (f("ten_reseller_email")) fabLinhas.push(`Reseller Sales Email Address: ${f("ten_reseller_email")}`);
  if (f("ten_reseller_phone")) fabLinhas.push(`Reseller Sales Contact Phone: ${f("ten_reseller_phone")}`);
  if (f("ten_description")) fabLinhas.push(`Description: ${f("ten_description")}`);
  // Fortinet / Fortinet SASE
  if (f("ft_oot")) fabLinhas.push(`Products bound outside country (OOT)?: ${f("ft_oot")}`);
  if (f("ft_website")) fabLinhas.push(`Website: ${f("ft_website")}`);
  if (f("ft_deal_reg_type")) fabLinhas.push(`Deal Reg Type: ${f("ft_deal_reg_type")}`);
  if (f("ft_new_product")) fabLinhas.push(`Deal Reg for new product?: ${f("ft_new_product")}`);
  if (f("ft_value")) fabLinhas.push(`Estimated Value (USD): ${f("ft_value")}`);
  if (f("ft_sdwan")) fabLinhas.push(`SD-WAN Opportunity?: ${f("ft_sdwan")}`);
  if (f("ft_it_ot")) fabLinhas.push(`IT or OT Opportunity?: ${f("ft_it_ot")}`);
  if (f("ft_security_solutions")) fabLinhas.push(`Security Solutions included: ${f("ft_security_solutions")}`);
  if (f("ft_distributor")) fabLinhas.push(`Distributor (Fortinet): ${f("ft_distributor")}`);
  if (f("ft_description")) fabLinhas.push(`Description: ${f("ft_description")}`);
  // Cloudflare
  if (f("cf_through_distributor")) fabLinhas.push(`Transacting through Distributor?: ${f("cf_through_distributor")}`);
  const cfReseller = [f("cf_reseller_first"), f("cf_reseller_last")].filter(Boolean).join(" ");
  if (cfReseller) fabLinhas.push(`Reseller Sales Rep: ${cfReseller}`);
  if (f("cf_reseller_email")) fabLinhas.push(`Reseller Sales Rep Email: ${f("cf_reseller_email")}`);
  if (f("cf_reseller_se")) fabLinhas.push(`Reseller SE involved?: ${f("cf_reseller_se")}`);
  if (f("cf_website")) fabLinhas.push(`Website: ${f("cf_website")}`);
  if (f("cf_under_attack")) fabLinhas.push(`Customer Under Attack?: ${f("cf_under_attack")}`);
  if (f("cf_solutions")) fabLinhas.push(`Solutions discussed: ${f("cf_solutions")}`);
  if (f("cf_public_sector")) fabLinhas.push(`Public sector opportunity?: ${f("cf_public_sector")}`);
  if (f("cf_primary_use_case")) fabLinhas.push(`Primary Use case: ${f("cf_primary_use_case")}`);
  if (f("cf_use_case_detail")) fabLinhas.push(`Primary Use Case Detail: ${f("cf_use_case_detail")}`);
  if (f("cf_budget_discussed")) fabLinhas.push(`Was budget discussed?: ${f("cf_budget_discussed")}`);
  if (f("cf_marketing_spiff")) fabLinhas.push(`Marketing campaign/SPIFF contributed?: ${f("cf_marketing_spiff")}`);
  // Gigamon
  if (f("gig_ecosystem_partner")) fabLinhas.push(`Ecosystem Partner Involved?: ${f("gig_ecosystem_partner")}`);
  if (f("gig_ecosystem_partner_who")) fabLinhas.push(`Ecosystem Partner: ${f("gig_ecosystem_partner_who")}`);
  if (f("gig_interest_driver")) fabLinhas.push(`Driving customer's interest: ${f("gig_interest_driver")}`);
  if (f("gig_product_family")) fabLinhas.push(`Gigamon Product Family: ${f("gig_product_family")}`);
  if (f("gig_competitors")) fabLinhas.push(`Gigamon Competitors: ${f("gig_competitors")}`);
  if (f("gig_current_environment")) fabLinhas.push(`Customer's Current Environment: ${f("gig_current_environment")}`);
  if (f("gig_deal_reg_source")) fabLinhas.push(`Deal Registration Source: ${f("gig_deal_reg_source")}`);
  if (f("gig_website")) fabLinhas.push(`Website: ${f("gig_website")}`);
  if (f("gig_reseller_salesperson")) fabLinhas.push(`Reseller Salesperson: ${f("gig_reseller_salesperson")}`);
  if (f("gig_distributor")) fabLinhas.push(`Distributor (Gigamon): ${f("gig_distributor")}`);
  if (f("gig_distributor_contact")) fabLinhas.push(`Distributor Contact: ${f("gig_distributor_contact")}`);
  if (f("gig_marketing_campaign")) fabLinhas.push(`Gigamon Marketing Campaign: ${f("gig_marketing_campaign")}`);
  // Elastic
  if (f("el_transaction_type")) fabLinhas.push(`Transaction Type: ${f("el_transaction_type")}`);
  if (f("el_elastic_rep")) fabLinhas.push(`Elastic Representative: ${f("el_elastic_rep")}`);
  if (f("el_public_sector")) fabLinhas.push(`Prospect Public Sector?: ${f("el_public_sector")}`);
  if (f("el_rfp_tender")) fabLinhas.push(`Related to RFP/Tender?: ${f("el_rfp_tender")}`);
  if (f("el_renewal")) fabLinhas.push(`Renewal Deal?: ${f("el_renewal")}`);
  if (f("el_num_employees")) fabLinhas.push(`Number of Employees: ${f("el_num_employees")}`);
  if (f("el_contact_role")) fabLinhas.push(`Prospect Contact Role: ${f("el_contact_role")}`);
  if (f("el_willing_to_speak")) fabLinhas.push(`Willing to speak with Elastic?: ${f("el_willing_to_speak")}`);
  if (f("el_why_contacted_select")) fabLinhas.push(`Why Customer Contacted (select): ${f("el_why_contacted_select")}`);
  if (f("el_why_contacted_reason")) fabLinhas.push(`Reason Why Customer Contacted: ${f("el_why_contacted_reason")}`);
  if (f("el_dnb_number")) fabLinhas.push(`D&B number: ${f("el_dnb_number")}`);
  if (f("el_use_cases")) fabLinhas.push(`Use cases: ${f("el_use_cases")}`);
  if (f("el_primary_solution")) fabLinhas.push(`Primary Solution: ${f("el_primary_solution")}`);
  if (f("el_delivery_type")) fabLinhas.push(`Delivery type: ${f("el_delivery_type")}`);
  if (f("el_deal_size")) fabLinhas.push(`Estimated deal size (USD): ${f("el_deal_size")}`);
  if (f("el_qualify_steps")) fabLinhas.push(`Qualification steps: ${f("el_qualify_steps")}`);
  if (f("el_help_forward")) fabLinhas.push(`How Elastic can help: ${f("el_help_forward")}`);
  // Vectra
  if (f("vec_use_distributor")) fabLinhas.push(`Use Distributor?: ${f("vec_use_distributor")}`);
  if (f("vec_distributor")) fabLinhas.push(`Distributor (Vectra): ${f("vec_distributor")}`);
  if (f("vec_partner_se_name")) fabLinhas.push(`Partner technical sales contact: ${f("vec_partner_se_name")}`);
  if (f("vec_partner_owns_license")) fabLinhas.push(`Partner owns HW/SW Title/License?: ${f("vec_partner_owns_license")}`);
  if (f("vec_partner_managed_service")) fabLinhas.push(`Partner Providing Managed Service?: ${f("vec_partner_managed_service")}`);
  if (f("vec_tech_decision_maker")) fabLinhas.push(`Technical Decision Maker: ${f("vec_tech_decision_maker")}`);
  if (f("vec_concurrent_ips")) fabLinhas.push(`Number of Concurrent IPs: ${f("vec_concurrent_ips")}`);
  if (f("vec_azure_ad_accounts")) fabLinhas.push(`Number of Azure AD Accounts: ${f("vec_azure_ad_accounts")}`);
  if (f("vec_us_fed_gov")) fabLinhas.push(`US Federal Government account?: ${f("vec_us_fed_gov")}`);
  if (f("vec_partner_gov_contract")) fabLinhas.push(`Partner Holds Government Contract Vehicle?: ${f("vec_partner_gov_contract")}`);
  if (f("vec_additional_details")) fabLinhas.push(`Additional details: ${f("vec_additional_details")}`);
  // Lenovo
  if (f("len_iaas_opp")) fabLinhas.push(`Iaas Opportunity: ${f("len_iaas_opp")}`);
  if (f("len_substituindo_concorrencia")) fabLinhas.push(`Substituindo Produtos Da Concorrência?: ${f("len_substituindo_concorrencia")}`);
  if (f("len_produtos_concorrencia")) fabLinhas.push(`Produtos Da Concorrência: ${f("len_produtos_concorrencia")}`);
  if (f("len_compra_distribuicao")) fabLinhas.push(`Deseja Comprar Via Distribuição?: ${f("len_compra_distribuicao")}`);
  if (f("len_distribuidor")) fabLinhas.push(`Distribuidor: ${f("len_distribuidor")}`);
  if (f("len_cliente_existente")) fabLinhas.push(`Cliente existente para sua empresa?: ${f("len_cliente_existente")}`);
  if (f("len_valor_total_brl")) fabLinhas.push(`Valor Total Do Registro De Oportunidade (BRL): ${f("len_valor_total_brl")}`);
  if (f("len_produtos_lenovo")) fabLinhas.push(`Produtos Lenovo: ${f("len_produtos_lenovo")}`);
  if (f("len_atividades_preliminares")) fabLinhas.push(`Atividades Preliminares: ${f("len_atividades_preliminares")}`);
  if (f("len_principais_acoes")) fabLinhas.push(`Principais Ações: ${f("len_principais_acoes")}`);
  if (f("len_justificativa")) fabLinhas.push(`Justificativa: ${f("len_justificativa")}`);
  if (f("len_description")) fabLinhas.push(`Descrição Do Registro De Oportunidade: ${f("len_description")}`);

  // Adiciona seção do fabricante só se houver campos preenchidos
  if (fabLinhas.length > 0) {
    linhas.push(`── CAMPOS ${(reg?.fabricante_nome || "FABRICANTE").toUpperCase()} ──────────────────────────────────────────`);
    linhas.push(...fabLinhas);
    linhas.push("");
  }

  if (reg?.fabricante_nome?.toLowerCase().includes("lenovo")) {
    linhas.push("⚠️ ATENÇÃO: Enviar evidência de contato/negociação com o cliente (e-mail, conversa, etc.) no chat desta tarefa no Bitrix.");
  }

  return linhas.join("\n");
}

// Ciclo de vida do RO (seção 8).
export const RO_STATUS = ["A registrar", "Pendente", "Aprovado", "Rejeitado", "Renovado", "Descartado"] as const;
export type RoStatus = (typeof RO_STATUS)[number];

export const RO_STATUS_TONE: Record<string, string> = {
  "A registrar": "bg-slate-500/15 text-slate-600 dark:text-slate-300",
  "Pendente": "bg-amber-500/15 text-amber-700 dark:text-amber-400",
  "Aprovado": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400",
  "Rejeitado": "bg-red-500/15 text-red-600 dark:text-red-400",
  "Renovado": "bg-indigo-500/15 text-indigo-700 dark:text-indigo-400",
  "Descartado": "bg-zinc-500/15 text-zinc-500 dark:text-zinc-400",
};

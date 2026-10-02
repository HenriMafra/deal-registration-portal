// Dados do Deal Registration da CLOUDFLARE — mapeados do portal. Listas verbatim (nomes de
// produto / frases do portal). Usados no Passo 2 do RO quando o fabricante é "Cloudflare".
//
// Campos comuns do Passo 1 NÃO se repetem: Company Name -> empresa, Address/Country/Street/City/
// State/Zip -> endereco_empresa, Customer Contact First/Last/Title/Email/Phone -> responsavel_*,
// Estimated Deal Value -> valor_estimado_usd, Expected Close Date -> data_fechamento.

// What type of solution have you discussed with the customer? (multisseleção; nomes de produto verbatim)
export const CLOUDFLARE_SOLUTIONS: string[] = [
  "Cloudflare One/SASE",
  "Application Performance",
  "Application Security",
  "Developer Platform",
  "Network Services",
  "Support and Services",
  "Access",
  "Browser Isolation",
  "CASB",
  "Cloudforce One - Threat Intelligence",
  "DLP",
  "Email Security",
  "Gateway",
  "Magic Firewall",
  "Magic Transit",
  "Magic WAN",
  "mTLS",
  "R2 / Cache Reserve",
  "Tunnel",
  "Zaraz",
  "Zero Trust",
];

// Primary Use case (seleção única). 12 opções CONFIRMADAS pelo henri (inclui "Performance & Security"
// e "DDoS - Under Attack", as duas que antes vieram cortadas no spec — inferência confirmada correta).
export const CLOUDFLARE_USE_CASE: string[] = [
  "Performance & Security",
  "Performance",
  "Security",
  "DDoS",
  "DDoS - Under Attack",
  "DNS Only",
  "WebSockets",
  "Virtual DNS",
  "Unknown",
  "Registrar",
  "Zero Trust",
  "Email Security",
];

// Was budget discussed? (seleção única; frases verbatim do portal)
export const CLOUDFLARE_BUDGET_DISCUSSED: string[] = [
  "Yes, I gave them the range, $3k-$100k",
  "Yes, I told them enterprise starts at $5k, but depends on products and usage",
  "No, they're already utilizing Akamai",
  "No, they're an ENT segment account with revenue > $1B",
  "No - Outbound",
];

// Dados do Deal Registration da HPE — mapeados do portal (Etapa 1: Criação da Conta/Cliente
// + Etapa 2: Registro da Oportunidade). Rótulos das opções são BILÍNGUES
// (termo em inglês — explicação curta em PT) para o AM/Intern entender mesmo sem dominar
// inglês. Usados no Passo 2 do RO quando o fabricante é "HPE".
//
// Origem: D:\Mapeamentos\mapeamento-deal-reg.md — seção "FABRICANTE: HPE".
// O campo "País" reaproveita a const PAISES de "@/lib/ro/checkpoint" (não recriamos a lista).

// 1) Moeda — Dropdown. O doc-fonte só confirma "USD - Dólar dos EUA" (valor exibido por
// padrão) e marca as demais moedas como "a confirmar". Não inventamos opções não capturadas:
// quando o mapeamento das outras moedas chegar, é só acrescentar aqui.
export const HPE_MOEDA: string[] = [
  "USD - Dólar dos EUA",
];

// 2) Número de usuários — Dropdown. Faixa de usuários do cliente (verbatim do portal).
export const HPE_NUMERO_USUARIOS: string[] = [
  "1-99",
  "100-250",
  "251-500",
  "501-1000",
  "1001-5000",
  "5000+",
];

// 3) Função do contato — Dropdown. Papel do contato no cliente. Placeholder "Select Role".
// Rótulos do portal em PT-BR; a explicação curta ajuda a identificar o papel real.
export const HPE_FUNCAO_CONTATO: string[] = [
  "Administrativo — funções administrativas/de apoio",
  "Gerente de aliança — Alliance Manager, gestão de parcerias",
  "Analista — Analyst, análise técnica/de negócio",
  "Contato de aplicativos — Applications Contact, responsável por aplicações",
  "Consultor — Consultant, consultoria externa/interna",
  "Tomadores de decisões — Decision Makers, decisores do projeto",
  "Implantar e manter — Deploy & Maintain, implantação e sustentação",
  "Engenheiro/técnico — Engineer/Technical, engenharia/técnica",
  "Executivo — Executive, nível executivo (C-level/diretoria)",
  "Vendas de campo — Field Sales, vendas em campo",
  "Marketing — Marketing, área de marketing",
  "Contato principal de vendas — Primary Sales Contact, contato comercial principal",
  "Contato principal técnico — Primary Technical Contact, contato técnico principal",
  "Aquisições e pagamentos — Procurement & Payables, compras e pagamentos",
  "Gerenciamento de produtos — Product Management, gestão de produtos",
  "Vendas — Sales, área de vendas",
  "Contato de vendas — Sales Contact, contato de vendas",
  "Suporte (técnico) — Support (technical), suporte técnico",
  "Técnico — Technician, técnico operacional",
];

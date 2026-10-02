# 💼 Deal Registration Portal — Sistema Multi-Etapas de Registro de Oportunidades (RO)

Plataforma corporativa de **Registro de Oportunidades (Deal Registration / RO)** e qualificação técnica para canais, revendas e integradores de tecnologia, projetada para intermediar a proteção de margem comercial junto a grandes fabricantes de TI (como Qualys, Fortinet, Netskope, HPE/Aruba e Zscaler).

Construída com **Next.js 14 (App Router)**, **Supabase** e um motor resiliente de **consulta cadastral de órgãos públicos por CNPJ com failover em 5 APIs em paralelo**.

---

## 📌 Que Problema Resolve?

No mercado B2B/B2G de tecnologia corporativa, as revendas que desenvolvem o projeto técnico junto ao cliente têm o direito de "registrar a oportunidade" no fabricante para obter desconto e proteção de margem. 

No entanto, o processo tradicional é manual, lento e burocrático:
- Formulários estáticos em PDF ou planilhas que não validam regras de concorrência ou valores mínimos.
- Necessidade de preencher campos técnicos completamente diferentes para cada fabricante (um formulário de Firewall exige throughput e portas; um de EDR exige quantidade de agentes e retenção).
- Erros de digitação de CNPJ e dados de órgãos públicos que travam aprovações por dias.

O **Deal Registration Portal** resolve isso digitalizando o ciclo completo em 3 etapas com validação dinâmica em tempo real.

---

## ⚙️ Diferencial Técnico & Arquitetura

### 1. Failover Paralelo de 5 APIs de Consulta CNPJ
Ao digitar o CNPJ do órgão comprador ou empresa cliente, o sistema dispara requisições assíncronas simultâneas (`Promise.any`) com fallback automático:
- BrasilAPI (Receita Federal)
- Minha Receita
- CNPJ.ws
- ReceitaWS
- Base local de cache PostgreSQL

Garante tempo de resposta inferior a **400ms** mesmo quando servidores governamentais estão instáveis.

### 2. Schemas Condicionais Dinâmicos por Fabricante
A interface renderiza campos e regras específicas conforme o fabricante selecionado:
- **Qualys:** Tipo de Nuvem (Shared/PCP), Quantidade de Licenças VMDR, Módulo Patch Management.
- **Fortinet:** Modelo NGFW FortiGate, Subscrição FortiGuard Bundle, FortiAnalyzer GB/dia, Switches PoE.
- **Netskope:** URL do Tenant, Assinantes CASB Inline, Nós ZTNA Private Access, Perfil DLP.

### 3. Máquina de Estado de Aprovação & CRM Webhook
- Validação de faixa de valor estimado (USD / BRL).
- Verificação de duplicidade de registro para o mesmo órgão/edital.
- Disparo de webhooks padronizados para CRMs comerciais (Bitrix24, HubSpot ou Salesforce).

---

## 🏗️ Stack Tecnológica

- **Frontend & Fullstack:** Next.js 14, React, TypeScript, Tailwind CSS, Lucide Icons.
- **Backend & Database:** Supabase (PostgreSQL com RLS para isolamento de canais).
- **Validação de Schemas:** Zod e React Hook Form.

---

## 🚀 Como Executar Localmente

```bash
# 1. Clone o repositório
git clone https://github.com/HenriMafra/deal-registration-portal.git
cd deal-registration-portal

# 2. Instale as dependências
npm install

# 3. Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Inicie o servidor
npm run dev
```

---

## 📄 Licença

Distribuído sob a licença **MIT**. Desenvolvido por **Henri Mafra**.

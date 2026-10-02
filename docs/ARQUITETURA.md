# Arquitetura — Registro de Oportunidade (RO)

## Contexto

Este produto é o módulo público de registro rápido de oportunidades
comerciais do sistema MAPPER (ENTERPRISECORE). Foi extraído de um monorepo maior
que também continha o sistema completo de gestão de contratos
("MAPPER Contratos" — repositório
[`mapper-contratos`](https://github.com/HenriMafra/mapper-contratos)).

## Fluxo principal

1. Usuário (logado ou não) acessa `/deal-reg`
2. Preenche o formulário (`components/ro/ROCreate.tsx`) — dados do
   órgão (com auto-complete por CNPJ via `app/api/cnpj`), objeto da
   oportunidade, valor estimado
3. Submissão grava no Supabase (projeto RO — `hgczpdwhjqaqiravorrg`)
   via `app/api/ro`
4. Opcionalmente, dispara uma notificação/integração com o Bitrix CRM
   (`app/api/bitrix-ro`)
5. Usuários logados veem o histórico dos próprios registros em
   `components/ro/RODashboard.tsx` / `ROProcessoView.tsx`

## Autenticação

- Supabase Auth (e-mail + senha, sem MFA)
- `middleware.ts` protege todas as rotas, EXCETO: `/`, `/login`,
  `/definir-senha`, `/deal-reg` (pública de propósito — reduzir fricção
  pra registrar uma oportunidade) e `/api/*`
- `lib/permissions/index.ts` define os papéis (`Role`) e permissões —
  neste repo standalone, a navegação já vem fixa mostrando só os itens
  do produto RO (a alternância por `SITE_MODE` do monorepo original foi
  removida, não existe mais)

## Onde procurar cada coisa

| Preciso mexer em... | Onde olhar |
|---|---|
| O formulário de registro | `components/ro/ROCreate.tsx`, `app/deal-reg/page.tsx` |
| Regras de campos do formulário | `lib/ro/fields.ts` |
| Lógica de backend do RO | `app/api/ro/route.ts` |
| Integração Bitrix | `app/api/bitrix-ro/` |
| Notificações | `lib/notifications/`, `components/notifications/`, `app/api/notifications/` |
| Permissões/menu | `lib/permissions/index.ts` |
| Redirecionamento/login | `middleware.ts` |

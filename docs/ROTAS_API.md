# Mapa de rotas e APIs — RO

Inventário completo das páginas e endpoints deste repositório, extraído
direto do sistema de arquivos (`app/**/page.tsx` e `app/api/**/route.ts`).
Serve como índice pra achar rápido "onde mexo pra alterar X".

## Páginas (App Router)

| Rota | Arquivo | O que é | Pública? |
|---|---|---|---|
| `/` | `app/page.tsx` | Raiz — redireciona conforme login/estado | sim |
| `/login` | `app/login/page.tsx` | Tela de login (Supabase Auth) | sim |
| `/definir-senha` | `app/definir-senha/page.tsx` | Definição/redefinição de senha (1º acesso) | sim |
| `/deal-reg` | `app/deal-reg/page.tsx` | **Coração do produto** — formulário de Registro de Oportunidade + lista de ROs (lista só p/ Administrador) | sim (registro) |
| `/deal-reg/[id]` | `app/deal-reg/[id]/page.tsx` | Ficha de um processo de RO específico | protegida |
| `/conta` | `app/conta/page.tsx` | Configurações da conta do usuário logado | protegida |
| `/notificacoes` | `app/notificacoes/page.tsx` | Central de notificações | protegida |
| `/ferramentas` | `app/ferramentas/page.tsx` | Índice de utilitários (PDF, CSV→Excel, etc.) | protegida |
| `/ferramentas/[slug]` | `app/ferramentas/[slug]/page.tsx` | Utilitário genérico por slug | protegida |
| `/ferramentas/csv-excel` | `app/ferramentas/csv-excel/page.tsx` | Conversor CSV → Excel | protegida |
| `/como-usar` | `app/como-usar/page.tsx` | Ajuda / guia de uso | protegida |
| `/faq` | `app/faq/page.tsx` | Perguntas frequentes | protegida |

> "Pública" = acessível sem login, conforme `middleware.ts`. A rota
> `/deal-reg` é pública **para registrar** (decisão de produto: reduzir
> fricção), mas a LISTA de registros dentro dela só aparece para o
> Administrador.

## Endpoints de API (server-side)

| Endpoint | Arquivo | O que faz |
|---|---|---|
| `POST /api/ro` | `app/api/ro/route.ts` | CRUD do fluxo de RO (criar processo/registros, mudar status, gravar eventos). Tem um caminho PÚBLICO (sem login) para o registro de oportunidade aberto. Grava em `ro_processos`/`ro_registros`/`ro_eventos`. |
| `POST /api/bitrix-ro` | `app/api/bitrix-ro/route.ts` | Envia o RO direto ao Bitrix24 (cria 1 deal + 1 tarefa por fabricante), substituindo o copia-cola manual. Só ativa se `BITRIX_WEBHOOK_URL` estiver definido; senão retorna 503 e a UI mostra os blocos pra colar à mão. |
| `GET /api/cnpj` | `app/api/cnpj/route.ts` | Consulta o mesmo CNPJ em **5 fontes públicas em paralelo** (server-side, sem CORS), normaliza, e devolve o valor de CONSENSO por campo + as divergências. Tolerante a falhas (ignora fonte que cair). Usado no auto-preenchimento do formulário. |
| `POST /api/contact` | `app/api/contact/route.ts` | Gerencia contatos de uma oportunidade (criar/editar/excluir), com checagem de escopo por UF. |
| `POST /api/auth/forgot` | `app/api/auth/forgot/route.ts` | Dispara e-mail de recuperação de senha. |
| `GET/POST /api/notifications/*` | `app/api/notifications/` | Central de notificações: `create`, `list`, `mark-read`, `mark-all-read`, `preferences`. |
| `GET /api/realtime/health` | `app/api/realtime/health/route.ts` | Health check da conexão Supabase Realtime. |
| `POST /api/ver-como` | `app/api/ver-como/route.ts` | "Ver como" (impersonação de perfil para teste, restrito a Admin). |
| `GET /api/version` | `app/api/version/route.ts` | Devolve o `NEXT_PUBLIC_BUILD_STAMP` atual — o `VersionWatcher` compara com o do cliente pra detectar deploy novo (ver `docs/DEPLOY.md`). |

## O sistema de fabricantes (`lib/ro/`)

O formulário de RO se adapta ao fabricante escolhido. A maioria dos
fabricantes é só uma linha na tabela `ro_fabricantes` (ver
`docs/BANCO.md`), mas os que têm regra/campos especiais têm um arquivo
dedicado em `lib/ro/`:

```
checkpoint · cloudflare · cohesity · cyberark · elastic · fortinet ·
gigamon · hpe · nutanix · purestorage · tenable · trendmicro · varonis ·
vectra · zscaler
```

Além de:
- `lib/ro/fields.ts` — definição dos campos genéricos do formulário
- `lib/ro/copyblock.ts` — geração dos blocos de texto pra colar no
  portal do fabricante (quando não há integração automática)

Componentes da UI do RO ficam em `components/ro/` (`ROCreate.tsx` é o
formulário principal; `RODashboard.tsx` a lista; `ROProcessoView.tsx` a
ficha; `RoShell.tsx` o layout).

## Para adicionar/alterar um fabricante

Ver o FAQ no `README.md` — resumo: fabricante simples = 1 linha em
`ro_fabricantes`; fabricante com regra especial = arquivo em `lib/ro/`
copiando um dos existentes como modelo.

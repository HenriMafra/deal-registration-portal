# Deploy — Cloudflare Workers (RO)

## Resumo de 30 segundos

```bash
npm install --legacy-peer-deps      # 1x, ou quando mudar dependências
cp .env.example .env.local          # preencha com as credenciais do projeto RO
npm run doctor                      # confere se o ambiente está sadio (não escreve nada)
npm run build:cf                    # build para Cloudflare (NÃO use o comando cru — ver abaixo)
npm run deploy:cf                   # deploy (lê o CLOUDFLARE_API_TOKEN do .env.local)
```

## Por que usar `npm run build:cf` e não `opennextjs-cloudflare build` direto

**Isto não é preferência, é obrigatório** — o comando cru quebra de duas formas:

1. **Loop infinito de reload**: o `next.config.mjs` gera um "carimbo de
   versão" (`NEXT_PUBLIC_BUILD_STAMP`) com `Date.now()`. Se o build roda
   esse `Date.now()` mais de uma vez (cliente vs. servidor), os carimbos
   ficam diferentes, e o componente `VersionWatcher` (ativo no
   `app/layout.tsx`) acha que sempre há uma versão nova e recarrega a
   página em loop eterno. O `scripts/build-cf.mjs` fixa o carimbo UMA vez
   no ambiente antes do build, resolvendo isso.
2. **Recusa de versão do Next**: o projeto está no Next 14, mas o
   adaptador `@opennextjs/cloudflare` (>= 1.16) passou a exigir Next 15+
   e recusa o build sem a flag `--dangerouslyUseUnsupportedNextVersion`.
   O `build:cf`/`deploy:cf` já passam essa flag. O código roda
   perfeitamente no Next 14 (é o que está em produção hoje) — a flag só
   silencia a checagem do adaptador. Ver a seção "Dívida técnica" no fim.

Os scripts `build:cf` e `deploy:cf` cuidam dos dois pontos. Se você
rodar `opennextjs-cloudflare build` na mão, vai bater nos dois
problemas.

## Passo a passo detalhado

### 1. Variáveis de ambiente

Copie `.env.example` para `.env.local` e preencha com os valores REAIS do
projeto Supabase **RO** (`hgczpdwhjqaqiravorrg`). Atenção a dois grupos:

- **`NEXT_PUBLIC_*`** — vão embutidos no bundle em tempo de build. Se você
  buildar com o valor errado, o site aponta pro projeto errado até o
  próximo build. É por isso que trocar de ambiente exige rebuild, não só
  reiniciar.
- **`SUPABASE_SERVICE_ROLE_KEY`, `DATABASE_URL`** — secretos, ficam no
  servidor. No deploy pro Worker, esses NÃO vão pelo `.env.local`/build —
  são configurados como *secret* do Worker (ver passo 4).
- **`CLOUDFLARE_API_TOKEN`** — usado só pelo `deploy:cf` pra deploy
  não-interativo. Token do tipo "Edit Cloudflare Workers".

Rode `npm run doctor` — ele valida tudo isso sem escrever nada e avisa se
alguma chave está trocada (ex.: service role igual à anon key, ou service
role exposta numa variável `NEXT_PUBLIC_`).

### 2. Build

```bash
npm run build:cf
```

Não trunque com `timeout` curto — o build genuíno leva alguns minutos.
Matar no meio deixa `.open-next/worker.js` num estado parcial sem erro
óbvio. Se precisar recomeçar limpo: `rm -rf .next .open-next` antes.

### 3. Deploy

```bash
npm run deploy:cf
```

Isso lê o `CLOUDFLARE_API_TOKEN` do `.env.local` e faz o deploy
não-interativo. O Worker de destino é definido pelo campo `name` do
`wrangler.jsonc` (hoje `mapper-ro-standalone` — ver nota abaixo).

### 4. Secrets do Worker (uma vez por Worker)

Variáveis secretas não vão no bundle — configure-as direto no Worker:

```bash
npx wrangler secret put DATABASE_URL --name <nome-do-worker>
npx wrangler secret put SUPABASE_SERVICE_ROLE_KEY --name <nome-do-worker>
```

Ver quais secrets existem (sem ver o valor):
```bash
npx wrangler secret list --name <nome-do-worker>
```

### 5. Confirmar

Abra a URL do Worker numa aba anônima e, no DevTools (Network), veja se o
hash de um chunk `_next/static/chunks/app/layout-*.js` mudou. O edge da
Cloudflare pode levar 10-20s pra propagar — se parecer que não atualizou,
espere e recarregue antes de concluir que falhou.

## Sobre o Worker de destino

O `wrangler.jsonc` deste repo usa o nome `mapper-ro-standalone`,
propositalmente diferente do Worker de produção real atual (`mapper`, que
ainda é deployado a partir do repositório original `atlas-b2g-online`).
Isso evita que um deploy de teste a partir daqui sobrescreva a produção
por engano. Quando a equipe decidir que este repositório passa a ser a
fonte oficial de deploy, troque o `name` para o Worker de produção e
atualize esta nota.

## Dívida técnica conhecida: Next 14 → Next 15

O uso da flag `--dangerouslyUseUnsupportedNextVersion` é uma solução de
ponte, não permanente. A recomendação para a equipe é, quando houver
janela, migrar o projeto de Next 14 para Next 15 (que o adaptador
OpenNext suporta oficialmente) e então remover a flag dos scripts
`build-cf.mjs`/`deploy-cf.mjs`. Não há urgência — o código roda estável
no Next 14 em produção — mas é a direção certa a médio prazo. O produto
irmão `mapper-contratos` está exatamente na mesma situação (mesma base de
código de origem), então idealmente os dois migram juntos.

# Banco de dados — projeto Supabase "RO"

Projeto: **`hgczpdwhjqaqiravorrg`** (região `sa-east-1`). Diferente do
projeto usado pelo produto irmão "MAPPER Contratos" — não misture
credenciais dos dois.

## Tabelas/schemas relevantes (pasta `supabase/`)

- `schema_atlas_b2g.sql` — schema base (usuários/`perfis`, tabelas
  compartilhadas de autenticação)
- `ro_module.sql`, `ro_collab.sql` — schema específico do fluxo de
  Registro de Oportunidade
- `notifications_schema.sql` + `notifications_rls_policies.sql` —
  central de notificações
- `realtime_publications.sql` + `realtime_security_notes.md` —
  configuração de Supabase Realtime (usado pra notificações ao vivo)
- `rls_policies.sql`, `rls_adversarial_test.sql` — políticas de RLS
  gerais e testes de adversário (rodar após qualquer mudança de RLS)
- `storage_policies.sql` — políticas de storage (se o RO usar upload de
  anexo/arquivo)

## Esquema exato das 4 tabelas do módulo RO

Extraído direto do `information_schema` do banco de produção
(`hgczpdwhjqaqiravorrg`) em 2026-07-13 — é o schema REAL. Se divergir
do banco no futuro, confie no banco, atualize este arquivo.

A modelagem tem uma hierarquia: **1 processo → N registros (1 por
fabricante) → N eventos (histórico de status de cada registro)**. Um
"Registro de Oportunidade" no dia a dia do usuário costuma envolver
registrar a MESMA oportunidade em vários portais de fabricante
diferentes (Nutanix, Varonis, Fortinet, etc.) — daí a separação
processo/registro.

### `ro_processos` — a oportunidade em si (nível "deal")
```
id                     bigint       PK, nextval(ro_processos_id_seq)
deal_id_bitrix         text         (ID do negócio no Bitrix CRM, se integrado)
nome_oportunidade       text
empresa                  text
responsavel_nome          text
responsavel_email          text
responsavel_cargo            text
responsavel_telefone          text
endereco_empresa                text
economic_buyer                    text  (metodologia MEDDIC)
champion                            text  (metodologia MEDDIC)
dor_cliente                          text
produtos                              text
valor_estimado_usd                     numeric
data_fechamento                         date
campos_comuns_extra                      jsonb    default '{}'
status_conjunto                           text    default 'aberto'
criado_por                                 text
criado_por_id                               uuid
urgente                                      boolean default false
created_at                                    timestamptz default CURRENT_TIMESTAMP
updated_at                                     timestamptz default CURRENT_TIMESTAMP
```

### `ro_registros` — 1 registro por fabricante dentro de um processo
```
id                   bigint       PK, nextval(ro_registros_id_seq)
processo_id           bigint      NOT NULL, FK -> ro_processos.id
fabricante_id           bigint    FK -> ro_fabricantes.id
fabricante_nome           text    (desnormalizado, cópia do nome pro histórico não quebrar se o fabricante mudar de nome)
portal_url                 text
campos                       jsonb   default '{}'  (campos específicos do fabricante — formato livre, ver ro_fabricantes.campos_especificos)
status                        text   default 'A registrar'
feito                          boolean default false
numero_ro                       text  (número do RO gerado pelo portal do fabricante, quando aplicável)
comprovante                      text  (link/referência do comprovante de registro)
data_vencimento                   date
tipo_renovacao                      text
bitrix_pendente                      boolean default true
bitrix_confirmado_em                   timestamptz
intern_id                               uuid   (quem executou o registro no portal)
intern_nome                              text
pre_vendas_id                             uuid  (quem originou/solicitou)
pre_vendas_nome                            text
handoff_status                              text  (fluxo de repasse entre pré-vendas e quem executa)
handoff_token                                text
handoff_em                                    timestamptz
feito_em                                       timestamptz
created_at                                      timestamptz default CURRENT_TIMESTAMP
updated_at                                       timestamptz default CURRENT_TIMESTAMP
```

### `ro_fabricantes` — catálogo de fabricantes suportados
```
id                     bigint       PK, nextval(ro_fabricantes_id_seq)
nome                    text        NOT NULL
portal_url               text
campos_especificos         jsonb     default '[]'  (define quais campos extras aparecem no formulário pra este fabricante)
renovacao_automatica         boolean default false
observacao                     text
ativo                            boolean default true
ordem                              integer default 100  (ordem de exibição no formulário)
email_ro                            text  (e-mail de contato do fabricante para dúvidas de registro)
created_at                           timestamptz default CURRENT_TIMESTAMP
```

Cada novo fabricante é uma LINHA nesta tabela, não uma mudança de
código — para adicionar um fabricante novo ao formulário, normalmente
não é preciso mexer em `.tsx`/`.ts`, só inserir a linha (ver também
`lib/ro/<fabricante>.ts` para casos que precisam de lógica específica
além dos campos genéricos — Cloudflare, CyberArk, Elastic, Fortinet,
Gigamon, HPE, Nutanix, Tenable, Varonis, Vectra, Zscaler já têm arquivo
próprio).

### `ro_eventos` — histórico de mudança de status de um registro
```
id             bigint       PK, nextval(ro_eventos_id_seq)
registro_id      bigint     NOT NULL, FK -> ro_registros.id
tipo               text
de_status             text
para_status             text
detalhe                   text
usuario                     text
created_at                   timestamptz default CURRENT_TIMESTAMP
```

## Como aplicar o schema num projeto Supabase novo

Não há migration runner automatizado — aplique os `.sql` na ordem
acima manualmente (Supabase Dashboard > SQL Editor, ou `psql` direto
com a `DATABASE_URL`).

## RLS

Toda tabela sensível tem RLS habilitado. Padrão comum:
`auth.role() = 'authenticated'` combinado com policies mais
específicas para as tabelas do módulo RO (um usuário só edita os
próprios registros, por exemplo — conferir `ro_collab.sql` para a
regra exata).

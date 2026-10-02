-- ============================================================================
-- MAPPER — Módulo "Registro de Oportunidade" (RO / Deal Registration)
-- Estrutura em 3 níveis: processo (DEAL) -> registros (1 por fabricante) -> eventos.
-- Bitrix é 100% manual (copiar/colar). Nada de API. Idempotente.
-- ============================================================================

-- 1) FABRICANTES (pré-mapeados; o AM só seleciona). Campos específicos configuráveis (jsonb).
CREATE TABLE IF NOT EXISTS ro_fabricantes (
  id                      BIGSERIAL PRIMARY KEY,
  nome                    TEXT UNIQUE NOT NULL,
  portal_url              TEXT,                         -- [A DEFINIR] link do portal de RO de cada fabricante
  campos_especificos      JSONB DEFAULT '[]'::jsonb,    -- [{key,label,tipo,opcoes?}] — configurável depois
  renovacao_automatica    BOOLEAN DEFAULT FALSE,        -- [A IMPLEMENTAR] alguns renovam sozinhos
  observacao              TEXT,
  ativo                   BOOLEAN DEFAULT TRUE,
  ordem                   INT DEFAULT 100,
  created_at              TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 2) PROCESSO / CONJUNTO DE ROs (o "pai" = um DEAL do Bitrix). Campos COMUNS preenchidos 1x.
CREATE TABLE IF NOT EXISTS ro_processos (
  id                      BIGSERIAL PRIMARY KEY,
  deal_id_bitrix          TEXT,
  nome_oportunidade       TEXT,
  empresa                 TEXT,
  responsavel_nome        TEXT,
  responsavel_email       TEXT,
  responsavel_cargo       TEXT,
  responsavel_telefone    TEXT,
  endereco_empresa        TEXT,
  economic_buyer          TEXT,
  champion                TEXT,
  dor_cliente             TEXT,
  produtos                TEXT,
  valor_estimado_usd      NUMERIC,
  data_fechamento         DATE,
  campos_comuns_extra     JSONB DEFAULT '{}'::jsonb,    -- p/ campos movidos de "por fabricante" -> "comum"
  status_conjunto         TEXT DEFAULT 'aberto',         -- aberto | finalizado (Intern finaliza qdo todos os ROs prontos)
  criado_por              TEXT,
  criado_por_id           UUID,
  created_at              TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3) REGISTRO (o "filho") — UM por fabricante por DEAL. Ciclo de vida independente.
CREATE TABLE IF NOT EXISTS ro_registros (
  id                      BIGSERIAL PRIMARY KEY,
  processo_id             BIGINT NOT NULL REFERENCES ro_processos(id) ON DELETE CASCADE,
  fabricante_id           BIGINT REFERENCES ro_fabricantes(id),
  fabricante_nome         TEXT,                         -- snapshot p/ exibição
  portal_url              TEXT,                         -- snapshot do link na criação
  campos                  JSONB DEFAULT '{}'::jsonb,    -- valores dos campos específicos do fabricante
  status                  TEXT DEFAULT 'A registrar',    -- A registrar | Pendente | Aprovado | Rejeitado | Renovado | Descartado
  feito                   BOOLEAN DEFAULT FALSE,         -- Intern marcou "feito" (submeteu no portal)
  numero_ro               TEXT,
  comprovante             TEXT,                          -- link/nota do print (quando não há número)
  data_vencimento         DATE,
  tipo_renovacao          TEXT,                          -- automatica | manual (quando Renovado)
  bitrix_pendente         BOOLEAN DEFAULT TRUE,          -- checklist do Bitrix ativo (reaparece a cada mudança)
  bitrix_confirmado_em    TIMESTAMPTZ,
  intern_id               UUID,
  intern_nome             TEXT,
  created_at              TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  updated_at              TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS ix_ro_registros_processo ON ro_registros(processo_id);
CREATE INDEX IF NOT EXISTS ix_ro_registros_status   ON ro_registros(status);

-- 4) EVENTOS — linha do tempo / auditoria por RO (mudanças de status, feito, confirmação do Bitrix).
CREATE TABLE IF NOT EXISTS ro_eventos (
  id                      BIGSERIAL PRIMARY KEY,
  registro_id             BIGINT NOT NULL REFERENCES ro_registros(id) ON DELETE CASCADE,
  tipo                    TEXT,                          -- status | feito | bitrix_confirmado | criado | renovado | descartado
  de_status               TEXT,
  para_status             TEXT,
  detalhe                 TEXT,
  usuario                 TEXT,
  created_at              TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS ix_ro_eventos_registro ON ro_eventos(registro_id);

-- ---------------------------------------------------------------------------
-- SEED de fabricantes (pré-mapeados; portais [A DEFINIR]). Os 4 campos específicos
-- de partida ficam iguais p/ todos e são editáveis depois.
-- ---------------------------------------------------------------------------
INSERT INTO ro_fabricantes (nome, ordem, campos_especificos) VALUES
  ('Check Point', 10, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Cisco', 20, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Fortinet', 30, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Palo Alto Networks', 40, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Cloudflare', 50, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Microsoft', 60, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Fortinet SASE', 70, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Zscaler', 80, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('CrowdStrike', 90, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('SonicWall', 100, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Sophos', 110, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Trend Micro', 120, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Aruba (HPE)', 130, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('VMware', 140, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Veeam', 150, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('HPE', 131, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Cohesity', 155, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb),
  ('Lenovo', 160, '[{"key":"len_iaas_opp","label":"Iaas Opportunity — Oportunidade de IaaS","tipo":"bool"},{"key":"len_propondo_concorrencia","label":"Propondo Produtos Da Concorrência?","tipo":"bool"},{"key":"len_description","label":"Descrição Do Registro De Oportunidade","tipo":"textarea"}]'::jsonb),
  ('Outro / a mapear', 999, '[{"key":"distribuidor","label":"Distribuidor","tipo":"text"},{"key":"concorrente","label":"Concorrente","tipo":"text"},{"key":"quantidade_licencas","label":"Quantidade de licenças","tipo":"text"},{"key":"descricao_proposta","label":"Descrição da proposta","tipo":"textarea"}]'::jsonb)
ON CONFLICT (nome) DO NOTHING;

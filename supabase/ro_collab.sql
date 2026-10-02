-- ============================================================================
-- MAPPER — RO colaborativo (AM -> Pré-vendas -> Intern) + e-mail por fabricante
-- Idempotente. Adiciona atribuição de Pré-vendas e estado de handoff ao registro,
-- e o e-mail de RO específico por fabricante (definido pelo Intern). Tudo aditivo.
-- ============================================================================

-- #4: e-mail de RO por fabricante (o Intern preenche; aparece ao fazer RO desse fabricante).
ALTER TABLE public.ro_fabricantes ADD COLUMN IF NOT EXISTS email_ro text;

-- #5: Pré-vendas atribuído + ciclo de handoff no registro (1 por fabricante).
ALTER TABLE public.ro_registros ADD COLUMN IF NOT EXISTS pre_vendas_id   uuid;
ALTER TABLE public.ro_registros ADD COLUMN IF NOT EXISTS pre_vendas_nome text;
-- handoff_status:
--   NULL / 'nao_definido'  -> sem Pré-vendas; o próprio AM preenche tudo (opção "Ainda não definido")
--   'aguardando_prevendas' -> atribuído a um SE; aguarda ele completar a parte técnica
--   'concluido_prevendas'  -> o SE completou; registro pronto para o Intern
ALTER TABLE public.ro_registros ADD COLUMN IF NOT EXISTS handoff_status  text;
ALTER TABLE public.ro_registros ADD COLUMN IF NOT EXISTS handoff_token   text;
ALTER TABLE public.ro_registros ADD COLUMN IF NOT EXISTS handoff_em      timestamptz;

CREATE INDEX IF NOT EXISTS ix_ro_registros_prevendas ON public.ro_registros(pre_vendas_id);
CREATE INDEX IF NOT EXISTS ix_ro_registros_handoff_token ON public.ro_registros(handoff_token);

-- Histórico: marca QUANDO o Intern registrou o RO (filtrar "ROs feitos esta semana/mês").
ALTER TABLE public.ro_registros ADD COLUMN IF NOT EXISTS feito_em timestamptz;
UPDATE public.ro_registros SET feito_em = updated_at WHERE feito = true AND feito_em IS NULL;

-- Urgência: o AM pode abrir um RO como urgente (fica fixado no topo p/ o Intern, e auditável).
ALTER TABLE public.ro_processos ADD COLUMN IF NOT EXISTS urgente boolean DEFAULT false;

// Dados do Deal Registration da VECTRA — mapeados do portal. Usados no Passo 2 do RO quando o
// fabricante é "Vectra".
//
// Campos comuns do Passo 1 NÃO se repetem: Deal Name -> nome_oportunidade (convenção do portal:
// "Nome da empresa_Produto Vectra"), Amount/NACV -> valor_estimado_usd, Close Date -> data_fechamento,
// Champion -> champion, Economic Buyer -> economic_buyer.
// "End User Account" (Create New/Select Existing) = o CLIENTE comum do Passo 1 ("Search Customer List",
// puxada do banco) — NÃO hardcodamos os ~31 nomes (a base muda com o tempo).

// Select Distributor = Yes -> a ÚNICA opção de distribuidor é CLM Tech.
export const VECTRA_DISTRIBUTOR: string[] = [
  "CLM Tech",
];

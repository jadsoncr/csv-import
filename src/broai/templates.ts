export type BroAIColumn = {
  name: string;                 // label PT-BR
  key: string;                  // snake_case sem acentos
  required: boolean;
  suggested_mappings: string[]; // alternativas comuns (sem vazios/duplicados)
};

export type BroAITemplate = {
  columns: BroAIColumn[];
};

// Helper: remove vazios, trim e duplicados
function cleanMappings(list: string[]) {
  return Array.from(
    new Set(
      (list || [])
        .map((s) => (typeof s === "string" ? s.trim().toLowerCase() : ""))
        .filter(Boolean)
    )
  );
}

function col(
  name: string,
  key: string,
  required: boolean,
  suggested_mappings: string[]
): BroAIColumn {
  return {
    name,
    key,
    required,
    suggested_mappings: cleanMappings(suggested_mappings),
  };
}

/* ======================
   PDV
====================== */

export const PDV_TEMPLATE: BroAITemplate = {
  columns: [
    col("Data da venda", "data_venda", true, [
      "data",
      "date",
      "data venda",
      "dt",
      "dia",
      "data_venda",
    ]),
    col("Item vendido", "item", true, [
      "item",
      "produto vendido",
      "descricao",
      "descrição",
      "nome",
      "item_nome",
    ]),
    col("Quantidade", "quantidade", true, [
      "quantidade",
      "qtd",
      "qty",
      "qtde",
      "quant",
    ]),
    col("Valor total da venda", "valor_total", true, [
      "valor",
      "total",
      "valor total",
      "amount",
      "venda",
      "valor_total",
    ]),
  ],
};

/* ======================
   NOTA FISCAL (ENTRADA)
====================== */

export const NF_TEMPLATE: BroAITemplate = {
  columns: [
    col("Data de entrada", "data_entrada", true, [
      "data",
      "date",
      "entrada",
      "dt entrada",
      "data_entrada",
    ]),
    col("Produto comprado", "produto", true, [
      "produto",
      "item",
      "descricao",
      "descrição",
      "nome",
      "produto_nome",
    ]),
    col("Quantidade", "quantidade", true, [
      "quantidade",
      "qtd",
      "qty",
      "qtde",
      "quant",
    ]),
    col("Unidade de medida", "unidade", true, [
      "unidade",
      "und",
      "un",
      "kg",
      "g",
      "l",
      "ml",
      "cx",
      "lt",
    ]),
    col("Custo total", "custo_total", true, [
      "custo",
      "valor",
      "total",
      "custo total",
      "valor total",
      "custo_total",
    ]),
    col("Fornecedor", "fornecedor", false, [
      "fornecedor",
      "vendor",
      "emitente",
      "razao social",
      "razão social",
    ]),
    col("Número da nota fiscal", "nf_numero", false, [
      "nf",
      "nota fiscal",
      "numero nf",
      "número nf",
      "invoice",
      "nf_numero",
    ]),
  ],
};

/* ======================
   FICHA TÉCNICA
====================== */

export const FICHA_TECNICA_TEMPLATE: BroAITemplate = {
  columns: [
    col("Produto final", "produto_final", true, [
      "produto final",
      "prato",
      "receita",
      "nome do prato",
      "produto_final",
    ]),
    col("Ingrediente", "ingrediente", true, [
      "ingrediente",
      "insumo",
      "matéria prima",
      "materia prima",
      "componente",
      // IMPORTANTE: não usar "produto" aqui pra não competir com Produto final
    ]),
    col("Quantidade do ingrediente", "quantidade", true, [
      "quantidade",
      "qtd",
      "qty",
      "qtde",
      "quant",
    ]),
    col("Unidade de medida", "unidade", true, [
      "unidade",
      "und",
      "un",
      "kg",
      "g",
      "l",
      "ml",
    ]),
    col("Rendimento", "rendimento", false, [
      "rendimento",
      "porcoes",
      "porções",
      "yield",
    ]),
  ],
}


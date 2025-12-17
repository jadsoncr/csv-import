/**
 * Modelos de dados para Recipes (Fichas Técnicas)
 */

/**
 * Item/Ingrediente de uma ficha técnica
 */
export type RecipeItem = {
  id: string;
  name: string;
  qty: number;
  unit: string; // ex: g, ml, un
  costUnit: number; // custo por unidade
};

/**
 * Recipe (Ficha Técnica)
 */
export type Recipe = {
  id: string;
  name: string;
  yieldQty: number; // rendimento (porções)
  yieldUnit: string; // porções, copos, unidades etc
  salePrice: number; // preço de venda do item
  items: RecipeItem[];
  itemsCount?: number;
  updatedAt?: string;
};

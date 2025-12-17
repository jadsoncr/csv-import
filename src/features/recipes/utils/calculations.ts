/**
 * Funções puras para cálculos de Fichas Técnicas
 */

import { RecipeItem } from '../../../models/recipes';

/**
 * Calcula o custo total dos itens
 */
export const calcTotalCost = (items: RecipeItem[]): number => {
  return items.reduce((total, item) => total + item.qty * item.costUnit, 0);
};

/**
 * Calcula o custo por porção
 */
export const calcCostPerPortion = (totalCost: number, yieldQty: number): number => {
  if (yieldQty <= 0) return 0;
  return totalCost / yieldQty;
};

/**
 * Calcula o CMV percentual
 */
export const calcCmvPercent = (costPerPortion: number, salePrice: number): number => {
  if (salePrice <= 0) return 0;
  return (costPerPortion / salePrice) * 100;
};

/**
 * Calcula a margem bruta (valor e percentual)
 */
export const calcMargin = (
  costPerPortion: number,
  salePrice: number
): { value: number; percent: number } => {
  const value = salePrice - costPerPortion;
  const percent = salePrice > 0 ? (value / salePrice) * 100 : 0;
  return { value, percent };
};

/**
 * Calcula o preço mínimo recomendado para atingir um CMV alvo
 */
export const calcMinPriceForTargetCmv = (
  costPerPortion: number,
  targetCmvPercent: number
): number => {
  if (targetCmvPercent <= 0 || targetCmvPercent >= 100) return 0;
  return costPerPortion / (targetCmvPercent / 100);
};


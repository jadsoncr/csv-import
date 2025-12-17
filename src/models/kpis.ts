/**
 * Modelos de dados para KPIs
 */

/**
 * Card de KPI individual
 * Pode conter variação (delta) para modo comparativo
 */
export type KpiCard = {
  id: string;
  label: string;
  value: number | string;
  unit?: string;
  trend?: 'up' | 'down' | 'flat';
  deltaValue?: number | string;
  deltaLabel?: string;
};

export type TopImpact = {
  label: string;
  value: number;
  unit?: string;
};

export type RecipeIndicator = {
  label: string;
  value: number | string;
  description?: string;
  ctaLabel?: string;
};

/**
 * Resposta da API de KPIs
 */
export type KpisResponse = {
  cards: KpiCard[];
  topImpacts?: TopImpact[];
  recipeIndicator?: RecipeIndicator;
  usageHealth?: string;
};


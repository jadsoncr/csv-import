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
  sparkline?: number[]; // Últimos 7 pontos para mini-gráfico de tendência
  benchmark?: {
    min: number;
    max: number;
    label: string; // ex: "Ideal: 30-35%"
  };
};

export type TopImpact = {
  label: string;
  value: number;
  unit?: string;
  recipeId?: string; // ID da ficha técnica relacionada (para deep-link)
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
  executiveSummary?: ExecutiveSummary; // Novo: resumo do que mudou
};

/**
 * Resumo executivo: destaque do que realmente importa
 */
export type ExecutiveSummary = {
  headline: string; // Ex: "Sua margem melhorou 3% este mês"
  insights: string[]; // Lista de 2-3 insights curtos
  alerts?: string[]; // Alertas de atenção (opcional)
};


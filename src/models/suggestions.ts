/**
 * Modelos de dados para Sugestões com IA
 */

/**
 * Sugestão de ação orientada por dados
 * Sempre inclui fonte explícita para transparência
 */
export type Suggestion = {
  id: string;
  text: string; // Texto curto e acionável
  source: string; // Fonte explícita da sugestão
  recipeId?: string; // ID da ficha técnica relacionada (se aplicável)
  action?: {
    label: string;
    link: string;
  };
};

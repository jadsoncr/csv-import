import { get } from './apiClient';
import { endpoints } from './endpoints';
import { Suggestion } from '../models/suggestions';
import { USE_MOCKS } from '../config/env';
import { sleep } from '../utils/sleep';

/**
 * Service para Sugestões com IA
 */

/**
 * Mock de sugestões para desenvolvimento
 * Baseado em regras de negócio + dados do período
 */
const buildMockSuggestions = (): Suggestion[] => {
  return [
    {
      id: '1',
      text: 'Ajustar a proporção de Alcatra pode economizar cerca de R$ 450/mês mantendo a qualidade.',
      source: 'Dados dez/2025 • Regra: CMV do item 12% acima da média ideal (25%) • Ref: Boas práticas do setor',
      recipeId: '1',
      action: {
        label: 'Revisar ficha técnica',
        link: '/fichas-tecnicas?recipeId=1&from=dashboard',
      },
    },
    {
      id: '2',
      text: 'Óleo de fritura representa 4% do seu CMV. Reduzir trocas pode gerar economia sem impactar sabor.',
      source: 'Dados dez/2025 • Regra: custo de fritura acima de 3% • Ref: Manual de gestão operacional',
      recipeId: '4',
      action: {
        label: 'Ver recomendações',
        link: '/fichas-tecnicas?recipeId=4&from=dashboard',
      },
    },
  ];
};

/**
 * Busca sugestões da API (ou mock)
 */
export const getSuggestions = async (): Promise<Suggestion[]> => {
  if (USE_MOCKS) {
    await sleep(300);
    return buildMockSuggestions();
  }

  // Quando o backend estiver pronto:
  // return get<Suggestion[]>(endpoints.suggestions());
  
  // Por enquanto, retorna mock mesmo em produção
  return buildMockSuggestions();
};

import { get } from './apiClient';
import { endpoints } from './endpoints';
import { KpisResponse } from '../models/kpis';
import { USE_MOCKS } from '../config/env';
import { sleep } from '../utils/sleep';

/**
 * Service para KPIs
 */

/**
 * Parâmetros opcionais para buscar KPIs
 */
export interface GetKpisParams {
  from?: string; // Data inicial (ISO string)
  to?: string;   // Data final (ISO string)
  compareFrom?: string; // Período comparativo (quando aplicável)
  compareTo?: string;
}

/**
 * Mock de dados de KPIs para desenvolvimento
 */
const buildMockKpis = (params?: GetKpisParams): KpisResponse => {
  const isCompare = !!(params?.compareFrom && params?.compareTo);

  return {
    cards: [
      {
        id: 'faturamento',
        label: 'Faturamento (PDV)',
        value: 'R$ 185.200',
        unit: 'R$',
        trend: 'up',
        deltaValue: isCompare ? '+8%' : undefined,
        deltaLabel: isCompare ? 'vs mês anterior' : undefined,
      },
      {
        id: 'cmv',
        label: 'CMV Real',
        value: 'R$ 72.800 (39%)',
        unit: 'R$',
        trend: 'flat',
        deltaValue: isCompare ? '+2 p.p.' : undefined,
        deltaLabel: isCompare ? 'vs mês anterior' : undefined,
      },
      {
        id: 'lucro-bruto',
        label: 'Lucro Bruto Estimado',
        value: 'R$ 112.400',
        unit: 'R$',
        trend: 'up',
        deltaValue: isCompare ? '+6%' : undefined,
        deltaLabel: isCompare ? 'vs mês anterior' : undefined,
      },
      {
        id: 'margem-bruta',
        label: 'Margem Bruta',
        value: '61%',
        unit: '%',
        trend: 'flat',
        deltaValue: isCompare ? '+1.2 p.p.' : undefined,
        deltaLabel: isCompare ? 'vs mês anterior' : undefined,
      },
      {
        id: 'perdas',
        label: 'Perdas / Ajustes',
        value: 'R$ 4.300',
        unit: 'R$',
        trend: 'down',
        deltaValue: isCompare ? '-3%' : undefined,
        deltaLabel: isCompare ? 'vs mês anterior' : undefined,
      },
      {
        id: 'saude-uso',
        label: 'Saúde do uso',
        value: 'Último envio há 12h',
        trend: 'up',
      },
    ],
    topImpacts: [
      { label: 'Alcatra (carne)', value: 18200, unit: 'R$' },
      { label: 'Filé de frango', value: 12400, unit: 'R$' },
      { label: 'Queijo muçarela', value: 9800, unit: 'R$' },
      { label: 'Óleo de fritura', value: 7400, unit: 'R$' },
      { label: 'Embalagem delivery', value: 5200, unit: 'R$' },
    ],
    recipeIndicator: {
      label: '% do cardápio acima do CMV alvo',
      value: '28%',
      description: 'Itens que podem ser ajustados via Ficha Técnica',
      ctaLabel: 'Revisar fichas técnicas',
    },
    usageHealth: 'Último envio há 12 horas',
  };
};

/**
 * Busca KPIs da API
 */
export const getKpis = async (params?: GetKpisParams): Promise<KpisResponse> => {
  if (USE_MOCKS) {
    await sleep(400);
    return buildMockKpis(params);
  }

  const queryParams = new URLSearchParams();
  if (params?.from) queryParams.append('from', params.from);
  if (params?.to) queryParams.append('to', params.to);
  if (params?.compareFrom) queryParams.append('compareFrom', params.compareFrom);
  if (params?.compareTo) queryParams.append('compareTo', params.compareTo);

  const queryString = queryParams.toString();
  const endpoint = queryString ? `${endpoints.kpis()}?${queryString}` : endpoints.kpis();

  return get<KpisResponse>(endpoint);
};


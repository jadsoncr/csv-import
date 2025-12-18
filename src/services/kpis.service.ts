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
        sparkline: [165000, 170000, 172000, 178000, 180000, 183000, 185200], // Últimos 7 dias
      },
      {
        id: 'cmv',
        label: 'CMV Real',
        value: 'R$ 72.800 (39%)',
        unit: 'R$',
        trend: 'flat',
        deltaValue: isCompare ? '+2 p.p.' : undefined,
        deltaLabel: isCompare ? 'vs mês anterior' : undefined,
        sparkline: [38, 37, 39, 40, 38, 39, 39], // % dos últimos 7 dias
        benchmark: {
          min: 30,
          max: 35,
          label: 'Ideal: 30-35% (bares/restaurantes típicos)',
        },
      },
      {
        id: 'lucro-bruto',
        label: 'Lucro Bruto Estimado',
        value: 'R$ 112.400',
        unit: 'R$',
        trend: 'up',
        deltaValue: isCompare ? '+6%' : undefined,
        deltaLabel: isCompare ? 'vs mês anterior' : undefined,
        sparkline: [102000, 105000, 106000, 109000, 110000, 111000, 112400],
      },
      {
        id: 'margem-bruta',
        label: 'Margem Bruta',
        value: '61%',
        unit: '%',
        trend: 'flat',
        deltaValue: isCompare ? '+1.2 p.p.' : undefined,
        deltaLabel: isCompare ? 'vs mês anterior' : undefined,
        sparkline: [59, 60, 60, 61, 61, 60, 61],
        benchmark: {
          min: 55,
          max: 65,
          label: 'Saudável: 55-65%',
        },
      },
      {
        id: 'perdas',
        label: 'Perdas / Ajustes',
        value: 'R$ 4.300',
        unit: 'R$',
        trend: 'down',
        deltaValue: isCompare ? '-3%' : undefined,
        deltaLabel: isCompare ? 'vs mês anterior' : undefined,
        sparkline: [5200, 5000, 4800, 4600, 4500, 4400, 4300],
      },
      {
        id: 'saude-uso',
        label: 'Saúde do uso',
        value: 'Último envio há 12h',
        trend: 'up',
      },
    ],
    topImpacts: [
      { label: 'Alcatra (carne)', value: 18200, unit: 'R$', recipeId: '1' },
      { label: 'Filé de frango', value: 12400, unit: 'R$', recipeId: '2' },
      { label: 'Queijo muçarela', value: 9800, unit: 'R$', recipeId: '3' },
      { label: 'Óleo de fritura', value: 7400, unit: 'R$', recipeId: '4' },
      { label: 'Embalagem delivery', value: 5200, unit: 'R$' },
    ],
    recipeIndicator: {
      label: '% do cardápio acima do CMV alvo',
      value: '28%',
      description: 'Itens que podem ser ajustados via Ficha Técnica',
      ctaLabel: 'Revisar fichas técnicas',
    },
    usageHealth: 'Último envio há 12 horas',
    executiveSummary: {
      headline: 'Sua operação está 4% mais eficiente que o mês passado',
      insights: [
        'Faturamento cresceu 8%, enquanto CMV subiu apenas 2%',
        'Perdas diminuíram R$ 300 comparado ao período anterior',
        'Margem está saudável (61%), acima da média do setor (55-58%)',
      ],
      alerts: [
        'CMV está 4 pontos acima do ideal (39% vs 30-35%). Ajustar Alcatra pode economizar R$ 450/mês',
      ],
    },
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


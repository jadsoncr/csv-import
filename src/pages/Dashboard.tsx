import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { PeriodFilter, PeriodState } from '../components/ui/PeriodFilter';
import { Sparkline } from '../components/ui/Sparkline';
import { getKpis } from '../services/kpis.service';
import { getSuggestions } from '../services/suggestions.service';
import { KpiCard, KpisResponse } from '../models/kpis';
import { Suggestion } from '../models/suggestions';
import { toHumanMessage } from '../services/errors';

/**
 * Frase-guia fixa do produto
 */
const PRODUCT_GUIDE = 'O BRO.AI transforma dados operacionais em decisões simples que aumentam o faturamento e reduzem desperdício.';

/**
 * Página Dashboard V1
 * Foco: visão orientada à decisão financeira
 */
export const Dashboard: React.FC = () => {
  const [period, setPeriod] = useState<PeriodState>(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    return {
      mode: 'custom',
      from: firstDay.toISOString().split('T')[0],
      to: lastDay.toISOString().split('T')[0],
    };
  });

  const [data, setData] = useState<KpisResponse | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKpis = async (p: PeriodState) => {
    try {
      setLoading(true);
      setError(null);
      const [kpisResponse, suggestionsResponse] = await Promise.all([
        getKpis({
          from: p.from,
          to: p.to,
          compareFrom: p.compare?.from,
          compareTo: p.compare?.to,
        }),
        getSuggestions(),
      ]);
      setData(kpisResponse);
      setSuggestions(suggestionsResponse);
    } catch (err) {
      setError(toHumanMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchKpis(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period.from, period.to, period.compare?.from, period.compare?.to]);

  const handleRetry = () => fetchKpis(period);

  const mainCardsOrder = ['faturamento', 'cmv', 'lucro-bruto', 'margem-bruta', 'perdas', 'saude-uso'];

  const mainCards = useMemo(() => {
    if (!data?.cards) return [];
    const map: Record<string, KpiCard> = {};
    data.cards.forEach((c) => (map[c.id] = c));
    return mainCardsOrder.map((id) => map[id]).filter(Boolean) as KpiCard[];
  }, [data]);

  const renderCard = (card: KpiCard) => {
    const isPositive = card.deltaValue && card.deltaValue.includes('+');
    const isNegative = card.deltaValue && card.deltaValue.includes('-');
    const hasBenchmark = !!card.benchmark;
    const currentValue = typeof card.value === 'string' 
      ? parseFloat(card.value.replace(/[^\d.-]/g, '')) 
      : card.value;
    
    // Verifica se está fora do benchmark
    const isAboveBenchmark = hasBenchmark && currentValue > (card.benchmark?.max || 0);
    const isBelowBenchmark = hasBenchmark && currentValue < (card.benchmark?.min || 0);
    
    return (
      <div
        key={card.id}
        style={{
          backgroundColor: '#0A0A0A',
          border: '1px solid #1F1F1F',
          borderRadius: 12,
          padding: 20,
          minWidth: 220,
          transition: 'all 0.2s ease',
          cursor: 'default',
          position: 'relative',
          overflow: 'hidden',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#2A2A2A';
          e.currentTarget.style.transform = 'translateY(-2px)';
          e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#1F1F1F';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        {/* Indicador sutil de status */}
        {isNegative && card.id === 'lucro-bruto' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, #EF4444, #DC2626)',
          }} />
        )}
        {isPositive && card.id === 'lucro-bruto' && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, #10B981, #059669)',
          }} />
        )}
        {isAboveBenchmark && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: 'linear-gradient(90deg, #F59E0B, #D97706)',
          }} />
        )}
        
        <div style={{ color: '#71717A', fontSize: 12, fontWeight: 500, marginBottom: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          {card.label}
        </div>
        
        {/* Valor principal */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 8 }}>
          <div style={{ color: '#FFFFFF', fontSize: 32, fontWeight: 700, letterSpacing: '-0.02em' }}>
            {card.value}
          </div>
          {/* Mini-gráfico de tendência */}
          {card.sparkline && card.sparkline.length > 0 && (
            <Sparkline 
              data={card.sparkline} 
              width={60} 
              height={24} 
              color={isPositive ? '#10B981' : isNegative ? '#EF4444' : '#3B82F6'}
            />
          )}
        </div>
        
        {/* Delta */}
        {card.deltaValue && (
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13,
            fontWeight: 500,
            color: isPositive ? '#10B981' : isNegative ? '#EF4444' : '#71717A',
            backgroundColor: isPositive ? 'rgba(16, 185, 129, 0.1)' : isNegative ? 'rgba(239, 68, 68, 0.1)' : 'transparent',
            padding: '4px 8px',
            borderRadius: 6,
            marginBottom: hasBenchmark ? 8 : 0,
          }}>
            {isPositive ? '↗' : isNegative ? '↘' : '→'} {card.deltaValue} {card.deltaLabel || ''}
          </div>
        )}
        
        {/* Benchmark */}
        {hasBenchmark && (
          <div style={{
            marginTop: 12,
            padding: '8px 10px',
            backgroundColor: isAboveBenchmark ? 'rgba(245, 158, 11, 0.1)' : isBelowBenchmark ? 'rgba(239, 68, 68, 0.1)' : 'rgba(59, 130, 246, 0.1)',
            borderRadius: 6,
            border: `1px solid ${isAboveBenchmark ? '#F59E0B' : isBelowBenchmark ? '#EF4444' : '#3B82F6'}30`,
          }}>
            <div style={{ fontSize: 11, color: '#71717A', marginBottom: 4 }}>
              {isAboveBenchmark ? '⚠️ Acima do ideal' : isBelowBenchmark ? '⚠️ Abaixo do ideal' : '✓ Dentro da faixa'}
            </div>
            <div style={{ fontSize: 12, color: '#A1A1AA', lineHeight: 1.4 }}>
              {card.benchmark.label}
            </div>
          </div>
        )}
        
        {card.id === 'cmv' && !hasBenchmark && (
          <div style={{ color: '#52525B', fontSize: 12, marginTop: 12, lineHeight: 1.4 }}>
            Ajustável via Ficha Técnica
          </div>
        )}
      </div>
    );
  };

  const renderTopImpacts = () => {
    if (!data?.topImpacts || data.topImpacts.length === 0) return null;
    const top = data.topImpacts.slice(0, 5);
    
    const maxValue = Math.max(...top.map(item => item.value));
    
    return (
      <div style={{ backgroundColor: '#0A0A0A', border: '1px solid #1F1F1F', borderRadius: 12, padding: 24 }}>
        <div style={{ marginBottom: 20 }}>
          <div style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 600, marginBottom: 4 }}>
            Maiores impactos no CMV
          </div>
          <p style={{ color: '#71717A', fontSize: 13, margin: 0 }}>
            Esses itens representam a maior parte do seu custo
          </p>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 20 }}>
          {top.map((item, index) => {
            const percentage = (item.value / maxValue) * 100;
            return (
              <div key={item.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{
                      width: 24,
                      height: 24,
                      borderRadius: 6,
                      backgroundColor: index === 0 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(71, 85, 105, 0.2)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 11,
                      fontWeight: 600,
                      color: index === 0 ? '#EF4444' : '#94A3B8',
                    }}>
                      {index + 1}
                    </div>
                    <span style={{ color: '#E5E7EB', fontSize: 14, fontWeight: 500 }}>{item.label}</span>
                  </div>
                  <span style={{ color: '#FFFFFF', fontSize: 14, fontWeight: 600 }}>
                    {item.unit === '%' ? `${item.value}%` : formatCurrency(item.value)}
                  </span>
                </div>
                <div style={{ 
                  width: '100%', 
                  height: 4, 
                  backgroundColor: '#18181B', 
                  borderRadius: 2,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: index === 0 
                      ? 'linear-gradient(90deg, #EF4444, #DC2626)'
                      : 'linear-gradient(90deg, #3B82F6, #2563EB)',
                    transition: 'width 0.5s ease',
                  }} />
                </div>
              </div>
            );
          })}
        </div>
        
        <button 
          style={{
            ...actionButtonStyle,
            width: '100%',
          }}
          onClick={() => {
            const firstWithRecipe = top.find(item => item.recipeId);
            const targetId = firstWithRecipe?.recipeId || '1';
            window.location.assign(`/fichas-tecnicas?recipeId=${targetId}&from=dashboard`);
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#2563EB';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#1E40AF';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          Revisar fichas técnicas →
        </button>
      </div>
    );
  };

  const renderRecipeIndicator = () => {
    if (!data?.recipeIndicator) return null;
    const r = data.recipeIndicator;
    return (
      <div style={{ 
        backgroundColor: '#0A0A0A', 
        border: '1px solid #1F1F1F', 
        borderRadius: 12, 
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ 
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            backgroundColor: 'rgba(251, 191, 36, 0.1)',
            padding: '4px 10px',
            borderRadius: 6,
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 14 }}>⚠️</span>
            <span style={{ color: '#FCD34D', fontSize: 12, fontWeight: 500 }}>Atenção</span>
          </div>
          
          <div style={{ color: '#71717A', fontSize: 12, fontWeight: 500, marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {r.label}
          </div>
          <div style={{ color: '#FFFFFF', fontSize: 28, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>
            {r.value}
          </div>
          <p style={{ color: '#A1A1AA', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
            {r.description || 'Itens acima do CMV ideal podem ser ajustados'}
          </p>
        </div>
        
        <button 
          style={{
            ...secondaryButtonStyle,
            marginTop: 16,
          }}
          onClick={() => window.location.assign('/fichas-tecnicas?from=dashboard')}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#18181B';
            e.currentTarget.style.borderColor = '#3B82F6';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'transparent';
            e.currentTarget.style.borderColor = '#27272A';
          }}
        >
          {r.ctaLabel || 'Revisar fichas técnicas'}
        </button>
      </div>
    );
  };

  /**
   * Bloco "O que merece sua atenção hoje"
   * Prioriza o insight mais crítico disponível
   */
  const renderAttentionBlock = () => {
    if (!data) return null;

    // Prioridade: topImpacts[0] > recipeIndicator
    const topImpact = data.topImpacts?.[0];
    const recipeInd = data.recipeIndicator;

    if (!topImpact && !recipeInd) return null;

    let title: string;
    let description: string;
    let ctaLabel: string;
    let ctaLink: string;

    if (topImpact) {
      title = `${topImpact.label} é o maior impacto no seu CMV`;
      description = `Este item representa ${formatCurrency(topImpact.value)} do seu custo. Pequenos ajustes aqui podem melhorar significativamente sua margem.`;
      ctaLabel = 'Abrir ficha técnica';
      ctaLink = `/fichas-tecnicas?recipeId=${topImpact.recipeId || '1'}&from=dashboard`;
    } else if (recipeInd) {
      title = recipeInd.label;
      description = recipeInd.description || 'Alguns itens do cardápio podem ser otimizados.';
      ctaLabel = 'Ver fichas técnicas';
      ctaLink = '/fichas-tecnicas?from=dashboard';
    } else {
      return null;
    }

    return (
      <div
        style={{
          backgroundColor: '#1E293B',
          border: '1px solid #334155',
          borderRadius: 8,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ fontSize: 24 }}>💡</div>
          <div style={{ flex: 1 }}>
            <h2 style={{ color: '#FFF', fontSize: 18, fontWeight: 600, margin: '0 0 8px 0' }}>
              O que merece sua atenção hoje
            </h2>
            <h3 style={{ color: '#E2E8F0', fontSize: 15, fontWeight: 500, margin: '0 0 8px 0' }}>
              {title}
            </h3>
            <p style={{ color: '#94A3B8', fontSize: 14, margin: '0 0 16px 0', lineHeight: 1.5 }}>
              {description}
            </p>
            <button
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#3B82F6',
              }}
              onClick={() => window.location.assign(ctaLink)}
            >
              {ctaLabel}
            </button>
          </div>
        </div>
      </div>
    );
  };

  /**
   * Card de sugestão com IA + fonte explícita
   */
  const renderSuggestionCard = () => {
    if (!suggestions || suggestions.length === 0) return null;

    const suggestion = suggestions[0]; // Mostra apenas a primeira

    return (
      <div
        style={{
          backgroundColor: '#0F172A',
          border: '1px solid #1E293B',
          borderRadius: 8,
          padding: 20,
          marginBottom: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
          <div style={{ fontSize: 24 }}>🤖</div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: '#FFF', fontSize: 16, fontWeight: 600, margin: '0 0 8px 0' }}>
              Sugestão baseada em dados
            </h3>
            <p style={{ color: '#E2E8F0', fontSize: 14, margin: '0 0 12px 0', lineHeight: 1.6 }}>
              {suggestion.text}
            </p>
            <div
              style={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: 4,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ color: '#94A3B8', fontSize: 12, marginBottom: 4, fontWeight: 600 }}>
                FONTE DA SUGESTÃO
              </div>
              <div style={{ color: '#CBD5E1', fontSize: 13, lineHeight: 1.5 }}>
                {suggestion.source}
              </div>
            </div>
            {suggestion.action && (
              <button
                style={{
                  ...linkButtonStyle,
                  textDecoration: 'none',
                  color: '#60A5FA',
                  fontSize: 14,
                  fontWeight: 500,
                }}
                onClick={() => window.location.assign(suggestion.action!.link)}
              >
                {suggestion.action.label} →
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ padding: 32, textAlign: 'center' }}>
          <p style={{ color: '#A1A1AA', fontSize: 15, margin: 0 }}>
            Organizando seus dados do período...
          </p>
        </div>
      );
    }

    if (error) {
      return (
        <div style={errorBoxStyle}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, marginBottom: 6 }}>Algo deu errado</div>
              <div style={{ marginBottom: 16, fontSize: 14, color: '#FCA5A5', lineHeight: 1.5 }}>{error}</div>
              <button 
                onClick={handleRetry} 
                style={{
                  ...primaryButtonStyle,
                  backgroundColor: '#DC2626',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#B91C1C';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#DC2626';
                }}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      );
    }

    if (!data || !data.cards || data.cards.length === 0) {
      return (
        <div style={emptyBoxStyle}>
          <div style={{ marginBottom: 8, color: '#FFF', fontWeight: 600 }}>Ainda não há dados para este período</div>
          <p style={{ color: '#A1A1AA', marginBottom: 12 }}>
            Importe seus dados de vendas e custos para começar a ver insights financeiros.
          </p>
          <button style={primaryButtonStyle} onClick={() => window.location.assign('/importar')}>
            Importar dados agora
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Blocos de IA lado a lado (estilo kanban) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
          {renderAttentionBlock()}
          {renderSuggestionCard()}
        </div>

        {/* Cards principais */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 12 }}>
          {mainCards.map(renderCard)}
        </div>

        {/* Blocos secundários */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, minHeight: 200 }}>
          {renderTopImpacts()}
          {renderRecipeIndicator()}
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 40 }}>
      <div>
        <PageHeader title="Dashboard" />
        <p style={{ color: '#71717A', marginTop: 8, fontSize: 14, lineHeight: 1.6, maxWidth: 720 }}>
          {PRODUCT_GUIDE}
        </p>
      </div>

      <PeriodFilter value={period} onChange={setPeriod} />

      {renderContent()}
    </div>
  );
};

// Helpers de formatação e estilos
const formatCurrency = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

const thStyle: React.CSSProperties = {
  padding: 10,
  textAlign: 'left',
  color: '#FFF',
  fontSize: 13,
  borderBottom: '1px solid #222',
};

const tdStyle: React.CSSProperties = {
  padding: 10,
  color: '#E5E7EB',
  fontSize: 13,
};

const linkButtonStyle: React.CSSProperties = {
  background: 'transparent',
  color: '#60A5FA',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontSize: 13,
  fontWeight: 500,
  textDecoration: 'none',
  transition: 'color 0.2s ease',
};

const actionButtonStyle: React.CSSProperties = {
  padding: '12px 20px',
  backgroundColor: '#1E40AF',
  color: '#FFF',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14,
  transition: 'all 0.2s ease',
  boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
};

const secondaryButtonStyle: React.CSSProperties = {
  padding: '10px 16px',
  backgroundColor: 'transparent',
  color: '#93C5FD',
  border: '1px solid #27272A',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 500,
  fontSize: 13,
  transition: 'all 0.2s ease',
  width: '100%',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '12px 24px',
  backgroundColor: '#2563EB',
  color: '#FFF',
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  fontWeight: 600,
  fontSize: 14,
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 4px rgba(37, 99, 235, 0.3)',
};

const errorBoxStyle: React.CSSProperties = {
  padding: 20,
  backgroundColor: 'rgba(127, 29, 29, 0.2)',
  color: '#FCA5A5',
  borderRadius: 12,
  border: '1px solid rgba(239, 68, 68, 0.3)',
  maxWidth: 520,
};

const emptyBoxStyle: React.CSSProperties = {
  padding: 32,
  backgroundColor: '#0A0A0A',
  color: '#FFF',
  borderRadius: 12,
  border: '1px dashed #27272A',
  maxWidth: 520,
  textAlign: 'center',
};

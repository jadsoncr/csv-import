import React, { useEffect, useMemo, useState } from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { PeriodFilter, PeriodState, buildLast12Range, buildMonthRange, buildPreviousMonthRange } from '../components/ui/PeriodFilter';
import { getKpis } from '../services/kpis.service';
import { KpiCard, KpisResponse } from '../models/kpis';
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
    const monthIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const base = buildMonthRange(monthIso);
    const prev = buildPreviousMonthRange(monthIso);
    return {
      mode: 'month',
      from: base.from,
      to: base.to,
      compare: { ...prev, label: 'vs mês anterior' },
    };
  });

  const [data, setData] = useState<KpisResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchKpis = async (p: PeriodState) => {
    try {
      setLoading(true);
      setError(null);
      const response = await getKpis({
        from: p.from,
        to: p.to,
        compareFrom: p.compare?.from,
        compareTo: p.compare?.to,
      });
      setData(response);
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
    return (
      <div
        key={card.id}
        style={{
          backgroundColor: '#111111',
          border: '1px solid #222',
          borderRadius: 8,
          padding: 16,
          minWidth: 220,
        }}
      >
        <div style={{ color: '#A1A1AA', fontSize: 13, marginBottom: 8 }}>{card.label}</div>
        <div style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700, marginBottom: 8 }}>{card.value}</div>
        {card.deltaValue && (
          <div style={{ color: '#A1A1AA', fontSize: 13 }}>
            {card.deltaValue} {card.deltaLabel || ''}
          </div>
        )}
        {card.id === 'cmv' && (
          <div style={{ color: '#A1A1AA', fontSize: 12, marginTop: 8 }}>
            CMV explicado e ajustável via Ficha Técnica.
          </div>
        )}
      </div>
    );
  };

  const renderTopImpacts = () => {
    if (!data?.topImpacts || data.topImpacts.length === 0) return null;
    const top = data.topImpacts.slice(0, 5);
    return (
      <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: 8, padding: 16 }}>
        <div style={{ color: '#FFF', fontWeight: 600, marginBottom: 8 }}>Top impactos no CMV</div>
        <p style={{ color: '#A1A1AA', fontSize: 13, marginBottom: 12 }}>
          Esses itens explicam boa parte do seu CMV.
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1a1a1a' }}>
              <th style={thStyle}>Item</th>
              <th style={thStyle}>Impacto</th>
            </tr>
          </thead>
          <tbody>
            {top.map((item) => (
              <tr key={item.label} style={{ borderBottom: '1px solid #222' }}>
                <td style={tdStyle}>{item.label}</td>
                <td style={{ ...tdStyle, textAlign: 'right' }}>
                  {item.unit === '%' ? `${item.value}%` : formatCurrency(item.value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ marginTop: 12 }}>
          <button style={linkButtonStyle}>Ver fichas técnicas desses itens</button>
        </div>
      </div>
    );
  };

  const renderRecipeIndicator = () => {
    if (!data?.recipeIndicator) return null;
    const r = data.recipeIndicator;
    return (
      <div style={{ backgroundColor: '#111', border: '1px solid #222', borderRadius: 8, padding: 16 }}>
        <div style={{ color: '#FFF', fontWeight: 600, marginBottom: 8 }}>{r.label}</div>
        <div style={{ color: '#FFFFFF', fontSize: 24, fontWeight: 700, marginBottom: 4 }}>{r.value}</div>
        <p style={{ color: '#A1A1AA', fontSize: 13, marginBottom: 12 }}>
          {r.description || 'Itens acima do CMV ideal podem ser ajustados via Ficha Técnica.'}
        </p>
        <button style={linkButtonStyle}>{r.ctaLabel || 'Revisar fichas técnicas'}</button>
      </div>
    );
  };

  const renderContent = () => {
    if (loading) {
      return <p style={{ color: '#A1A1AA' }}>Carregando visão do período...</p>;
    }

    if (error) {
      return (
        <div style={errorBoxStyle}>
          <div><strong>Algo deu errado.</strong></div>
          <div style={{ margin: '4px 0 12px 0' }}>{error}</div>
          <button onClick={handleRetry} style={primaryButtonStyle}>Tentar novamente</button>
        </div>
      );
    }

    if (!data || !data.cards || data.cards.length === 0) {
      return (
        <div style={emptyBoxStyle}>
          <div style={{ marginBottom: 8, color: '#FFF', fontWeight: 600 }}>Sem dados ainda</div>
          <p style={{ color: '#A1A1AA', marginBottom: 12 }}>
            Importe dados para visualizar o desempenho financeiro.
          </p>
          <button style={primaryButtonStyle} onClick={() => window.location.assign('/importar')}>
            Importar dados
          </button>
        </div>
      );
    }

    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <PageHeader title="Dashboard" />
      <p style={{ color: '#A1A1AA', marginTop: -8 }}>{PRODUCT_GUIDE}</p>

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
  color: '#93C5FD',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontSize: 13,
  textDecoration: 'underline',
};

const primaryButtonStyle: React.CSSProperties = {
  padding: '10px 18px',
  backgroundColor: '#2563EB',
  color: '#FFF',
  border: 'none',
  borderRadius: 6,
  cursor: 'pointer',
  fontWeight: 600,
};

const errorBoxStyle: React.CSSProperties = {
  padding: 16,
  backgroundColor: '#7F1D1D',
  color: '#FCA5A5',
  borderRadius: 8,
  maxWidth: 480,
};

const emptyBoxStyle: React.CSSProperties = {
  padding: 20,
  backgroundColor: '#111',
  color: '#FFF',
  borderRadius: 8,
  border: '1px dashed #333',
  maxWidth: 520,
};

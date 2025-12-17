import React, { useMemo } from 'react';
import { colors } from '../../styles/tokens';

export type PeriodState = {
  mode: 'month' | 'last12';
  from: string;
  to: string;
  compare?: {
    from: string;
    to: string;
    label: string; // ex: "vs mês anterior"
  };
};

interface PeriodFilterProps {
  value: PeriodState;
  onChange: (next: PeriodState) => void;
}

/**
 * Filtro de período simples
 * - Modo mês (seleção de mês e toggle de comparação com mês anterior)
 * - Modo últimos 12 meses
 */
export const PeriodFilter: React.FC<PeriodFilterProps> = ({ value, onChange }) => {
  const monthValue = useMemo(() => value.from.slice(0, 7), [value.from]);

  const handleModeChange = (mode: 'month' | 'last12') => {
    if (mode === 'last12') {
      const { from, to } = buildLast12Range();
      onChange({ mode, from, to });
      return;
    }
    const { from, to } = buildMonthRange(monthValue);
    onChange({ mode, from, to });
  };

  const handleMonthChange = (month: string) => {
    const { from, to } = buildMonthRange(month);
    onChange({ mode: 'month', from, to, compare: value.compare });
  };

  const handleToggleCompare = (checked: boolean) => {
    if (value.mode !== 'month') return;
    if (!checked) {
      onChange({ ...value, compare: undefined });
      return;
    }
    const { from: currentFrom, to: currentTo } = buildMonthRange(monthValue);
    const prev = buildPreviousMonthRange(monthValue);
    onChange({
      mode: 'month',
      from: currentFrom,
      to: currentTo,
      compare: { ...prev, label: 'vs mês anterior' },
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 12,
        alignItems: 'center',
        padding: 12,
        border: `1px solid ${colors.muted}20`,
        borderRadius: 8,
        backgroundColor: colors.surface,
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ color: colors.muted, fontSize: 14 }}>Período</label>
        <select
          value={value.mode}
          onChange={(e) => handleModeChange(e.target.value as 'month' | 'last12')}
          style={selectStyle}
        >
          <option value="month">Mês</option>
          <option value="last12">Últimos 12 meses</option>
        </select>
      </div>

      {value.mode === 'month' && (
        <input
          type="month"
          value={monthValue}
          onChange={(e) => handleMonthChange(e.target.value)}
          style={selectStyle}
        />
      )}

      {value.mode === 'month' && (
        <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: colors.muted, fontSize: 14 }}>
          <input
            type="checkbox"
            checked={!!value.compare}
            onChange={(e) => handleToggleCompare(e.target.checked)}
          />
          Comparar com mês anterior
        </label>
      )}
    </div>
  );
};

const selectStyle: React.CSSProperties = {
  padding: 8,
  backgroundColor: '#111',
  color: '#FFF',
  border: '1px solid #333',
  borderRadius: 6,
};

// Helpers de datas
const pad = (n: number) => String(n).padStart(2, '0');

export const buildMonthRange = (monthIso: string) => {
  // monthIso: "YYYY-MM"
  const [year, month] = monthIso.split('-').map(Number);
  const from = `${year}-${pad(month)}-01`;
  const toDate = new Date(year, month, 0); // último dia do mês
  const to = `${year}-${pad(month)}-${pad(toDate.getDate())}`;
  return { from, to };
};

export const buildPreviousMonthRange = (monthIso: string) => {
  const [year, month] = monthIso.split('-').map(Number);
  const date = new Date(year, month - 1, 1);
  date.setMonth(date.getMonth() - 1);
  const prevYear = date.getFullYear();
  const prevMonth = date.getMonth() + 1;
  return {
    from: `${prevYear}-${pad(prevMonth)}-01`,
    to: `${prevYear}-${pad(prevMonth)}-${pad(new Date(prevYear, prevMonth, 0).getDate())}`,
  };
};

export const buildLast12Range = () => {
  const end = new Date();
  const start = new Date();
  start.setMonth(start.getMonth() - 11);
  const from = `${start.getFullYear()}-${pad(start.getMonth() + 1)}-01`;
  const to = `${end.getFullYear()}-${pad(end.getMonth() + 1)}-${pad(new Date(end.getFullYear(), end.getMonth() + 1, 0).getDate())}`;
  return { from, to };
};


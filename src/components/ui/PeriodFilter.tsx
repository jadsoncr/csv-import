import React, { useMemo } from 'react';
import { colors } from '../../styles/tokens';

export type PeriodState = {
  mode: 'custom' | 'last12';
  from: string; // YYYY-MM-DD
  to: string; // YYYY-MM-DD
  compare?: {
    from: string;
    to: string;
    label: string;
  };
};

interface PeriodFilterProps {
  value: PeriodState;
  onChange: (next: PeriodState) => void;
}

/**
 * Filtro de período com seleção de data livre
 * - Permite selecionar data de início e data de fim
 */
export const PeriodFilter: React.FC<PeriodFilterProps> = ({ value, onChange }) => {
  const handleFromChange = (date: string) => {
    onChange({ ...value, from: date });
  };

  const handleToChange = (date: string) => {
    onChange({ ...value, to: date });
  };

  const handleToggleCompare = (checked: boolean) => {
    if (!checked) {
      onChange({ ...value, compare: undefined });
      return;
    }
    // Calcula período anterior com mesmo tamanho
    const fromDate = new Date(value.from);
    const toDate = new Date(value.to);
    const diff = toDate.getTime() - fromDate.getTime();
    const prevTo = new Date(fromDate.getTime() - 86400000); // dia antes
    const prevFrom = new Date(prevTo.getTime() - diff);
    
    onChange({
      ...value,
      compare: {
        from: prevFrom.toISOString().split('T')[0],
        to: prevTo.toISOString().split('T')[0],
        label: 'vs período anterior',
      },
    });
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: 16,
        alignItems: 'center',
        padding: '12px 20px',
        border: '1px solid #1F1F1F',
        borderRadius: 10,
        backgroundColor: '#0A0A0A',
      }}
    >
      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ color: '#71717A', fontSize: 13, fontWeight: 500 }}>De</label>
        <input
          type="date"
          value={value.from}
          onChange={(e) => handleFromChange(e.target.value)}
          max={value.to}
          style={{
            ...inputStyle,
            minWidth: 150,
          }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <label style={{ color: '#71717A', fontSize: 13, fontWeight: 500 }}>Até</label>
        <input
          type="date"
          value={value.to}
          onChange={(e) => handleToChange(e.target.value)}
          min={value.from}
          style={{
            ...inputStyle,
            minWidth: 150,
          }}
        />
      </div>

      <label style={{ display: 'flex', gap: 8, alignItems: 'center', color: '#A1A1AA', fontSize: 13 }}>
        <input
          type="checkbox"
          checked={!!value.compare}
          onChange={(e) => handleToggleCompare(e.target.checked)}
          style={{ cursor: 'pointer' }}
        />
        Comparar com período anterior
      </label>
    </div>
  );
};

// Helpers de estilo
const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  backgroundColor: '#000000',
  color: '#FFFFFF',
  border: '1px solid #27272A',
  borderRadius: 6,
  fontSize: 13,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const selectStyle: React.CSSProperties = {
  padding: 8,
  backgroundColor: '#111',
  color: '#FFF',
  border: '1px solid #333',
  borderRadius: 6,
};

// Helpers de datas (manter para compatibilidade)
const pad = (n: number) => String(n).padStart(2, '0');

export const buildMonthRange = (monthIso: string) => {
  const [year, month] = monthIso.split('-').map(Number);
  const from = `${year}-${pad(month)}-01`;
  const toDate = new Date(year, month, 0);
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


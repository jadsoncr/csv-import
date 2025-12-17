import React, { useState, useEffect } from 'react';
import { ColumnMapping } from '../state/types';

interface StepMapColumnsProps {
  columns: string[];
  initialMappings?: ColumnMapping;
  onMappingsChange: (mappings: ColumnMapping) => void;
  onBack: () => void;
  onContinue: () => void;
  loading: boolean;
}

/**
 * Etapa 2: Mapear colunas do arquivo para campos do sistema
 */
export const StepMapColumns: React.FC<StepMapColumnsProps> = ({
  columns,
  initialMappings,
  onMappingsChange,
  onBack,
  onContinue,
  loading,
}) => {
  const [mappings, setMappings] = useState<ColumnMapping>(initialMappings || {});

  // Opções de destino disponíveis
  const destinationOptions = [
    { value: '', label: '-- Selecionar --' },
    { value: 'DATA', label: 'DATA' },
    { value: 'ITEM', label: 'ITEM' },
    { value: 'QTD', label: 'QTD' },
    { value: 'VALOR_TOTAL', label: 'VALOR_TOTAL' },
    { value: 'CATEGORIA', label: 'CATEGORIA' },
    { value: 'UNIDADE', label: 'UNIDADE' },
    { value: 'CUSTO_UNITARIO', label: 'CUSTO_UNITARIO' },
    { value: 'PRECO_VENDA', label: 'PRECO_VENDA' },
    { value: 'IGNORAR', label: 'IGNORAR' },
  ];

  useEffect(() => {
    // Inicializa mappings vazios se não existirem
    const newMappings: ColumnMapping = { ...initialMappings };
    columns.forEach((col) => {
      if (!(col in newMappings)) {
        newMappings[col] = '';
      }
    });
    setMappings(newMappings);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns]);

  const handleMappingChange = (column: string, destination: string) => {
    const newMappings = { ...mappings, [column]: destination };
    setMappings(newMappings);
    onMappingsChange(newMappings);
  };

  const handleContinue = () => {
    // Validação: pelo menos DATA, ITEM, QTD mapeados (se existirem nas opções)
    const mappedDestinations = Object.values(mappings).filter((v) => v && v !== 'IGNORAR');
    const hasData = mappedDestinations.includes('DATA');
    const hasItem = mappedDestinations.includes('ITEM');
    const hasQtd = mappedDestinations.includes('QTD');

    if (!hasData || !hasItem || !hasQtd) {
      alert('Mapeie pelo menos DATA, ITEM e QTD para continuar.');
      return;
    }

    onContinue();
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
        Mapear colunas
      </h2>

      <p style={{ color: '#A1A1AA', marginBottom: 24 }}>
        Selecione o campo do sistema correspondente para cada coluna do arquivo.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {columns.map((column) => (
          <div
            key={column}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              padding: 16,
              backgroundColor: '#1a1a1a',
              borderRadius: 4,
            }}
          >
            <div style={{ flex: 1, color: '#FFF', fontWeight: 500 }}>
              {column}
            </div>
            <div style={{ flex: 1 }}>
              <select
                value={mappings[column] || ''}
                onChange={(e) => handleMappingChange(column, e.target.value)}
                disabled={loading}
                style={{
                  width: '100%',
                  padding: 8,
                  backgroundColor: '#111',
                  color: '#FFF',
                  border: '1px solid #333',
                  borderRadius: 4,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {destinationOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        <button
          onClick={onBack}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#333',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          Voltar
        </button>
        <button
          onClick={handleContinue}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#333' : '#2563EB',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          {loading ? 'Processando...' : 'Continuar'}
        </button>
      </div>
    </div>
  );
};


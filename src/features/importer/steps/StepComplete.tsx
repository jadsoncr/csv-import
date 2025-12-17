import React from 'react';

interface StepCompleteProps {
  onReset: () => void;
  onGoToDashboard: () => void;
}

/**
 * Etapa 4: Importação concluída
 */
export const StepComplete: React.FC<StepCompleteProps> = ({
  onReset,
  onGoToDashboard,
}) => {
  return (
    <div style={{ maxWidth: 600, margin: '0 auto', textAlign: 'center' }}>
      <div
        style={{
          padding: 48,
          backgroundColor: '#1a1a1a',
          borderRadius: 8,
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 48,
            marginBottom: 16,
          }}
        >
          ✓
        </div>
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8, color: '#FFF' }}>
          Importação concluída!
        </h2>
        <p style={{ color: '#A1A1AA', fontSize: 16 }}>
          Seus dados foram importados com sucesso.
        </p>
      </div>

      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <button
          onClick={onReset}
          style={{
            padding: '12px 24px',
            backgroundColor: '#333',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Importar outro arquivo
        </button>
        <button
          onClick={onGoToDashboard}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2563EB',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 500,
          }}
        >
          Ir para Dashboard
        </button>
      </div>
    </div>
  );
};


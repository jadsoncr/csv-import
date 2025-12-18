import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';

/**
 * Página Relatórios
 * Placeholder - será implementada posteriormente
 */
export const Relatorios: React.FC = () => {
  return (
    <div>
      <PageHeader title="Relatórios" />
      <div
        style={{
          padding: 48,
          textAlign: 'center',
          backgroundColor: '#1a1a1a',
          borderRadius: 8,
          maxWidth: 520,
        }}
      >
        <p style={{ fontSize: 16, color: '#FFF', marginBottom: 8 }}>
          Em breve, relatórios detalhados
        </p>
        <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>
          Por enquanto, use o Dashboard para acompanhar os principais indicadores.
        </p>
      </div>
    </div>
  );
};


import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';

/**
 * Página Configurações
 * Placeholder - será implementada posteriormente
 */
export const Configuracoes: React.FC = () => {
  return (
    <div>
      <PageHeader title="Configurações" />
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
          Configurações em desenvolvimento
        </p>
        <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>
          Em breve você poderá personalizar metas, alertas e preferências.
        </p>
      </div>
    </div>
  );
};


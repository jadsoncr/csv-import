import React from 'react';
import { PageHeader } from '../components/ui/PageHeader';
import { ImportWizard } from '../features/importer/ImportWizard';

/**
 * Página Importar Dados
 * Contém o wizard de importação completo
 */
export const ImportarDados: React.FC = () => {
  return (
    <div>
      <PageHeader title="Importar Dados" />
      
      {/* Microcopy contextual */}
      <div
        style={{
          backgroundColor: '#1E293B',
          border: '1px solid #334155',
          borderRadius: 8,
          padding: 20,
          marginBottom: 24,
          maxWidth: 720,
        }}
      >
        <p style={{ color: '#E2E8F0', fontSize: 15, margin: '0 0 8px 0', lineHeight: 1.6 }}>
          <strong style={{ color: '#FFF' }}>Como funciona:</strong>
        </p>
        <p style={{ color: '#94A3B8', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
          Você envia o arquivo. O BRO.AI organiza. Você confirma.
        </p>
      </div>

      <ImportWizard />
    </div>
  );
};


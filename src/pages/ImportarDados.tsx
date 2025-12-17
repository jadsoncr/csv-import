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
      <ImportWizard />
    </div>
  );
};


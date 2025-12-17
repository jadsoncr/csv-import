import React from 'react';

interface PageHeaderProps {
  title: string;
}

/**
 * Componente de cabeçalho de página
 * Exibe o título da página de forma consistente
 */
export const PageHeader: React.FC<PageHeaderProps> = ({ title }) => {
  return (
    <div style={{ marginBottom: 24 }}>
      <h1 style={{ 
        fontSize: 24, 
        fontWeight: 600, 
        color: '#FFFFFF',
        margin: 0 
      }}>
        {title}
      </h1>
    </div>
  );
};


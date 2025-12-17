import React from 'react';
import { colors, spacing } from '../../styles/tokens';

/**
 * Topbar no topo da aplicação
 * Área para ações globais e informações do usuário
 */
export const Topbar: React.FC = () => {
  return (
    <header
      style={{
        height: 64,
        backgroundColor: colors.surface,
        borderBottom: `1px solid ${colors.muted}20`,
        padding: `0 ${spacing.lg}`,
        display: 'flex',
        alignItems: 'center',
        position: 'fixed',
        top: 0,
        left: 240, // Largura da sidebar
        right: 0,
        zIndex: 100,
      }}
    >
      <div style={{ 
        color: colors.text, 
        fontSize: 14,
        fontWeight: 500 
      }}>
        BRO.AI
      </div>
    </header>
  );
};


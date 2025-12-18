import React from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/layout/Sidebar';
import { Topbar } from '../components/layout/Topbar';
import { colors, spacing } from '../styles/tokens';

/**
 * Layout base da aplicação
 * Contém Sidebar, Topbar e área de conteúdo
 */
export const AppLayout: React.FC = () => {
  return (
    <div style={{ 
      backgroundColor: '#000000',
      backgroundImage: 'radial-gradient(circle at 20% 10%, rgba(37, 99, 235, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.03) 0%, transparent 50%)',
      minHeight: '100vh',
      color: colors.text 
    }}>
      <Topbar />
      
      {/* Área de conteúdo */}
      <main
        style={{
          marginTop: 64, // Altura da topbar
          padding: spacing.lg,
          maxWidth: 1800,
          marginLeft: 'auto',
          marginRight: 'auto',
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};


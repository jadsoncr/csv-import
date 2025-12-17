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
      backgroundColor: colors.background,
      minHeight: '100vh',
      color: colors.text 
    }}>
      <Sidebar />
      <Topbar />
      
      {/* Área de conteúdo */}
      <main
        style={{
          marginLeft: 240, // Largura da sidebar
          marginTop: 64, // Altura da topbar
          padding: spacing.lg,
        }}
      >
        <Outlet />
      </main>
    </div>
  );
};


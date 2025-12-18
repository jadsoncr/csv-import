import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors, spacing } from '../../styles/tokens';

/**
 * Topbar com navegação horizontal
 */
export const Topbar: React.FC = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/importar', label: 'Importar Dados' },
    { path: '/fichas-tecnicas', label: 'Fichas Técnicas' },
    { path: '/relatorios', label: 'Relatórios' },
    { path: '/configuracoes', label: 'Configurações' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header
      style={{
        height: 64,
        backgroundColor: '#0A0A0A',
        borderBottom: '1px solid #1F1F1F',
        padding: `0 ${spacing.lg}`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
      }}
    >
      {/* Logo */}
      <div style={{ 
        color: '#FFFFFF', 
        fontSize: 18,
        fontWeight: 700,
        letterSpacing: '-0.02em',
      }}>
        BRO.AI
      </div>

      {/* Menu horizontal */}
      <nav style={{ display: 'flex', gap: 8 }}>
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              padding: '8px 16px',
              color: isActive(item.path) ? '#FFFFFF' : '#71717A',
              textDecoration: 'none',
              fontSize: 14,
              fontWeight: isActive(item.path) ? 600 : 500,
              borderRadius: 6,
              backgroundColor: isActive(item.path) ? '#18181B' : 'transparent',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = '#18181B';
                e.currentTarget.style.color = '#A1A1AA';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive(item.path)) {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#71717A';
              }
            }}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      {/* User area */}
      <div style={{ width: 120 }} />
    </header>
  );
};


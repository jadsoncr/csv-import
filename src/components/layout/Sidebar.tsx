import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { colors, spacing } from '../../styles/tokens';

/**
 * Sidebar fixa à esquerda
 * Contém links de navegação principais
 */
export const Sidebar: React.FC = () => {
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
    <aside
      style={{
        width: 240,
        height: '100vh',
        backgroundColor: colors.surface,
        borderRight: `1px solid ${colors.muted}20`,
        padding: spacing.lg,
        position: 'fixed',
        left: 0,
        top: 0,
        overflowY: 'auto',
      }}
    >
      <div style={{ marginBottom: spacing.xl }}>
        <h2 style={{ 
          color: colors.text, 
          fontSize: 20, 
          fontWeight: 700,
          margin: 0 
        }}>
          BRO.AI
        </h2>
      </div>

      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {menuItems.map((item) => (
            <li key={item.path} style={{ marginBottom: spacing.sm }}>
              <Link
                to={item.path}
                style={{
                  display: 'block',
                  padding: spacing.sm,
                  color: isActive(item.path) ? colors.primary : colors.muted,
                  textDecoration: 'none',
                  borderRadius: 4,
                  backgroundColor: isActive(item.path) ? `${colors.primary}20` : 'transparent',
                  transition: 'all 0.2s',
                }}
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};


import React, { ReactNode } from 'react';

/**
 * Providers da aplicação
 * Placeholder - será expandido com providers necessários (theme, auth, etc)
 */
interface ProvidersProps {
  children: ReactNode;
}

export const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return <>{children}</>;
};


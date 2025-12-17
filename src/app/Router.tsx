import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import { AppLayout } from './AppLayout';
import { Dashboard } from '../pages/Dashboard';
import { ImportarDados } from '../pages/ImportarDados';
import { FichasTecnicas } from '../pages/FichasTecnicas';
import { Relatorios } from '../pages/Relatorios';
import { Configuracoes } from '../pages/Configuracoes';

/**
 * Configuração de rotas da aplicação
 * Todas as rotas usam o AppLayout
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'importar',
        element: <ImportarDados />,
      },
      {
        path: 'fichas-tecnicas',
        element: <FichasTecnicas />,
      },
      {
        path: 'relatorios',
        element: <Relatorios />,
      },
      {
        path: 'configuracoes',
        element: <Configuracoes />,
      },
    ],
  },
]);


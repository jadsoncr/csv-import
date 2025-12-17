# Setup BRO.AI - Estrutura Base

## ✅ Estrutura Criada

A estrutura base do BRO.AI foi criada com sucesso:

```
src/
 ├─ app/
 │   ├─ App.tsx
 │   ├─ AppLayout.tsx
 │   ├─ Router.tsx
 │   └─ providers.tsx
 │
 ├─ pages/
 │   ├─ Dashboard.tsx
 │   ├─ ImportarDados.tsx
 │   ├─ FichasTecnicas.tsx
 │   ├─ Relatorios.tsx
 │   └─ Configuracoes.tsx
 │
 ├─ components/
 │   ├─ layout/
 │   │   ├─ Sidebar.tsx
 │   │   └─ Topbar.tsx
 │   └─ ui/
 │       └─ PageHeader.tsx
 │
 ├─ features/
 │   ├─ importer/
 │   ├─ kpis/
 │   └─ recipes/
 │
 ├─ services/
 │   └─ apiClient.ts
 │
 ├─ styles/
 │   └─ tokens.ts
 │
 └─ main.tsx
```

## 📦 Dependências Necessárias

Para rodar o projeto, você precisa instalar:

```bash
npm install react-router-dom vite @vitejs/plugin-react
# ou
yarn add react-router-dom vite @vitejs/plugin-react
```

## 🚀 Como Rodar

1. Instale as dependências:
```bash
npm install
```

2. Adicione ao package.json (se ainda não existir):
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

3. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

## 🧭 Rotas Configuradas

- `/` - Dashboard
- `/importar` - Importar Dados
- `/fichas-tecnicas` - Fichas Técnicas
- `/relatorios` - Relatórios
- `/configuracoes` - Configurações

## 📝 Próximos Passos

- Implementar lógica de negócio nas páginas
- Conectar APIs
- Adicionar estilização final
- Implementar features específicas


# Camada de Serviços - BRO.AI

## Estrutura

```
src/
 ├─ services/
 │   ├─ apiClient.ts      # Cliente HTTP padronizado (fetch)
 │   ├─ endpoints.ts      # Endpoints centralizados
 │   ├─ errors.ts         # Tratamento de erros tipado
 │   ├─ kpis.service.ts   # Service de KPIs
 │   ├─ imports.service.ts # Service de Imports
 │   └─ recipes.service.ts # Service de Recipes
 │
 ├─ models/
 │   ├─ kpis.ts          # Tipos de KPIs
 │   ├─ imports.ts       # Tipos de Imports
 │   └─ recipes.ts       # Tipos de Recipes
 │
 ├─ config/
 │   └─ env.ts          # Variáveis de ambiente
 │
 └─ utils/
     └─ sleep.ts        # Utilitário para mocks
```

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
VITE_API_URL=https://your-api.railway.app
VITE_API_TOKEN=your-token-here  # Opcional
VITE_USE_MOCKS=false            # Opcional, default: false
```

### Modo Mock

Para desenvolvimento sem backend, configure:

```env
VITE_USE_MOCKS=true
```

Os services retornarão dados mockados com delay de 400ms.

## Uso

### KPIs

```typescript
import { getKpis } from '../services/kpis.service';

const kpis = await getKpis({ from: '2024-01-01', to: '2024-01-31' });
```

### Imports

```typescript
import { createImport, getImportPreview, confirmImport } from '../services/imports.service';

// Criar import
const job = await createImport({ source: 'csv', fileName: 'dados.csv' });

// Buscar preview
const preview = await getImportPreview(job.id);

// Confirmar import
await confirmImport(job.id, { mappings: { produto: 'name', quantidade: 'qty' } });
```

### Recipes

```typescript
import { listRecipes } from '../services/recipes.service';

const recipes = await listRecipes();
```

## Tratamento de Erros

Todos os erros são tipados como `ApiError`:

```typescript
import { ApiError } from '../services/errors';

try {
  const data = await getKpis();
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`Erro ${error.status}: ${error.message}`);
  }
}
```


import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useRecipes } from './state/useRecipes';
import { RecipeList } from './components/RecipeList';
import { RecipeEditor } from './components/RecipeEditor';
import { Recipe } from '../../models/recipes';

/**
 * Página principal de Fichas Técnicas
 * Layout em 2 colunas: Lista (esquerda) + Editor (direita)
 */
export const RecipesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const {
    recipes,
    selectedRecipe,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    loadRecipe,
    handleSaveRecipe,
    handleDeleteRecipe,
    createNewRecipe,
    setSelectedRecipe,
  } = useRecipes();

  const handleSelectRecipe = async (recipe: Recipe) => {
    if (recipe.id) {
      await loadRecipe(recipe.id);
    } else {
      setSelectedRecipe(recipe);
    }
  };

  // Detecta se veio do Dashboard (contexto)
  const fromDashboard = searchParams.get('from') === 'dashboard';

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 600, color: '#FFF', margin: '0 0 8px 0' }}>
          Fichas técnicas
        </h1>
        <p style={{ fontSize: 14, color: '#A1A1AA', margin: 0 }}>
          Controle o custo por porção e proteja sua margem.
        </p>
      </div>

      {/* Banner contextual (quando vem do Dashboard) */}
      {fromDashboard && selectedRecipe && (
        <div
          style={{
            backgroundColor: '#FEF3C7',
            border: '1px solid #FCD34D',
            borderRadius: 8,
            padding: 16,
            marginBottom: 24,
            display: 'flex',
            alignItems: 'flex-start',
            gap: 12,
          }}
        >
          <div style={{ fontSize: 20 }}>💡</div>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#78350F', fontSize: 14, fontWeight: 600, margin: '0 0 4px 0' }}>
              Você está aqui porque este item pode ser otimizado
            </p>
            <p style={{ color: '#92400E', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
              Ajustar este item pode melhorar sua margem. Revise os ingredientes e quantidades abaixo.
            </p>
          </div>
        </div>
      )}

      {/* Erro */}
      {error && (
        <div
          style={{
            padding: 16,
            backgroundColor: '#7F1D1D',
            color: '#FCA5A5',
            borderRadius: 4,
            marginBottom: 24,
          }}
        >
          <strong>Erro:</strong> {error}
        </div>
      )}

      {/* Loading global */}
      {loading && !selectedRecipe && (
        <div style={{ textAlign: 'center', padding: 48, color: '#A1A1AA' }}>
          Carregando...
        </div>
      )}

      {/* Empty state */}
      {!loading && recipes.length === 0 && !searchQuery && (
        <div
          style={{
            padding: 48,
            textAlign: 'center',
            backgroundColor: '#1a1a1a',
            borderRadius: 4,
          }}
        >
          <p style={{ fontSize: 16, color: '#FFF', marginBottom: 8 }}>
            Nenhuma ficha técnica cadastrada
          </p>
          <p style={{ fontSize: 14, color: '#A1A1AA', marginBottom: 24 }}>
            Comece criando sua primeira ficha técnica
          </p>
          <button
            onClick={createNewRecipe}
            style={{
              padding: '12px 24px',
              backgroundColor: '#2563EB',
              color: '#FFF',
              border: 'none',
              borderRadius: 4,
              cursor: 'pointer',
              fontWeight: 500,
            }}
          >
            Criar primeira ficha
          </button>
        </div>
      )}

      {/* Layout 2 colunas (desktop) / stack (mobile) */}
      {(!loading || selectedRecipe) && (recipes.length > 0 || searchQuery || selectedRecipe) && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(300px, 1fr) minmax(400px, 2fr)',
            gap: 24,
          }}
        >
          {/* Coluna esquerda: Lista */}
          <div>
            <RecipeList
              recipes={recipes}
              selectedRecipe={selectedRecipe}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onSelectRecipe={handleSelectRecipe}
              onCreateNew={createNewRecipe}
              onDeleteRecipe={handleDeleteRecipe}
              loading={loading}
            />
          </div>

          {/* Coluna direita: Editor */}
          <div>
            <RecipeEditor
              recipe={selectedRecipe}
              onSave={handleSaveRecipe}
              onDelete={handleDeleteRecipe}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
};


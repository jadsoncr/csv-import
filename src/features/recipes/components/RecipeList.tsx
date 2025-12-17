import React from 'react';
import { Recipe } from '../../../models/recipes';
import { calcTotalCost, calcCostPerPortion, calcCmvPercent } from '../utils/calculations';

interface RecipeListProps {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onSelectRecipe: (recipe: Recipe) => void;
  onCreateNew: () => void;
  onDeleteRecipe: (id: string) => void;
  loading: boolean;
}

const CMV_TARGET = 35; // 35% fixo V1

/**
 * Lista de fichas técnicas
 */
export const RecipeList: React.FC<RecipeListProps> = ({
  recipes,
  selectedRecipe,
  searchQuery,
  onSearchChange,
  onSelectRecipe,
  onCreateNew,
  onDeleteRecipe,
  loading,
}) => {
  return (
    <div>
      <div style={{ marginBottom: 16 }}>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por nome..."
          disabled={loading}
          style={{
            width: '100%',
            padding: 12,
            backgroundColor: '#111',
            color: '#FFF',
            border: '1px solid #333',
            borderRadius: 4,
            fontSize: 14,
          }}
        />
      </div>

      <button
        onClick={onCreateNew}
        disabled={loading}
        style={{
          width: '100%',
          padding: 12,
          backgroundColor: loading ? '#333' : '#2563EB',
          color: '#FFF',
          border: 'none',
          borderRadius: 4,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontWeight: 500,
          marginBottom: 16,
        }}
      >
        + Nova ficha
      </button>

      {recipes.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: 'center',
            color: '#A1A1AA',
            backgroundColor: '#1a1a1a',
            borderRadius: 4,
          }}
        >
          {searchQuery ? 'Nenhuma ficha encontrada' : 'Nenhuma ficha técnica cadastrada'}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {recipes.map((recipe) => {
            const totalCost = calcTotalCost(recipe.items);
            const costPerPortion = calcCostPerPortion(totalCost, recipe.yieldQty);
            const cmvPercent = calcCmvPercent(costPerPortion, recipe.salePrice);
            const isAboveTarget = cmvPercent > CMV_TARGET;
            const isSelected = selectedRecipe?.id === recipe.id;

            return (
              <div
                key={recipe.id}
                onClick={() => onSelectRecipe(recipe)}
                style={{
                  padding: 16,
                  backgroundColor: isSelected ? '#1a3a5a' : '#1a1a1a',
                  border: isSelected ? '1px solid #2563EB' : '1px solid #333',
                  borderRadius: 4,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, color: '#FFF', margin: 0 }}>
                    {recipe.name || 'Sem nome'}
                  </h3>
                  {isAboveTarget && (
                    <span
                      style={{
                        fontSize: 11,
                        padding: '2px 8px',
                        backgroundColor: '#7F1D1D',
                        color: '#FCA5A5',
                        borderRadius: 4,
                      }}
                    >
                      Acima do alvo
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 14, color: '#A1A1AA', marginBottom: 4 }}>
                  {recipe.yieldQty} {recipe.yieldUnit} • R$ {recipe.salePrice.toFixed(2)}
                </div>
                <div style={{ fontSize: 12, color: '#A1A1AA' }}>
                  CMV: {cmvPercent.toFixed(1)}% • {recipe.items.length} ingredientes
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};


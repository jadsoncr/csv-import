import React, { useState, useEffect } from 'react';
import { Recipe, RecipeItem } from '../../../models/recipes';
import { RecipeItemsTable } from './RecipeItemsTable';
import { KpiStrip } from './KpiStrip';

interface RecipeEditorProps {
  recipe: Recipe | null;
  onSave: (recipe: Recipe) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}

const CMV_TARGET = 35; // 35% fixo V1

/**
 * Editor de ficha técnica
 */
export const RecipeEditor: React.FC<RecipeEditorProps> = ({
  recipe,
  onSave,
  onDelete,
  loading,
}) => {
  const [editedRecipe, setEditedRecipe] = useState<Recipe | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (recipe) {
      setEditedRecipe({ ...recipe });
    } else {
      setEditedRecipe(null);
    }
    setErrors({});
  }, [recipe]);

  if (!editedRecipe) {
    return (
      <div
        style={{
          padding: 48,
          textAlign: 'center',
          color: '#A1A1AA',
          backgroundColor: '#1a1a1a',
          borderRadius: 4,
        }}
      >
        <p style={{ fontSize: 16, margin: 0 }}>Selecione uma ficha técnica para editar</p>
        <p style={{ fontSize: 14, marginTop: 8, color: '#666' }}>
          ou crie uma nova usando o botão "Nova ficha"
        </p>
      </div>
    );
  }

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!editedRecipe.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (editedRecipe.yieldQty <= 0) {
      newErrors.yieldQty = 'Rendimento deve ser maior que zero';
    }

    if (editedRecipe.salePrice <= 0) {
      newErrors.salePrice = 'Preço de venda deve ser maior que zero';
    }

    editedRecipe.items.forEach((item, index) => {
      if (!item.name.trim()) {
        newErrors[`item-${index}-name`] = 'Nome do ingrediente é obrigatório';
      }
      if (item.qty <= 0) {
        newErrors[`item-${index}-qty`] = 'Quantidade deve ser maior que zero';
      }
      if (item.costUnit < 0) {
        newErrors[`item-${index}-costUnit`] = 'Custo unitário não pode ser negativo';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      await onSave(editedRecipe);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  const handleDelete = async () => {
    if (!editedRecipe.id || !confirm('Tem certeza que deseja deletar esta ficha técnica?')) {
      return;
    }

    try {
      await onDelete(editedRecipe.id);
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  return (
    <div>
      <KpiStrip recipe={editedRecipe} targetCmvPercent={CMV_TARGET} />

      <div style={{ marginBottom: 24 }}>
        <label style={{ display: 'block', marginBottom: 8, color: '#FFF', fontWeight: 500 }}>
          Nome da ficha técnica
        </label>
        <input
          type="text"
          value={editedRecipe.name}
          onChange={(e) => setEditedRecipe({ ...editedRecipe, name: e.target.value })}
          disabled={loading}
          placeholder="Ex: Hambúrguer Artesanal"
          style={{
            width: '100%',
            padding: 12,
            backgroundColor: '#111',
            color: '#FFF',
            border: errors.name ? '1px solid #7F1D1D' : '1px solid #333',
            borderRadius: 4,
            fontSize: 14,
          }}
        />
        {errors.name && <div style={{ color: '#FCA5A5', fontSize: 12, marginTop: 4 }}>{errors.name}</div>}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div>
          <label style={{ display: 'block', marginBottom: 8, color: '#FFF', fontWeight: 500 }}>
            Rendimento
          </label>
          <input
            type="number"
            value={editedRecipe.yieldQty}
            onChange={(e) =>
              setEditedRecipe({ ...editedRecipe, yieldQty: parseFloat(e.target.value) || 0 })
            }
            disabled={loading}
            min="0.01"
            step="0.01"
            style={{
              width: '100%',
              padding: 12,
              backgroundColor: '#111',
              color: '#FFF',
              border: errors.yieldQty ? '1px solid #7F1D1D' : '1px solid #333',
              borderRadius: 4,
              fontSize: 14,
            }}
          />
          {errors.yieldQty && (
            <div style={{ color: '#FCA5A5', fontSize: 12, marginTop: 4 }}>{errors.yieldQty}</div>
          )}
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 8, color: '#FFF', fontWeight: 500 }}>
            Unidade
          </label>
          <select
            value={editedRecipe.yieldUnit}
            onChange={(e) => setEditedRecipe({ ...editedRecipe, yieldUnit: e.target.value })}
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
          >
            <option value="porção">porção</option>
            <option value="unidade">unidade</option>
            <option value="pizza">pizza</option>
            <option value="copo">copo</option>
            <option value="xícara">xícara</option>
          </select>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: 8, color: '#FFF', fontWeight: 500 }}>
            Preço de venda (R$)
          </label>
          <input
            type="number"
            value={editedRecipe.salePrice}
            onChange={(e) =>
              setEditedRecipe({ ...editedRecipe, salePrice: parseFloat(e.target.value) || 0 })
            }
            disabled={loading}
            min="0"
            step="0.01"
            style={{
              width: '100%',
              padding: 12,
              backgroundColor: '#111',
              color: '#FFF',
              border: errors.salePrice ? '1px solid #7F1D1D' : '1px solid #333',
              borderRadius: 4,
              fontSize: 14,
            }}
          />
          {errors.salePrice && (
            <div style={{ color: '#FCA5A5', fontSize: 12, marginTop: 4 }}>{errors.salePrice}</div>
          )}
        </div>
      </div>

      <RecipeItemsTable
        items={editedRecipe.items}
        onItemsChange={(items) => setEditedRecipe({ ...editedRecipe, items })}
        disabled={loading}
      />

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 24 }}>
        {editedRecipe.id && (
          <button
            onClick={handleDelete}
            disabled={loading}
            style={{
              padding: '12px 24px',
              backgroundColor: loading ? '#333' : '#7F1D1D',
              color: '#FCA5A5',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 500,
            }}
          >
            Deletar
          </button>
        )}
        <button
          onClick={handleSave}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#333' : '#2563EB',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          {loading ? 'Salvando...' : 'Salvar'}
        </button>
      </div>
    </div>
  );
};


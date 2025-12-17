import React from 'react';
import { RecipeItem } from '../../../models/recipes';

interface RecipeItemsTableProps {
  items: RecipeItem[];
  onItemsChange: (items: RecipeItem[]) => void;
  disabled?: boolean;
}

/**
 * Tabela de itens/ingredientes da ficha técnica
 */
export const RecipeItemsTable: React.FC<RecipeItemsTableProps> = ({
  items,
  onItemsChange,
  disabled = false,
}) => {
  const handleItemChange = (id: string, field: keyof RecipeItem, value: string | number) => {
    const updated = items.map((item) =>
      item.id === id ? { ...item, [field]: value } : item
    );
    onItemsChange(updated);
  };

  const handleAddItem = () => {
    const newItem: RecipeItem = {
      id: `item-${Date.now()}`,
      name: '',
      qty: 0,
      unit: 'g',
      costUnit: 0,
    };
    onItemsChange([...items, newItem]);
  };

  const handleRemoveItem = (id: string) => {
    onItemsChange(items.filter((item) => item.id !== id));
  };

  const getSubtotal = (item: RecipeItem) => {
    return item.qty * item.costUnit;
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: '#FFF', margin: 0 }}>Ingredientes</h3>
        <button
          onClick={handleAddItem}
          disabled={disabled}
          style={{
            padding: '8px 16px',
            backgroundColor: disabled ? '#333' : '#2563EB',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: disabled ? 'not-allowed' : 'pointer',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          + Adicionar item
        </button>
      </div>

      {items.length === 0 ? (
        <div
          style={{
            padding: 24,
            textAlign: 'center',
            color: '#A1A1AA',
            backgroundColor: '#1a1a1a',
            borderRadius: 4,
          }}
        >
          Nenhum ingrediente adicionado
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#1a1a1a' }}>
                <th style={{ padding: 12, textAlign: 'left', color: '#FFF', fontWeight: 600 }}>
                  Nome
                </th>
                <th style={{ padding: 12, textAlign: 'right', color: '#FFF', fontWeight: 600 }}>
                  Qtd
                </th>
                <th style={{ padding: 12, textAlign: 'left', color: '#FFF', fontWeight: 600 }}>
                  Unidade
                </th>
                <th style={{ padding: 12, textAlign: 'right', color: '#FFF', fontWeight: 600 }}>
                  Custo unit.
                </th>
                <th style={{ padding: 12, textAlign: 'right', color: '#FFF', fontWeight: 600 }}>
                  Subtotal
                </th>
                <th style={{ padding: 12, textAlign: 'center', color: '#FFF', fontWeight: 600 }}>
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #333' }}>
                  <td style={{ padding: 12 }}>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => handleItemChange(item.id, 'name', e.target.value)}
                      disabled={disabled}
                      placeholder="Nome do ingrediente"
                      style={{
                        width: '100%',
                        padding: 8,
                        backgroundColor: '#111',
                        color: '#FFF',
                        border: '1px solid #333',
                        borderRadius: 4,
                      }}
                    />
                  </td>
                  <td style={{ padding: 12, textAlign: 'right' }}>
                    <input
                      type="number"
                      value={item.qty}
                      onChange={(e) => handleItemChange(item.id, 'qty', parseFloat(e.target.value) || 0)}
                      disabled={disabled}
                      min="0"
                      step="0.01"
                      style={{
                        width: 80,
                        padding: 8,
                        backgroundColor: '#111',
                        color: '#FFF',
                        border: '1px solid #333',
                        borderRadius: 4,
                        textAlign: 'right',
                      }}
                    />
                  </td>
                  <td style={{ padding: 12 }}>
                    <select
                      value={item.unit}
                      onChange={(e) => handleItemChange(item.id, 'unit', e.target.value)}
                      disabled={disabled}
                      style={{
                        padding: 8,
                        backgroundColor: '#111',
                        color: '#FFF',
                        border: '1px solid #333',
                        borderRadius: 4,
                      }}
                    >
                      <option value="g">g</option>
                      <option value="kg">kg</option>
                      <option value="ml">ml</option>
                      <option value="l">l</option>
                      <option value="un">un</option>
                      <option value="xícara">xícara</option>
                      <option value="colher">colher</option>
                    </select>
                  </td>
                  <td style={{ padding: 12, textAlign: 'right' }}>
                    <input
                      type="number"
                      value={item.costUnit}
                      onChange={(e) =>
                        handleItemChange(item.id, 'costUnit', parseFloat(e.target.value) || 0)
                      }
                      disabled={disabled}
                      min="0"
                      step="0.01"
                      style={{
                        width: 100,
                        padding: 8,
                        backgroundColor: '#111',
                        color: '#FFF',
                        border: '1px solid #333',
                        borderRadius: 4,
                        textAlign: 'right',
                      }}
                    />
                  </td>
                  <td style={{ padding: 12, textAlign: 'right', color: '#FFF' }}>
                    R$ {getSubtotal(item).toFixed(2)}
                  </td>
                  <td style={{ padding: 12, textAlign: 'center' }}>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={disabled}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#7F1D1D',
                        color: '#FCA5A5',
                        border: 'none',
                        borderRadius: 4,
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        fontSize: 12,
                      }}
                    >
                      Remover
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};


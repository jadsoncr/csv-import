import React from 'react';
import { Recipe } from '../../../models/recipes';
import {
  calcTotalCost,
  calcCostPerPortion,
  calcCmvPercent,
  calcMargin,
  calcMinPriceForTargetCmv,
} from '../utils/calculations';

interface KpiStripProps {
  recipe: Recipe;
  targetCmvPercent?: number;
}

/**
 * Strip de KPIs da ficha técnica
 * Exibe: Custo por porção, CMV, Margem, Preço mínimo (se alvo definido)
 */
export const KpiStrip: React.FC<KpiStripProps> = ({ recipe, targetCmvPercent = 35 }) => {
  const totalCost = calcTotalCost(recipe.items);
  const costPerPortion = calcCostPerPortion(totalCost, recipe.yieldQty);
  const cmvPercent = calcCmvPercent(costPerPortion, recipe.salePrice);
  const margin = calcMargin(costPerPortion, recipe.salePrice);
  const minPrice = targetCmvPercent
    ? calcMinPriceForTargetCmv(costPerPortion, targetCmvPercent)
    : null;

  const isAboveTarget = cmvPercent > targetCmvPercent;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 16,
        padding: 16,
        backgroundColor: '#1a1a1a',
        borderRadius: 4,
        marginBottom: 24,
      }}
    >
      <div>
        <div style={{ fontSize: 12, color: '#A1A1AA', marginBottom: 4 }}>Custo por porção</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#FFF' }}>
          R$ {costPerPortion.toFixed(2)}
        </div>
      </div>

      <div>
        <div style={{ fontSize: 12, color: '#A1A1AA', marginBottom: 4 }}>CMV do item</div>
        <div
          style={{
            fontSize: 20,
            fontWeight: 600,
            color: isAboveTarget ? '#FCA5A5' : '#FFF',
          }}
        >
          {cmvPercent.toFixed(1)}%
          {isAboveTarget && (
            <span
              style={{
                fontSize: 12,
                marginLeft: 8,
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
      </div>

      <div>
        <div style={{ fontSize: 12, color: '#A1A1AA', marginBottom: 4 }}>Margem bruta</div>
        <div style={{ fontSize: 20, fontWeight: 600, color: '#FFF' }}>
          R$ {margin.value.toFixed(2)}
        </div>
        <div style={{ fontSize: 12, color: '#A1A1AA', marginTop: 2 }}>
          {margin.percent.toFixed(1)}%
        </div>
      </div>

      {minPrice && minPrice > 0 && (
        <div>
          <div style={{ fontSize: 12, color: '#A1A1AA', marginBottom: 4 }}>
            Preço mínimo recomendado
          </div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#2563EB' }}>
            R$ {minPrice.toFixed(2)}
          </div>
          <div style={{ fontSize: 12, color: '#A1A1AA', marginTop: 2 }}>
            (CMV {targetCmvPercent}%)
          </div>
        </div>
      )}
    </div>
  );
};


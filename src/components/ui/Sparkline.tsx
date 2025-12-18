import React from 'react';

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  showDots?: boolean;
}

/**
 * Mini-gráfico de tendência (sparkline)
 * Mostra evolução visual sem eixos ou labels
 */
export const Sparkline: React.FC<SparklineProps> = ({ 
  data, 
  width = 100, 
  height = 32, 
  color = '#3B82F6',
  showDots = false,
}) => {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return { x, y };
  });

  const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');

  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      {/* Linha de tendência */}
      <path
        d={pathData}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Pontos (opcional) */}
      {showDots && points.map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={2.5}
          fill={color}
          opacity={i === points.length - 1 ? 1 : 0.6}
        />
      ))}
    </svg>
  );
};

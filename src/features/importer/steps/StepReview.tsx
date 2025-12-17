import React from 'react';
import { ImportPreviewRow } from '../../../models/imports';

interface StepReviewProps {
  preview: ImportPreviewRow[];
  onBack: () => void;
  onConfirm: () => void;
  loading: boolean;
}

/**
 * Etapa 3: Revisar preview dos dados
 */
export const StepReview: React.FC<StepReviewProps> = ({
  preview,
  onBack,
  onConfirm,
  loading,
}) => {
  const totalRows = preview.length;
  const rowsWithIssues = preview.filter((row) => row.issues && row.issues.length > 0).length;
  const previewRows = preview.slice(0, 10); // Mostra apenas 10 primeiras linhas

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
        Revisar dados
      </h2>

      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            gap: 24,
            marginBottom: 16,
          }}
        >
          <div style={{ color: '#A1A1AA' }}>
            <strong style={{ color: '#FFF' }}>Total de linhas:</strong> {totalRows}
          </div>
          {rowsWithIssues > 0 && (
            <div style={{ color: '#FCA5A5' }}>
              <strong>Linhas com problemas:</strong> {rowsWithIssues}
            </div>
          )}
        </div>
      </div>

      <div
        style={{
          overflowX: 'auto',
          border: '1px solid #333',
          borderRadius: 4,
          marginBottom: 24,
        }}
      >
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#1a1a1a' }}>
              <th
                style={{
                  padding: 12,
                  textAlign: 'left',
                  borderBottom: '1px solid #333',
                  color: '#FFF',
                  fontWeight: 600,
                }}
              >
                Linha
              </th>
              {previewRows[0] && (
                Object.keys(previewRows[0].data).map((key) => (
                  <th
                    key={key}
                    style={{
                      padding: 12,
                      textAlign: 'left',
                      borderBottom: '1px solid #333',
                      color: '#FFF',
                      fontWeight: 600,
                    }}
                  >
                    {key}
                  </th>
                ))
              )}
              <th
                style={{
                  padding: 12,
                  textAlign: 'left',
                  borderBottom: '1px solid #333',
                  color: '#FFF',
                  fontWeight: 600,
                }}
              >
                Problemas
              </th>
            </tr>
          </thead>
          <tbody>
            {previewRows.map((row) => (
              <tr
                key={row.rowNumber}
                style={{
                  borderBottom: '1px solid #333',
                  backgroundColor: row.issues && row.issues.length > 0 ? '#7F1D1D20' : 'transparent',
                }}
              >
                <td style={{ padding: 12, color: '#A1A1AA' }}>{row.rowNumber}</td>
                {Object.entries(row.data).map(([key, value]) => (
                  <td key={key} style={{ padding: 12, color: '#FFF' }}>
                    {value === null || value === undefined ? '-' : String(value)}
                  </td>
                ))}
                <td style={{ padding: 12, color: '#FCA5A5' }}>
                  {row.issues && row.issues.length > 0 ? (
                    <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12 }}>
                      {row.issues.map((issue, idx) => (
                        <li key={idx}>{issue}</li>
                      ))}
                    </ul>
                  ) : (
                    '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalRows > 10 && (
        <p style={{ color: '#A1A1AA', fontSize: 14, marginBottom: 24 }}>
          Mostrando 10 de {totalRows} linhas
        </p>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          onClick={onBack}
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: '#333',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontWeight: 500,
          }}
        >
          Voltar
        </button>
        <button
          onClick={onConfirm}
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
          {loading ? 'Processando...' : 'Confirmar Importação'}
        </button>
      </div>
    </div>
  );
};


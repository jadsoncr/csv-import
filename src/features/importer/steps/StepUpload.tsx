import React, { useRef, ChangeEvent } from 'react';
import { SelectedFile } from '../state/types';

interface StepUploadProps {
  selectedFile?: SelectedFile;
  onFileSelected: (file: File) => void;
  onContinue: () => void;
  loading: boolean;
}

/**
 * Etapa 1: Upload de arquivo
 */
export const StepUpload: React.FC<StepUploadProps> = ({
  selectedFile,
  onFileSelected,
  onContinue,
  loading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelected(file);
    }
  };

  const handleContinue = () => {
    if (selectedFile) {
      onContinue();
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 24 }}>
        Selecionar arquivo
      </h2>

      <div style={{ marginBottom: 24 }}>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,.xlsx"
          onChange={handleFileChange}
          disabled={loading}
          style={{
            padding: 12,
            border: '1px solid #333',
            borderRadius: 4,
            backgroundColor: '#111',
            color: '#FFF',
            width: '100%',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        />
      </div>

      {selectedFile && (
        <div
          style={{
            padding: 16,
            backgroundColor: '#1a1a1a',
            borderRadius: 4,
            marginBottom: 24,
          }}
        >
          <p style={{ margin: 0, color: '#A1A1AA' }}>
            <strong style={{ color: '#FFF' }}>Arquivo selecionado:</strong>{' '}
            {selectedFile.fileName}
          </p>
          <p style={{ margin: '8px 0 0 0', color: '#A1A1AA', fontSize: 14 }}>
            Tipo: {selectedFile.source.toUpperCase()}
          </p>
        </div>
      )}

      <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
        <button
          onClick={handleContinue}
          disabled={!selectedFile || loading}
          style={{
            padding: '12px 24px',
            backgroundColor: selectedFile && !loading ? '#2563EB' : '#333',
            color: '#FFF',
            border: 'none',
            borderRadius: 4,
            cursor: selectedFile && !loading ? 'pointer' : 'not-allowed',
            fontWeight: 500,
          }}
        >
          {loading ? 'Processando...' : 'Continuar'}
        </button>
      </div>
    </div>
  );
};


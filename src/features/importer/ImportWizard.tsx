import React, { useEffect } from 'react';
import { useImportWizard } from './state/useImportWizard';
import { StepUpload } from './steps/StepUpload';
import { StepMapColumns } from './steps/StepMapColumns';
import { StepReview } from './steps/StepReview';
import { StepComplete } from './steps/StepComplete';

/**
 * Wizard de importação - orquestra as 4 etapas
 */
export const ImportWizard: React.FC = () => {
  const {
    currentStep,
    loading,
    errorMessage,
    wizardData,
    goNext,
    goBack,
    reset,
    handleFileSelected,
    startImport,
    loadPreview,
    setMappings,
    confirm,
    navigate,
  } = useImportWizard();

  /**
   * Handler para continuar do step Upload
   * Inicia import e carrega preview
   */
  const handleUploadContinue = async () => {
    try {
      const job = await startImport();
      if (job?.id) {
        await loadPreview(job.id);
        goNext();
      }
    } catch (error) {
      // Erro já tratado no hook
    }
  };

  /**
   * Handler para continuar do step MapColumns
   * Salva mappings e vai para review
   */
  const handleMapContinue = () => {
    if (wizardData.mappings) {
      goNext();
    }
  };

  /**
   * Handler para ir ao dashboard
   */
  const handleGoToDashboard = () => {
    navigate('/');
  };

  return (
    <div style={{ padding: 24 }}>
      {/* Indicador de progresso */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
          {['upload', 'map', 'review', 'complete'].map((step, index) => {
            const stepNames = ['Upload', 'Mapear', 'Revisar', 'Concluir'];
            const isActive = currentStep === step;
            const isCompleted = ['upload', 'map', 'review', 'complete'].indexOf(currentStep) > index;

            return (
              <div key={step} style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    backgroundColor: isActive || isCompleted ? '#2563EB' : '#333',
                    color: '#FFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 600,
                    fontSize: 14,
                  }}
                >
                  {isCompleted ? '✓' : index + 1}
                </div>
                <span
                  style={{
                    marginLeft: 8,
                    color: isActive ? '#FFF' : '#A1A1AA',
                    fontSize: 14,
                    fontWeight: isActive ? 600 : 400,
                  }}
                >
                  {stepNames[index]}
                </span>
                {index < 3 && (
                  <div
                    style={{
                      width: 40,
                      height: 2,
                      backgroundColor: isCompleted ? '#2563EB' : '#333',
                      margin: '0 8px',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Mensagem de erro */}
      {errorMessage && (
        <div
          style={{
            padding: 16,
            backgroundColor: '#7F1D1D',
            color: '#FCA5A5',
            borderRadius: 4,
            marginBottom: 24,
          }}
        >
          <strong>Erro:</strong> {errorMessage}
        </div>
      )}

      {/* Loading global */}
      {loading && currentStep !== 'complete' && (
        <div
          style={{
            padding: 16,
            textAlign: 'center',
            color: '#A1A1AA',
            marginBottom: 24,
          }}
        >
          Processando...
        </div>
      )}

      {/* Renderiza step atual */}
      {currentStep === 'upload' && (
        <StepUpload
          selectedFile={wizardData.file}
          onFileSelected={handleFileSelected}
          onContinue={handleUploadContinue}
          loading={loading}
        />
      )}

      {currentStep === 'map' && wizardData.columns && (
        <StepMapColumns
          columns={wizardData.columns}
          initialMappings={wizardData.mappings}
          onMappingsChange={setMappings}
          onBack={goBack}
          onContinue={handleMapContinue}
          loading={loading}
        />
      )}

      {currentStep === 'review' && wizardData.preview && (
        <StepReview
          preview={wizardData.preview}
          onBack={goBack}
          onConfirm={confirm}
          loading={loading}
        />
      )}

      {currentStep === 'complete' && (
        <StepComplete onReset={reset} onGoToDashboard={handleGoToDashboard} />
      )}
    </div>
  );
};


import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Step, SelectedFile, ColumnMapping, WizardData } from './types';
import { createImport, getImportPreview, confirmImport } from '../../../services/imports.service';
import { ImportPreviewRow } from '../../../models/imports';
import { ApiError } from '../../../services/errors';

/**
 * Hook para gerenciar o estado do wizard de importação
 */
export const useImportWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [wizardData, setWizardData] = useState<WizardData>({});

  /**
   * Navega para o próximo step
   */
  const goNext = useCallback(() => {
    setErrorMessage(null);
    const steps: Step[] = ['upload', 'map', 'review', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1]);
    }
  }, [currentStep]);

  /**
   * Volta para o step anterior
   */
  const goBack = useCallback(() => {
    setErrorMessage(null);
    const steps: Step[] = ['upload', 'map', 'review', 'complete'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1]);
    }
  }, [currentStep]);

  /**
   * Reseta o wizard para o início
   */
  const reset = useCallback(() => {
    setCurrentStep('upload');
    setWizardData({});
    setErrorMessage(null);
    setLoading(false);
  }, []);

  /**
   * Salva o arquivo selecionado
   */
  const handleFileSelected = useCallback((file: File) => {
    const extension = file.name.split('.').pop()?.toLowerCase();
    const source = extension === 'csv' ? 'csv' : 'xlsx';
    
    setWizardData((prev) => ({
      ...prev,
      file: {
        file,
        source,
        fileName: file.name,
      },
    }));
    setErrorMessage(null);
  }, []);

  /**
   * Inicia o processo de importação
   */
  const startImport = useCallback(async () => {
    if (!wizardData.file) {
      setErrorMessage('Nenhum arquivo selecionado');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      const job = await createImport({
        source: wizardData.file.source,
        fileName: wizardData.file.fileName,
      });

      setWizardData((prev) => ({
        ...prev,
        jobId: job.id,
      }));

      return job;
    } catch (error) {
      const message = error instanceof ApiError 
        ? `Erro ao iniciar importação: ${error.message}`
        : 'Erro desconhecido ao iniciar importação';
      setErrorMessage(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [wizardData.file]);

  /**
   * Carrega o preview do import
   */
  const loadPreview = useCallback(async (jobId: string) => {
    try {
      setLoading(true);
      setErrorMessage(null);

      const preview = await getImportPreview(jobId);

      setWizardData((prev) => ({
        ...prev,
        columns: preview.columns,
        preview: preview.preview,
      }));

      return preview;
    } catch (error) {
      const message = error instanceof ApiError
        ? `Erro ao carregar preview: ${error.message}`
        : 'Erro desconhecido ao carregar preview';
      setErrorMessage(message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Salva os mapeamentos de colunas
   */
  const setMappings = useCallback((mappings: ColumnMapping) => {
    setWizardData((prev) => ({
      ...prev,
      mappings,
    }));
  }, []);

  /**
   * Confirma o import
   */
  const confirm = useCallback(async () => {
    if (!wizardData.jobId || !wizardData.mappings) {
      setErrorMessage('Dados incompletos para confirmar importação');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage(null);

      await confirmImport(wizardData.jobId, {
        mappings: wizardData.mappings,
      });

      goNext();
    } catch (error) {
      const message = error instanceof ApiError
        ? `Erro ao confirmar importação: ${error.message}`
        : 'Erro desconhecido ao confirmar importação';
      setErrorMessage(message);
    } finally {
      setLoading(false);
    }
  }, [wizardData.jobId, wizardData.mappings, goNext]);

  return {
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
  };
};


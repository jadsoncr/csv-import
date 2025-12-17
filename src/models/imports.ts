/**
 * Modelos de dados para Imports
 */

/**
 * Status do job de importação
 */
export type ImportStatus = 'uploaded' | 'parsing' | 'ready' | 'confirmed' | 'error';

/**
 * Job de importação
 */
export interface ImportJob {
  id: string;
  status: ImportStatus;
  createdAt?: string;
  errorMessage?: string;
}

/**
 * Linha do preview de importação
 */
export interface ImportPreviewRow {
  rowNumber: number;
  data: Record<string, string | number | null>;
  issues?: string[];
}

/**
 * Resposta do preview de importação
 */
export type ImportPreviewResponse = {
  job: ImportJob;
  columns: string[];
  preview: ImportPreviewRow[];
};


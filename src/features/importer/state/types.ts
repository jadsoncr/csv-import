/**
 * Tipos do estado do wizard de importação
 */

import { ImportPreviewRow } from '../../../models/imports';

export type Step = 'upload' | 'map' | 'review' | 'complete';

export type SelectedFile = {
  file: File;
  source: 'csv' | 'xlsx';
  fileName: string;
};

export type ColumnMapping = Record<string, string>;

export interface WizardData {
  jobId?: string;
  file?: SelectedFile;
  columns?: string[];
  preview?: ImportPreviewRow[];
  mappings?: ColumnMapping;
}


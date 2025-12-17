import { post } from './apiClient';
import { endpoints } from './endpoints';
import { ImportJob, ImportPreviewResponse } from '../models/imports';
import { USE_MOCKS } from '../config/env';
import { sleep } from '../utils/sleep';

/**
 * Service para Imports
 */

/**
 * Payload para criar um import
 */
export interface CreateImportPayload {
  source: 'csv' | 'xlsx';
  fileName: string;
}

/**
 * Payload para confirmar um import
 */
export interface ConfirmImportPayload {
  mappings: Record<string, string>;
}

/**
 * Mock de dados para desenvolvimento
 */
const mockImportJob: ImportJob = {
  id: 'mock-import-123',
  status: 'ready',
  createdAt: new Date().toISOString(),
};

const mockImportPreview: ImportPreviewResponse = {
  job: mockImportJob,
  columns: ['produto', 'quantidade', 'preco', 'data', 'categoria'],
  preview: [
    {
      rowNumber: 1,
      data: { produto: 'Produto A', quantidade: 10, preco: 25.5, data: '2024-01-15', categoria: 'Eletrônicos' },
    },
    {
      rowNumber: 2,
      data: { produto: 'Produto B', quantidade: 5, preco: 30.0, data: '2024-01-16', categoria: 'Roupas' },
      issues: ['Campo obrigatório ausente'],
    },
    {
      rowNumber: 3,
      data: { produto: 'Produto C', quantidade: 8, preco: 15.0, data: '2024-01-17', categoria: 'Alimentos' },
    },
    {
      rowNumber: 4,
      data: { produto: 'Produto D', quantidade: 12, preco: 45.0, data: null, categoria: 'Casa' },
      issues: ['Data inválida'],
    },
    {
      rowNumber: 5,
      data: { produto: 'Produto E', quantidade: 3, preco: 60.0, data: '2024-01-18', categoria: 'Eletrônicos' },
    },
    {
      rowNumber: 6,
      data: { produto: 'Produto F', quantidade: 20, preco: 8.5, data: '2024-01-19', categoria: 'Alimentos' },
    },
    {
      rowNumber: 7,
      data: { produto: 'Produto G', quantidade: 7, preco: 35.0, data: '2024-01-20', categoria: 'Roupas' },
    },
    {
      rowNumber: 8,
      data: { produto: 'Produto H', quantidade: 15, preco: 22.0, data: '2024-01-21', categoria: 'Casa' },
    },
    {
      rowNumber: 9,
      data: { produto: 'Produto I', quantidade: 4, preco: 55.0, data: '2024-01-22', categoria: 'Eletrônicos' },
    },
    {
      rowNumber: 10,
      data: { produto: 'Produto J', quantidade: 9, preco: 18.0, data: '2024-01-23', categoria: 'Alimentos' },
    },
    {
      rowNumber: 11,
      data: { produto: 'Produto K', quantidade: 6, preco: 40.0, data: '2024-01-24', categoria: 'Roupas' },
    },
  ],
};

/**
 * Cria um novo job de importação
 */
export const createImport = async (payload: CreateImportPayload): Promise<ImportJob> => {
  if (USE_MOCKS) {
    await sleep(400);
    return {
      ...mockImportJob,
      id: `mock-import-${Date.now()}`,
      status: 'parsing',
    };
  }

  return post<ImportJob>(endpoints.imports(), payload);
};

/**
 * Busca preview de um import por ID
 */
export const getImportPreview = async (id: string): Promise<ImportPreviewResponse> => {
  if (USE_MOCKS) {
    await sleep(400);
    return {
      ...mockImportPreview,
      job: {
        ...mockImportJob,
        id,
        status: 'ready',
      },
    };
  }

  return post<ImportPreviewResponse>(endpoints.importPreview(id));
};

/**
 * Confirma um import com os mapeamentos
 */
export const confirmImport = async (
  id: string,
  payload: ConfirmImportPayload
): Promise<{ ok: true }> => {
  if (USE_MOCKS) {
    await sleep(400);
    return { ok: true };
  }

  return post<{ ok: true }>(endpoints.importConfirm(id), payload);
};


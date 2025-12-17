import { API_URL, API_TOKEN } from '../config/env';
import { ApiError, createApiError } from './errors';

/**
 * Cliente API padronizado usando fetch
 * Sem dependências externas
 */

const TIMEOUT_MS = 15000; // 15 segundos

/**
 * Cria headers padrão para requisições
 */
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (API_TOKEN) {
    headers['Authorization'] = `Bearer ${API_TOKEN}`;
  }

  return headers;
};

/**
 * Cria um AbortController com timeout
 */
const createTimeoutController = (): AbortController => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), TIMEOUT_MS);
  return controller;
};

/**
 * Executa uma requisição HTTP genérica
 */
const request = async <T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_URL}${endpoint}`;
  const controller = createTimeoutController();

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        ...getHeaders(),
        ...options.headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw await createApiError(response.status, response.statusText, response);
    }

    // Se a resposta não tiver conteúdo, retorna vazio
    if (response.status === 204 || response.headers.get('content-length') === '0') {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request Timeout', 'A requisição excedeu o tempo limite');
    }

    throw new ApiError(undefined, 'Network Error', error instanceof Error ? error.message : 'Erro desconhecido');
  }
};

/**
 * GET request genérico
 */
export const get = <T>(endpoint: string): Promise<T> => {
  return request<T>(endpoint, { method: 'GET' });
};

/**
 * POST request genérico
 */
export const post = <T>(endpoint: string, body?: unknown): Promise<T> => {
  return request<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  });
};

/**
 * PUT request genérico
 */
export const put = <T>(endpoint: string, body?: unknown): Promise<T> => {
  return request<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  });
};

/**
 * DELETE request genérico
 */
export const del = <T>(endpoint: string): Promise<T> => {
  return request<T>(endpoint, { method: 'DELETE' });
};

/**
 * Tipos de erro da API
 * Erros tipados para tratamento centralizado
 */

/**
 * Erro customizado da API
 */
export class ApiError extends Error {
  constructor(
    public status?: number,
    public statusText?: string,
    message?: string,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Converte erro para mensagem humana
 */
export const toHumanMessage = (err: unknown): string => {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Não autorizado. Verifique suas credenciais.';
    if (err.status === 403) return 'Acesso negado.';
    if (err.status === 404) return 'Recurso não encontrado.';
    if (err.status === 408) return 'Timeout. Tente novamente.';
    if (err.status === 500) return 'Erro interno do servidor.';
    if (err.status) return `Erro ${err.status}: ${err.message || 'Erro desconhecido'}`;
  }
  
  if (err instanceof Error) {
    if (err.message.includes('timeout') || err.message.includes('Timeout')) {
      return 'Timeout. Tente novamente.';
    }
    return err.message;
  }
  
  return 'Erro desconhecido';
};

/**
 * Mapeia status HTTP para mensagens humanas
 */
const getErrorMessage = (status: number, statusText: string): string => {
  const errorMessages: Record<number, string> = {
    400: 'Requisição inválida. Verifique os dados enviados.',
    401: 'Não autorizado. Verifique suas credenciais.',
    403: 'Acesso negado. Você não tem permissão para esta ação.',
    404: 'Recurso não encontrado.',
    409: 'Conflito. O recurso já existe ou está em uso.',
    422: 'Dados inválidos. Verifique os campos obrigatórios.',
    429: 'Muitas requisições. Tente novamente em alguns instantes.',
    500: 'Erro interno do servidor. Tente novamente mais tarde.',
    502: 'Servidor indisponível. Tente novamente mais tarde.',
    503: 'Serviço temporariamente indisponível.',
  };

  return errorMessages[status] || `Erro ${status}: ${statusText}`;
};

/**
 * Cria um ApiError a partir de uma resposta HTTP
 */
export const createApiError = async (
  status: number,
  statusText: string,
  response: Response
): Promise<ApiError> => {
  let details: unknown;
  
  try {
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      details = await response.json();
    } else {
      details = await response.text();
    }
  } catch {
    // Ignora erros ao ler o corpo da resposta
  }

  const message = getErrorMessage(status, statusText);
  
  return new ApiError(status, statusText, message, details);
};


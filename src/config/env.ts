/**
 * Configuração de variáveis de ambiente
 * Valida variáveis obrigatórias e fornece acesso tipado
 */

const getEnvVar = (key: string, required = false): string | undefined => {
  const value = import.meta.env[key];
  
  if (required && !value) {
    throw new Error(
      `❌ Variável de ambiente obrigatória ausente: ${key}\n` +
      `Por favor, configure ${key} no arquivo .env`
    );
  }
  
  return value;
};

/**
 * URL base da API (obrigatória)
 */
export const API_URL = getEnvVar('VITE_API_URL', true) as string;

/**
 * Token de autenticação (opcional)
 */
export const API_TOKEN = getEnvVar('VITE_API_TOKEN', false);

/**
 * Flag para usar mocks em desenvolvimento
 */
export const USE_MOCKS = getEnvVar('VITE_USE_MOCKS', false) === 'true';

// Validação no carregamento do módulo
if (!API_URL) {
  console.error('❌ VITE_API_URL não configurada. Configure no arquivo .env');
}


/**
 * Utilitário para simular delay (útil para mocks)
 * @param ms Milissegundos para aguardar
 */
export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};


/**
 * Endpoints centralizados da API
 * Funções que retornam paths dos endpoints
 */

export const endpoints = {
  /**
   * Health check da API
   */
  health: () => '/health',

  /**
   * KPIs
   */
  kpis: () => '/kpis',

  /**
   * Imports
   */
  imports: () => '/imports',
  
  /**
   * Import por ID
   */
  importById: (id: string) => `/imports/${id}`,
  
  /**
   * Preview de import
   */
  importPreview: (id: string) => `/imports/${id}/preview`,
  
  /**
   * Confirmar import
   */
  importConfirm: (id: string) => `/imports/${id}/confirm`,

  /**
   * Recipes
   */
  recipes: () => '/recipes',
};


import { get, post, put, del } from './apiClient';
import { endpoints } from './endpoints';
import { Recipe } from '../models/recipes';
import { USE_MOCKS } from '../config/env';
import { sleep } from '../utils/sleep';

/**
 * Service para Recipes (Fichas Técnicas)
 */

/**
 * Mock de dados para desenvolvimento
 */
const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Hambúrguer Artesanal',
    yieldQty: 1,
    yieldUnit: 'unidade',
    salePrice: 25.0,
    items: [
      { id: '1-1', name: 'Pão de hambúrguer', qty: 1, unit: 'un', costUnit: 1.5 },
      { id: '1-2', name: 'Carne moída', qty: 150, unit: 'g', costUnit: 0.08 },
      { id: '1-3', name: 'Queijo cheddar', qty: 30, unit: 'g', costUnit: 0.12 },
      { id: '1-4', name: 'Alface', qty: 20, unit: 'g', costUnit: 0.05 },
      { id: '1-5', name: 'Tomate', qty: 30, unit: 'g', costUnit: 0.06 },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Pizza Margherita',
    yieldQty: 1,
    yieldUnit: 'pizza',
    salePrice: 45.0,
    items: [
      { id: '2-1', name: 'Massa de pizza', qty: 300, unit: 'g', costUnit: 0.03 },
      { id: '2-2', name: 'Molho de tomate', qty: 100, unit: 'ml', costUnit: 0.02 },
      { id: '2-3', name: 'Mussarela', qty: 200, unit: 'g', costUnit: 0.15 },
      { id: '2-4', name: 'Manjericão', qty: 5, unit: 'g', costUnit: 0.5 },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: '3',
    name: 'Salada Caesar',
    yieldQty: 1,
    yieldUnit: 'porção',
    salePrice: 18.0,
    items: [
      { id: '3-1', name: 'Alface romana', qty: 100, unit: 'g', costUnit: 0.04 },
      { id: '3-2', name: 'Croutons', qty: 30, unit: 'g', costUnit: 0.08 },
      { id: '3-3', name: 'Molho caesar', qty: 50, unit: 'ml', costUnit: 0.12 },
      { id: '3-4', name: 'Parmesão', qty: 20, unit: 'g', costUnit: 0.25 },
    ],
    updatedAt: new Date().toISOString(),
  },
];

/**
 * Lista todas as recipes (fichas técnicas)
 */
export const listRecipes = async (): Promise<Recipe[]> => {
  if (USE_MOCKS) {
    await sleep(400);
    return [...mockRecipes];
  }

  return get<Recipe[]>(endpoints.recipes());
};

/**
 * Busca uma recipe por ID
 */
export const getRecipe = async (id: string): Promise<Recipe> => {
  if (USE_MOCKS) {
    await sleep(300);
    const recipe = mockRecipes.find((r) => r.id === id);
    if (!recipe) {
      throw new Error(`Recipe com ID ${id} não encontrada`);
    }
    return { ...recipe };
  }

  return get<Recipe>(`${endpoints.recipes()}/${id}`);
};

/**
 * Salva uma recipe (cria ou atualiza)
 */
export const saveRecipe = async (recipe: Recipe): Promise<Recipe> => {
  if (USE_MOCKS) {
    await sleep(400);
    const existingIndex = mockRecipes.findIndex((r) => r.id === recipe.id);
    
    const savedRecipe: Recipe = {
      ...recipe,
      itemsCount: recipe.items.length,
      updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
      mockRecipes[existingIndex] = savedRecipe;
    } else {
      // Novo ID se não tiver
      if (!savedRecipe.id) {
        savedRecipe.id = `mock-${Date.now()}`;
      }
      mockRecipes.push(savedRecipe);
    }

    return { ...savedRecipe };
  }

  if (recipe.id) {
    return put<Recipe>(`${endpoints.recipes()}/${recipe.id}`, recipe);
  } else {
    return post<Recipe>(endpoints.recipes(), recipe);
  }
};

/**
 * Deleta uma recipe
 */
export const deleteRecipe = async (id: string): Promise<{ ok: true }> => {
  if (USE_MOCKS) {
    await sleep(300);
    const index = mockRecipes.findIndex((r) => r.id === id);
    if (index >= 0) {
      mockRecipes.splice(index, 1);
    }
    return { ok: true };
  }

  return del<{ ok: true }>(`${endpoints.recipes()}/${id}`);
};

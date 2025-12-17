/**
 * Tipos do estado de Recipes
 */

import { Recipe } from '../../../models/recipes';

export interface RecipesState {
  recipes: Recipe[];
  selectedRecipe: Recipe | null;
  loading: boolean;
  error: string | null;
  searchQuery: string;
}


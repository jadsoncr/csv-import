import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '../../../models/recipes';
import { listRecipes, getRecipe, saveRecipe, deleteRecipe } from '../../../services/recipes.service';
import { ApiError } from '../../../services/errors';

/**
 * Hook para gerenciar estado de Recipes
 */
export const useRecipes = () => {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  /**
   * Carrega todas as recipes
   */
  const loadRecipes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await listRecipes();
      setRecipes(data);
    } catch (err) {
      const message = err instanceof ApiError
        ? `Erro ao carregar fichas técnicas: ${err.message}`
        : 'Erro desconhecido ao carregar fichas técnicas';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Carrega uma recipe específica
   */
  const loadRecipe = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      const recipe = await getRecipe(id);
      setSelectedRecipe(recipe);
    } catch (err) {
      const message = err instanceof ApiError
        ? `Erro ao carregar ficha técnica: ${err.message}`
        : 'Erro desconhecido ao carregar ficha técnica';
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Salva uma recipe (cria ou atualiza)
   */
  const handleSaveRecipe = useCallback(async (recipe: Recipe) => {
    try {
      setLoading(true);
      setError(null);
      const saved = await saveRecipe(recipe);
      
      // Atualiza na lista
      setRecipes((prev) => {
        const index = prev.findIndex((r) => r.id === saved.id);
        if (index >= 0) {
          const updated = [...prev];
          updated[index] = saved;
          return updated;
        } else {
          return [...prev, saved];
        }
      });
      
      setSelectedRecipe(saved);
      return saved;
    } catch (err) {
      const message = err instanceof ApiError
        ? `Erro ao salvar ficha técnica: ${err.message}`
        : 'Erro desconhecido ao salvar ficha técnica';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Deleta uma recipe
   */
  const handleDeleteRecipe = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      await deleteRecipe(id);
      
      setRecipes((prev) => prev.filter((r) => r.id !== id));
      
      if (selectedRecipe?.id === id) {
        setSelectedRecipe(null);
      }
    } catch (err) {
      const message = err instanceof ApiError
        ? `Erro ao deletar ficha técnica: ${err.message}`
        : 'Erro desconhecido ao deletar ficha técnica';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [selectedRecipe]);

  /**
   * Cria uma nova recipe vazia
   */
  const createNewRecipe = useCallback(() => {
    const newRecipe: Recipe = {
      id: '',
      name: '',
      yieldQty: 1,
      yieldUnit: 'porção',
      salePrice: 0,
      items: [],
    };
    setSelectedRecipe(newRecipe);
  }, []);

  /**
   * Filtra recipes por busca
   */
  const filteredRecipes = recipes.filter((recipe) =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Carrega recipes na montagem
  useEffect(() => {
    loadRecipes();
  }, [loadRecipes]);

  return {
    recipes: filteredRecipes,
    selectedRecipe,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    loadRecipe,
    handleSaveRecipe,
    handleDeleteRecipe,
    createNewRecipe,
    setSelectedRecipe,
    reloadRecipes: loadRecipes,
  };
};


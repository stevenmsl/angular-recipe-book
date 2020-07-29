import { Recipe } from '../recipe.model';
import * as ra from './recipe.actions';

export interface State {
  recipes: Recipe[];
}

const initialState: State = {
  recipes: [],
};

export function recipeReducer(state = initialState, action: ra.RecipesActions) {
  switch (action.type) {
    case ra.SET_RECIPES:
      return {
        ...state,
        recipes: [...action.payload],
      };
    case ra.ADD_RECIPE:
      return {
        ...state,
        recipes: [...state.recipes, action.payload],
      };
    case ra.UPDATE_RECIPE:
      const updatedRecipe = {
        ...state.recipes[action.payload.index],
        ...action.payload.newRecipe, // merge the changes
      };

      const updatedRecipes = [...state.recipes];
      updatedRecipes[action.payload.index] = updatedRecipe;
      return {
        ...state,
        recipes: updatedRecipes,
      };
    case ra.DELETE_RECIPE:
      return {
        ...state,
        recipes: state.recipes.filter((recipe, index) => {
          return index !== action.payload;
        }),
      };
    default:
      return state;
  }
}

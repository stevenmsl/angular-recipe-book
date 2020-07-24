import { Ingredient } from '../../shared/ingredient.model';
import * as sla from './shopping-list.actions';

export interface State {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

const initialState: State = {
  ingredients: [new Ingredient('Apples', 5), new Ingredient('Tomatoes', 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

/*
  - need to update the state in a immutable way 
*/

export function shoppingListReducer(
  state = initialState,
  action: sla.ShoppingListActions
) {
  switch (action.type) {
    case sla.ADD_INGREDIENT:
      return {
        ...state, // copy everytning
        // update what you want to modify
        ingredients: [...state.ingredients, action.payload],
      };
    case sla.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };
    case sla.UPDATE_INGREDIENT:
      const ingredient = state.ingredients[state.editedIngredientIndex];
      const updatedIngredient = {
        /*
          copy existing state
        */
        ...ingredient,
        /*
          overwrite properties with new values 
        */
        ...action.payload.ingredient,
      };
      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;
      return {
        ...state,
        ingredients: updatedIngredients,
        // should stop editing as well
        editedIngredientIndex: -1,
        editedIngredient: null,
      };
    case sla.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter((ig, index) => {
          return index !== state.editedIngredientIndex;
        }),
        // should stop editing as well
        editedIngredientIndex: -1,
        editedIngredient: null,
      };
    case sla.START_EDIT:
      return {
        ...state,
        editedIngredientIndex: action.payload,
        editedIngredient: { ...state.ingredients[action.payload] },
      };
    case sla.STOP_EDIT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };
    // crucial to initialize the state
    default:
      return state;
  }
}

import * as fromShoppingList from '../shopping-list/store/shopping-list.reducer';
import * as fromAuth from '../auth/store/auth.reducer';
import { ActionReducerMap } from '@ngrx/store';

/*
   - any action dispatched will reach all reducers 
   - it is important for each reducer to return 
     the original state if it does not recognize 
     the action received
   - action type must be unique in the entire application
   - action type name convention [Feature Name] Action: [Shopping List] Add Ingredient   

*/

export interface AppState {
  shoppingList: fromShoppingList.State;
  auth: fromAuth.State;
}

export const appReducer: ActionReducerMap<AppState> = {
  shoppingList: fromShoppingList.shoppingListReducer,
  auth: fromAuth.authReducer,
};

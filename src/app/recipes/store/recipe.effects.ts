import { Actions, Effect, ofType } from '@ngrx/effects';
import * as fromApp from '../../store/app.reducer';
import * as ra from './recipe.actions';
import { switchMap, map, withLatestFrom } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { Recipe } from '../recipe.model';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

@Injectable()
export class RecipeEffects {
  private url = `https://angular-recipe-book-704dd.firebaseio.com/recipes.json`;
  @Effect()
  fetchRecipes = this.actions$.pipe(
    ofType(ra.FETCH_RECIPES),
    switchMap(() => {
      return this.http.get<Recipe[]>(this.url);
    }),
    map((recipes) => {
      return recipes.map((recipe) => {
        // set the ingredients to an empty array
        // if it’s missing from the recipe
        return {
          ...recipe,
          ingredients: recipe.ingredients ? recipe.ingredients : [],
        };
      });
    }),
    map((recipes) => {
      return new ra.SetRecipes(recipes);
    })
  );

  @Effect({ dispatch: false })
  storeRecipes = this.actions$.pipe(
    ofType(ra.STORE_RECIPES),
    withLatestFrom(this.store.select('recipes')),
    switchMap(([actionData, recipeState]) => {
      return this.http.put(this.url, recipeState.recipes);
    })
  );

  constructor(
    private actions$: Actions,
    private http: HttpClient,
    private store: Store<fromApp.AppState>
  ) {}
}

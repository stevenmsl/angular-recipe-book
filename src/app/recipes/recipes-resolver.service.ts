import { Injectable } from '@angular/core';
import {
  Resolve,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import * as fromApp from '../store/app.reducer';
import * as ra from './store/recipe.actions';
import { Recipe } from './recipe.model';
import { Observable, of } from 'rxjs';
import { DataStorageService } from '../shared/data-storage.service';
import { RecipeService } from './recipe.service';
import { take, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(
    private dataStorgeService: DataStorageService,
    private recipeService: RecipeService,
    private store: Store<fromApp.AppState>,
    // you can access dispatched actions in a regular
    // class not just in the effects
    private actions$: Actions
  ) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    return this.store.select('recipes').pipe(
      take(1),
      map((recipeState) => recipeState.recipes),
      switchMap((recipes) => {
        if (recipes.length === 0) {
          this.store.dispatch(new ra.FetchRecipes());
          return this.actions$.pipe(ofType(ra.SET_RECIPES), take(1));
        } else {
          return of(recipes);
        }
      })
    );

    // const recipes = this.recipeService.getRecipes();
    // if (recipes.length === 0) {
    //   return this.dataStorgeService.fetchRecipes();
    // }
    // return recipes;
  }
}

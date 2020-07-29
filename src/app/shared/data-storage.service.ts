import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { map, tap } from 'rxjs/operators';
import * as fromApp from '../store/app.reducer';
import * as ra from '../recipes/store/recipe.actions';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(
    private http: HttpClient,
    private recipesService: RecipeService,
    private store: Store<fromApp.AppState>
  ) {}

  private url = `https://angular-recipe-book-704dd.firebaseio.com/recipes.json`;

  storeRecipes() {
    const recipes = this.recipesService.getRecipes();
    this.http.put(this.url, recipes).subscribe((response) => {
      console.log(response);
    });
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(this.url).pipe(
      map((recipes) => {
        return recipes.map((recipe) => {
          // set the ingredients to an empty array if it’s missing
          return {
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          };
        });
      }),
      tap((recipes: Recipe[]) => {
        this.store.dispatch(new ra.SetRecipes(recipes));
        //console.log(recipes);
        //this.recipesService.setRecipes(recipes);
      })
    );
  }
}

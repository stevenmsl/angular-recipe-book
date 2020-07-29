import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import * as fromApp from '../../store/app.reducer';
import { map, switchMap } from 'rxjs/operators';
import * as ra from '../store/recipe.actions';
import * as sa from '../../shopping-list/store/shopping-list.actions';
@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css'],
})
export class RecipeDetailComponent implements OnInit {
  @Input()
  recipe: Recipe;
  id: number;
  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit(): void {
    this.route.params
      .pipe(
        map((params) => +params['id']),
        switchMap((id) => {
          this.id = id;
          return this.store.select('recipes');
        }),
        map((recipesState) =>
          recipesState.recipes.find((recipe, index) => {
            return index === this.id;
          })
        )
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }
  onAddToShoppingList() {
    this.store.dispatch(new sa.AddIngredients(this.recipe.ingredients));
    //console.log(this.recipe.ingredients);
    //this.recipeService.addIngredientsToShoppingList(this.recipe.ingredients);
  }
  onEditRecipe() {
    // either of the following approaches would work
    //this.router.navigate(["edit"], { relativeTo: this.route });
    this.router.navigate(['../', this.id, 'edit'], { relativeTo: this.route });
  }
  onDeleteRecipe() {
    this.store.dispatch(new ra.DeleteRecipe(this.id));
    //this.recipeService.deleteRecipe(this.id);
    this.router.navigate(['/recipes']);
  }
}

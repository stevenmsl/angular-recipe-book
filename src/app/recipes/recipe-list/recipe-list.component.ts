import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit, OnDestroy {
  // the source of events is coming from the
  // child component (recipe-item)
  recipes: Recipe[];
  subscription: Subscription;

  @Output()
  recipeSelected = new EventEmitter<Recipe>();
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit(): void {
    this.subscription = this.store
      .select('recipes')
      .pipe(map((recipesState) => recipesState.recipes))
      .subscribe((recipes: Recipe[]) => {
        this.recipes = recipes;
      });
  }
  onRecipeSelected(recipe: Recipe) {
    // re-emit what you have received from child component, recipe-item.
    this.recipeSelected.emit(recipe);
  }
  onNewRecipe() {
    this.router.navigate(['new'], { relativeTo: this.route });
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

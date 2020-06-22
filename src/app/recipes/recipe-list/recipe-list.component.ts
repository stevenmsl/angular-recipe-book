import { Component, OnInit, EventEmitter, Output } from "@angular/core";
import { Recipe } from "../recipe.model";
import { RecipeService } from "../recipe.service";

@Component({
  selector: "app-recipe-list",
  templateUrl: "./recipe-list.component.html",
  styleUrls: ["./recipe-list.component.css"],
})
export class RecipeListComponent implements OnInit {
  // the source of events is coming from the
  // child component (recipe-item)
  recipes: Recipe[];

  @Output()
  recipeSelected = new EventEmitter<Recipe>();
  // moved to service
  // recipes: Recipe[] = [
  //   new Recipe(
  //     'A Test Recipe',
  //     'This is simply a test',
  //     'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg'
  //   ),
  // ];
  constructor(private recipeService: RecipeService) {
  }
  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
  }
  onRecipeSelected(recipe: Recipe) {
    // re-emit what you have received from child component, recipe-item.
    this.recipeSelected.emit(recipe);
  }
}

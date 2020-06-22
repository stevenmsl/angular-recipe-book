import { Component, OnInit } from "@angular/core";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipe.service";

@Component({
  selector: "app-recipes",
  templateUrl: "./recipes.component.html",
  styleUrls: ["./recipes.component.css"],
  providers: [RecipeService],
})
export class RecipesComponent implements OnInit {
  selectedRecipe: Recipe;
  constructor(private recipeService: RecipeService) {
  }

  ngOnInit(): void {
    // subscribe to the event defined in the service directly.
    // You no longer need the middleman recipe-list component
    // to inform you a recipe has been selected
    // when a recipe-item component is clicked.
    this.recipeService.recipeSelected.subscribe((recipe: Recipe) => {
      this.selectedRecipe = recipe;
    });
  }
}

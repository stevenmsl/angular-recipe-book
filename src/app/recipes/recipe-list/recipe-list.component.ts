import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Recipe } from '../recipe.model';

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css'],
})
export class RecipeListComponent implements OnInit {
  // the source of events is coming from the
  // child component (recipe-item)
  @Output() recipeSelected = new EventEmitter<Recipe>();
  recipes: Recipe[] = [
    new Recipe(
      'A Test Recipe',
      'This is simply a test',
      'https://cdn.pixabay.com/photo/2016/06/15/19/09/food-1459693_960_720.jpg'
    ),
  ];
  constructor() {}
  ngOnInit(): void {}
  onRecipeSelected(recipe: Recipe) {
    // re-emit what you have received from child component, recipe-item.
    this.recipeSelected.emit(recipe);
  }
}

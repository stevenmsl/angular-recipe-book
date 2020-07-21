import { Component, OnInit, OnDestroy } from '@angular/core';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from './shopping-list.service';
import { Subscription, Observable } from 'rxjs';
import { LoggingService } from '../logging.service';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css'],
})
export class ShoppingListComponent implements OnInit, OnDestroy {
  ingredients: Observable<{ ingredients: Ingredient[] }>;
  private igChangeSub: Subscription;
  // ingredients: Ingredient[] = [
  //   new Ingredient('Apples', 5),
  //   new Ingredient('Tomatoes', 10),
  // ];
  constructor(
    private slService: ShoppingListService,
    private loggingService: LoggingService,
    /* 
      - area: shoppingList
      - you can find what the area should be in in the 
        app.module:
        StoreModule.forRoot({
        shoppingList: shoppingListReducer,
        }),
      - the type of the area (shoppingList) should be the same
        as the return type of the initial state defined in the 
        reducer:
        const initialState = {
          ingredients: [new Ingredient('Apples', 5), 
          new Ingredient('Tomatoes', 10)],
        };
    */
    private store: Store<{ shoppingList: { ingredients: Ingredient[] } }>
  ) {}

  ngOnInit(): void {
    this.ingredients = this.store.select('shoppingList');

    this.loggingService.printLog('Hello from ShoppingListComponent');
  }

  onEditItem(index: number) {
    // use service to communicate with shopping-edit component
    this.slService.startedEditing.next(index);
  }

  onIngredientAdded(ingredient: Ingredient) {
    //this.ingredients.push(ingredient);
  }
  ngOnDestroy() {}
}

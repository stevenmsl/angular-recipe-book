import { NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { AuthInterceptorService } from './auth/auth-interceptor.service';
import { ShoppingListService } from './shopping-list/shopping-list.service';
import { RecipeService } from './recipes/recipe.service';

/*
   - This is a collection of services that will be imported 
     by app.module and in turns made available by Angular via DI
   - A newer, recommended approach is to use the Injectable decorator
     on each individual service to configure where the service will 
     be provided.
   - example: @Injectable({ providedIn: 'root' })
     export class DataStorageService { }
   - HTTP_INTERCEPTORS is one of the exceptions 

*/

@NgModule({
  providers: [
    ShoppingListService,
    RecipeService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
  ],
})
export class CoreModule {}

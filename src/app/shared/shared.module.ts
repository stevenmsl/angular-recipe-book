import { NgModule } from '@angular/core';
import { AlertComponent } from './alert/alert.component';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { PlaceholderDirective } from './placeholder/placeholder.directive';
import { DropdownDirective } from './dropdown.directive';
import { CommonModule } from '@angular/common';
import { LoggingService } from '../logging.service';

@NgModule({
  declarations: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
  ],
  imports: [CommonModule],

  exports: [
    AlertComponent,
    LoadingSpinnerComponent,
    PlaceholderDirective,
    DropdownDirective,
    // Expose the Common Module as well so that
    // whoever imports this module doesn’t need
    // to import CommonModule separately
    CommonModule,
  ],
  /*
    - generally speaking, we should avoid specifying services 
      in the providers array inside a module
    - a lazy-loaded module who imports this module will get 
      its own instance of the logging service instead of using 
      the application-wide instance created by app module who
      eager-loads the this module as well 
  */
  providers: [LoggingService],
  entryComponents: [AlertComponent],
})
export class SharedModule {}

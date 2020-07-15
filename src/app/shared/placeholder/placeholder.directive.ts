import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appPlaceholder]',
})
export class PlaceholderDirective {
  // viewContainerRef needs to be public because the
  // component whose template uses this directive will
  // access the viewContainerRef to create components
  // it wants to place in the container
  constructor(public viewContainerRef: ViewContainerRef) {}
}

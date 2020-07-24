import {
  Component,
  ComponentFactoryResolver,
  ViewChild,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService, AuthResponseData } from './auth.service';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceholderDirective } from '../shared/placeholder/placeholder.directive';
import * as fromApp from '../store/app.reducer';
import * as aa from './store/auth.actions';
import { Store } from '@ngrx/store';

/*
   Dynamic components 
   - You don’t have to use it. *ngIf directive is probably 
     a better, much easier alternative in most cases
   - You need to create a directive, who exposes ViewContainerRef, 
     that allows you to put the programmatically created component in the
     container located in the template.
   - Use componentFactoryResolver to create a factory to tell 
     Angular which component to create
   - use the ViewContainerRef exposed by the directive to create the component
   - set the properties and event handlers of the programmatically  created component
*/

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  @ViewChild(PlaceholderDirective, { static: false })
  alertHost: PlaceholderDirective;

  private closeSub: Subscription;

  private storeSub: Subscription;

  constructor(
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit(): void {
    this.storeSub = this.store.select('auth').subscribe((authState) => {
      this.isLoading = authState.loading;
      this.error = authState.authError;
      if (this.error) {
        this.showErrorAlert(this.error);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.closeSub) {
      this.closeSub.unsubscribe();
    }
    if (this.storeSub) {
      this.storeSub.unsubscribe();
    }
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>;
    this.isLoading = true;

    // authObs = this.isLoginMode
    //   ? this.authService.login(email, password)
    //   : this.authService.signup(email, password);

    if (this.isLoginMode) {
      this.store.dispatch(
        new aa.LoginStart({
          email,
          password,
        })
      );
    } else {
      this.store.dispatch(
        new aa.SignupStart({
          email,
          password,
        })
      );
    }

    // authObs.subscribe(
    //   (resData) => {
    //     // console.log(resData);
    //     this.isLoading = false;
    //     this.router.navigate(['/recipes']);
    //   },
    //   (error) => {
    //     // console.log(error);
    //     this.error = error;
    //     this.showErrorAlert(error);
    //     this.isLoading = false;
    //   }
    // );

    form.reset();
  }

  onHandleError() {
    //this.error = null;
    this.store.dispatch(new aa.ClearError());
  }

  // not necessarily preferred -
  // the imperative way of showing the alert modal box
  // as opposed to using the *ngIf directive
  private showErrorAlert(error: string) {
    /*
      - you can’t simply create an instance of your component
        using new operator as Angular needs to do more work
        behind the scene.
      - use ComponentFactoryResolver
    */
    const alertCmpFactory = this.componentFactoryResolver.resolveComponentFactory(
      AlertComponent
    );
    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();
    const componentRef = hostViewContainerRef.createComponent(alertCmpFactory);
    componentRef.instance.message = error;
    this.closeSub = componentRef.instance.close.subscribe(() => {
      this.closeSub.unsubscribe();
      hostViewContainerRef.clear();
    });
  }
}

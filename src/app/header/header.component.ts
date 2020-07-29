import {
  Component,
  EventEmitter,
  Output,
  OnInit,
  OnDestroy,
} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';
import { AuthService } from '../auth/auth.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { Store } from '@ngrx/store';
import * as fromApp from '../store/app.reducer';
import { map } from 'rxjs/operators';
import * as aa from '../auth/store/auth.actions';
import * as ra from '../recipes/store/recipe.actions';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  @Output() featureSelected = new EventEmitter<string>();
  onSelect(feature: string) {
    this.featureSelected.emit(feature);
  }

  constructor(
    private dataStorageService: DataStorageService,
    private authService: AuthService,
    private store: Store<fromApp.AppState>
  ) {}

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }

  ngOnInit(): void {
    this.userSub = this.store
      .select('auth')
      .pipe(map((authState) => authState.user))
      .subscribe((user) => {
        this.isAuthenticated = !!user;
      });
  }

  onSaveData() {
    this.store.dispatch(new ra.StoreRecipes());
    //this.dataStorageService.storeRecipes();
  }
  onFetchData() {
    this.store.dispatch(new ra.FetchRecipes());
  }

  onLogout() {
    this.store.dispatch(new aa.Logout());
    //this.authService.logout();
  }
}

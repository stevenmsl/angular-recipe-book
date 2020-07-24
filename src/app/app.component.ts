import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { LoggingService } from './logging.service';
import { Store } from '@ngrx/store';
import * as fromApp from '../app/store/app.reducer';
import * as aa from './auth/store/auth.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private loggingServie: LoggingService,
    private store: Store<fromApp.AppState>
  ) {}
  ngOnInit(): void {
    this.store.dispatch(new aa.AutoLogin());
    // this.authService.autoLogin();
    //this.loggingServie.printLog('Hello from AppComponent');
  }
  loadedFeature = 'recipe';
  onNavigate(feature: string) {
    console.log(feature);
    this.loadedFeature = feature;
  }
}

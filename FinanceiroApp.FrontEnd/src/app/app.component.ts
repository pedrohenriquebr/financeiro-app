import { Component } from '@angular/core';
import { AuthService } from './core/services/auth.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Financeiro App';
  isAuthenticated$;

  constructor(private authService: AuthService) {
    this.isAuthenticated$ = this.authService.user$.pipe(
      map(user => !!user)
    );
  }
}
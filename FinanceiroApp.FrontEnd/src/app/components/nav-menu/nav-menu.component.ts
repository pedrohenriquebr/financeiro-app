import { Component } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrls: ['./nav-menu.component.scss']
})
export class NavMenuComponent {
  menuItems = [
    { path: 'transactions', label: 'Transações', icon: 'receipt_long' },
    { path: 'description-mappings', label: 'Mapeamentos', icon: 'compare_arrows' },
    { path: 'categories', label: 'Categorias', icon: 'category' },
    { path: 'bank-accounts', label: 'Contas', icon: 'account_balance' },
    { path: 'banks', label: 'Bancos', icon: 'account_balance_wallet' },
  ];

  isHandset$: Observable<boolean>;
  user$: Observable<any & { safePicture: SafeResourceUrl }>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {
    this.isHandset$ = this.breakpointObserver.observe(Breakpoints.Handset)
      .pipe(
        map(result => result.matches),
        shareReplay()
      );

    this.user$ = this.authService.user$.pipe(
      map(user => {
        if (!user) return null;
        return {
          ...user,
          safePicture: this.sanitizer.bypassSecurityTrustResourceUrl(user.picture)
        };
      })
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}

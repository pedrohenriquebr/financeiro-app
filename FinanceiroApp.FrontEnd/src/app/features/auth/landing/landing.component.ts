import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../core/services/auth.service';
import { DonateDialogComponent } from '../donate-dialog/donate-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatDividerModule } from '@angular/material/divider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatGridListModule,
    MatDividerModule
  ]
})
export class LandingComponent implements AfterViewInit {
  @ViewChild('googleBtn') googleBtn!: ElementRef;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog
  ) {}

  ngAfterViewInit() {
    // Inicializa o botão do Google após a view ser criada
    this.authService.initGoogleButton(this.googleBtn.nativeElement);
  }

  login() {
    this.authService.login();
  }

  openDonateDialog() {
    this.dialog.open(DonateDialogComponent, {
      width: '600px',
      panelClass: 'donate-dialog'
    });
  }
}

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-loading-dialog',
  template: `
    <div class="loading-dialog">
      <h2>{{ data.title }}</h2>
      <mat-progress-bar mode="indeterminate"></mat-progress-bar>
      <p *ngIf="data.message">{{ data.message }}</p>
    </div>
  `,
  styles: [`
    .loading-dialog {
      padding: 20px;
      text-align: center;
    }
    h2 {
      margin-bottom: 20px;
    }
    p {
      margin-top: 20px;
      color: rgba(0, 0, 0, 0.54);
    }
  `]
})
export class LoadingDialogComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { title: string; message?: string }) {}
}

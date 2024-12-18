import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule, MatSpinner } from '@angular/material/progress-spinner';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';

import { DashboardComponent } from './dashboard.component';
import { FinancialGoalDialogComponent } from './financial-goal-dialog/financial-goal-dialog.component';
import { MatTableModule } from '@angular/material/table';
import { ScheduledTransactionDialogComponent } from './scheduled-transaction-dialog/scheduled-transaction-dialog.component';
import { ScheduledTransactionsListComponent } from './scheduled-transactions-list/scheduled-transactions-list.component';
import { MatListModule } from '@angular/material/list';
import { CurrencyMaskModule } from 'ng2-currency-mask';

@NgModule({
  declarations: [
    DashboardComponent,
    FinancialGoalDialogComponent,
    ScheduledTransactionDialogComponent,
    ScheduledTransactionsListComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    CurrencyMaskModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent }
    ]),
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatIconModule,
    MatButtonToggleModule,
    MatTooltipModule,
    MatDialogModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatCheckboxModule,
    MatExpansionModule
  ]
})
export class DashboardModule { }

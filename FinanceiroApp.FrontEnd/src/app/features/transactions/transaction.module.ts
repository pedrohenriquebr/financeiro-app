import { NgModule } from '@angular/core';
import { SharedModule } from '../../components/shared/shared.module';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { TransactionFormComponent } from './transaction-form/transaction-form.component';
import { ImportTransactionsModule } from './import-transactions/import-transactions.module';
import { MatStepperModule } from '@angular/material/stepper';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@NgModule({
  declarations: [
    TransactionListComponent,
    TransactionFormComponent
  ],
  imports: [
    SharedModule,
    MatStepperModule,
    MatProgressBarModule,
    ImportTransactionsModule
  ],
  exports: [
    TransactionListComponent,
    TransactionFormComponent,
    ImportTransactionsModule
  ]
})
export class TransactionModule { }

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScheduledTransactionService } from '../../../services/scheduled-transaction.service';
import { ScheduledTransaction } from '../../../models/scheduled-transaction.model';
import { ScheduledTransactionDialogComponent } from '../scheduled-transaction-dialog/scheduled-transaction-dialog.component';
import { catchError, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { RecurrenceType } from '../../../models/recurrence-type.enum';
import { SelectionModel } from '@angular/cdk/collections';

@Component({
  selector: 'app-scheduled-transactions-list',
  templateUrl: './scheduled-transactions-list.component.html',
  styleUrls: ['./scheduled-transactions-list.component.scss']
})
export class ScheduledTransactionsListComponent implements OnInit {
  scheduledTransactions: ScheduledTransaction[] = [];
  displayedColumns: string[] = ['select', 'description', 'amount', 'nextDueDate', 'recurrenceType', 'actions'];
  isLoading = false;
  error = '';
  selection = new SelectionModel<ScheduledTransaction>(true, []);

  constructor(
    private scheduledTransactionService: ScheduledTransactionService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadScheduledTransactions();
  }

  loadScheduledTransactions(): void {
    this.isLoading = true;
    this.error = '';
    this.scheduledTransactionService.getScheduledTransactions()
      .pipe(
        catchError(error => {
          this.error = 'Failed to load scheduled transactions. Please try again later.';
          return of([]);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(transactions => {
        this.scheduledTransactions = transactions;
      });
  }

  openDialog(transaction?: ScheduledTransaction): void {
    const dialogRef = this.dialog.open(ScheduledTransactionDialogComponent, {
      width: '500px',
      data: { transaction }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.updateTransaction(result);
        } else {
          this.createTransaction(result);
        }
      }
    });
  }

  private createTransaction(transaction: ScheduledTransaction): void {
    this.isLoading = true;
    this.error = '';
    this.scheduledTransactionService.createScheduledTransaction(transaction)
      .pipe(
        catchError(error => {
          this.error = 'Failed to create scheduled transaction. Please try again later.';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(newTransaction => {
        if (newTransaction) {
          this.scheduledTransactions = [...this.scheduledTransactions, newTransaction];
        }
      });
  }

  private updateTransaction(transaction: ScheduledTransaction): void {
    this.isLoading = true;
    this.error = '';
    this.scheduledTransactionService.updateScheduledTransaction(transaction)
      .pipe(
        catchError(error => {
          this.error = 'Failed to update scheduled transaction. Please try again later.';
          return of(null);
        }),
        finalize(() => this.isLoading = false)
      )
      .subscribe(updatedTransaction => {
        if (updatedTransaction) {
          this.scheduledTransactions = this.scheduledTransactions.map(t => 
            t.id === updatedTransaction.id ? updatedTransaction : t
          );
        }
      });
  }

  deleteTransaction(transaction: ScheduledTransaction): void {
    if (!transaction.id) {
      this.error = 'Cannot delete transaction: Invalid ID';
      return;
    }

    
    if (confirm('Are you sure you want to delete this scheduled transaction?')) {
      this.isLoading = true;
      this.error = '';
      this.scheduledTransactionService.deleteScheduledTransaction(transaction.id)
        .pipe(
          catchError(error => {
            this.error = 'Failed to delete the transaction. Please try again later.';
            return of(null);
          }),
          finalize(() => this.isLoading = false)
        )
        .subscribe(() => {
          this.loadScheduledTransactions();
        });
    }
  }

  getRecurrenceTypeText(type: RecurrenceType): string {
    return RecurrenceType[type].toLowerCase();
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.scheduledTransactions.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.scheduledTransactions);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: ScheduledTransaction): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }
}

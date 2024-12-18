import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { TransactionFormComponent } from '../transaction-form/transaction-form.component';
import { TransactionService } from '../../../services/transaction.service';
import { Transaction } from '../../../models/transaction.model';
import { ConfirmDialogComponent } from '../../../components/shared/confirm-dialog/confirm-dialog.component';
import { ImportTransactionsComponent } from '../import-transactions/import-transactions.component';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit {
  displayedColumns: string[] = ['select', 'date', 'description', 'amount', 'categoryName', 'bankAccountName', 'actions'];
  dataSource: MatTableDataSource<Transaction>;
  selection = new SelectionModel<Transaction>(true, []);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private transactionService: TransactionService,
    private dialog: MatDialog
  ) {
    this.dataSource = new MatTableDataSource<Transaction>();
  }

  ngOnInit(): void {
    this.loadTransactions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadTransactions(): void {
    this.transactionService.getAll().subscribe({
      next: (transactions: Transaction[]) => {
        this.dataSource.data = transactions;
      },
      error: (error: any) => {
        console.error('Error loading transactions:', error);
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openTransactionDialog(transaction?: Transaction): void {
    const dialogRef = this.dialog.open(TransactionFormComponent, {
      width: '600px',
      data: transaction || {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  editTransaction(transaction: Transaction): void {
    this.openTransactionDialog(transaction);
  }

  deleteTransaction(transaction: Transaction): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Tem certeza que deseja excluir a transação "${transaction.description}"?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.transactionService.delete(transaction.id).subscribe({
          next: () => {
            this.loadTransactions();
          },
          error: (error: any) => {
            console.error('Error deleting transaction:', error);
          }
        });
      }
    });
  }

  importTransactions(): void {
    const dialogRef = this.dialog.open(ImportTransactionsComponent, {
      width: '1200px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTransactions();
      }
    });
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Transaction): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  exportBudget(): void {
    this.transactionService.exportBudget().subscribe(blob => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `orcamento_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }
}

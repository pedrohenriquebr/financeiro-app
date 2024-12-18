import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BankAccountFormComponent } from '../bank-account-form/bank-account-form.component';
import { BankAccountService, BankAccount } from '../../../services/bank-account.service';
import { finalize } from 'rxjs';
import { TableColumn, TableAction, ActionEvent } from '../../../components/shared/data-table/models';
import { QueryBuilderConfig, QueryGroup } from '../../../components/shared/query-builder/models/query-builder.models';

@Component({
  selector: 'app-bank-account-list',
  templateUrl: './bank-account-list.component.html',
  styleUrls: ['./bank-account-list.component.scss']
})
export class BankAccountListComponent implements OnInit {
  accounts: BankAccount[] = [];
  isLoading = false;

  columns: TableColumn[] = [
    { property: 'bankName', label: 'Banco', sortable: true },
    { property: 'name', label: 'Nome', sortable: true },
    { property: 'agency', label: 'Agência', sortable: true },
    { property: 'accountNumber', label: 'Número', sortable: true },
    { property: 'balance', label: 'Saldo', sortable: true }
  ];

  actions: TableAction[] = [
    { icon: 'edit', tooltip: 'Editar', type: 'edit' },
    { icon: 'delete', tooltip: 'Excluir', color: 'warn', type: 'delete' }
  ];

  queryConfig: QueryBuilderConfig = {
    fields: [
      { field: 'bankName', label: 'Banco', dataType: 'string' },
      { field: 'name', label: 'Nome', dataType: 'string' },
      { field: 'agency', label: 'Agência', dataType: 'string' },
      { field: 'accountNumber', label: 'Número', dataType: 'string' },
      { field: 'balance', label: 'Saldo', dataType: 'number' }
    ]
  };

  queryGroup: QueryGroup = {
    type: 'AND',
    conditions: []
  };

  showQueryBuilder = true;

  constructor(
    private bankAccountService: BankAccountService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadBankAccounts();
  }

  loadBankAccounts(): void {
    this.isLoading = true;
    this.bankAccountService.getAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (accounts) => this.accounts = accounts,
        error: (error) => {
          console.error('Error loading bank accounts:', error);
          this.snackBar.open('Erro ao carregar contas bancárias', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
  }

  openAccountDialog(account?: BankAccount): void {
    const dialogRef = this.dialog.open(BankAccountFormComponent, {
      width: '600px',
      data: account
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBankAccounts();
      }
    });
  }

  onActionClick(event: ActionEvent): void {
    if (event.action.type === 'edit') {
      this.openAccountDialog(event.row);
    } else if (event.action.type === 'delete') {
      this.deleteAccount(event.row);
    }
  }

  deleteAccount(account: BankAccount): void {
    if (confirm(`Deseja excluir a conta ${account.name}?`)) {
      this.bankAccountService.delete(account.id).subscribe({
        next: () => {
          this.loadBankAccounts();
          this.snackBar.open('Conta excluída com sucesso', 'Fechar', {
            duration: 3000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        },
        error: (error) => {
          console.error('Error deleting bank account:', error);
          this.snackBar.open('Erro ao excluir conta', 'Fechar', {
            duration: 5000,
            horizontalPosition: 'end',
            verticalPosition: 'top'
          });
        }
      });
    }
  }

  onQueryChange(query: QueryGroup): void {
    console.log('Query changed:', query);
    this.queryGroup = query;
  }

  onSelectionChange(selectedItems: any[]): void {
    console.log('Selected items:', selectedItems);
  }
}

import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { BankService, Bank } from '../bank.service';
import { BankFormComponent } from '../bank-form/bank-form.component';
import { ConfirmDialogComponent } from '../../../components/shared/confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs/operators';
import { TableColumn, TableAction, ActionEvent } from '../../../components/shared/data-table/models';
import { QueryBuilderConfig, QueryGroup } from '../../../components/shared/query-builder/models/query-builder.models';

@Component({
  selector: 'app-bank-list',
  templateUrl: './bank-list.component.html',
  styleUrls: ['./bank-list.component.scss']
})
export class BankListComponent implements OnInit {
  banks: Bank[] = [];
  isLoading = false;

  columns: TableColumn[] = [
    { property: 'name', label: 'Nome', sortable: true },
    { property: 'code', label: 'Código', sortable: true }
  ];

  actions: TableAction[] = [
    { icon: 'edit', tooltip: 'Editar', type: 'edit' },
    { icon: 'delete', tooltip: 'Excluir', color: 'warn', type: 'delete' }
  ];

  queryConfig: QueryBuilderConfig = {
    fields: [
      { field: 'name', label: 'Nome', dataType: 'string' },
      { field: 'code', label: 'Código', dataType: 'string' }
    ]
  };

  queryGroup: QueryGroup = {
    type: 'AND',
    conditions: []
  };

  showQueryBuilder = true;

  constructor(
    private bankService: BankService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadBanks();
  }

  loadBanks(): void {
    this.isLoading = true;
    this.bankService.getAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (banks) => this.banks = banks,
        error: (error) => console.error('Error loading banks:', error)
      });
  }

  openBankDialog(bank?: Bank): void {
    const dialogRef = this.dialog.open(BankFormComponent, {
      width: '500px',
      data: bank
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadBanks();
      }
    });
  }

  onActionClick(event: ActionEvent): void {
    if (event.action.type === 'edit') {
      this.openBankDialog(event.row);
    } else if (event.action.type === 'delete') {
      this.deleteBank(event.row);
    }
  }

  deleteBank(bank: Bank): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja excluir o banco ${bank.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bankService.delete(bank.id??0).subscribe({
          next: () => this.loadBanks(),
          error: (error) => console.error('Error deleting bank:', error)
        });
      }
    });
  }

  onQueryChange(query: QueryGroup): void {
    console.log('Query changed:', query);
    this.queryGroup = query;
  }

  onSelectionChange(selectedItems: any[]): void {
    console.log('Selected items:', selectedItems);
  }
}

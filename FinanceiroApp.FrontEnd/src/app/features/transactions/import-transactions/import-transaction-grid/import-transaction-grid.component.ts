import { Component, OnInit, ViewChild, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { ImportTransactionDto } from '../models/import-transaction.dto';

interface ColumnDefinition {
  name: string;
  displayName: string;
  visible: boolean;
  canHide: boolean;
}

@Component({
  selector: 'app-import-transaction-grid',
  templateUrl: './import-transaction-grid.component.html',
  styleUrls: ['./import-transaction-grid.component.scss']
})
export class ImportTransactionGridComponent implements OnInit, OnChanges {
  @Input() transactions: ImportTransactionDto[] = [];
  @Output() transactionEdit = new EventEmitter<ImportTransactionDto>();
  @Output() transactionDelete = new EventEmitter<ImportTransactionDto>();
  @Output() selectionChange = new EventEmitter<ImportTransactionDto[]>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<ImportTransactionDto>;
  selection = new SelectionModel<ImportTransactionDto>(true, []);
  filterExpression: string = '';

  columns: ColumnDefinition[] = [
    { name: 'select', displayName: 'Selecionar', visible: true, canHide: false },
    { name: 'description', displayName: 'Descrição', visible: true, canHide: true },
    { name: 'amount', displayName: 'Valor', visible: true, canHide: true },
    { name: 'date', displayName: 'Data', visible: true, canHide: true },
    { name: 'type', displayName: 'Tipo', visible: true, canHide: true },
    { name: 'categoryName', displayName: 'Categoria', visible: true, canHide: true },
    { name: 'bankAccountName', displayName: 'Conta', visible: true, canHide: true },
    { name: 'actions', displayName: 'Ações', visible: true, canHide: false }
  ];

  get visibleColumns(): string[] {
    return this.columns.filter(c => c.visible).map(c => c.name);
  }

  get hideableColumns(): ColumnDefinition[] {
    return this.columns.filter(c => c.canHide);
  }

  ngOnInit() {
    this.initializeDataSource();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['transactions'] && this.transactions) {
      this.initializeDataSource();
    }
  }

  private initializeDataSource() {
    this.dataSource = new MatTableDataSource(this.transactions);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      if (!filter) return true;
      try {
        const item = data;
        return eval(filter);
      } catch (error) {
        console.error('Invalid filter expression:', error);
        return true;
      }
    };
  }

  applyFilter() {
    this.dataSource.filter = this.filterExpression.trim();
  }

  clearFilter() {
    this.filterExpression = '';
    this.dataSource.filter = '';
  }

  toggleColumnVisibility(column: ColumnDefinition) {
    if (column.canHide) {
      column.visible = !column.visible;
    }
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    this.emitSelectionChange();
  }

  editTransaction(transaction: ImportTransactionDto) {
    this.transactionEdit.emit(transaction);
  }

  deleteTransaction(transaction: ImportTransactionDto) {
    this.transactionDelete.emit(transaction);
  }

  private emitSelectionChange() {
    this.selectionChange.emit(this.selection.selected);
  }
}

import { Component, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { QueryBuilderConfig, QueryGroup } from '../query-builder/models/query-builder.models';
import { ActionEvent, TableAction, TableColumn } from './models';
import { QueryBuilderDialogComponent } from './query-builder-dialog/query-builder-dialog.component';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
  animations: [
    trigger('slideInOut', [
      state('true', style({
        height: '*',
        opacity: 1
      })),
      state('false', style({
        height: '0',
        opacity: 0,
        overflow: 'hidden'
      })),
      transition('true <=> false', animate('300ms ease-in-out'))
    ])
  ]
})
export class DataTableComponent {
  @Input() columns: TableColumn[] = [];
  @Input() set data(value: any[]) {
    this.dataSource = new MatTableDataSource(value);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  @Input() showSelection = false;
  @Input() showPaginator = true;
  @Input() pageSize = 10;
  @Input() pageSizeOptions = [5, 10, 25, 100];
  @Input() actions: TableAction[] = [];
  @Input() loading = false;
  @Input() queryConfig?: QueryBuilderConfig;
  @Input() queryGroup: QueryGroup = {
    type: 'AND',
    conditions: []
  };
  @Input() showQueryBuilder = false;

  @Output() selectionChange = new EventEmitter<any[]>();
  @Output() actionClick = new EventEmitter<ActionEvent>();
  @Output() queryChange = new EventEmitter<QueryGroup>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  dataSource!: MatTableDataSource<any>;
  selection = new SelectionModel<any>(true, []);
  displayedColumns: string[] = [];
  activeFilters: number = 0;

  constructor(private dialog: MatDialog) {}

  ngOnInit() {
    this.displayedColumns = [
      ...(this.showSelection ? ['select'] : []),
      ...this.columns.map(col => col.property),
      ...(this.actions.length > 0 ? ['actions'] : [])
    ];
  }

  openQueryBuilder(): void {
    const dialogRef = this.dialog.open(QueryBuilderDialogComponent, {
      width: '800px',
      data: {
        config: this.queryConfig,
        group: this.queryGroup
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.queryGroup = result;
        this.queryChange.emit(result);
        this.activeFilters = this.countActiveFilters(result);
      }
    });
  }

  private countActiveFilters(group: QueryGroup): number {
    let count = 0;
    if (group.conditions) {
      count += group.conditions.length;
      group.conditions.forEach(condition => {
        if ('conditions' in condition) {
          count += this.countActiveFilters(condition);
        }
      });
    }
    return count;
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource?.data.length;
    return numSelected === numRows;
  }

  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.selection.select(...this.dataSource.data);
    }
    this.selectionChange.emit(this.selection.selected);
  }

  toggleRow(row: any) {
    this.selection.toggle(row);
    this.selectionChange.emit(this.selection.selected);
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  onActionClick(action: TableAction, row: any): void {
    this.actionClick.emit({ action, row });
  }

  onQueryChange(query: QueryGroup) {
    this.queryGroup = query;
    this.queryChange.emit(query);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  toggleQueryBuilder(): void {
    this.showQueryBuilder = !this.showQueryBuilder;
  }
}

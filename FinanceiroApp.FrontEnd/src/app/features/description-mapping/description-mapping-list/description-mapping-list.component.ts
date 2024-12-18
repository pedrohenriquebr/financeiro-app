import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DescriptionMapping } from '../../../models/description-mapping.model';
import { DescriptionMappingService } from '../../../services/description-mapping.service';
import { DescriptionMappingFormComponent } from '../description-mapping-form/description-mapping-form.component';
import { delay, finalize } from 'rxjs';
import { TableColumn, TableAction, ActionEvent } from '../../../components/shared/data-table/models';
import { QueryBuilderConfig, QueryGroup } from '../../../components/shared/query-builder/models/query-builder.models';
import { LoadingDialogComponent } from '../../../components/shared/loading-dialog/loading-dialog.component';
import { HelpDialogComponent } from '../help-dialog/help-dialog.component';

@Component({
  selector: 'app-description-mapping-list',
  templateUrl: './description-mapping-list.component.html',
  styleUrls: ['./description-mapping-list.component.scss']
})
export class DescriptionMappingListComponent implements OnInit {
  mappings: DescriptionMapping[] = [];
  columns: TableColumn[] = [
    { property: 'pattern', label: 'Padrão', sortable: true },
    { property: 'description', label: 'Descrição', sortable: true },
    { property: 'categoryName', label: 'Categoria', sortable: true }
  ];

  actions: TableAction[] = [
    { icon: 'edit', tooltip: 'Editar', type: 'edit' },
    { icon: 'delete', tooltip: 'Excluir', color: 'warn', type: 'delete' }
  ];

  isLoading = false;
  selectedItems: any[] = [];

  queryConfig: QueryBuilderConfig = {
    fields: [
      { field: 'pattern', label: 'Padrão', dataType: 'string' },
      { field: 'description', label: 'Descrição', dataType: 'string' },
      { field: 'categoryName', label: 'Categoria', dataType: 'string' }
    ]
  };

  queryGroup: QueryGroup = {
    type: 'AND',
    conditions: []
  };

  showQueryBuilder = true;

  constructor(
    private descriptionMappingService: DescriptionMappingService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadMappings();
  }

  loadMappings(): void {
    this.isLoading = true;
    this.descriptionMappingService.getAll()
    .pipe(
      delay(150),
      finalize(() => this.isLoading = false)
    )
    .subscribe({
      next: (mappings) => this.mappings = mappings,
      error: (error) => this.showError('Erro ao carregar mapeamentos')
    });
  }

  applyMappings() {
    const dialogRef = this.dialog.open(LoadingDialogComponent, {
      disableClose: true,
      data: {
        title: 'Aplicando Categorias',
        message: 'Por favor, aguarde enquanto as categorias são aplicadas...'
      }
    });

    this.descriptionMappingService.applyMappings()
    .pipe(
      delay(1500),
      finalize(() => dialogRef.close())
    )
    .subscribe({
      next: () => {
        this.snackBar.open('Categorias aplicadas com sucesso!', 'Fechar', {
          duration: 3000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
      },
      error: (error) => {
        this.snackBar.open('Erro ao aplicar categorias. Por favor, tente novamente.', 'Fechar', {
          duration: 5000,
          horizontalPosition: 'end',
          verticalPosition: 'top'
        });
        console.error('Erro ao aplicar mapeamentos:', error);
      }
    });
  }

  openMappingDialog(mapping?: DescriptionMapping): void {
    const dialogRef = this.dialog.open(DescriptionMappingFormComponent, {
      width: '400px',
      data: mapping
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadMappings();
      }
    });
  }

  deleteMapping(mapping: DescriptionMapping): void {
    if (confirm('Tem certeza que deseja excluir este mapeamento?')) {
      this.descriptionMappingService.delete(mapping.id).subscribe({
        next: () => {
          this.loadMappings();
          this.showSuccess('Mapeamento excluído com sucesso');
        },
        error: (error) => this.showError('Erro ao excluir mapeamento')
      });
    }
  }

  onActionClick(event: ActionEvent): void {
    switch (event.action.type) {
      case 'edit':
        this.openMappingDialog(event.row);
        break;
      case 'delete':
        this.deleteMapping(event.row);
        break;
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  onSelectionChange(selectedItems: any[]): void {
    // Handle selection change
    console.log('Selected items:', selectedItems);
  }

  onQueryChange(query: QueryGroup): void {
    console.log('Query changed:', query);
    // Here you can implement the filtering logic based on the query
    // For now, we'll just update the queryGroup
    this.queryGroup = query;
  }

  openHelp() {
    this.dialog.open(HelpDialogComponent, {
      width: '1024px',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });
  }
}

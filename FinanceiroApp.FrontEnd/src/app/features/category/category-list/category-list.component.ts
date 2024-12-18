import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Category, CategoryType } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { CategoryFormComponent } from '../category-form/category-form.component';
import { ConfirmDialogComponent } from '../../../components/shared/confirm-dialog/confirm-dialog.component';
import { TableColumn, TableAction, ActionEvent } from '../../../components/shared/data-table/models';
import { QueryBuilderConfig, QueryGroup } from '../../../components/shared/query-builder/models/query-builder.models';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = false;
  CategoryType = CategoryType;

  columns: TableColumn[] = [
    { property: 'name', label: 'Nome', sortable: true },
    { 
      property: 'type', 
      label: 'Tipo', 
      sortable: true,
      transform: (value: CategoryType) => value === CategoryType.Income ? 'Receita' : 'Despesa'
    }
  ];

  actions: TableAction[] = [
    { icon: 'edit', tooltip: 'Editar', type: 'edit' },
    { icon: 'delete', tooltip: 'Excluir', color: 'warn', type: 'delete' }
  ];

  queryConfig: QueryBuilderConfig = {
    fields: [
      { field: 'name', label: 'Nome', dataType: 'string' },
      { 
        field: 'type', 
        label: 'Tipo', 
        dataType: 'select',
        options: [
          { value: CategoryType.Income, label: 'Receita' },
          { value: CategoryType.Expense, label: 'Despesa' }
        ]
      }
    ]
  };

  queryGroup: QueryGroup = {
    type: 'AND',
    conditions: []
  };

  showQueryBuilder = true;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.isLoading = true;
    this.categoryService.getAll()
      .pipe(finalize(() => this.isLoading = false))
      .subscribe({
        next: (categories) => this.categories = categories,
        error: (error) => {
          console.error('Error loading categories:', error);
          this.snackBar.open('Erro ao carregar categorias', 'Fechar', { duration: 3000 });
        }
      });
  }

  openCategoryDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, {
      width: '500px',
      data: category
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  onActionClick(event: ActionEvent): void {
    if (event.action.type === 'edit') {
      this.openCategoryDialog(event.row);
    } else if (event.action.type === 'delete') {
      this.deleteCategory(event.row);
    }
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Exclusão',
        message: `Deseja excluir a categoria ${category.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.categoryService.delete(category.id).subscribe({
          next: () => {
            this.loadCategories();
            this.snackBar.open('Categoria excluída com sucesso', 'Fechar', { duration: 3000 });
          },
          error: (error) => {
            console.error('Error deleting category:', error);
            this.snackBar.open('Erro ao excluir categoria', 'Fechar', { duration: 3000 });
          }
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

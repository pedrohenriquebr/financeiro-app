import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { Category, CategoryType, CategoryNature } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit {
  categoryForm: FormGroup;
  isLoading = false;
  isEditing = false;
  isSubmitting = false;
  categoryTypes = Object.values(CategoryType);
  categoryNatures = Object.values(CategoryNature);
  CategoryType_Income = CategoryType.Income;
  CategoryType_Expense = CategoryType.Expense;
  CategoryNature_Fixed = CategoryNature.Fixed;
  CategoryNature_Variable = CategoryNature.Variable;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category | null
  ) {
    this.categoryForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      type: ['', Validators.required],
      nature: ['', Validators.required],
      plannedAmount: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit() {
    if (this.data) {
      this.isEditing = true;
      this.categoryForm.patchValue({
        name: this.data.name,
        type: this.data.type,
        nature: this.data.nature,
        plannedAmount: this.data.plannedAmount
      });
    }
  }

  onCancel() {
    this.dialogRef.close(false);
  }

  onSubmit() {
    if (this.categoryForm.valid) {
      this.isSubmitting = true;
      const category: Omit<Category, 'id'> = this.categoryForm.value;

      const request = this.isEditing && this.data
        ? this.categoryService.update(this.data.id, category)
        : this.categoryService.create(category);

      request.pipe(
        finalize(() => {
          this.isSubmitting = false;
          this.isLoading = false;
        })
      ).subscribe({
        next: () => {
          this.snackBar.open(
            `Categoria ${this.isEditing ? 'atualizada' : 'criada'} com sucesso!`,
            'Fechar',
            { duration: 3000 }
          );
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Error saving category:', error);
          this.snackBar.open(
            `Erro ao ${this.isEditing ? 'atualizar' : 'criar'} categoria. Por favor, tente novamente.`,
            'Fechar',
            { duration: 3000 }
          );
        }
      });
    }
  }
}

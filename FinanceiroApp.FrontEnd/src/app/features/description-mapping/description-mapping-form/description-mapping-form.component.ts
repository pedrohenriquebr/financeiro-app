import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DescriptionMapping } from '../../../models/description-mapping.model';
import { DescriptionMappingService } from '../../../services/description-mapping.service';
import { CategoryService } from '../../../services/category.service';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-description-mapping-form',
  templateUrl: './description-mapping-form.component.html',
  styleUrls: ['./description-mapping-form.component.scss']
})
export class DescriptionMappingFormComponent implements OnInit {
  form: FormGroup;
  categories: Category[] = [];
  isEditing = false;

  constructor(
    private fb: FormBuilder,
    private descriptionMappingService: DescriptionMappingService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<DescriptionMappingFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: DescriptionMapping
  ) {
    this.form = this.fb.group({
      pattern: ['', Validators.required],
      categoryId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    if (this.data) {
      this.isEditing = true;
      this.form.patchValue({
        pattern: this.data.pattern,
        categoryId: this.data.categoryId
      });
    }
  }

  loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories) => this.categories = categories,
      error: (error) => this.showError('Erro ao carregar categorias')
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      const mapping = this.form.value;
      
      if (this.isEditing) {
        this.descriptionMappingService.update(this.data.id, mapping).subscribe({
          next: () => {
            this.showSuccess('Mapeamento atualizado com sucesso');
            this.dialogRef.close(true);
          },
          error: (error) => this.showError('Erro ao atualizar mapeamento')
        });
      } else {
        this.descriptionMappingService.create(mapping).subscribe({
          next: () => {
            this.showSuccess('Mapeamento criado com sucesso');
            this.dialogRef.close(true);
          },
          error: (error) => this.showError('Erro ao criar mapeamento')
        });
      }
    }
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 3000 });
  }
}

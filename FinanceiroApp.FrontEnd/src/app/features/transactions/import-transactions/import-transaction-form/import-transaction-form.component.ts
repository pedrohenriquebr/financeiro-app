import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../../services/category.service';
import { BankAccountService } from '../../../../services/bank-account.service';
import { ImportTransactionDto } from '../models/import-transaction.dto';

@Component({
  selector: 'app-import-transaction-form',
  templateUrl: './import-transaction-form.component.html',
  styleUrls: ['./import-transaction-form.component.scss']
})
export class ImportTransactionFormComponent implements OnInit {
  form: FormGroup;
  categories: any[] = [];
  bankAccounts: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ImportTransactionFormComponent>,
    private categoryService: CategoryService,
    private bankAccountService: BankAccountService,
    @Inject(MAT_DIALOG_DATA) public data: ImportTransactionDto
  ) {
    this.form = this.fb.group({
      description: ['', [Validators.required, Validators.maxLength(500)]],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      date: [new Date(), Validators.required],
      type: ['EXPENSE', Validators.required],
      categoryId: [null],
      bankAccountId: [null, Validators.required]
    });

    if (data) {
      this.form.patchValue({
        description: data.description,
        amount: Math.abs(data.amount),
        date: new Date(data.date),
        type: data.type,
        categoryId: data.categoryId,
        bankAccountId: data.bankAccountId
      });
    }
  }

  ngOnInit() {
    this.loadCategories();
    this.loadBankAccounts();
  }

  private loadCategories() {
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    );
  }

  private loadBankAccounts() {
    this.bankAccountService.getAll().subscribe(
      accounts => this.bankAccounts = accounts
    );
  }

  onSubmit() {
    if (this.form.valid) {
      const formValue = this.form.value;
      const transaction: ImportTransactionDto = {
        ...this.data,
        ...formValue,
        amount: formValue.type === 'EXPENSE' ? -Math.abs(formValue.amount) : Math.abs(formValue.amount),
        date: formValue.date instanceof Date ? formValue.date : new Date(formValue.date),
        categoryName: this.categories.find(c => c.id === formValue.categoryId)?.name || null,
        bankAccountName: this.bankAccounts.find(a => a.id === formValue.bankAccountId)?.name || null
      };
      this.dialogRef.close(transaction);
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}

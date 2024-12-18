import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../../services/category.service';
import { BankAccountService } from '../../../services/bank-account.service';
import { TransactionService } from '../../../services/transaction.service';
import { Category } from '../../../models/category.model';
import { BankAccount } from '../../../models/bank-account.model';
import { Transaction, CreateTransactionDto, UpdateTransactionDto } from '../../../models/transaction.model';

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.component.html',
  styleUrls: ['./transaction-form.component.scss']
})
export class TransactionFormComponent implements OnInit {
  transactionForm!: FormGroup;
  categories: Category[] = [];
  bankAccounts: BankAccount[] = [];
  isSubmitting = false;
  isEditing = false;
  currencyMask = {
    align: "right",
    allowNegative: true,
    decimal: ",",
    precision: 2,
    prefix: "R$ ",
    suffix: "",
    thousands: "."
  };

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TransactionFormComponent>,
    private categoryService: CategoryService,
    private bankAccountService: BankAccountService,
    private transactionService: TransactionService,
    @Inject(MAT_DIALOG_DATA) public data: Transaction
  ) {
    this.createForm();
    this.isEditing = !!data?.id;
  }

  ngOnInit(): void {
    this.loadCategories();
    this.loadBankAccounts();
    if (this.isEditing) {
      this.patchFormValues();
    }
  }

  private createForm(): void {
    this.transactionForm = this.fb.group({
      id: [null],
      date: [new Date(), Validators.required],
      description: ['', Validators.required],
      amount: [null, [Validators.required]],
      categoryId: [null, Validators.required], 
      bankAccountId: [null, Validators.required],
      isTransfer: [false],
      destinationBankAccountId: [null],
      isRecurring: [false],
      recurrenceType: [null],
      recurrenceFrequency: [null],
      recurrenceEndDate: [null],
      status: ['Pending', Validators.required],
      notes: ['']
    });
    
    // Adiciona validador condicional para destinationBankAccountId e categoryId
    this.transactionForm.get('isTransfer')?.valueChanges.subscribe((isTransfer: boolean) => {
      const destinationControl = this.transactionForm.get('destinationBankAccountId');
      const categoryControl = this.transactionForm.get('categoryId');
      
      if (isTransfer) {
        destinationControl?.setValidators([Validators.required]);
        categoryControl?.clearValidators();
        categoryControl?.setValue(null);
      } else {
        destinationControl?.clearValidators();
        destinationControl?.setValue(null);
        categoryControl?.setValidators([Validators.required]);
      }
      
      destinationControl?.updateValueAndValidity();
      categoryControl?.updateValueAndValidity();
    });
  }

  private loadCategories(): void {
    this.categoryService.getAll().subscribe({
      next: (categories: Category[]) => {
        console.log('Categories loaded:', categories); 
        this.categories = categories;
      },
      error: (error: any) => {
        console.error('Error loading categories:', error);
      }
    });
  }

  private loadBankAccounts(): void {
    this.bankAccountService.getAll().subscribe({
      next: (accounts: BankAccount[]) => {
        this.bankAccounts = accounts;
      },
      error: (error: any) => {
        console.error('Error loading bank accounts:', error);
      }
    });
  }

  private patchFormValues(): void {
    const transaction = { ...this.data };
    if (transaction.date) {
      transaction.date = new Date(transaction.date);
    }
    this.transactionForm.patchValue(transaction);
  }

  onSubmit(): void {
    if (this.transactionForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.transactionForm.value;

      const transactionDto: CreateTransactionDto  = {
        description: this.transactionForm.get('description')?.value,
        amount: this.transactionForm.get('amount')?.value,
        date: this.transactionForm.get('date')?.value,
        categoryId: this.transactionForm.get('categoryId')?.value,
        bankAccountId: this.transactionForm.get('bankAccountId')?.value,
        isTransfer: this.transactionForm.get('isTransfer')?.value,
        destinationBankAccountId: this.transactionForm.get('destinationBankAccountId')?.value,
        isRecurring: this.transactionForm.get('isRecurring')?.value || false,
        recurrenceType: this.transactionForm.get('recurrenceType')?.value,
        recurrenceFrequency: this.transactionForm.get('recurrenceFrequency')?.value,
        recurrenceEndDate: this.transactionForm.get('recurrenceEndDate')?.value
      };

      if (this.isEditing) {
        this.transactionService.update(this.data.id, transactionDto as UpdateTransactionDto)
          .subscribe({
            next: () => {
              this.dialogRef.close(true);
            },
            error: (error: any) => {
              console.error('Error updating transaction:', error);
              this.isSubmitting = false;
            }
          });
      } else {
        this.transactionService.create(transactionDto as CreateTransactionDto)
          .subscribe({
            next: () => {
              this.dialogRef.close(true);
            },
            error: (error: any) => {
              console.error('Error creating transaction:', error);
              this.isSubmitting = false;
            }
          });
      }
    }
  }
}

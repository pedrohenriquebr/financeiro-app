import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScheduledTransaction } from '../../../models/scheduled-transaction.model';
import { RecurrenceType } from '../../../models/recurrence-type.enum';
import { CategoryService } from '../../../services/category.service';
import { BankAccount, BankAccountService } from '../../../services/bank-account.service';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Category } from '../../../models/category.model';

@Component({
  selector: 'app-scheduled-transaction-dialog',
  templateUrl: './scheduled-transaction-dialog.component.html',
  styleUrls: ['./scheduled-transaction-dialog.component.scss']
})
export class ScheduledTransactionDialogComponent implements OnInit {
  form: FormGroup;
  categories$ : Observable<Category[]> = of([]);
  bankAccounts$ : Observable<BankAccount[]>= of([]);
  recurrenceTypes = Object.values(RecurrenceType).filter(value => typeof value === 'number');
  isLoading = false;
  error = '';
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
    private dialogRef: MatDialogRef<ScheduledTransactionDialogComponent>,
    private categoryService: CategoryService,
    private bankAccountService: BankAccountService,
    @Inject(MAT_DIALOG_DATA) public data: { transaction?: ScheduledTransaction }
  ) {
    this.form = this.fb.group({
      description: ['', [Validators.required]],
      amount: ['', [Validators.required]],
      nextDueDate: ['', [Validators.required]],
      isRecurring: [false],
      recurrenceType: [{ value: RecurrenceType.None, disabled: true }],
      recurrenceFrequency: [{ value: 1, disabled: true }],
      recurrenceEndDate: [{ value: null, disabled: true }],
      categoryId: ['', [Validators.required]],
      bankAccountId: ['', [Validators.required]]
    });

    this.form.get('isRecurring')?.valueChanges.subscribe(isRecurring => {
      const recurrenceControls = ['recurrenceType', 'recurrenceFrequency', 'recurrenceEndDate'];
      recurrenceControls.forEach(control => {
        const formControl = this.form.get(control);
        if (isRecurring) {
          formControl?.enable();
        } else {
          formControl?.disable();
        }
      });
    });

    if (data.transaction) {
      this.form.patchValue({
        ...data.transaction,
        nextDueDate: new Date(data.transaction.nextDueDate),
        recurrenceEndDate: data.transaction.recurrenceEndDate ? new Date(data.transaction.recurrenceEndDate) : null
      });
    }
  }

  ngOnInit(): void {
    this.categories$ = this.categoryService.getAll();
    this.bankAccounts$ = this.bankAccountService.getAll();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const transaction: ScheduledTransaction = {
        ...this.form.value,
        id: this.data.transaction?.id
      };
      this.dialogRef.close(transaction);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  getRecurrenceTypeLabel(type): string {
    return RecurrenceType[type];
  }
}

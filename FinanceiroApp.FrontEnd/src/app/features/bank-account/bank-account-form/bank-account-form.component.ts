import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BankAccount } from '../../../models/bank-account.model';
import { BankAccountService } from '../../../services/bank-account.service';
import { BankService, Bank } from '../../../services/bank.service';
import { Observable, finalize } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-bank-account-form',
  templateUrl: './bank-account-form.component.html',
  styleUrls: ['./bank-account-form.component.scss']
})
export class BankAccountFormComponent implements OnInit {
  bankAccountForm!: FormGroup;
  isSubmitting = false;
  isEditing = false;
  banks: Bank[] = [];
  isLoading = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<BankAccountFormComponent>,
    private bankAccountService: BankAccountService,
    private bankService: BankService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: BankAccount
  ) {
    this.createForm();
    this.isEditing = !!data?.id;
    if (this.isEditing) {
      this.patchFormValues();
    }
  }

  ngOnInit(): void {
    this.loadBanks();
  }

  private loadBanks(): void {
    this.isLoading = true;
    this.bankService.getAll().pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (banks) => {
        this.banks = banks;
      },
      error: (error) => {
        console.error('Error loading banks:', error);
        this.snackBar.open('Erro ao carregar bancos', 'Fechar', { duration: 3000 });
      }
    });
  }

  private createForm(): void {
    this.bankAccountForm = this.fb.group({
      name: ['', Validators.required],
      bankId: ['', Validators.required],
      accountNumber: ['', [Validators.required, Validators.pattern('^[0-9-]*$')]],
      agency: ['', [Validators.required, Validators.pattern('^[0-9-]*$')]],
      balance: [0, Validators.required]
    });
  }

  private patchFormValues(): void {
    this.bankAccountForm.patchValue(this.data);
  }

  onSubmit(): void {
    if (this.bankAccountForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      const formValue = this.bankAccountForm.value;
      
      const bankAccount = {
        name: formValue.name,
        bankId: formValue.bankId,
        accountNumber: formValue.accountNumber,
        agency: formValue.agency,
        balance: formValue.balance
      };

      let request: Observable<BankAccount | void>;
      if (this.isEditing) {
        request = this.bankAccountService.update(this.data.id, bankAccount);
      } else {
        request = this.bankAccountService.create(bankAccount);
      }

      request.pipe(
        finalize(() => this.isSubmitting = false)
      ).subscribe({
        next: () => {
          this.dialogRef.close(true);
          this.snackBar.open(
            `Conta bancária ${this.isEditing ? 'atualizada' : 'criada'} com sucesso!`,
            'Fechar',
            { duration: 3000 }
          );
        },
        error: (error) => {
          console.error('Error saving bank account:', error);
          this.snackBar.open(
            `Erro ao ${this.isEditing ? 'atualizar' : 'criar'} conta bancária`,
            'Fechar',
            { duration: 3000 }
          );
        }
      });
    }
  }

  formatAgency(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 4) {
      value = value.substring(0, 4) + '-' + value.substring(4, 5);
    }
    this.bankAccountForm.get('agency')?.setValue(value, { emitEvent: false });
  }

  formatAccountNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 6);
    }
    this.bankAccountForm.get('accountNumber')?.setValue(value, { emitEvent: false });
  }
}

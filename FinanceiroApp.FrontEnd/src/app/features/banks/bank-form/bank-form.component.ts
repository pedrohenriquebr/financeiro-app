import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BankService, Bank, CreateBankDTO, UpdateBankDTO } from '../bank.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-bank-form',
  templateUrl: './bank-form.component.html',
  styleUrls: ['./bank-form.component.scss']
})
export class BankFormComponent implements OnInit {
  bankForm: FormGroup;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private dialogRef: MatDialogRef<BankFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Bank | null
  ) {
    this.bankForm = this.fb.group({
      name: ['', [Validators.required]],
      code: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.bankForm.patchValue(this.data);
    }
  }

  onSubmit(): void {
    if (this.bankForm.valid) {
      this.isLoading = true;
      
      if (this.data?.id) {
        const updateDto: UpdateBankDTO = this.bankForm.value;
        this.bankService.update(this.data.id, updateDto)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(() => {
            this.dialogRef.close(true);
          });
      } else {
        const createDto: CreateBankDTO = this.bankForm.value;
        this.bankService.create(createDto)
          .pipe(finalize(() => this.isLoading = false))
          .subscribe(() => {
            this.dialogRef.close(true);
          });
      }
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

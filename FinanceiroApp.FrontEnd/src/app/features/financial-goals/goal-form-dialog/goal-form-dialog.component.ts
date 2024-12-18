import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinancialGoal } from '../../../models/financial-goal.model';

@Component({
  selector: 'app-goal-form-dialog',
  templateUrl: './goal-form-dialog.component.html',
  styleUrls: ['./goal-form-dialog.component.scss']
})
export class GoalFormDialogComponent implements OnInit {
  goalForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<GoalFormDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FinancialGoal
  ) {
    this.goalForm = this.fb.group({
      id: [null],
      name: ['', [Validators.required]],
      targetAmount: [null, [Validators.required, Validators.min(0)]],
      currentAmount: [0, [Validators.required, Validators.min(0)]],
      deadline: [null, [Validators.required]],
      description: ['']
    });

    if (data) {
      this.goalForm.patchValue(data);
    }
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.goalForm.valid) {
      this.dialogRef.close(this.goalForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

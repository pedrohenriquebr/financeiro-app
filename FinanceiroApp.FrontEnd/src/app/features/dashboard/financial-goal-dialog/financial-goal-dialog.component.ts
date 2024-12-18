import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FinancialGoal } from '../../../models/financial-goal.model';

@Component({
  selector: 'app-financial-goal-dialog',
  templateUrl: './financial-goal-dialog.component.html',
  styleUrls: ['./financial-goal-dialog.component.scss']
})
export class FinancialGoalDialogComponent {
  goalForm: FormGroup;
  isEditing: boolean;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<FinancialGoalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { goal?: FinancialGoal }
  ) {
    this.isEditing = !!data?.goal;
    this.goalForm = this.fb.group({
      name: [data?.goal?.name || '', [Validators.required]],
      targetAmount: [data?.goal?.targetAmount || 0, [Validators.required, Validators.min(0)]],
      currentAmount: [data?.goal?.currentAmount || 0, [Validators.required, Validators.min(0)]],
      targetDate: [data?.goal?.targetDate || new Date(), [Validators.required]]
    });
  }

  onSubmit(): void {
    if (this.goalForm.valid) {
      const formValue = this.goalForm.value;
      const monthsToTarget = this.calculateMonthsToTarget(new Date(), formValue.targetDate);
      const remainingAmount = formValue.targetAmount - formValue.currentAmount;
      
      const goal: FinancialGoal = {
        ...this.data?.goal,
        ...formValue,
        percentageComplete: (formValue.currentAmount / formValue.targetAmount) * 100,
        monthlyRequired: monthsToTarget > 0 ? remainingAmount / monthsToTarget : remainingAmount
      };

      this.dialogRef.close(goal);
    }
  }

  private calculateMonthsToTarget(startDate: Date, targetDate: Date): number {
    const start = new Date(startDate);
    const target = new Date(targetDate);
    const months = (target.getFullYear() - start.getFullYear()) * 12 + 
                  (target.getMonth() - start.getMonth());
    return Math.max(1, months);
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}

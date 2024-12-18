import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GoalFormDialogComponent } from './goal-form-dialog/goal-form-dialog.component';
import { FinancialGoal } from '../../models/financial-goal.model';
import { FinancialGoalService } from '../../services/financial-goal.service';

@Component({
  selector: 'app-financial-goals',
  templateUrl: './financial-goals.component.html',
  styleUrls: ['./financial-goals.component.scss']
})
export class FinancialGoalsComponent implements OnInit {
  goals: FinancialGoal[] = [];
  displayedColumns: string[] = ['name', 'targetAmount', 'currentAmount', 'deadline', 'progress', 'actions'];

  constructor(
    private financialGoalService: FinancialGoalService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadGoals();
  }

  loadGoals(): void {
    this.financialGoalService.getGoals().subscribe(goals => {
      this.goals = goals;
    });
  }

  openGoalDialog(goal?: FinancialGoal): void {
    const dialogRef = this.dialog.open(GoalFormDialogComponent, {
      width: '500px',
      data: goal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (goal) {
          this.financialGoalService.updateGoal(goal.id,result).subscribe(() => {
            this.loadGoals();
          });
        } else {
          this.financialGoalService.createGoal(result).subscribe(() => {
            this.loadGoals();
          });
        }
      }
    });
  }

  deleteGoal(id: number): void {
    if (confirm('Tem certeza que deseja excluir esta meta?')) {
      this.financialGoalService.deleteGoal(id).subscribe(() => {
        this.loadGoals();
      });
    }
  }

  calculateProgress(goal: FinancialGoal): number {
    return (goal.currentAmount / goal.targetAmount) * 100;
  }

  getProgressColor(progress: number): string {
    if (progress < 30) return 'warn';
    if (progress < 70) return 'accent';
    return 'primary';
  }
}

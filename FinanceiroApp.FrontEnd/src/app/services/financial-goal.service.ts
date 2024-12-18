import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { FinancialGoal } from '../models/financial-goal.model';

@Injectable({
  providedIn: 'root'
})
export class FinancialGoalService {
  private apiUrl = `${environment.apiUrl}/financialgoals`;

  constructor(private http: HttpClient) { }

  getGoals(): Observable<FinancialGoal[]> {
    return this.http.get<FinancialGoal[]>(this.apiUrl);
  }

  getGoal(id: number): Observable<FinancialGoal> {
    return this.http.get<FinancialGoal>(`${this.apiUrl}/${id}`);
  }

  createGoal(goal: Omit<FinancialGoal, 'id'>): Observable<FinancialGoal> {
    return this.http.post<FinancialGoal>(this.apiUrl, goal);
  }

  updateGoal(id: number, goal: FinancialGoal): Observable<FinancialGoal> {
    return this.http.put<FinancialGoal>(`${this.apiUrl}/${id}`, goal);
  }

  deleteGoal(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

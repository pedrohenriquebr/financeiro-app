import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ScheduledTransaction } from '../models/scheduled-transaction.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduledTransactionService {
  private apiUrl = `${environment.apiUrl}/scheduledtransactions`;

  constructor(private http: HttpClient) { }

  getScheduledTransactions(): Observable<ScheduledTransaction[]> {
    return this.http.get<ScheduledTransaction[]>(this.apiUrl);
  }

  getUpcomingTransactions(startDate: Date, endDate: Date): Observable<ScheduledTransaction[]> {
    return this.http.get<ScheduledTransaction[]>(`${this.apiUrl}/upcoming`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  getScheduledTransaction(id: number): Observable<ScheduledTransaction> {
    return this.http.get<ScheduledTransaction>(`${this.apiUrl}/${id}`);
  }

  createScheduledTransaction(transaction: ScheduledTransaction): Observable<ScheduledTransaction> {
    return this.http.post<ScheduledTransaction>(this.apiUrl, transaction);
  }

  updateScheduledTransaction(transaction: ScheduledTransaction): Observable<ScheduledTransaction> {
    return this.http.put<ScheduledTransaction>(`${this.apiUrl}/${transaction.id}`, transaction);
  }

  deleteScheduledTransaction(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  processScheduledTransactions(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/process`, {});
  }
}

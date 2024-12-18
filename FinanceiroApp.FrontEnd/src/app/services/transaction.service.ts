import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Transaction, CreateTransactionDto, UpdateTransactionDto } from '../models/transaction.model';
import { environment } from '../../environments/environment';
import { DashboardFilter, DashboardData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = `${environment.apiUrl}/transactions`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(this.apiUrl);
  }

  getById(id: number): Observable<Transaction> {
    return this.http.get<Transaction>(`${this.apiUrl}/${id}`);
  }

  create(transaction: CreateTransactionDto): Observable<Transaction> {
    return this.http.post<Transaction>(this.apiUrl, transaction);
  }

  update(id: number, transaction: UpdateTransactionDto): Observable<Transaction> {
    return this.http.put<Transaction>(`${this.apiUrl}/${id}`, transaction);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/byDate`, {
      params: {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString()
      }
    });
  }

  getByCategory(categoryId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/byCategory/${categoryId}`);
  }

  getByAccount(accountId: number): Observable<Transaction[]> {
    return this.http.get<Transaction[]>(`${this.apiUrl}/byAccount/${accountId}`);
  }

  importTransactions(transactions: any[]): Observable<Transaction[]> {
    return this.http.post<Transaction[]>(`${this.apiUrl}/import`, transactions);
  }

  getStatistics(): Observable<{ totalIncome: number; totalExpenses: number; balance: number }> {
    return this.http.get<{ totalIncome: number; totalExpenses: number; balance: number }>(`${this.apiUrl}/statistics`);
  }

  getBalance(accountId: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/balance/${accountId}`);
  }

  getDashboardData(filter?: DashboardFilter): Observable<DashboardData> {
    let params = new HttpParams();
    
    if (filter?.startDate) {
      params = params.set('startDate', filter.startDate.toISOString());
    }
    if (filter?.endDate) {
      params = params.set('endDate', filter.endDate.toISOString());
    }
    if (filter?.bankAccountIds?.length) {
      filter.bankAccountIds.forEach(id => {
        params = params.append('bankAccountIds', id.toString());
      });
    }
    if (filter?.categoryIds?.length) {
      filter.categoryIds.forEach(id => {
        params = params.append('categoryIds', id.toString());
      });
    }
    if (filter?.groupBy) {
      params = params.set('groupBy', filter.groupBy);
    }

    return this.http.get<DashboardData>(`${this.apiUrl}/dashboard`, { params });
  }

  exportBudget(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/export-budget`, {
      responseType: 'blob'
    });
  }
}

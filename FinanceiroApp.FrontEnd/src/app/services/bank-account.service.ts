import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface BankAccount {
  id: number;
  name: string;
  bankId: number;
  bankName: string;
  accountNumber: string;
  balance: number;
  agency: string;
}

@Injectable({
  providedIn: 'root'
})
export class BankAccountService {
  private apiUrl = `${environment.apiUrl}/bankaccounts`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<BankAccount[]> {
    return this.http.get<BankAccount[]>(this.apiUrl);
  }

  getById(id: number): Observable<BankAccount> {
    return this.http.get<BankAccount>(`${this.apiUrl}/${id}`);
  }

  create(bankAccount: Omit<BankAccount, 'id' | 'bankName'>): Observable<BankAccount> {
    return this.http.post<BankAccount>(this.apiUrl, bankAccount);
  }

  update(id: number, bankAccount: Omit<BankAccount, 'id' | 'bankName'>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, bankAccount);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBalance(id: number): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/${id}/balance`);
  }
}

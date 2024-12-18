import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BankAccount } from '../models/bank-account.model';
import { mockBankAccounts } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockBankAccountService {
  private bankAccounts: BankAccount[] = [...mockBankAccounts];

  getAll(): Observable<BankAccount[]> {
    return of(this.bankAccounts);
  }

  getById(id: number): Observable<BankAccount|null> {
    const bankAccount = this.bankAccounts.find(b => b.id === id);
    return of(bankAccount || null);
  }

  create(bankAccount: BankAccount): Observable<BankAccount> {
    const newBankAccount = {
      ...bankAccount,
      id: Math.max(...this.bankAccounts.map(b => b.id), 0) + 1,
      createdAt: new Date(),
      updatedAt: null
    };
    this.bankAccounts.push(newBankAccount);
    return of(newBankAccount);
  }

  update(id: number, bankAccount: BankAccount): Observable<BankAccount|null> {
    const index = this.bankAccounts.findIndex(b => b.id === id);
    if (index === -1) {
      return of(null);
    }

    const updatedBankAccount = {
      ...bankAccount,
      id,
      updatedAt: new Date()
    };
    this.bankAccounts[index] = updatedBankAccount;
    return of(updatedBankAccount);
  }

  delete(id: number): Observable<void> {
    const index = this.bankAccounts.findIndex(b => b.id === id);
    if (index !== -1) {
      this.bankAccounts.splice(index, 1);
    }
    return of(void 0);
  }
}

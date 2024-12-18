import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { mockTransactions } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockTransactionService {
  private transactions: Transaction[] = [...mockTransactions];

  getAll(): Observable<Transaction[]> {
    return of(this.transactions);
  }

  getById(id: number): Observable<Transaction|null> {
    const transaction = this.transactions.find(t => t.id === id);
    return of(transaction || null);
  }

  create(transaction: Transaction): Observable<Transaction> {
    const newTransaction = {
      ...transaction,
      id: Math.max(...this.transactions.map(t => t.id), 0) + 1,
      importedDate: new Date()
    };
    this.transactions.push(newTransaction);
    return of(newTransaction);
  }

  update(id: number, transaction: Transaction): Observable<Transaction|null> {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index === -1) {
      return of(null);
    }

    const updatedTransaction = {
      ...transaction,
      id,
      importedDate: this.transactions[index].importedDate
    };
    this.transactions[index] = updatedTransaction;
    return of(updatedTransaction);
  }

  delete(id: number): Observable<void> {
    const index = this.transactions.findIndex(t => t.id === id);
    if (index !== -1) {
      this.transactions.splice(index, 1);
    }
    return of(void 0);
  }

  getByCategory(categoryId: number): Observable<Transaction[]> {
    const filteredTransactions = this.transactions.filter(t => t.categoryId === categoryId);
    return of(filteredTransactions);
  }

  getByBankAccount(bankAccountId: number): Observable<Transaction[]> {
    const filteredTransactions = this.transactions.filter(t => t.bankAccountId === bankAccountId);
    return of(filteredTransactions);
  }

  getByDateRange(startDate: Date, endDate: Date): Observable<Transaction[]> {
    const filteredTransactions = this.transactions.filter(t => 
      t.date >= startDate && t.date <= endDate
    );
    return of(filteredTransactions);
  }
}



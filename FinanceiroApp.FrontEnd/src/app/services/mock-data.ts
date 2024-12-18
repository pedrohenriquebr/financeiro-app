import { BankAccount } from '../models/bank-account.model';
import { Category, CategoryType } from '../models/category.model';
import { Transaction } from '../models/transaction.model';

export const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Salário',
    type: CategoryType.Income,
  },
  {
    id: 2,
    name: 'Alimentação',
    type: CategoryType.Expense,
  },
  {
    id: 3,
    name: 'Transporte',
    type: CategoryType.Expense,
  }
];

export const mockBankAccounts: BankAccount[] = [
  {
    id: 1,
    name: 'Conta Corrente',
    bankId: 1,
    bankName: 'Banco do Brasil',
    balance: 5000,
    accountNumber: '12345-6',
    agency: '0001'
  },
  {
    id: 2,
    name: 'Poupança',
    bankId: 1,
    bankName: 'Banco do Brasil',
    balance: 10000,
    accountNumber: '98765-4',
    agency: '0002'
  }
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    description: 'Salário',
    amount: 5000,
    date: new Date('2023-11-05'),
    registrationDate: new Date('2023-11-05'),
    categoryId: 1,
    categoryName: 'Salário',
    bankAccountId: 1,
    bankAccountName: 'Conta Corrente',
    importedDate: new Date('2023-11-05'),
    isTransfer: false,
    isRecurring: false
  },
  {
    id: 2,
    description: 'Aluguel',
    amount: -1500,
    date: new Date('2023-11-10'),
    registrationDate: new Date('2023-11-10'),
    categoryId: 2,
    categoryName: 'Moradia',
    bankAccountId: 1,
    bankAccountName: 'Conta Corrente',
    importedDate: new Date('2023-11-10'),
    isTransfer: false,
    isRecurring: false
  }
];

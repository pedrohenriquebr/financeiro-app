export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: Date;
  registrationDate: Date;
  importedDate?: Date;
  categoryId?: number;
  categoryName?: string;
  bankAccountId?: number;
  bankAccountName?: string;
  isTransfer: boolean;
  destinationBankAccountId?: number;
  destinationBankAccountName?: string;
  isRecurring: boolean;
  recurrenceType?: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  recurrenceFrequency?: number;
  recurrenceEndDate?: Date;
  parentTransactionId?: number;
}

export interface CreateTransactionDto {
  description: string;
  amount: number;
  date: Date;
  categoryId?: number;
  bankAccountId?: number;
  isTransfer: boolean;
  destinationBankAccountId?: number;
  isRecurring: boolean;
  recurrenceType?: 'None' | 'Daily' | 'Weekly' | 'Monthly' | 'Yearly';
  recurrenceFrequency?: number;
  recurrenceEndDate?: Date;
}

export interface UpdateTransactionDto extends CreateTransactionDto {
  id: number;
}

export interface ImportTransactionDto {
  description: string;
  amount: number;
  date: Date;
  categoryName?: string;
  bankAccountName: string;
  isTransfer: boolean;
  destinationBankAccountName?: string;
}

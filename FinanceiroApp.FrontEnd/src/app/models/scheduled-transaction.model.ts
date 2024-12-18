import { RecurrenceType } from './recurrence-type.enum';

export interface ScheduledTransaction {
  id?: number;
  description: string;
  amount: number;
  nextDueDate: Date;
  isRecurring: boolean;
  recurrenceType: RecurrenceType;
  recurrenceFrequency?: number;
  recurrenceEndDate?: Date;
  categoryId: number;
  bankAccountId: number;
  isProcessed: boolean;
  lastProcessedDate?: Date;
  category?: any;
  bankAccount?: any;
}

import { environment } from '../../environments/environment';
import { CategoryService } from './category.service';
import { BankAccountService } from './bank-account.service';
import { TransactionService } from './transaction.service';
import { MockCategoryService } from './mock-category.service';
import { MockBankAccountService } from './mock-bank-account.service';
import { MockTransactionService } from './mock-transaction.service';
import { HttpClient } from '@angular/common/http';

export function categoryServiceFactory(http: HttpClient) {
  return environment.useMockData
    ? new MockCategoryService()
    : new CategoryService(http);
}

export function bankAccountServiceFactory(http: HttpClient) {
  return environment.useMockData
    ? new MockBankAccountService()
    : new BankAccountService(http);
}

export function transactionServiceFactory(http: HttpClient) {
  return environment.useMockData
    ? new MockTransactionService()
    : new TransactionService(http);
}

export interface BankAccount {
  id: number;
  name: string;
  bankId: number;
  bankName: string;
  balance: number;
  accountNumber: string;
  agency: string;
}

export interface CreateBankAccountDto {
  name: string;
  bankId: number;
  accountNumber: string;
  agency: string;
}

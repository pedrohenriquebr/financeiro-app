export interface ImportTransactionDto {
    id?: number | null;
    description: string;
    amount: number;
    date: Date;
    type: 'EXPENSE' | 'INCOME';
    categoryId?: number | null;
    categoryName?: string | null;
    bankAccountId?: number | null;
    bankAccountName?: string | null;
    selected?: boolean | null;
}

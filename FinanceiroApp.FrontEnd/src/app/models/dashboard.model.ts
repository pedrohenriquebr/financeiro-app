export interface DashboardOverview {
  totalBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalTransactions: number;
  averageTransactionAmount: number;
  lastUpdateDate: Date;
  currentBalance: number;
  lastMonthIncome: number;
  lastMonthExpenses: number;
}

export interface BankAccountBalance {
  bankAccountId: number;
  bankAccountName: string;
  initialBalance: number;
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalTransfers: number;
}

export interface CategorySummary {
  id: number;
  name: string;
  total: number;
  transactionCount: number;
  trend: number;
}

export interface TransactionsByPeriod {
  period: string;
  income: number;
  expenses: number;
  balance: number;
  transactionCount: number;
}

export interface DashboardData {
  overview: DashboardOverview;
  bankAccountBalances: BankAccountBalance[];
  monthlyTransactions: TransactionsByPeriod[];
  yearlyTransactions: TransactionsByPeriod[];
  expenseCategories: CategorySummary[];
  incomeCategories: CategorySummary[];
  previousMonthTotal: number;
}

export interface DashboardFilter {
  startDate?: Date;
  endDate?: Date;
  bankAccountIds?: number[];
  categoryIds?: number[];
  groupBy?: 'month' | 'year';
}

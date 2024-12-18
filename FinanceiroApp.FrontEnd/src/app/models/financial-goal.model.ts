export interface CategoryAnalysis {
    categoryId: number;
    categoryName: string;
    totalAmount: number;
    percentageOfTotal: number;
    trend: number;
    transactions: number;
}

export interface FinancialGoal {
    id: number;
    name: string;
    targetAmount: number;
    currentAmount: number;
    targetDate: Date;
    percentageComplete: number;
    monthlyRequired: number;
}

export interface UpcomingTransaction {
    date: Date;
    description: string;
    amount: number;
    isRecurring: boolean;
}
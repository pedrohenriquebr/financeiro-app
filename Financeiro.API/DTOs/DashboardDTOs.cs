using System;
using System.Collections.Generic;

namespace Financeiro.API.DTOs
{
    public class DashboardOverviewDto
    {
        public decimal TotalBalance { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public int TotalTransactions { get; set; }
        public decimal AverageTransactionAmount { get; set; }
        public DateTime LastUpdateDate { get; set; }
    }

    public class BankAccountBalanceDto
    {
        public int BankAccountId { get; set; }
        public string BankAccountName { get; set; }
        public decimal InitialBalance { get; set; }
        public decimal CurrentBalance { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }
        public decimal TotalTransfers { get; set; }
    }

    public class TransactionsByPeriodDto
    {
        public string Period { get; set; }
        public decimal Income { get; set; }
        public decimal Expenses { get; set; }
        public decimal Balance { get; set; }
        public int TransactionCount { get; set; }
    }

    public class DashboardDataDto
    {
        public DashboardOverviewDto Overview { get; set; }
        public List<BankAccountBalanceDto> BankAccountBalances { get; set; }
        public List<TransactionsByPeriodDto> MonthlyTransactions { get; set; }
        public List<TransactionsByPeriodDto> YearlyTransactions { get; set; }
        public decimal PreviousMonthTotal { get; set; }
    }

    public class DashboardFilterDto
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public List<int>? BankAccountIds { get; set; }
        public List<int>? CategoryIds { get; set; }
        public string? GroupBy { get; set; } // "month" or "year"
    }
}

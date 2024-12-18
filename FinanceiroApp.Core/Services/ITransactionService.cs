using System.Collections.Generic;
using FinanceiroApp.Core.Entities;
using FinanceiroApp.Core.ViewModels;

namespace FinanceiroApp.Core.Services
{
  public interface ITransactionService
  {
    IEnumerable<Transaction> GetAllTransactions();
    IEnumerable<TransactionViewModel> GetAllTransactionsWithDetails();
    Transaction GetTransactionById(int id);
    void AddTransaction(Transaction transaction);
    void UpdateTransaction(Transaction transaction);
    void DeleteTransaction(int id);
    decimal GetBalanceForAccount(int accountId);
    decimal GetTotalIncome();
    decimal GetTotalExpenses();
    IEnumerable<TransactionViewModel> GetTransactionsByDateRange(DateTime startDate, DateTime endDate);
    IEnumerable<TransactionViewModel> GetTransactionsByCategory(int categoryId);
    IEnumerable<TransactionViewModel> GetTransactionsByAccount(int accountId);
  }
}

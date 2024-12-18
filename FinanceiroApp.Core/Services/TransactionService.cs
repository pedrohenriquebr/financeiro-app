using System;
using System.Collections.Generic;
using System.Linq;
using FinanceiroApp.Core.Entities;
using FinanceiroApp.Core.ViewModels;

namespace FinanceiroApp.Core.Services
{
  public class TransactionService : ITransactionService
  {
    private readonly IDataStore<Transaction> _transactionStore;
    private readonly IDataStore<Category> _categoryStore;
    private readonly IDataStore<BankAccount> _bankAccountStore;

    public TransactionService(
        IDataStore<Transaction> transactionStore,
        IDataStore<Category> categoryStore,
        IDataStore<BankAccount> bankAccountStore)
    {
      _transactionStore = transactionStore;
      _categoryStore = categoryStore;
      _bankAccountStore = bankAccountStore;
    }

    public IEnumerable<Transaction> GetAllTransactions()
    {
      return _transactionStore.GetAll();
    }

    public IEnumerable<TransactionViewModel> GetAllTransactionsWithDetails()
    {
      var transactions = _transactionStore.GetAll();
      var categories = _categoryStore.GetAll().ToDictionary(c => c.Id);
      var accounts = _bankAccountStore.GetAll().ToDictionary(a => a.Id);

      return transactions.Select(t => CreateTransactionViewModel(t, categories, accounts));
    }

    public Transaction GetTransactionById(int id)
    {
      return _transactionStore.GetById(id);
    }

    public void AddTransaction(Transaction transaction)
    {
      _transactionStore.Add(transaction);
    }

    public void UpdateTransaction(Transaction transaction)
    {
      _transactionStore.Update(transaction);
    }

    public void DeleteTransaction(int id)
    {
      _transactionStore.Delete(id);
    }

    public decimal GetBalanceForAccount(int accountId)
    {
      return _transactionStore.GetAll()
          .Where(t => t.BankAccountId == accountId)
          .Sum(t => t.Value);
    }

    public decimal GetTotalIncome()
    {
      return _transactionStore.GetAll()
          .Where(t => t.Value > 0)
          .Sum(t => t.Value);
    }

    public decimal GetTotalExpenses()
    {
      return _transactionStore.GetAll()
          .Where(t => t.Value < 0)
          .Sum(t => t.Value);
    }

    public IEnumerable<TransactionViewModel> GetTransactionsByDateRange(DateTime startDate, DateTime endDate)
    {
      var transactions = _transactionStore.GetAll()
          .Where(t => t.TransactionDateTime >= startDate && t.TransactionDateTime <= endDate);
      var categories = _categoryStore.GetAll().ToDictionary(c => c.Id);
      var accounts = _bankAccountStore.GetAll().ToDictionary(a => a.Id);

      return transactions.Select(t => CreateTransactionViewModel(t, categories, accounts));
    }

    public IEnumerable<TransactionViewModel> GetTransactionsByCategory(int categoryId)
    {
      var transactions = _transactionStore.GetAll()
          .Where(t => t.CategoryId == categoryId);
      var categories = _categoryStore.GetAll().ToDictionary(c => c.Id);
      var accounts = _bankAccountStore.GetAll().ToDictionary(a => a.Id);

      return transactions.Select(t => CreateTransactionViewModel(t, categories, accounts));
    }

    public IEnumerable<TransactionViewModel> GetTransactionsByAccount(int accountId)
    {
      var transactions = _transactionStore.GetAll()
          .Where(t => t.BankAccountId == accountId);
      var categories = _categoryStore.GetAll().ToDictionary(c => c.Id);
      var accounts = _bankAccountStore.GetAll().ToDictionary(a => a.Id);

      return transactions.Select(t => CreateTransactionViewModel(t, categories, accounts));
    }

    private TransactionViewModel CreateTransactionViewModel(
        Transaction transaction,
        Dictionary<int, Category> categories,
        Dictionary<int, BankAccount> accounts)
    {
      var categoryName = transaction.CategoryId.HasValue && categories.TryGetValue(transaction.CategoryId.Value, out var category)
          ? category.Name
          : "Sem Categoria";

      var accountName = transaction.BankAccountId.HasValue && accounts.TryGetValue(transaction.BankAccountId.Value, out var account)
          ? account.Name
          : "Conta Não Especificada";

      var destinationAccountName = transaction.IsTransfer && transaction.DestinationBankAccountId.HasValue && 
        accounts.TryGetValue(transaction.DestinationBankAccountId.Value, out var destAccount)
        ? destAccount.Name
        : null;

      return new TransactionViewModel
      {
        Id = transaction.Id,
        Description = transaction.Description,
        Value = transaction.Value,
        TransactionDateTime = transaction.TransactionDateTime,
        RegistrationDateTime = transaction.RegistrationDateTime,
        ImportDateTime = transaction.ImportDateTime,
        CategoryId = transaction.CategoryId,
        CategoryName = categoryName,
        BankAccountId = transaction.BankAccountId,
        BankAccountName = accountName,
        IsTransfer = transaction.IsTransfer,
        DestinationBankAccountId = transaction.DestinationBankAccountId,
        DestinationBankAccountName = destinationAccountName,
        IsRecurring = transaction.IsRecurring,
        RecurrenceType = (ViewModels.RecurrenceType)transaction.RecurrenceType,
        RecurrenceFrequency = transaction.RecurrenceFrequency,
        RecurrenceEndDate = transaction.RecurrenceEndDate,
        ParentTransactionId = transaction.ParentTransactionId
      };
    }
  }
}

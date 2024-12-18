using System.Collections.Generic;
using System.Linq;
using FinanceiroApp.Core.Entities;
using FinanceiroApp.Core.ViewModels;

namespace FinanceiroApp.Core.Services
{
  public class BankAccountService : IBankAccountService
  {
    private readonly IDataStore<BankAccount> _bankAccountStore;
    private readonly IDataStore<Bank> _bankStore;
    private readonly ITransactionService _transactionService;

    public BankAccountService(
        IDataStore<BankAccount> bankAccountStore,
        IDataStore<Bank> bankStore,
        ITransactionService transactionService)
    {
      _bankAccountStore = bankAccountStore;
      _bankStore = bankStore;
      _transactionService = transactionService;
    }

    public IEnumerable<BankAccount> GetAllBankAccounts()
    {
      return _bankAccountStore.GetAll()
        .Select(a => new BankAccount
        {
          Id = a.Id,
          Name = a.Name,
          BankId = a.BankId,
          Number = a.Number,
          Agency = a.Agency,
          Balance = a.Balance,
          Bank = _bankStore.GetById(a.BankId)
        });
    }

    public BankAccount GetBankAccountById(int id)
    {
      return _bankAccountStore.GetById(id);
    }

    public BankAccount GetBankAccountByName(string name)
    {
      return _bankAccountStore.GetAll()
          .FirstOrDefault(a => a.Name.Equals(name, StringComparison.OrdinalIgnoreCase));
    }

    public void AddBankAccount(BankAccount bankAccount)
    {
      _bankAccountStore.Add(bankAccount);
    }

    public void UpdateBankAccount(BankAccount bankAccount)
    {
      _bankAccountStore.Update(bankAccount);
    }

    public void DeleteBankAccount(int id)
    {
      _bankAccountStore.Delete(id);
    }

    public IEnumerable<BankAccountViewModel> GetAllBankAccountsWithDetails()
    {
      var bankAccounts = _bankAccountStore.GetAll();
      var banks = _bankStore.GetAll().ToDictionary(b => b.Id);

      return bankAccounts.Select(ba => CreateBankAccountViewModel(ba, banks));
    }

    public decimal GetTotalBalance()
    {
      return GetAllBankAccounts()
          .Sum(account => _transactionService.GetBalanceForAccount(account.Id));
    }

    private BankAccountViewModel CreateBankAccountViewModel(
        BankAccount bankAccount,
        Dictionary<int, Bank> banks)
    {
      var bank = banks.TryGetValue(bankAccount.BankId, out var b) ? b : null;
      var balance = _transactionService.GetBalanceForAccount(bankAccount.Id);

      return new BankAccountViewModel
      {
        Id = bankAccount.Id,
        Name = bankAccount.Name,
        AccountNumber = bankAccount.Number,
        BankId = bankAccount.BankId,
        BankName = bank?.Name ?? "Banco Desconhecido",
        Balance = balance,
        DisplayName = $"{bankAccount.Name} ({bank?.Name ?? "Banco Desconhecido"})"
      };
    }

  }
}

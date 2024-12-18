using FinanceiroApp.Core.Entities;
using FinanceiroApp.Core.ViewModels;
using System.Collections.Generic;

namespace FinanceiroApp.Core.Services
{
  public interface IBankAccountService
  {
    IEnumerable<BankAccount> GetAllBankAccounts();
    BankAccount GetBankAccountById(int id);
    BankAccount? GetBankAccountByName(string name);
    void AddBankAccount(BankAccount bankAccount);
    void UpdateBankAccount(BankAccount bankAccount);
    void DeleteBankAccount(int id);

    decimal GetTotalBalance();
    IEnumerable<BankAccountViewModel> GetAllBankAccountsWithDetails();
  }
}

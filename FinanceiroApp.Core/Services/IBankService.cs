using FinanceiroApp.Core.Entities;
using System.Collections.Generic;

namespace FinanceiroApp.Core.Services
{
  public interface IBankService
  {
    void AddBank(Bank bank);
    void DeleteBank(int id);
    IEnumerable<Bank> GetAllBanks();
    Bank GetBankById(int id);
    void UpdateBank(Bank bank);

  }
}
using System.Collections.Generic;
using FinanceiroApp.Core.Entities;

namespace FinanceiroApp.Core.Services
{
  public class BankService : IBankService
  {
    private readonly IDataStore<Bank> _store;

    public BankService(IDataStore<Bank> store)
    {
      _store = store;
    }

    public void AddBank(Bank bank)
    {
      _store.Add(bank);
    }

    public void DeleteBank(int id)
    {
      _store.Delete(id);
    }

    public IEnumerable<Bank> GetAllBanks()
    {
      return _store.GetAll();
    }

    public Bank GetBankById(int id)
    {
      return _store.GetById(id);
    }

    public void UpdateBank(Bank bank)
    {
      _store.Update(bank);
    }
  }
}

using System.Collections.Generic;

namespace FinanceiroApp.Core.Services
{
  public interface IDataStore<T> where T : class
  {
    IEnumerable<T> GetAll();
    T GetById(int id);
    void Add(T entity);
    void Update(T entity);
    void Delete(int id);
  }
}

using FinanceiroApp.Core.Entities;
using FinanceiroApp.Core.ViewModels;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace FinanceiroApp.Core.Services
{
  public interface ICategoryService
  {
    Task<IEnumerable<Category>> GetAllAsync();
    Task<Category> GetByIdAsync(int id);
    Task<Category> CreateAsync(Category category);
    Task<Category> UpdateAsync(Category category);
    Task DeleteAsync(int id);
    Task<IEnumerable<TransactionViewModel>> GetCategoryTransactionsAsync(DateTime? startDate, DateTime? endDate);
  }
}

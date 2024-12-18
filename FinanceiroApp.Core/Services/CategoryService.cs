using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceiroApp.Core.Entities;
using FinanceiroApp.Core.ViewModels;

namespace FinanceiroApp.Core.Services
{
  public class CategoryService : ICategoryService
  {
    private readonly IDataStore<Category> _categoryStore;
    private readonly ITransactionService _transactionService;

    public CategoryService(
        IDataStore<Category> categoryStore,
        ITransactionService transactionService)
    {
      _categoryStore = categoryStore;
      _transactionService = transactionService;
    }

    public async Task<IEnumerable<Category>> GetAllAsync()
    {
      return await Task.FromResult(_categoryStore.GetAll());
    }

    public async Task<Category> GetByIdAsync(int id)
    {
      return await Task.FromResult(_categoryStore.GetById(id));
    }

    public async Task<Category> GetCategoryByNameAsync(string name)
    {
      return await Task.FromResult(_categoryStore.GetAll()
          .FirstOrDefault(c => c.Name.Equals(name, StringComparison.OrdinalIgnoreCase)));
    }

    public async Task<Category> CreateAsync(Category category)
    {
      _categoryStore.Add(category);
      return await Task.FromResult(category);
    }

    public async Task<Category> UpdateAsync(Category category)
    {
      _categoryStore.Update(category);
      return await Task.FromResult(category);
    }

    public async Task DeleteAsync(int id)
    {
      _categoryStore.Delete(id);
      await Task.CompletedTask;
    }

    public async Task<IEnumerable<CategoryViewModel>> GetAllCategoriesWithDetailsAsync()
    {
      var categories = await GetAllAsync();
      return categories.Select(CreateCategoryViewModel);
    }

    public async Task<IEnumerable<TransactionViewModel>> GetCategoryTransactionsAsync(DateTime? startDate, DateTime? endDate)
    {
      var categories = await GetAllAsync();
      var result = new List<TransactionViewModel>();
      
      foreach (var category in categories)
      {
        var transactions = _transactionService.GetTransactionsByCategory(category.Id);
        
        // Aplicar filtros de data se fornecidos
        if (startDate.HasValue)
        {
          transactions = transactions.Where(t => t.TransactionDateTime >= startDate.Value);
        }
        if (endDate.HasValue)
        {
          transactions = transactions.Where(t => t.TransactionDateTime <= endDate.Value);
        }

        result.AddRange(transactions);
      }

      return result;
    }

    private CategoryViewModel CreateCategoryViewModel(Category category)
    {
      var transactions = _transactionService.GetTransactionsByCategory(category.Id);
      var totalIncome = transactions.Where(t => t.Value > 0).Sum(t => t.Value);
      var totalExpenses = transactions.Where(t => t.Value < 0).Sum(t => t.Value);
      var balance = totalIncome + totalExpenses; // totalExpenses is already negative

      return new CategoryViewModel
      {
        Id = category.Id,
        Name = category.Name,
        Description = category.Name,
        Type = category.Type,
        Nature = category.Nature,
        PlannedAmount = category.PlannedAmount,
        TotalIncome = totalIncome,
        TotalExpenses = totalExpenses,
        Balance = balance,
        TransactionCount = transactions.Count()
      };
    }
  }
}

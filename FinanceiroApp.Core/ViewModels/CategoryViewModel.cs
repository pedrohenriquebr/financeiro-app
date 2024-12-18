using FinanceiroApp.Core.Entities;

namespace FinanceiroApp.Core.ViewModels
{
  // CategoryViewModel
  public class CategoryViewModel
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public CategoryType Type { get; set; }
    public CategoryNature Nature { get; set; }
    public decimal PlannedAmount { get; set; }
    public decimal TotalIncome { get; set; }
    public decimal TotalExpenses { get; set; }
    public decimal Balance { get; set; }
    public int TransactionCount { get; set; }
  }
}

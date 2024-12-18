using FinanceiroApp.Core.Entities;

namespace Financeiro.API.DTOs.Category
{
    public class CategoryResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public CategoryType Type { get; set; }
        public CategoryNature Nature { get; set; }
        public decimal PlannedAmount { get; set; }
    }
}

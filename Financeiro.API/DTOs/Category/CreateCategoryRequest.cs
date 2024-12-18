using System.ComponentModel.DataAnnotations;
using FinanceiroApp.Core.Entities;

namespace Financeiro.API.DTOs.Category
{
    public class CreateCategoryRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public CategoryType Type { get; set; }

        [Required]
        public CategoryNature Nature { get; set; }

        [Required]
        [Range(0, double.MaxValue, ErrorMessage = "O valor planejado deve ser maior ou igual a zero")]
        public decimal PlannedAmount { get; set; }
    }
}

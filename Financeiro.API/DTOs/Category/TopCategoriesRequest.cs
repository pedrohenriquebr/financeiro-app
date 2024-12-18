using System;

namespace Financeiro.API.DTOs.Category
{
    public class TopCategoriesRequest
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }
}

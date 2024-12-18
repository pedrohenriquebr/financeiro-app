namespace Financeiro.API.DTOs.Category
{
    public class TopCategoryResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal TotalAmount { get; set; }
        public double PercentageOfTotal { get; set; }
        public int TransactionCount { get; set; }
    }
}

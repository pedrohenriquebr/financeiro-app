namespace FinanceiroApp.Core.Entities
{
  public class Category
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public CategoryType Type { get; set; }
    public CategoryNature Nature { get; set; }
    public decimal PlannedAmount { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }

    // Navegação
    public ICollection<Transaction> Transactions { get; set; }
    public ICollection<DescriptionMapping> DescriptionMappings { get; set; }
  }
}

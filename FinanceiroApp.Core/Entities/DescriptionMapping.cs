namespace FinanceiroApp.Core.Entities
{
  public class DescriptionMapping
  {
    public int Id { get; set; }
    public string Pattern { get; set; }
    public int CategoryId { get; set; }

    // Navegação
    public Category Category { get; set; }
  }
}

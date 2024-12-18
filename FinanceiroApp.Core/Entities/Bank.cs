namespace FinanceiroApp.Core.Entities
{
  public class Bank
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Code { get; set; }

    // Navegação
    public ICollection<BankAccount> BankAccounts { get; set; }
  }
}

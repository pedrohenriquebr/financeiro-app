namespace FinanceiroApp.Core.Entities
{
  public class BankAccount
  {
    public int Id { get; set; }
    public int BankId { get; set; }
    public string Number { get; set; }
    public string Name { get; set; }
    public decimal Balance { get; set; }
    public string Agency { get; set; }

    // Navegação
    public Bank Bank { get; set; }
    public ICollection<Transaction> Transactions { get; set; }

    public ICollection<Transaction> DestinationTransactions { get; set; }

  }
}

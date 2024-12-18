namespace FinanceiroApp.Core.ViewModels
{
  // BankAccountViewModel
  public class BankAccountViewModel
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public decimal Balance { get; set; }
    public string FormattedBalance => Balance.ToString("C");
    public int TransactionCount { get; set; }
    public string AccountNumber { get; internal set; }
    public int BankId { get; internal set; }
    public string BankName { get; internal set; }
    public string DisplayName { get; internal set; }
  }
}

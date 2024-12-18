namespace Financeiro.API.DTOs.BankAccount
{
    public class BankAccountResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int BankId { get; set; }
        public string BankName { get; set; }
        public string AccountNumber { get; set; }
        public string Agency { get; set; }
        public decimal Balance { get; set; }
    }
}

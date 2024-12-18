using System.ComponentModel.DataAnnotations;

namespace Financeiro.API.DTOs.BankAccount
{
    public class CreateBankAccountRequest
    {
        [Required]
        public string Name { get; set; }

        [Required]
        public int BankId { get; set; }

        [Required]
        public string AccountNumber { get; set; }

        [Required]
        public string Agency { get; set; }

        [Required]
        public decimal Balance { get; set; }
    }
}

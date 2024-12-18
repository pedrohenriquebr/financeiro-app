using FinanceiroApp.Core.Entities;

namespace Financeiro.API.DTOs
{
  public class TransactionDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public DateTime? ImportedDate { get; set; }
        public int? CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int? BankAccountId { get; set; }
        public string BankAccountName { get; set; }

        // Transfer properties
        public bool IsTransfer { get; set; }
        public int? DestinationBankAccountId { get; set; }
        public string DestinationBankAccountName { get; set; }

        // Recurring properties
        public bool IsRecurring { get; set; }
        public RecurrenceType RecurrenceType { get; set; }
        public int? RecurrenceFrequency { get; set; }
        public DateTime? RecurrenceEndDate { get; set; }
        public int? ParentTransactionId { get; set; }
    }

    public class CreateTransactionDto
    {
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public int? CategoryId { get; set; }
        public int? BankAccountId { get; set; }
        public bool IsTransfer { get; set; }
        public int? DestinationBankAccountId { get; set; }
        public bool IsRecurring { get; set; }
        public RecurrenceType? RecurrenceType { get; set; }
        public int? RecurrenceFrequency { get; set; }
        public DateTime? RecurrenceEndDate { get; set; }
    }

    public class UpdateTransactionDto : CreateTransactionDto
    {
        public int Id { get; set; }
    }
}

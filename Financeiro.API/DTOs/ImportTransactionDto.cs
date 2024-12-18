using System;

namespace Financeiro.API.DTOs
{
    public class ImportTransactionDto
    {
        public string Description { get; set; }
        public decimal Value { get; set; }
        public DateTime TransactionDateTime { get; set; }
        public int? CategoryId { get; set; }
        public int BankAccountId { get; set; }
        public bool IsTransfer { get; set; }
        public bool IsRecurring { get; set; }
        public FinanceiroApp.Core.Entities.RecurrenceType RecurrenceType { get; set; }
        public int RecurrenceFrequency { get; set; }
        public DateTime? RecurrenceEndDate { get; set; }
    }
}

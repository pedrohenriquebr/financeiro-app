using System;
using FinanceiroApp.Core.Entities;

namespace Financeiro.API.DTOs
{
    public class ScheduledTransactionDto
    {
        public int Id { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime NextDueDate { get; set; }
        public bool IsRecurring { get; set; }
        public RecurrenceType RecurrenceType { get; set; }
        public int? RecurrenceFrequency { get; set; }
        public DateTime? RecurrenceEndDate { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
        public int BankAccountId { get; set; }
        public string BankAccountName { get; set; }
        public bool IsProcessed { get; set; }
        public DateTime? LastProcessedDate { get; set; }
    }

    public class CreateScheduledTransactionDto
    {
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime NextDueDate { get; set; }
        public bool IsRecurring { get; set; }
        public RecurrenceType RecurrenceType { get; set; }
        public int? RecurrenceFrequency { get; set; }
        public DateTime? RecurrenceEndDate { get; set; }
        public int CategoryId { get; set; }
        public int BankAccountId { get; set; }
    }

    public class UpdateScheduledTransactionDto : CreateScheduledTransactionDto
    {
        public int Id { get; set; }
    }
}

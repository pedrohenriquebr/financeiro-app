namespace FinanceiroApp.Core.Entities
{
    public class ScheduledTransaction
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
        public int BankAccountId { get; set; }
        public bool IsProcessed { get; set; }
        public DateTime? LastProcessedDate { get; set; }

        // Navegação
        public Category Category { get; set; }
        public BankAccount BankAccount { get; set; }

        public DateTime? CalculateNextDueDate()
        {
            if (!IsRecurring || RecurrenceEndDate.HasValue && NextDueDate > RecurrenceEndDate)
                return null;

            var next = NextDueDate;
            switch (RecurrenceType)
            {
                case RecurrenceType.Daily:
                    next = next.AddDays(RecurrenceFrequency ?? 1);
                    break;
                case RecurrenceType.Weekly:
                    next = next.AddDays((RecurrenceFrequency ?? 1) * 7);
                    break;
                case RecurrenceType.Monthly:
                    next = next.AddMonths(RecurrenceFrequency ?? 1);
                    break;
                case RecurrenceType.Yearly:
                    next = next.AddYears(RecurrenceFrequency ?? 1);
                    break;
            }

            return next <= RecurrenceEndDate ? next : null;
        }
    }
}

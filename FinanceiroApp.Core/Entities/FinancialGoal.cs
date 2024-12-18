using System;

namespace FinanceiroApp.Core.Entities
{
    public class FinancialGoal
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal CurrentAmount { get; set; }
        public DateTime TargetDate { get; set; }

        // Propriedades calculadas
        public decimal PercentageComplete => (CurrentAmount / TargetAmount) * 100;
        public decimal MonthlyRequired
        {
            get
            {
                var remainingAmount = TargetAmount - CurrentAmount;
                var monthsUntilTarget = (TargetDate - DateTime.Today).Days / 30.0;
                return monthsUntilTarget > 0 ? remainingAmount / (decimal)monthsUntilTarget : remainingAmount;
            }
        }
    }
}

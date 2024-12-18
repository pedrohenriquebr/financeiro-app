using System;

namespace Financeiro.API.DTOs
{
    public class FinancialGoalDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal CurrentAmount { get; set; }
        public DateTime TargetDate { get; set; }
        public decimal PercentageComplete { get; set; }
        public decimal MonthlyRequired { get; set; }
    }

    public class CreateFinancialGoalDto
    {
        public string Name { get; set; }
        public decimal TargetAmount { get; set; }
        public decimal CurrentAmount { get; set; }
        public DateTime TargetDate { get; set; }
    }

    public class UpdateFinancialGoalDto : CreateFinancialGoalDto
    {
        public int Id { get; set; }
    }
}

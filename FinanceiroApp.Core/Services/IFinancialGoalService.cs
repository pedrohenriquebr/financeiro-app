using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceiroApp.Core.Entities;

namespace FinanceiroApp.Core.Services
{
    public interface IFinancialGoalService
    {
        Task<IEnumerable<FinancialGoal>> GetGoalsAsync();
        Task<FinancialGoal> GetGoalAsync(int id);
        Task<FinancialGoal> CreateGoalAsync(FinancialGoal goal);
        Task<FinancialGoal> UpdateGoalAsync(FinancialGoal goal);
        Task<FinancialGoal> UpdateGoalProgressAsync(int goalId, decimal newAmount);
        Task DeleteGoalAsync(int goalId);
    }
}

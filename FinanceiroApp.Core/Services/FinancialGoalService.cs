using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using FinanceiroApp.Core.Entities;

namespace FinanceiroApp.Core.Services
{
    public class FinancialGoalService : IFinancialGoalService
    {
        private readonly IDataStore<FinancialGoal> _goalStore;

        public FinancialGoalService(IDataStore<FinancialGoal> goalStore)
        {
            _goalStore = goalStore;
        }

        public async Task<IEnumerable<FinancialGoal>> GetGoalsAsync()
        {
            return await Task.FromResult(_goalStore.GetAll());
        }

        public async Task<FinancialGoal> GetGoalAsync(int id)
        {
            return await Task.FromResult(_goalStore.GetById(id));
        }

        public async Task<FinancialGoal> CreateGoalAsync(FinancialGoal goal)
        {
             _goalStore.Add(goal);
            return await Task.FromResult(goal);
        }

        public async Task<FinancialGoal> UpdateGoalAsync(FinancialGoal goal)
        {
            var existingGoal = await Task.FromResult( _goalStore.GetById(goal.Id));
            if (existingGoal == null)
                throw new KeyNotFoundException($"Goal with ID {goal.Id} not found.");

            _goalStore.Update(goal);
            return goal;
        }

        public async Task<FinancialGoal> UpdateGoalProgressAsync(int goalId, decimal newAmount)
        {
            var goal = await Task.FromResult( _goalStore.GetById(goalId));
            if (goal == null)
                throw new KeyNotFoundException($"Goal with ID {goalId} not found.");

            goal.CurrentAmount = newAmount;
            _goalStore.Update(goal);
            return goal;
        }

        public async Task DeleteGoalAsync(int goalId)
        {
            var goal = await Task.FromResult( _goalStore.GetById(goalId));
            if (goal == null)
                throw new KeyNotFoundException($"Goal with ID {goalId} not found.");

            _goalStore.Delete(goalId);
        }
    }
}

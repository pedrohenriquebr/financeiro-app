using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FinanceiroApp.Core.Entities;

namespace FinanceiroApp.Core.Services
{
    public interface IScheduledTransactionService
    {
        Task<IEnumerable<ScheduledTransaction>> GetScheduledTransactionsAsync();
        Task<IEnumerable<ScheduledTransaction>> GetUpcomingTransactionsAsync(DateTime startDate, DateTime endDate);
        Task<ScheduledTransaction> GetScheduledTransactionAsync(int transactionId);
        Task<ScheduledTransaction> CreateScheduledTransactionAsync(ScheduledTransaction transaction);
        Task<ScheduledTransaction> UpdateScheduledTransactionAsync(ScheduledTransaction transaction);
        Task DeleteScheduledTransactionAsync(int transactionId);
        Task ProcessScheduledTransactionsAsync();
    }
}

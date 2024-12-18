using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;
using FinanceiroApp.Core.Entities;

namespace FinanceiroApp.Core.Services
{
    public class ScheduledTransactionService : IScheduledTransactionService
    {
        private readonly IDataStore<ScheduledTransaction> _transactionStore;
        private readonly ITransactionService _transactionService;

        public ScheduledTransactionService(
            IDataStore<ScheduledTransaction> transactionStore,
            ITransactionService transactionService)
        {
            _transactionStore = transactionStore;
            _transactionService = transactionService;
        }

        public async Task<IEnumerable<ScheduledTransaction>> GetScheduledTransactionsAsync()
        {
            return await Task.FromResult(_transactionStore.GetAll());
        }

        public async Task<IEnumerable<ScheduledTransaction>> GetUpcomingTransactionsAsync(DateTime startDate, DateTime endDate)
        {
            var transactions = _transactionStore.GetAll();
            return await Task.FromResult(transactions.Where(st =>
                st.NextDueDate >= startDate &&
                st.NextDueDate <= endDate &&
                !st.IsProcessed)
                .OrderBy(st => st.NextDueDate));
        }

        public async Task<ScheduledTransaction> GetScheduledTransactionAsync(int transactionId)
        {
            return await Task.FromResult(_transactionStore.GetById(transactionId));
        }

        public async Task<ScheduledTransaction> CreateScheduledTransactionAsync(ScheduledTransaction transaction)
        {
            _transactionStore.Add(transaction);
            return await Task.FromResult(transaction);
        }

        public async Task<ScheduledTransaction> UpdateScheduledTransactionAsync(ScheduledTransaction transaction)
        {
            var existingTransaction = await Task.FromResult(_transactionStore.GetById(transaction.Id));
            if (existingTransaction == null)
                throw new KeyNotFoundException($"Scheduled transaction with ID {transaction.Id} not found.");

            _transactionStore.Update(transaction);
            return await Task.FromResult(transaction);
        }

        public async Task DeleteScheduledTransactionAsync(int transactionId)
        {
            var transaction = await Task.FromResult(_transactionStore.GetById(transactionId));
            if (transaction == null)
                throw new KeyNotFoundException($"Scheduled transaction with ID {transactionId} not found.");

            _transactionStore.Delete(transactionId);
        }

        public async Task ProcessScheduledTransactionsAsync()
        {
            var today = DateTime.Today;
            var transactions = await Task.FromResult(_transactionStore.GetAll());
            var dueTransactions = transactions.Where(st =>
                st.NextDueDate.Date <= today &&
                !st.IsProcessed);

            foreach (var scheduledTx in dueTransactions)
            {
                // Create actual transaction
                var transaction = new Transaction
                {
                    Description = scheduledTx.Description,
                    Value = scheduledTx.Amount,
                    TransactionDateTime = scheduledTx.NextDueDate,
                    CategoryId = scheduledTx.CategoryId,
                    BankAccountId = scheduledTx.BankAccountId
                };

                _transactionService.AddTransaction(transaction);

                // Update scheduled transaction
                if (scheduledTx.IsRecurring)
                {
                    var nextDueDate = scheduledTx.CalculateNextDueDate();
                    if (nextDueDate.HasValue)
                    {
                        scheduledTx.NextDueDate = nextDueDate.Value;
                        scheduledTx.LastProcessedDate = today;
                    }
                    else
                    {
                        scheduledTx.IsProcessed = true;
                        scheduledTx.LastProcessedDate = today;
                    }
                }
                else
                {
                    scheduledTx.IsProcessed = true;
                    scheduledTx.LastProcessedDate = today;
                }

                _transactionStore.Update(scheduledTx);
            }
        }
    }
}

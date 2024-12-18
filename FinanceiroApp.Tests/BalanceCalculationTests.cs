using System;
using System.Collections.Generic;
using System.Linq;
using FinanceiroApp.Core.Entities;
using Xunit;

namespace FinanceiroApp.Tests
{
    public class BalanceCalculationTests
    {
        [Fact]
        public void CalculateBalance_WithNormalTransactions_ShouldReturnCorrectBalance()
        {
            // Arrange
            decimal initialBalance = 1000m;
            var transactions = new List<Transaction>
            {
                new Transaction { TransactionDateTime = DateTime.Parse("2024-01-01"), Value = 500m, IsTransfer = false }, // Receita
                new Transaction { TransactionDateTime = DateTime.Parse("2024-01-02"), Value = -300m, IsTransfer = false }, // Despesa
            };

            // Act
            decimal finalBalance = CalculateBalance(initialBalance, transactions);

            // Assert
            Assert.Equal(1200m, finalBalance); // 1000 + 500 - 300 = 1200
        }

        [Fact]
        public void CalculateBalance_WithTransfersBetweenDifferentAccounts_ShouldConsiderTransferValue()
        {
            // Arrange
            decimal initialBalance = 1000m;
            var transactions = new List<Transaction>
            {
                new Transaction 
                { 
                    TransactionDateTime = DateTime.Parse("2024-01-01"),
                    Value = -500m,
                    IsTransfer = true,
                    BankAccountId = 1,
                    DestinationBankAccountId = 2
                }
            };

            // Act
            decimal finalBalance = CalculateBalance(initialBalance, transactions);

            // Assert
            Assert.Equal(500m, finalBalance); // 1000 - 500 = 500
        }

        [Fact]
        public void CalculateBalance_WithTransfersBetweenSameAccount_ShouldIgnoreTransfer()
        {
            // Arrange
            decimal initialBalance = 1000m;
            var transactions = new List<Transaction>
            {
                new Transaction 
                { 
                    TransactionDateTime = DateTime.Parse("2024-01-01"),
                    Value = -500m,
                    IsTransfer = true,
                    BankAccountId = 1,
                    DestinationBankAccountId = 1
                }
            };

            // Act
            decimal finalBalance = CalculateBalance(initialBalance, transactions);

            // Assert
            Assert.Equal(1000m, finalBalance); // Transferência entre mesmas contas deve ser ignorada
        }

        [Fact]
        public void CalculateBalance_WithMixedTransactions_ShouldCalculateCorrectly()
        {
            // Arrange
            decimal initialBalance = 1000m;
            var transactions = new List<Transaction>
            {
                new Transaction { TransactionDateTime = DateTime.Parse("2024-01-01"), Value = 500m, IsTransfer = false }, // Receita
                new Transaction 
                { 
                    TransactionDateTime = DateTime.Parse("2024-01-02"),
                    Value = -300m,
                    IsTransfer = true,
                    BankAccountId = 1,
                    DestinationBankAccountId = 2
                }, // Transferência para outra conta
                new Transaction { TransactionDateTime = DateTime.Parse("2024-01-03"), Value = -200m, IsTransfer = false }, // Despesa
            };

            // Act
            decimal finalBalance = CalculateBalance(initialBalance, transactions);

            // Assert
            Assert.Equal(1000m, finalBalance); // 1000 + 500 - 300 - 200 = 1000
        }

        private decimal CalculateBalance(decimal initialBalance, List<Transaction> transactions)
        {
            decimal realizedBalance = initialBalance;

            foreach (var transaction in transactions.OrderBy(t => t.TransactionDateTime))
            {
                if (transaction.IsTransfer)
                {
                    if (transaction.BankAccountId != transaction.DestinationBankAccountId)
                    {
                        realizedBalance += transaction.Value;
                    }
                }
                else
                {
                    realizedBalance += transaction.Value;
                }
            }

            return realizedBalance;
        }
    }
}

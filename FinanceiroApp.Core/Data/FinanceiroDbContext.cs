using Microsoft.EntityFrameworkCore;
using FinanceiroApp.Core.Entities;
using Microsoft.Extensions.Configuration;

namespace FinanceiroApp.Core.Data
{
    public class FinanceiroDbContext : DbContext
    {
        // Definição das DbSets para cada entidade
        public DbSet<Bank> Banks { get; set; }
        public DbSet<BankAccount> BankAccounts { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<DescriptionMapping> DescriptionMappings { get; set; }
        public DbSet<FinancialGoal> FinancialGoals { get; set; }
        public DbSet<ScheduledTransaction> ScheduledTransactions { get; set; }
        public DbSet<Transaction> Transactions { get; set; }

        public FinanceiroDbContext(DbContextOptions<FinanceiroDbContext> options) : base(options) { }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Configuração do relacionamento entre Bank e BankAccount
            modelBuilder.Entity<Bank>()
                .HasMany(b => b.BankAccounts)
                .WithOne(ba => ba.Bank)
                .HasForeignKey(ba => ba.BankId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuração do relacionamento principal entre BankAccount e Transaction (Origem)
            modelBuilder.Entity<BankAccount>()
                .HasMany(ba => ba.Transactions)
                .WithOne(t => t.BankAccount)
                .HasForeignKey(t => t.BankAccountId)
                .OnDelete(DeleteBehavior.Restrict); // Evita exclusão em cascata

            // Configuração do relacionamento de destino entre BankAccount e Transaction (Destino)
            modelBuilder.Entity<BankAccount>()
                .HasMany(ba => ba.DestinationTransactions)
                .WithOne(t => t.DestinationBankAccount)
                .HasForeignKey(t => t.DestinationBankAccountId)
                .OnDelete(DeleteBehavior.Restrict); // Evita exclusão em cascata

            // Configuração do relacionamento entre Category e Transaction
            modelBuilder.Entity<Category>()
                .HasMany(c => c.Transactions)
                .WithOne(t => t.Category)
                .HasForeignKey(t => t.CategoryId)
                .OnDelete(DeleteBehavior.SetNull); // Define nulo ao deletar a categoria

            // Configuração do relacionamento entre Category e DescriptionMapping
            modelBuilder.Entity<Category>()
                .HasMany(c => c.DescriptionMappings)
                .WithOne(dm => dm.Category)
                .HasForeignKey(dm => dm.CategoryId)
                .OnDelete(DeleteBehavior.Cascade);

            // Configuração do relacionamento auto-referenciado em Transaction (ParentTransaction)
            modelBuilder.Entity<Transaction>()
                .HasOne(t => t.ParentTransaction)
                .WithMany()
                .HasForeignKey(t => t.ParentTransactionId)
                .OnDelete(DeleteBehavior.Restrict); // Evita exclusão em cascata

            // Configuração do relacionamento entre ScheduledTransaction e Category
            modelBuilder.Entity<ScheduledTransaction>()
                .HasOne(st => st.Category)
                .WithMany()
                .HasForeignKey(st => st.CategoryId)
                .OnDelete(DeleteBehavior.SetNull); // Define nulo ao deletar a categoria

            // Configuração do relacionamento entre ScheduledTransaction e BankAccount
            modelBuilder.Entity<ScheduledTransaction>()
                .HasOne(st => st.BankAccount)
                .WithMany()
                .HasForeignKey(st => st.BankAccountId)
                .OnDelete(DeleteBehavior.Restrict); // Evita exclusão em cascata

            // Configurações adicionais de relacionamento podem ser feitas aqui conforme necessário

            base.OnModelCreating(modelBuilder);
        }
    }
}

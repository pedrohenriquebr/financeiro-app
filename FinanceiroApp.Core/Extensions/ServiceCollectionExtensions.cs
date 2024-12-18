using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using FinanceiroApp.Core.Data;
using FinanceiroApp.Core.Services;
using FinanceiroApp.Core.Entities;
using System;
using System.IO;

namespace FinanceiroApp.Core.Extensions
{
    public static class ServiceCollectionExtensions
    {
        public static IServiceCollection AddFinanceiroServices(this IServiceCollection services, IConfiguration configuration)
        {
            // Configure SQLite
            var dbPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "FinanceiroApp",
                "financeiro.db"
            );

            // Ensure directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(dbPath));

            // Add DbContext
            services.AddDbContext<FinanceiroDbContext>(options =>
                options.UseSqlite($"Data Source={dbPath}")
                       .EnableSensitiveDataLogging()
            );

            // services.AddScoped<GoogleDriveDataStore>();
            // services.AddScoped<DatabaseBackupService>();
            // services.AddScoped<GoogleDriveConfigService>();
            // Register database initialization service
            services.AddScoped<DatabaseInitializationService>();

            // Register generic data store
            services.AddScoped(typeof(IDataStore<>), typeof(SQLiteDataStore<>));

            // Register specific data stores for each entity
            services.AddScoped<IDataStore<Transaction>, SQLiteDataStore<Transaction>>();
            services.AddScoped<IDataStore<Category>, SQLiteDataStore<Category>>();
            services.AddScoped<IDataStore<BankAccount>, SQLiteDataStore<BankAccount>>();
            services.AddScoped<IDataStore<Bank>, SQLiteDataStore<Bank>>();
            services.AddScoped<IDataStore<DescriptionMapping>, SQLiteDataStore<DescriptionMapping>>();
            services.AddScoped<IDataStore<FinancialGoal>, SQLiteDataStore<FinancialGoal>>();
            services.AddScoped<IDataStore<ScheduledTransaction>, SQLiteDataStore<ScheduledTransaction>>();

            // Register business services
            services.AddScoped<ITransactionService, TransactionService>();
            services.AddScoped<ICategoryService, CategoryService>();
            services.AddScoped<IBankAccountService, BankAccountService>();
            services.AddScoped<IBankService, BankService>();
            services.AddScoped<IFinancialGoalService, FinancialGoalService>();
            services.AddScoped<IScheduledTransactionService, ScheduledTransactionService>();
            services.AddScoped<IDescriptionMappingService, DescriptionMappingService>();
            
            return services;
        }

        public static async Task InitializeDatabaseAsync(this IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var initService = scope.ServiceProvider.GetRequiredService<DatabaseInitializationService>();
            await initService.InitializeDatabaseAsync();
        }
    }
}

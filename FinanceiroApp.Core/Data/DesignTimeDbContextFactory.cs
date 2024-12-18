// FinanceiroApp.Core\Data\DesignTimeDbContextFactory.cs

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace FinanceiroApp.Core.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<FinanceiroDbContext>
    {
        public FinanceiroDbContext CreateDbContext(string[] args)
        {

            var appDataPath = System.IO.Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData), "FinanceiroApp");
            var optionsBuilder = new DbContextOptionsBuilder<FinanceiroDbContext>();
            optionsBuilder.UseSqlite($"Data Source={System.IO.Path.Combine(appDataPath, "financeiro.db")}");

            return new FinanceiroDbContext(optionsBuilder.Options);
        }
    }
}

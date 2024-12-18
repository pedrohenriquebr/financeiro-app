using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using FinanceiroApp.Core.Data;
using FinanceiroApp.Core.Entities;
using System.Collections.Generic;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace FinanceiroApp.Core.Services
{
    public class DatabaseInitializationService
    {
        private readonly FinanceiroDbContext _context;
        private readonly ILogger<DatabaseInitializationService> _logger;
        private  DatabaseBackupService? _backupService;
        private readonly IConfiguration _configuration;
        private  GoogleDriveConfigService?_googleDriveConfigService ;

        public DatabaseInitializationService(
            FinanceiroDbContext context,
            IConfiguration configuration,
            ILogger<DatabaseInitializationService> logger)
        {
            _context = context;
            _configuration = configuration;
            _logger = logger;
        }

        public DatabaseInitializationService WithGoogleDriveConfigService(GoogleDriveConfigService googleDriveConfigService)
        {
            _googleDriveConfigService = googleDriveConfigService;
            return this;
        }

        public DatabaseInitializationService WithBackupService(DatabaseBackupService backupService)
        {
            _backupService = backupService;
            return this;
        }

        public async Task InitializeDatabaseAsync()
        {
            try
            {
                _logger.LogInformation("Iniciando verificação do banco de dados...");

                // Verifica integridade do banco
                await VerifyDatabaseIntegrityAsync();

                // Aplica as migrações pendentes
                await _context.Database.MigrateAsync();

                // Verifica se é necessário restaurar backup
                await CheckAndRestoreBackupIfNeededAsync();

                // Verifica se é necessário criar dados iniciais
                await SeedInitialDataIfNeededAsync();

                // Realiza backup automático após inicialização
                await CreateAutomaticBackupAsync();

                _logger.LogInformation("Banco de dados inicializado com sucesso!");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao inicializar o banco de dados");
                throw;
            }
        }

        private async Task VerifyDatabaseIntegrityAsync()
        {
            _logger.LogInformation("Verificando integridade do banco de dados...");

            try
            {
                // Verifica se o arquivo existe
                var dbPath = Path.Combine(
                    Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                    "FinanceiroApp",
                    "financeiro.db");

                if (File.Exists(dbPath))
                {
                    // Tenta executar um comando simples para verificar se o banco está funcional
                    await _context.Database.ExecuteSqlRawAsync("PRAGMA integrity_check;");
                    
                    // Verifica o tamanho do arquivo
                    var fileInfo = new FileInfo(dbPath);
                    if (fileInfo.Length == 0)
                    {
                        throw new Exception("Arquivo do banco de dados está vazio");
                    }
                }

                _logger.LogInformation("Verificação de integridade concluída com sucesso");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro na verificação de integridade do banco de dados");
                throw;
            }
        }

        private async Task CheckAndRestoreBackupIfNeededAsync()
        {
            if (!_configuration.GetValue<bool>("UseGoogleDriveDataStore"))
                return;

            // Verifica se o usuário está autenticado no Google Drive
            if (_googleDriveConfigService != null && !_googleDriveConfigService.IsAuthenticated())
            {
                _logger.LogInformation("Usuário não está autenticado no Google Drive. Pulando verificação de backup.");
                return;
            }

            // Verifica se é o primeiro uso (banco não existe)
            var dbPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "FinanceiroApp",
                "financeiro.db");

            if (!File.Exists(dbPath))
            {
                _logger.LogInformation("Primeiro uso detectado. Pulando verificação de backup.");
                return;
            }

            if(_googleDriveConfigService == null)
            {
                _logger.LogInformation("Google Drive config service nulo. Pulando verificação de backup.");
                return;
            }

            if (_backupService == null)
            {
                _logger.LogInformation("Backup service nulo. Pulando verificação de backup.");
                return;
            }
            
            try
            {
                var lastBackupDate = _googleDriveConfigService?.GetLastBackupDate();
                if (lastBackupDate.HasValue)
                {
                    var dbFileInfo = new FileInfo(dbPath);
                    
                    // Se o banco local não existe ou é mais antigo que o backup
                    if (!dbFileInfo.Exists || (dbFileInfo.LastWriteTimeUtc < lastBackupDate.Value))
                    {
                        _logger.LogInformation("Backup mais recente encontrado. Iniciando restauração...");
                        await _backupService?.RestoreFromGoogleDriveAsync();
                        _logger.LogInformation("Restauração concluída com sucesso");
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao verificar/restaurar backup");
                // Não lança exceção para permitir que a aplicação continue
            }
        }

        private async Task SeedInitialDataIfNeededAsync()
        {
            if (!await _context.Categories.AnyAsync())
            {
                await SeedDefaultCategoriesAsync();
            }

            if (!await _context.Banks.AnyAsync())
            {
                await SeedDefaultBanksAsync();
            }
        }

        private async Task CreateAutomaticBackupAsync()
        {
            if (!_configuration.GetValue<bool>("UseGoogleDriveDataStore"))
                return;

            // Verifica se o usuário está autenticado no Google Drive
            if (_googleDriveConfigService != null && !_googleDriveConfigService.IsAuthenticated())
            {
                _logger.LogInformation("Usuário não está autenticado no Google Drive. Pulando backup automático.");
                return;
            }

            if(_googleDriveConfigService == null)
            {
                _logger.LogInformation("Google Drive config service nulo. Pulando backup automático.");
                return;
            }

            if (_backupService == null)
            {
                _logger.LogInformation("Backup service nulo. Pulando backup automático.");
                return;
            }

            try
            {
                _logger.LogInformation("Criando backup automático...");
                await _backupService.BackupToGoogleDriveAsync();
                if (_googleDriveConfigService != null)
                    await _googleDriveConfigService.UpdateLastBackupDateAsync(DateTime.UtcNow);
                _logger.LogInformation("Backup automático criado com sucesso");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao criar backup automático");
                // Não lança exceção para permitir que a aplicação continue
            }
        }

        private async Task SeedDefaultCategoriesAsync()
        {
            _logger.LogInformation("Criando categorias padrão...");

            var defaultCategories = new List<Category>
            {
                new Category { Name = "Alimentação", Type = CategoryType.Expense },
                new Category { Name = "Transporte", Type = CategoryType.Expense },
                new Category { Name = "Moradia", Type = CategoryType.Expense },
                new Category { Name = "Saúde", Type = CategoryType.Expense },
                new Category { Name = "Educação", Type = CategoryType.Expense },
                new Category { Name = "Lazer", Type = CategoryType.Expense },
                new Category { Name = "Salário", Type = CategoryType.Income },
                new Category { Name = "Investimentos", Type = CategoryType.Income },
                new Category { Name = "Outros", Type = CategoryType.Income },
            };

            await _context.Categories.AddRangeAsync(defaultCategories);
            await _context.SaveChangesAsync();
        }

        private async Task SeedDefaultBanksAsync()
        {
            _logger.LogInformation("Criando bancos padrão...");

            var defaultBanks = new List<Bank>
            {
                new Bank { Name = "Banco do Brasil", Code = "001" },
                new Bank { Name = "Caixa Econômica Federal", Code = "104" },
                new Bank { Name = "Bradesco", Code = "237" },
                new Bank { Name = "Itaú", Code = "341" },
                new Bank { Name = "Santander", Code = "033" },
                new Bank { Name = "Nubank", Code = "260" },
                new Bank { Name = "Inter", Code = "077" },
                new Bank { Name = "C6 Bank", Code = "336" },
                new Bank { Name = "PicPay", Code = "380" },
                new Bank { Name = "Carteira", Code = "000" }  // Para dinheiro em espécie
            };

            await _context.Banks.AddRangeAsync(defaultBanks);
            await _context.SaveChangesAsync();
        }
    }
}

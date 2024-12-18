using System;
using System.IO;
using System.Text.Json;
using System.Threading.Tasks;
using FinanceiroApp.Core.Models;
using Microsoft.Extensions.Logging;

namespace FinanceiroApp.Core.Services
{
    public class GoogleDriveConfigService
    {
        private readonly ILogger<GoogleDriveConfigService> _logger;
        private readonly string _configPath;
        private GoogleDriveConfig _currentConfig;

        public GoogleDriveConfigService(ILogger<GoogleDriveConfigService> logger)
        {
            _logger = logger;
            _configPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "FinanceiroApp",
                "google_drive_config.json");
            
            // Ensure directory exists
            Directory.CreateDirectory(Path.GetDirectoryName(_configPath));
            LoadConfig();
        }

        private void LoadConfig()
        {
            try
            {
                if (File.Exists(_configPath))
                {
                    var json = File.ReadAllText(_configPath);
                    _currentConfig = JsonSerializer.Deserialize<GoogleDriveConfig>(json);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao carregar configuração do Google Drive");
            }

            _currentConfig ??= new GoogleDriveConfig();
        }

        private async Task SaveConfigAsync()
        {
            try
            {
                var json = JsonSerializer.Serialize(_currentConfig, new JsonSerializerOptions { WriteIndented = true });
                await File.WriteAllTextAsync(_configPath, json);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Erro ao salvar configuração do Google Drive");
            }
        }

        public bool IsAuthenticated() => _currentConfig.IsAuthenticated;

        public async Task SetAuthenticatedAsync(string userEmail)
        {
            _currentConfig.IsAuthenticated = true;
            _currentConfig.UserEmail = userEmail;
            await SaveConfigAsync();
        }

        public async Task SetUnauthenticatedAsync()
        {
            _currentConfig.IsAuthenticated = false;
            _currentConfig.UserEmail = null;
            await SaveConfigAsync();
        }

        public async Task UpdateLastBackupDateAsync(DateTime date)
        {
            _currentConfig.LastBackupDate = date;
            await SaveConfigAsync();
        }

        public DateTime? GetLastBackupDate() => _currentConfig.LastBackupDate;
    }
}

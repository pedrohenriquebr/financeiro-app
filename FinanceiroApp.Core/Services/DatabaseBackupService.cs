using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Data.Sqlite;

namespace FinanceiroApp.Core.Services
{
    public class DatabaseBackupService
    {
        private readonly string _dbPath;
        private readonly GoogleDriveDataStore _googleDriveStore;
        private readonly IConfiguration _configuration;
        private const string BackupFileName = "financeiro.db";
        private const string BackupMetaFileName = "backup_meta.json";

        public DatabaseBackupService(IConfiguration configuration, GoogleDriveDataStore googleDriveStore)
        {
            _configuration = configuration;
            _googleDriveStore = googleDriveStore;
            _dbPath = Path.Combine(
                Environment.GetFolderPath(Environment.SpecialFolder.ApplicationData),
                "FinanceiroApp",
                BackupFileName
            );
        }

        public async Task BackupToGoogleDriveAsync()
        {
            try
            {
                // Ensure database is not being written to
                using (var connection = new SqliteConnection($"Data Source={_dbPath}"))
                {
                    await connection.OpenAsync();
                    using (var command = connection.CreateCommand())
                    {
                        command.CommandText = "PRAGMA wal_checkpoint(FULL);";
                        await command.ExecuteNonQueryAsync();
                    }
                }

                // Read the database file
                byte[] dbBytes = await File.ReadAllBytesAsync(_dbPath);

                // Create backup metadata
                var backupMeta = new
                {
                    LastBackupDate = DateTime.UtcNow,
                    DatabaseVersion = "1.0",
                    BackupSize = dbBytes.Length
                };

                // Upload database file to Google Drive
                await _googleDriveStore.SaveFileAsync(BackupFileName, dbBytes);

                // Save backup metadata
                string metaJson = System.Text.Json.JsonSerializer.Serialize(backupMeta);
                await _googleDriveStore.SaveFileAsync(BackupMetaFileName, 
                    System.Text.Encoding.UTF8.GetBytes(metaJson));
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to backup database: {ex.Message}", ex);
            }
        }

        public async Task RestoreFromGoogleDriveAsync()
        {
            try
            {
                // Download database file from Google Drive
                var dbBytes = await _googleDriveStore.GetFileContentAsync(BackupFileName);
                
                if (dbBytes == null || dbBytes.Length == 0)
                    throw new Exception("No backup found on Google Drive");

                // Create backup of current database before restore
                if (File.Exists(_dbPath))
                {
                    string backupPath = _dbPath + ".backup";
                    File.Copy(_dbPath, backupPath, true);
                }

                // Ensure directory exists
                Directory.CreateDirectory(Path.GetDirectoryName(_dbPath));

                // Write the new database file
                await File.WriteAllBytesAsync(_dbPath, dbBytes);
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed to restore database: {ex.Message}", ex);
            }
        }

        public async Task<DateTime?> GetLastBackupDateAsync()
        {
            try
            {
                var metaBytes = await _googleDriveStore.GetFileContentAsync(BackupMetaFileName);
                if (metaBytes == null || metaBytes.Length == 0)
                    return null;

                var metaJson = System.Text.Encoding.UTF8.GetString(metaBytes);
                var meta = System.Text.Json.JsonSerializer.Deserialize<dynamic>(metaJson);
                return meta.GetProperty("LastBackupDate").GetDateTime();
            }
            catch
            {
                return null;
            }
        }
    }
}

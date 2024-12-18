using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using FinanceiroApp.Core.Services;

namespace Financeiro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BackupController : ControllerBase
    {
        private readonly DatabaseBackupService _backupService;

        public BackupController(DatabaseBackupService backupService)
        {
            _backupService = backupService;
        }

        [HttpPost("backup")]
        public async Task<IActionResult> CreateBackup()
        {
            try
            {
                await _backupService.BackupToGoogleDriveAsync();
                return Ok(new { message = "Backup created successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("restore")]
        public async Task<IActionResult> RestoreBackup()
        {
            try
            {
                await _backupService.RestoreFromGoogleDriveAsync();
                return Ok(new { message = "Database restored successfully" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("last-backup")]
        public async Task<IActionResult> GetLastBackupDate()
        {
            try
            {
                var lastBackup = await _backupService.GetLastBackupDateAsync();
                return Ok(new { lastBackupDate = lastBackup });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }
    }
}

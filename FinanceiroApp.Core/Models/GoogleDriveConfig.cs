using System;

namespace FinanceiroApp.Core.Models
{
    public class GoogleDriveConfig
    {
        public bool IsAuthenticated { get; set; }
        public string UserEmail { get; set; }
        public DateTime? LastBackupDate { get; set; }
    }
}

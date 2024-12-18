using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Google.Apis.Auth.OAuth2;
using Google.Apis.Drive.v3;
using Google.Apis.Services;
using Microsoft.Extensions.Configuration;

namespace FinanceiroApp.Core.Services
{
    public class GoogleDriveDataStore
    {
        private readonly DriveService _driveService;
        private readonly string _folderId;
        private readonly IConfiguration _configuration;

        public GoogleDriveDataStore(IConfiguration configuration)
        {
            _configuration = configuration;
            
            var credential = GoogleCredential.FromFile("credentials.json")
                .CreateScoped(DriveService.ScopeConstants.DriveFile);

            _driveService = new DriveService(new BaseClientService.Initializer
            {
                HttpClientInitializer = credential
            });

            _folderId = GetOrCreateAppFolder();
        }

        private string GetOrCreateAppFolder()
        {
            var folderName = "FinanceiroAppData";
            var listRequest = _driveService.Files.List();
            listRequest.Q = $"name = '{folderName}' and mimeType = 'application/vnd.google-apps.folder'";
            var files = listRequest.Execute().Files;

            if (files != null && files.Any())
                return files.First().Id;

            var folderMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = folderName,
                MimeType = "application/vnd.google-apps.folder",
                Parents = new List<string> { "root" },
                ViewersCanCopyContent = true
            };

            var request = _driveService.Files.Create(folderMetadata);
            request.Fields = "id";
            var folder = request.Execute();
            return folder.Id;
        }

        public async Task SaveFileAsync(string fileName, byte[] content)
        {
            var fileMetadata = new Google.Apis.Drive.v3.Data.File()
            {
                Name = fileName,
                Parents = new List<string> { _folderId }
            };

            using var stream = new MemoryStream(content);
            var request = _driveService.Files.Create(fileMetadata, stream, "application/octet-stream");
            request.Fields = "id";
            await request.UploadAsync();
        }

        public async Task<byte[]> GetFileContentAsync(string fileName)
        {
            var listRequest = _driveService.Files.List();
            listRequest.Q = $"name = '{fileName}' and '{_folderId}' in parents";
            var files = (await listRequest.ExecuteAsync()).Files;

            if (files == null || !files.Any())
                return null;

            var fileId = files.First().Id;
            var request = _driveService.Files.Get(fileId);
            
            using var stream = new MemoryStream();
            await request.DownloadAsync(stream);
            return stream.ToArray();
        }

        public async Task DeleteFileAsync(string fileName)
        {
            var listRequest = _driveService.Files.List();
            listRequest.Q = $"name = '{fileName}' and '{_folderId}' in parents";
            var files = (await listRequest.ExecuteAsync()).Files;

            if (files != null && files.Any())
            {
                foreach (var file in files)
                {
                    await _driveService.Files.Delete(file.Id).ExecuteAsync();
                }
            }
        }
    }
}

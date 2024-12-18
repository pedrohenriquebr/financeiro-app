using Microsoft.AspNetCore.Mvc;
using FinanceiroApp.Core.Services;
using FinanceiroApp.Core.Entities;
using Financeiro.API.Models;

namespace Financeiro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DriveInfoController : ControllerBase
    {
        private readonly IDataStore<Transaction> _transactionStore;
        private readonly IDataStore<Category> _categoryStore;
        private readonly IDataStore<BankAccount> _bankAccountStore;
        private readonly GoogleDriveDataStore _driveDataStore;
        private readonly GoogleDriveConfigService _googleDriveConfigService;

        public DriveInfoController(
            IDataStore<Transaction> transactionStore,
            IDataStore<Category> categoryStore,
            IDataStore<BankAccount> bankAccountStore,
            GoogleDriveDataStore driveDataStore,
            GoogleDriveConfigService googleDriveConfigService)
        {
            _transactionStore = transactionStore;
            _categoryStore = categoryStore;
            _bankAccountStore = bankAccountStore;
            _driveDataStore = driveDataStore;
            _googleDriveConfigService = googleDriveConfigService;
        }

        [HttpGet]
        public IActionResult GetDriveInfo()
        {
            var result = new Dictionary<string, object>();
            return Ok(result);
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] GoogleAuthRequest request)
        {
            await _googleDriveConfigService.SetAuthenticatedAsync(request.UserEmail);
            return Ok(new { message = "Autenticação salva com sucesso" });
        }

        [HttpPost("logout")]
        public async Task<IActionResult> Logout()
        {
            await _googleDriveConfigService.SetUnauthenticatedAsync();
            return Ok(new { message = "Logout realizado com sucesso" });
        }
    }
}

using Microsoft.AspNetCore.Mvc;
using Financeiro.API.DTOs;
using Financeiro.API.DTOs.BankAccount;
using FinanceiroApp.Core.Services;
using FinanceiroApp.Core.Entities;

namespace Financeiro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BankAccountsController : ControllerBase
    {
        private readonly IBankAccountService _bankAccountService;
        private readonly ITransactionService _transactionService;

        public BankAccountsController(
            IBankAccountService bankAccountService,
            ITransactionService transactionService)
        {
            _bankAccountService = bankAccountService;
            _transactionService = transactionService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<BankAccountResponse>> GetAll()
        {
            var accounts = _bankAccountService.GetAllBankAccounts();
            var response = accounts.Select(a => new BankAccountResponse
            {
                Id = a.Id,
                Name = a.Name,
                BankId = a.BankId,
                BankName = a.Bank?.Name,
                AccountNumber = a.Number,
                Agency = a.Agency,
                Balance = a.Balance
            });
            return Ok(response);
        }

        [HttpGet("{id}")]
        public ActionResult<BankAccountResponse> GetById(int id)
        {
            var account = _bankAccountService.GetBankAccountById(id);
            if (account == null)
                return NotFound();

            var response = new BankAccountResponse
            {
                Id = account.Id,
                Name = account.Name,
                BankId = account.BankId,
                BankName = account.Bank?.Name,
                AccountNumber = account.Number,
                Agency = account.Agency,
                Balance = account.Balance
            };
            return Ok(response);
        }

        [HttpPost]
        public ActionResult<BankAccountResponse> Create([FromBody] CreateBankAccountRequest request)
        {
            var bankAccount = new BankAccount
            {
                Name = request.Name,
                BankId = request.BankId,
                Number = request.AccountNumber,
                Agency = request.Agency,
                Balance = request.Balance
            };

            _bankAccountService.AddBankAccount(bankAccount);

            var response = new BankAccountResponse
            {
                Id = bankAccount.Id,
                Name = bankAccount.Name,
                BankId = bankAccount.BankId,
                BankName = bankAccount.Bank?.Name,
                AccountNumber = bankAccount.Number,
                Agency = bankAccount.Agency,
                Balance = bankAccount.Balance
            };

            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }

        [HttpPut("{id}")]
        public ActionResult<BankAccountResponse> Update(int id, [FromBody] UpdateBankAccountRequest request)
        {
            var existingAccount = _bankAccountService.GetBankAccountById(id);
            if (existingAccount == null)
                return NotFound();

            existingAccount.Name = request.Name;
            existingAccount.BankId = request.BankId;
            existingAccount.Number = request.AccountNumber;
            existingAccount.Agency = request.Agency;
            existingAccount.Balance = request.Balance;

            _bankAccountService.UpdateBankAccount(existingAccount);

            var response = new BankAccountResponse
            {
                Id = existingAccount.Id,
                Name = existingAccount.Name,
                BankId = existingAccount.BankId,
                BankName = existingAccount.Bank?.Name,
                AccountNumber = existingAccount.Number,
                Agency = existingAccount.Agency,
                Balance = existingAccount.Balance
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var account = _bankAccountService.GetBankAccountById(id);
            if (account == null)
                return NotFound();

            _bankAccountService.DeleteBankAccount(id);
            return NoContent();
        }

        [HttpGet("{id}/balance")]
        public ActionResult<decimal> GetBalance(int id)
        {
            var account = _bankAccountService.GetBankAccountById(id);
            if (account == null)
                return NotFound();

            var balance = _transactionService.GetBalanceForAccount(id);
            return Ok(balance);
        }

        [HttpGet("{id}/transactions")]
        public ActionResult<IEnumerable<TransactionDto>> GetTransactions(int id)
        {
            var account = _bankAccountService.GetBankAccountById(id);
            if (account == null)
                return NotFound();

            var transactions = _transactionService.GetTransactionsByAccount(id);
            var transactionDtos = transactions.Select(t => new TransactionDto
            {
                Id = t.Id,
                Description = t.Description,
                Amount = t.Value,
                Date = t.TransactionDateTime,
                ImportedDate = t.ImportDateTime,
                CategoryId = t.CategoryId,
                CategoryName = t.CategoryName,
                BankAccountId = t.BankAccountId,
                BankAccountName = t.BankAccountName
            });

            return Ok(transactionDtos);
        }
    }
}

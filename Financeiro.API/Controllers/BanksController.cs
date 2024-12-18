using Microsoft.AspNetCore.Mvc;
using FinanceiroApp.Core.Services;
using FinanceiroApp.Core.Entities;
using Financeiro.API.DTOs;

namespace Financeiro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BanksController : ControllerBase
    {
        private readonly IBankService _bankService;

        public BanksController(IBankService bankService)
        {
            _bankService = bankService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<BankDTO>> GetAll()
        {
            var banks = _bankService.GetAllBanks();
            var bankDtos = banks.Select(b => new BankDTO
            {
                Id = b.Id,
                Name = b.Name,
                Code = b.Code
            });
            return Ok(bankDtos);
        }

        [HttpGet("{id}")]
        public ActionResult<BankDTO> GetById(int id)
        {
            var bank = _bankService.GetBankById(id);
            if (bank == null)
                return NotFound();

            var bankDto = new BankDTO
            {
                Id = bank.Id,
                Name = bank.Name,
                Code = bank.Code
            };
            return Ok(bankDto);
        }

        [HttpPost]
        public ActionResult<BankDTO> Create([FromBody] CreateBankDTO createDto)
        {
            var bank = new Bank
            {
                Name = createDto.Name,
                Code = createDto.Code
            };

            _bankService.AddBank(bank);

            var bankDto = new BankDTO
            {
                Id = bank.Id,
                Name = bank.Name,
                Code = bank.Code
            };
            return CreatedAtAction(nameof(GetById), new { id = bankDto.Id }, bankDto);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UpdateBankDTO updateDto)
        {
            var existingBank = _bankService.GetBankById(id);
            if (existingBank == null)
                return NotFound();

            existingBank.Name = updateDto.Name;
            existingBank.Code = updateDto.Code;

            _bankService.UpdateBank(existingBank);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var bank = _bankService.GetBankById(id);
            if (bank == null)
                return NotFound();

            _bankService.DeleteBank(id);
            return NoContent();
        }
    }
}

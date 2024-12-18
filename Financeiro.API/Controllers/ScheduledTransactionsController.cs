using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FinanceiroApp.Core.Services;
using FinanceiroApp.Core.Entities;
using Financeiro.API.DTOs;
using System.Linq;

namespace Financeiro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ScheduledTransactionsController : ControllerBase
    {
        private readonly IScheduledTransactionService _scheduledTransactionService;

        public ScheduledTransactionsController(IScheduledTransactionService scheduledTransactionService)
        {
            _scheduledTransactionService = scheduledTransactionService;
        }

        private ScheduledTransactionDto MapToDto(ScheduledTransaction transaction)
        {
            return new ScheduledTransactionDto
            {
                Id = transaction.Id,
                Description = transaction.Description,
                Amount = transaction.Amount,
                NextDueDate = transaction.NextDueDate,
                IsRecurring = transaction.IsRecurring,
                RecurrenceType = transaction.RecurrenceType,
                RecurrenceFrequency = transaction.RecurrenceFrequency,
                RecurrenceEndDate = transaction.RecurrenceEndDate,
                CategoryId = transaction.CategoryId,
                CategoryName = transaction.Category?.Name,
                BankAccountId = transaction.BankAccountId,
                BankAccountName = transaction.BankAccount?.Name,
                IsProcessed = transaction.IsProcessed,
                LastProcessedDate = transaction.LastProcessedDate
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ScheduledTransactionDto>>> GetScheduledTransactions()
        {
            var transactions = await _scheduledTransactionService.GetScheduledTransactionsAsync();
            return Ok(transactions.Select(MapToDto));
        }

        [HttpGet("upcoming")]
        public async Task<ActionResult<IEnumerable<ScheduledTransactionDto>>> GetUpcomingTransactions(
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            var transactions = await _scheduledTransactionService.GetUpcomingTransactionsAsync( startDate, endDate);
            return Ok(transactions.Select(MapToDto));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ScheduledTransactionDto>> GetScheduledTransaction(int id)
        {
            var transaction = await _scheduledTransactionService.GetScheduledTransactionAsync( id);

            if (transaction == null)
                return NotFound();

            return MapToDto(transaction);
        }

        [HttpPost]
        public async Task<ActionResult<ScheduledTransactionDto>> CreateScheduledTransaction(CreateScheduledTransactionDto dto)
        {
            var transaction = new ScheduledTransaction
            {
                Description = dto.Description,
                Amount = dto.Amount,
                NextDueDate = dto.NextDueDate,
                IsRecurring = dto.IsRecurring,
                RecurrenceType = dto.RecurrenceType,
                RecurrenceFrequency = dto.RecurrenceFrequency,
                RecurrenceEndDate = dto.RecurrenceEndDate,
                CategoryId = dto.CategoryId,
                BankAccountId = dto.BankAccountId
            };

            var createdTransaction = await _scheduledTransactionService.CreateScheduledTransactionAsync(transaction);
            return CreatedAtAction(
                nameof(GetScheduledTransaction),
                new { id = createdTransaction.Id },
                MapToDto(createdTransaction));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<ScheduledTransactionDto>> UpdateScheduledTransaction(
            int id,
            UpdateScheduledTransactionDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var transaction = new ScheduledTransaction
            {
                Id = dto.Id,
                Description = dto.Description,
                Amount = dto.Amount,
                NextDueDate = dto.NextDueDate,
                IsRecurring = dto.IsRecurring,
                RecurrenceType = dto.RecurrenceType,
                RecurrenceFrequency = dto.RecurrenceFrequency,
                RecurrenceEndDate = dto.RecurrenceEndDate,
                CategoryId = dto.CategoryId,
                BankAccountId = dto.BankAccountId
            };

            try
            {
                var updatedTransaction = await _scheduledTransactionService.UpdateScheduledTransactionAsync(transaction);
                return MapToDto(updatedTransaction);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScheduledTransaction(int id)
        {
            try
            {
                await _scheduledTransactionService.DeleteScheduledTransactionAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPost("process")]
        public async Task<IActionResult> ProcessScheduledTransactions()
        {
            await _scheduledTransactionService.ProcessScheduledTransactionsAsync();
            return Ok();
        }
    }
}

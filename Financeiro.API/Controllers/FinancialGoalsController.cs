using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using FinanceiroApp.Core.Services;
using FinanceiroApp.Core.Entities;
using Financeiro.API.DTOs;

namespace Financeiro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class FinancialGoalsController : ControllerBase
    {
        private readonly IFinancialGoalService _goalService;

        public FinancialGoalsController(IFinancialGoalService goalService)
        {
            _goalService = goalService;
        }

        private FinancialGoalDto MapToDto(FinancialGoal goal)
        {
            return new FinancialGoalDto
            {
                Id = goal.Id,
                Name = goal.Name,
                TargetAmount = goal.TargetAmount,
                CurrentAmount = goal.CurrentAmount,
                TargetDate = goal.TargetDate,
                PercentageComplete = goal.PercentageComplete,
                MonthlyRequired = goal.MonthlyRequired
            };
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<FinancialGoalDto>>> GetGoals()
        {
            var goals = await _goalService.GetGoalsAsync();
            return Ok(goals.Select(MapToDto));
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<FinancialGoalDto>> GetGoal(int id)
        {
            var goal = await _goalService.GetGoalAsync(id);

            if (goal == null)
                return NotFound();

            return MapToDto(goal);
        }

        [HttpPost]
        public async Task<ActionResult<FinancialGoalDto>> CreateGoal(CreateFinancialGoalDto dto)
        {
            var goal = new FinancialGoal
            {
                Name = dto.Name,
                TargetAmount = dto.TargetAmount,
                CurrentAmount = dto.CurrentAmount,
                TargetDate = dto.TargetDate
            };

            var createdGoal = await _goalService.CreateGoalAsync( goal);
            return CreatedAtAction(nameof(GetGoal), new { id = createdGoal.Id }, MapToDto(createdGoal));
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<FinancialGoalDto>> UpdateGoal(int id, UpdateFinancialGoalDto dto)
        {
            if (id != dto.Id)
                return BadRequest();

            var goal = new FinancialGoal
            {
                Id = dto.Id,
                Name = dto.Name,
                TargetAmount = dto.TargetAmount,
                CurrentAmount = dto.CurrentAmount,
                TargetDate = dto.TargetDate
            };

            try
            {
                var updatedGoal = await _goalService.UpdateGoalAsync(goal);
                return MapToDto(updatedGoal);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteGoal(int id)
        {
            try
            {
                await _goalService.DeleteGoalAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpPatch("{id}/progress")]
        public async Task<ActionResult<FinancialGoalDto>> UpdateProgress(int id, [FromBody] decimal newAmount)
        {
            try
            {
                var updatedGoal = await _goalService.UpdateGoalProgressAsync(id, newAmount);
                return MapToDto(updatedGoal);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }
    }
}

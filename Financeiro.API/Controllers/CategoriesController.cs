using Microsoft.AspNetCore.Mvc;
using FinanceiroApp.Core.Services;
using FinanceiroApp.Core.Entities;
using Financeiro.API.DTOs.Category;

namespace Financeiro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;

        public CategoriesController(ICategoryService categoryService)
        {
            _categoryService = categoryService;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<CategoryResponse>>> GetAll()
        {
            var categories = await _categoryService.GetAllAsync();
            var response = categories.Select(c => new CategoryResponse
            {
                Id = c.Id,
                Name = c.Name,
                Type = c.Type,
                Nature = c.Nature,
                PlannedAmount = c.PlannedAmount
            });
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<CategoryResponse>> GetById(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category == null)
                return NotFound();

            var response = new CategoryResponse
            {
                Id = category.Id,
                Name = category.Name,
                Type = category.Type,
                Nature = category.Nature,
                PlannedAmount = category.PlannedAmount
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<CategoryResponse>> Create([FromBody] CreateCategoryRequest request)
        {
            var category = new Category
            {
                Name = request.Name,
                Type = request.Type,
                Nature = request.Nature,
                PlannedAmount = request.PlannedAmount,
                CreatedAt = DateTime.UtcNow
            };

            var createdCategory = await _categoryService.CreateAsync(category);

            var response = new CategoryResponse
            {
                Id = createdCategory.Id,
                Name = createdCategory.Name,
                Type = createdCategory.Type,
                Nature = createdCategory.Nature,
                PlannedAmount = createdCategory.PlannedAmount
            };

            return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<CategoryResponse>> Update(int id, [FromBody] UpdateCategoryRequest request)
        {
            var existingCategory = await _categoryService.GetByIdAsync(id);
            if (existingCategory == null)
                return NotFound();

            existingCategory.Name = request.Name;
            existingCategory.Type = request.Type;
            existingCategory.Nature = request.Nature;
            existingCategory.PlannedAmount = request.PlannedAmount;
            existingCategory.UpdatedAt = DateTime.UtcNow;

            var updatedCategory = await _categoryService.UpdateAsync(existingCategory);

            var response = new CategoryResponse
            {
                Id = updatedCategory.Id,
                Name = updatedCategory.Name,
                Type = updatedCategory.Type,
                Nature = updatedCategory.Nature,
                PlannedAmount = updatedCategory.PlannedAmount
            };

            return Ok(response);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var category = await _categoryService.GetByIdAsync(id);
            if (category == null)
                return NotFound();

            await _categoryService.DeleteAsync(id);
            return NoContent();
        }

        /// <summary>
        /// Retrieves the top 5 categories based on total transaction amount.
        /// </summary>
        /// <param name="request">The request containing optional start and end dates for filtering.</param>
        /// <returns>An ActionResult containing a list of TopCategoryResponse objects.</returns>
        [HttpGet("top")]
        public async Task<ActionResult<IEnumerable<TopCategoryResponse>>> GetTopCategories([FromQuery] TopCategoriesRequest request)
        {
            var categories = await _categoryService.GetAllAsync();
            var transactions = await _categoryService.GetCategoryTransactionsAsync(request.StartDate, request.EndDate);

            var topCategories = categories
                .Select(c => {
                    var categoryTransactions = transactions
                        .Where(t => t.CategoryId == c.Id)
                        .ToList();

                    var totalAmount = categoryTransactions.Sum(t => Math.Abs(t.Value));
                    var transactionCount = categoryTransactions.Count;
                    var percentageOfTotal = transactions.Any() 
                        ? (totalAmount / transactions.Sum(t => Math.Abs(t.Value))) * 100 
                        : 0;

                    return new TopCategoryResponse
                    {
                        Id = c.Id,
                        Name = c.Name,
                        TotalAmount = c.Type == CategoryType.Expense ? -totalAmount : totalAmount,
                        PercentageOfTotal = (double) percentageOfTotal,
                        TransactionCount = transactionCount
                    };
                })
                .OrderByDescending(c => Math.Abs(c.TotalAmount))
                .Take(5)
                .ToList();

            return Ok(topCategories);
        }
    }
}

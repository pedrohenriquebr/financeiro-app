using Microsoft.AspNetCore.Mvc;
using Financeiro.API.DTOs;
using FinanceiroApp.Core.Services;
using FinanceiroApp.Core.Entities;

namespace Financeiro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DescriptionMappingsController : ControllerBase
    {
        private readonly IDescriptionMappingService _descriptionMappingService;
        private readonly ICategoryService _categoryService;

        public DescriptionMappingsController(
            IDescriptionMappingService descriptionMappingService,
            ICategoryService categoryService)
        {
            _descriptionMappingService = descriptionMappingService;
            _categoryService = categoryService;
        }

        [HttpGet]
        public ActionResult<IEnumerable<DescriptionMappingDto>> GetAll()
        {
            var mappings = _descriptionMappingService.GetAllDescriptionMappings();
            var dtos = mappings.Select(m => new DescriptionMappingDto
            {
                Id = m.Id,
                Pattern = m.Pattern,
                CategoryId = m.CategoryId,
                CategoryName = _categoryService.GetByIdAsync(m.CategoryId).GetAwaiter().GetResult()?.Name
            });

            return Ok(dtos);
        }

        [HttpGet("{id}")]
        public ActionResult<DescriptionMappingDto> GetById(int id)
        {
            var mapping = _descriptionMappingService.GetDescriptionMappingById(id);
            if (mapping == null)
                return NotFound();

            var dto = new DescriptionMappingDto
            {
                Id = mapping.Id,
                Pattern = mapping.Pattern,
                CategoryId = mapping.CategoryId,
                CategoryName = _categoryService.GetByIdAsync(mapping.CategoryId).GetAwaiter().GetResult()?.Name
            };

            return Ok(dto);
        }

        [HttpPost]
        public ActionResult<DescriptionMappingDto> Create([FromBody] CreateDescriptionMappingDto dto)
        {
            var category = _categoryService.GetByIdAsync(dto.CategoryId).GetAwaiter().GetResult();
            if (category == null)
                return BadRequest("Categoria não encontrada");

            var mapping = new DescriptionMapping
            {
                Pattern = dto.Pattern,
                CategoryId = dto.CategoryId
            };

            _descriptionMappingService.AddDescriptionMapping(mapping);

            var createdDto = new DescriptionMappingDto
            {
                Id = mapping.Id,
                Pattern = mapping.Pattern,
                CategoryId = mapping.CategoryId,
                CategoryName = category.Name
            };

            return CreatedAtAction(nameof(GetById), new { id = mapping.Id }, createdDto);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UpdateDescriptionMappingDto dto)
        {
            var existingMapping = _descriptionMappingService.GetDescriptionMappingById(id);
            if (existingMapping == null)
                return NotFound();

            var category = _categoryService.GetByIdAsync(dto.CategoryId).GetAwaiter().GetResult();
            if (category == null)
                return BadRequest("Categoria não encontrada");

            existingMapping.Pattern = dto.Pattern;
            existingMapping.CategoryId = dto.CategoryId;

            _descriptionMappingService.UpdateDescriptionMapping(existingMapping);

            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var mapping = _descriptionMappingService.GetDescriptionMappingById(id);
            if (mapping == null)
                return NotFound();

            _descriptionMappingService.DeleteDescriptionMapping(id);

            return NoContent();
        }

        [HttpGet("match/{description}")]
        public ActionResult<DescriptionMappingDto> FindMatchingMapping(string description)
        {
            var mapping = _descriptionMappingService.FindMatchingMapping(description);
            if (mapping == null)
                return NotFound();

            var dto = new DescriptionMappingDto
            {
                Id = mapping.Id,
                Pattern = mapping.Pattern,
                CategoryId = mapping.CategoryId,
                CategoryName = _categoryService.GetByIdAsync(mapping.CategoryId).GetAwaiter().GetResult()?.Name,
            };

            return Ok(dto);
        }

        [HttpPost("apply")]
        public IActionResult ApplyMappings()
        {
            try
            {
                _descriptionMappingService.ApplyMappingsToTransactions();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Erro ao aplicar mapeamentos: " + ex.Message);
            }
        }
    }
}

namespace Financeiro.API.DTOs
{
    public class DescriptionMappingDto
    {
        public int Id { get; set; }
        public string Pattern { get; set; }
        public int CategoryId { get; set; }
        public string CategoryName { get; set; }
    }

    public class CreateDescriptionMappingDto
    {
        public string Pattern { get; set; }
        public int CategoryId { get; set; }
    }

    public class UpdateDescriptionMappingDto : CreateDescriptionMappingDto
    {
    }
}

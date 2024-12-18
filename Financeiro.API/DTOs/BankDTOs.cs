using System.ComponentModel.DataAnnotations;

namespace Financeiro.API.DTOs
{
    public class BankDTO
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Code { get; set; }
    }

    public class CreateBankDTO
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(10)]
        public string Code { get; set; }
    }

    public class UpdateBankDTO
    {
        [Required]
        [StringLength(100)]
        public string Name { get; set; }

        [Required]
        [StringLength(10)]
        public string Code { get; set; }
    }
}

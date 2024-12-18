using System.Collections.Generic;
using FinanceiroApp.Core.Entities;

namespace FinanceiroApp.Core.Services
{
  public interface IDescriptionMappingService
  {
    IEnumerable<DescriptionMapping> GetAllDescriptionMappings();
    DescriptionMapping GetDescriptionMappingById(int id);
    void AddDescriptionMapping(DescriptionMapping mapping);
    void UpdateDescriptionMapping(DescriptionMapping mapping);
    void DeleteDescriptionMapping(int id);
    DescriptionMapping? FindMatchingMapping(string description);
    void ApplyMappingsToTransactions();
  }
}

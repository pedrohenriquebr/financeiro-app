using System.Collections.Generic;
using System.Text.RegularExpressions;
using FinanceiroApp.Core.Entities;

namespace FinanceiroApp.Core.Services
{
  public class DescriptionMappingService : IDescriptionMappingService
  {
    private readonly IDataStore<DescriptionMapping> _store;
    private readonly ITransactionService _transactionService;

    public DescriptionMappingService(
      IDataStore<DescriptionMapping> store,
      ITransactionService transactionService)
    {
      _store = store;
      _transactionService = transactionService;
    }

    public void AddDescriptionMapping(DescriptionMapping mapping)
    {
      _store.Add(mapping);
    }

    public void DeleteDescriptionMapping(int id)
    {
      _store.Delete(id);
    }

    public DescriptionMapping? FindMatchingMapping(string description)
    {
      return _store.GetAll().Where(x => new Regex(x.Pattern).IsMatch(description)).FirstOrDefault();
    }

    public IEnumerable<DescriptionMapping> GetAllDescriptionMappings()
    {
      return _store.GetAll();
    }

    public DescriptionMapping GetDescriptionMappingById(int id)
    {
      return _store.GetById(id);
    }

    public void UpdateDescriptionMapping(DescriptionMapping mapping)
    {
      _store.Update(mapping);
    }

    private string ConvertToRegexPattern(string pattern)
    {
      // Se o padrão já começa com (?i), mantemos ele como está pois é um regex válido
      if (pattern.StartsWith("(?i)"))
        return pattern;

      // Escapa todos os caracteres especiais de regex
      var escaped = Regex.Escape(pattern);
      
      // Se o padrão original começava com *, adicionamos .* no início
      if (pattern.StartsWith("*"))
        escaped = ".*" + escaped.Substring(2); // Remove o \* escapado
      
      // Se o padrão original terminava com *, adicionamos .* no final
      if (pattern.EndsWith("*"))
        escaped = escaped.Substring(0, escaped.Length - 2) + ".*"; // Remove o \* escapado
      
      return escaped;
    }

    public void ApplyMappingsToTransactions()
    {
      var transactions = _transactionService.GetAllTransactions().ToList();
      var mappings = GetAllDescriptionMappings().ToList();
      var transactionsToUpdate = new Dictionary<int, int>();

      foreach (var mapping in mappings)
      {
        var regexPattern = ConvertToRegexPattern(mapping.Pattern);
        var regex = new Regex(regexPattern, RegexOptions.IgnoreCase);
        
        foreach (var transaction in transactions)
        {
          if (regex.IsMatch(transaction.Description) && 
              !transactionsToUpdate.ContainsKey(transaction.Id))
          {
            transactionsToUpdate[transaction.Id] = mapping.CategoryId;
          }
        }
      }

      foreach (var kvp in transactionsToUpdate)
      {
        var transaction = transactions.First(t => t.Id == kvp.Key);
        transaction.CategoryId = kvp.Value;
        _transactionService.UpdateTransaction(transaction);
      }
    }
  }
}

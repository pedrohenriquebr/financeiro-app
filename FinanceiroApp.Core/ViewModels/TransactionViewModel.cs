using System;

namespace FinanceiroApp.Core.ViewModels
{
  public class TransactionViewModel
  {
    public int Id { get; set; }
    public string Description { get; set; }
    public decimal Value { get; set; }
    public DateTime TransactionDateTime { get; set; }
    public DateTime RegistrationDateTime { get; set; }
    public DateTime? ImportDateTime { get; set; }
    public int? CategoryId { get; set; }
    public string CategoryName { get; set; }
    public int? BankAccountId { get; set; }
    public string BankAccountName { get; set; }

    public BankAccountViewModel BankAccount { get; set; }

    // Transfer properties
    public bool IsTransfer { get; set; }
    public int? DestinationBankAccountId { get; set; }
    public string DestinationBankAccountName { get; set; }

    // Recurring transaction properties
    public bool IsRecurring { get; set; }
    public RecurrenceType RecurrenceType { get; set; }
    public int? RecurrenceFrequency { get; set; }
    public DateTime? RecurrenceEndDate { get; set; }
    public int? ParentTransactionId { get; set; }

    // Computed properties for display
    public string FormattedValue => Value.ToString("C2");
    public string FormattedDate => TransactionDateTime.ToString("dd/MM/yyyy");
    public string FormattedRegistrationDate => RegistrationDateTime.ToString("dd/MM/yyyy HH:mm");
    public string FormattedImportDate => ImportDateTime?.ToString("dd/MM/yyyy HH:mm");
    public string DisplayDescription => string.IsNullOrWhiteSpace(Description) ? "(Sem descrição)" : Description;
    public string DisplayCategory => IsTransfer ? "Transferência" : string.IsNullOrWhiteSpace(CategoryName) ? "Sem Categoria" : CategoryName;
    public string DisplayAccount => string.IsNullOrWhiteSpace(BankAccountName) ? "Conta Não Especificada" : BankAccountName;
    public string DisplayDestinationAccount => IsTransfer ? string.IsNullOrWhiteSpace(DestinationBankAccountName) ? "Conta de Destino Não Especificada" : DestinationBankAccountName : null;
    public bool IsExpense => Value < 0;
    public bool IsIncome => Value > 0;
    public string TransactionType => IsTransfer ? "Transferência" : IsExpense ? "Despesa" : "Receita";
    public string RecurrenceInfo => IsRecurring ? $"Recorrente ({RecurrenceType} - {RecurrenceFrequency}x)" : null;
  }
}

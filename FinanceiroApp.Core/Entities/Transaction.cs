namespace FinanceiroApp.Core.Entities
{
  public class Transaction
  {
    public int Id { get; set; }
    public string Description { get; set; } = string.Empty;
    public decimal Value { get; set; }
    public DateTime TransactionDateTime { get; set; }
    public DateTime RegistrationDateTime { get; set; }
    public DateTime? ImportDateTime { get; set; } = null;

    // Transfer properties
    public bool IsTransfer { get; set; }
    public int? DestinationBankAccountId { get; set; } = null;
    public BankAccount? DestinationBankAccount { get; set; } = null;

    // Recurring transaction properties
    public bool IsRecurring { get; set; }
    public RecurrenceType RecurrenceType { get; set; }
    public int? RecurrenceFrequency { get; set; } // How often it recurs (e.g., every 2 weeks)
    public DateTime? RecurrenceEndDate { get; set; }
    public int? ParentTransactionId { get; set; } // For recurring transaction instances

    // Chaves estrangeiras
    public int? CategoryId { get; set; } = null;
    public int? BankAccountId { get; set; } = null;

    // Navegação
    public Category? Category { get; set; } = null;
    public BankAccount? BankAccount { get; set; } = null;
    public Transaction? ParentTransaction { get; set; } = null;

    public Transaction()
    {

    }

    public Transaction(int id, string description, decimal value, DateTime transactionDateTime, DateTime registrationDateTime, bool isTransfer, int? destinationBankAccountId)
    {
      Id = id;
      Description = description;
      Value = value;
      TransactionDateTime = transactionDateTime;
      RegistrationDateTime = registrationDateTime;
      IsTransfer = isTransfer;
      DestinationBankAccountId = destinationBankAccountId;
    }

    public void TransferTo(BankAccount destinationBankAccount)
    {
      if (destinationBankAccount == null)
        throw new ArgumentNullException(nameof(destinationBankAccount));

      IsTransfer = true;
      DestinationBankAccountId = destinationBankAccount.Id;
      DestinationBankAccount = destinationBankAccount;
    }

    public void SetParentTransaction(Transaction parentTransaction)
    {
      if (parentTransaction == null)
        throw new ArgumentNullException(nameof(parentTransaction));

      ParentTransactionId = parentTransaction.Id;
      ParentTransaction = parentTransaction;
    }

    public void SetCategory(Category category)
    {
      if (category == null)
        throw new ArgumentNullException(nameof(category));

      CategoryId = category.Id;
      Category = category;
    }

    public void SetBankAccount(BankAccount bankAccount)
    {
      if (bankAccount == null)
        throw new ArgumentNullException(nameof(bankAccount));

      BankAccountId = bankAccount.Id;
      BankAccount = bankAccount;
    }

    public void SetImportDateTime(DateTime importDateTime)
    {
      ImportDateTime = importDateTime;
    }

    public void SetRecurringProperties(RecurrenceType recurrenceType, int? recurrenceFrequency, DateTime? recurrenceEndDate)
    {
      IsRecurring = true;
      RecurrenceType = recurrenceType;
      RecurrenceFrequency = recurrenceFrequency;
      RecurrenceEndDate = recurrenceEndDate;
    }
  }
}

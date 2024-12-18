using Microsoft.AspNetCore.Mvc;
using Financeiro.API.DTOs;
using FinanceiroApp;
using FinanceiroApp.Core.Services;
using FinanceiroApp.Core.ViewModels;
using FinanceiroApp.Core.Entities;
using OfficeOpenXml;
using OfficeOpenXml.Style;
using System.Text;
using System.IO;
using Microsoft.Extensions.Logging;

namespace Financeiro.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TransactionsController : ControllerBase
    {
        private readonly ITransactionService _transactionService;
        private readonly IBankAccountService _bankAccountService;
        private readonly ICategoryService _categoryService;
        private readonly ILogger<TransactionsController> _logger;

        public TransactionsController(ITransactionService transactionService, IBankAccountService bankAccountService, ICategoryService categoryService, ILogger<TransactionsController> logger)
        {
            _transactionService = transactionService;
            _bankAccountService = bankAccountService;
            _categoryService = categoryService;
            _logger = logger;
        }

        private TransactionDto MapToDto(Transaction t)
        {
            return new TransactionDto
            {
                Id = t.Id,
                Description = t.Description,
                Amount = t.Value,
                Date = t.TransactionDateTime,
                ImportedDate = t.ImportDateTime,
                CategoryId = t.CategoryId,
                CategoryName = t.Category?.Name,
                BankAccountId = t.BankAccountId,
                BankAccountName = t.BankAccount?.Name,
                IsTransfer = t.IsTransfer,
                DestinationBankAccountId = t.DestinationBankAccountId,
                DestinationBankAccountName = t.DestinationBankAccount?.Name,
                IsRecurring = t.IsRecurring,
                RecurrenceType = t.RecurrenceType,
                RecurrenceFrequency = t.RecurrenceFrequency,
                RecurrenceEndDate = t.RecurrenceEndDate,
                ParentTransactionId = t.ParentTransactionId
            };
        }

        private TransactionDto MapToDto(TransactionViewModel model)
        {
            return new TransactionDto
            {
                Id = model.Id,
                Description = model.Description,
                Amount = model.Value,
                Date = model.TransactionDateTime,
                ImportedDate = model.ImportDateTime,
                CategoryId = model.CategoryId,
                CategoryName = model.CategoryName,
                BankAccountId = model.BankAccountId,
                BankAccountName = model.BankAccountName,
                IsTransfer = model.IsTransfer,
                DestinationBankAccountId = model.DestinationBankAccountId,
                DestinationBankAccountName = model.DestinationBankAccountName,
                IsRecurring = model.IsRecurring,
                RecurrenceType = ConvertRecurrenceType(model.RecurrenceType),
                RecurrenceFrequency = model.RecurrenceFrequency,
                RecurrenceEndDate = model.RecurrenceEndDate,
                ParentTransactionId = model.ParentTransactionId
            };
        }

        private FinanceiroApp.Core.Entities.RecurrenceType ConvertRecurrenceType(FinanceiroApp.Core.ViewModels.RecurrenceType viewModelRecurrenceType)
        {
            return viewModelRecurrenceType switch
            {
                FinanceiroApp.Core.ViewModels.RecurrenceType.Daily => FinanceiroApp.Core.Entities.RecurrenceType.Daily,
                FinanceiroApp.Core.ViewModels.RecurrenceType.Weekly => FinanceiroApp.Core.Entities.RecurrenceType.Weekly,
                FinanceiroApp.Core.ViewModels.RecurrenceType.Monthly => FinanceiroApp.Core.Entities.RecurrenceType.Monthly,
                FinanceiroApp.Core.ViewModels.RecurrenceType.Yearly => FinanceiroApp.Core.Entities.RecurrenceType.Yearly,
                _ => FinanceiroApp.Core.Entities.RecurrenceType.None
            };
        }

        [HttpGet]
        public ActionResult<IEnumerable<TransactionDto>> GetAll()
        {
            var transactions = _transactionService.GetAllTransactionsWithDetails();
            var transactionDtos = transactions.Select(t => MapToDto(t));

            return Ok(transactionDtos);
        }

        [HttpGet("{id}")]
        public ActionResult<TransactionDto> GetById(int id)
        {
            var transaction = _transactionService.GetTransactionById(id);
            if (transaction == null)
                return NotFound();

            var transactionDto = MapToDto(transaction);

            return Ok(transactionDto);
        }

        [HttpPost]
        public IActionResult Create([FromBody] CreateTransactionDto dto)
        {
            var transaction = new Transaction
            {
                Description = dto.Description,
                Value = dto.Amount,
                TransactionDateTime = dto.Date,
                ImportDateTime = DateTime.Now,
                CategoryId = !dto.IsTransfer ? dto.CategoryId : null,
                BankAccountId = dto.BankAccountId,
                IsTransfer = dto.IsTransfer,
                DestinationBankAccountId = dto.IsTransfer ? dto.DestinationBankAccountId : null,
                IsRecurring = dto.IsRecurring,
                RecurrenceType = dto.RecurrenceType ?? FinanceiroApp.Core.Entities.RecurrenceType.None,
                RecurrenceFrequency = dto.RecurrenceFrequency,
                RecurrenceEndDate = dto.RecurrenceEndDate
            };

            _transactionService.AddTransaction(transaction);

            return Ok(MapToDto(transaction));
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromBody] UpdateTransactionDto dto)
        {
            var existingTransaction = _transactionService.GetTransactionById(id);
            if (existingTransaction == null)
                return NotFound();

            existingTransaction.Description = dto.Description;
            existingTransaction.Value = dto.Amount;
            existingTransaction.TransactionDateTime = dto.Date;
            existingTransaction.CategoryId = !dto.IsTransfer ? dto.CategoryId : null;
            existingTransaction.BankAccountId = dto.BankAccountId;
            existingTransaction.IsTransfer = dto.IsTransfer;
            existingTransaction.DestinationBankAccountId = dto.IsTransfer ? dto.DestinationBankAccountId : null;
            existingTransaction.IsRecurring = dto.IsRecurring;
            existingTransaction.RecurrenceType = dto.RecurrenceType ?? FinanceiroApp.Core.Entities.RecurrenceType.None;
            existingTransaction.RecurrenceFrequency = dto.RecurrenceFrequency;
            existingTransaction.RecurrenceEndDate = dto.RecurrenceEndDate;

            _transactionService.UpdateTransaction(existingTransaction);

            return Ok(MapToDto(existingTransaction));
        }

        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var transaction = _transactionService.GetTransactionById(id);
            if (transaction == null)
                return NotFound();

            _transactionService.DeleteTransaction(id);

            return NoContent();
        }

        [HttpGet("byDate")]
        public ActionResult<IEnumerable<TransactionDto>> GetByDateRange([FromQuery] DateTime startDate, [FromQuery] DateTime endDate)
        {
            var transactions = _transactionService.GetTransactionsByDateRange(startDate, endDate);
            var transactionDtos = transactions.Select(t => MapToDto(t));

            return Ok(transactionDtos);
        }

        [HttpGet("byCategory/{categoryId}")]
        public ActionResult<IEnumerable<TransactionDto>> GetByCategory(int categoryId)
        {
            var transactions = _transactionService.GetTransactionsByCategory(categoryId);
            var transactionDtos = transactions.Select(t => MapToDto(t));

            return Ok(transactionDtos);
        }

        [HttpGet("byAccount/{accountId}")]
        public ActionResult<IEnumerable<TransactionDto>> GetByAccount(int accountId)
        {
            var transactions = _transactionService.GetTransactionsByAccount(accountId);
            var transactionDtos = transactions.Select(t => MapToDto(t));

            return Ok(transactionDtos);
        }

        [HttpPost("import")]
        public async Task<ActionResult<IEnumerable<TransactionDto>>> Import([FromBody] IEnumerable<ImportTransactionDto> transactions)
        {
            if (transactions == null || !transactions.Any())
                return BadRequest("Nenhuma transação fornecida para importação");

            var importedTransactions = new List<Transaction>();

            foreach (var transactionDto in transactions)
            {
                var transaction = new Transaction
                {
                    Description = transactionDto.Description,
                    Value = transactionDto.Value,
                    TransactionDateTime = transactionDto.TransactionDateTime,
                    ImportDateTime = DateTime.UtcNow,
                    CategoryId = transactionDto.CategoryId,
                    BankAccountId = transactionDto.BankAccountId,
                    IsTransfer = transactionDto.IsTransfer,
                    IsRecurring = transactionDto.IsRecurring,
                    RecurrenceType = transactionDto.RecurrenceType,
                    RecurrenceFrequency = transactionDto.RecurrenceFrequency,
                    RecurrenceEndDate = transactionDto.RecurrenceEndDate
                };

                _transactionService.AddTransaction(transaction);
                importedTransactions.Add(transaction);
            }

            //random delay to improve user experience
            await Task.Delay(Math.Abs(new Random().Next(1000, 5000)));
            return Ok(importedTransactions.Select(t => MapToDto(t)));
        }

        [HttpGet("balance/{accountId}")]
        public ActionResult<decimal> GetBalance(int accountId)
        {
            var balance = _transactionService.GetBalanceForAccount(accountId);
            return Ok(balance);
        }

        [HttpGet("statistics")]
        public ActionResult<object> GetStatistics()
        {
            var totalIncome = _transactionService.GetTotalIncome();
            var totalExpenses = _transactionService.GetTotalExpenses();

            return Ok(new
            {
                TotalIncome = totalIncome,
                TotalExpenses = totalExpenses,
                Balance = totalIncome - totalExpenses
            });
        }

        [HttpGet("dashboard")]
        public ActionResult<DashboardDataDto> GetDashboardData([FromQuery] DashboardFilterDto filter)
        {
            var transactions = _transactionService.GetAllTransactionsWithDetails();

            // Calculate previous month's total
            var today = DateTime.Today;
            var firstDayOfCurrentMonth = new DateTime(today.Year, today.Month, 1);
            var lastDayOfPreviousMonth = firstDayOfCurrentMonth.AddDays(-1);
            var firstDayOfPreviousMonth = new DateTime(lastDayOfPreviousMonth.Year, lastDayOfPreviousMonth.Month, 1);

            var previousMonthTransactions = transactions.Where(t =>
                t.TransactionDateTime >= firstDayOfPreviousMonth &&
                t.TransactionDateTime <= lastDayOfPreviousMonth);

            var previousMonthIncome = previousMonthTransactions
                .Where(t => !t.IsTransfer && t.Value > 0)
                .Sum(t => t.Value);
            var previousMonthExpenses = previousMonthTransactions
                .Where(t => !t.IsTransfer && t.Value < 0)
                .Sum(t => Math.Abs(t.Value));
            var previousMonthTotal = previousMonthIncome - previousMonthExpenses;

            // Aplicar filtros
            if (filter.StartDate.HasValue)
                transactions = transactions.Where(t => t.TransactionDateTime >= filter.StartDate.Value);
            if (filter.EndDate.HasValue)
                transactions = transactions.Where(t => t.TransactionDateTime <= filter.EndDate.Value);
            if (filter.BankAccountIds?.Any() == true)
                transactions = transactions.Where(t => t.BankAccountId != null && filter.BankAccountIds.Contains(t.BankAccountId.Value));
            if (filter.CategoryIds?.Any() == true)
                transactions = transactions.Where(t => t.CategoryId.HasValue && filter.CategoryIds.Contains(t.CategoryId.Value));

            var dashboardData = new DashboardDataDto
            {
                Overview = CalculateOverview(transactions),
                BankAccountBalances = CalculateBankAccountBalances(transactions),
                MonthlyTransactions = GroupTransactionsByPeriod(transactions, "month"),
                YearlyTransactions = GroupTransactionsByPeriod(transactions, "year"),
                PreviousMonthTotal = previousMonthTotal
            };

            return Ok(dashboardData);
        }

        private DashboardOverviewDto CalculateOverview(IEnumerable<TransactionViewModel> transactions)
        {
            var income = transactions.Where(t => !t.IsTransfer && t.Value > 0).Sum(t => t.Value);
            var expenses = transactions.Where(t => !t.IsTransfer && t.Value < 0).Sum(t => Math.Abs(t.Value));

            return new DashboardOverviewDto
            {
                TotalBalance = income - expenses,
                TotalIncome = income,
                TotalExpenses = expenses,
                TotalTransactions = transactions.Count(),
                AverageTransactionAmount = transactions.Any() ? transactions.Average(t => Math.Abs(t.Value)) : 0,
                LastUpdateDate = DateTime.UtcNow
            };
        }

        private List<BankAccountBalanceDto> CalculateBankAccountBalances(IEnumerable<TransactionViewModel> transactions)
        {
            // Get all bank accounts from the service
            var bankAccounts = _bankAccountService.GetAllBankAccounts();
            var balances = new List<BankAccountBalanceDto>();

            foreach (var account in bankAccounts)
            {
                var accountTransactions = transactions.Where(t =>
                    t.BankAccountId == account.Id ||
                    (t.IsTransfer && t.DestinationBankAccountId == account.Id));

                var income = accountTransactions
                    .Where(t => !t.IsTransfer && t.Value > 0)
                    .Sum(t => t.Value);

                var expenses = accountTransactions
                    .Where(t => !t.IsTransfer && t.Value < 0)
                    .Sum(t => Math.Abs(t.Value));

                var transfersIn = accountTransactions
                    .Where(t => t.IsTransfer && t.DestinationBankAccountId == account.Id)
                    .Sum(t => t.Value);

                var transfersOut = accountTransactions
                    .Where(t => t.IsTransfer && t.BankAccountId == account.Id)
                    .Sum(t => Math.Abs(t.Value));

                var currentBalance = account.Balance + income - expenses + transfersIn - transfersOut;

                balances.Add(new BankAccountBalanceDto
                {
                    BankAccountId = account.Id,
                    BankAccountName = account.Name,
                    InitialBalance = account.Balance,
                    CurrentBalance = currentBalance,
                    TotalIncome = income,
                    TotalExpenses = expenses,
                    TotalTransfers = transfersIn - transfersOut
                });
            }

            return balances;
        }

        private List<TransactionsByPeriodDto> GroupTransactionsByPeriod(IEnumerable<TransactionViewModel> transactions, string groupBy)
        {
            var grouped = groupBy.ToLower() == "month"
                ? transactions.GroupBy(t => new { t.TransactionDateTime.Year, t.TransactionDateTime.Month })
                    .Select(g => new TransactionsByPeriodDto
                    {
                        Period = $"{g.Key.Year}-{g.Key.Month:D2}",
                        Income = g.Where(t => !t.IsTransfer && t.Value > 0).Sum(t => t.Value),
                        Expenses = g.Where(t => !t.IsTransfer && t.Value < 0).Sum(t => Math.Abs(t.Value)),
                        TransactionCount = g.Count()
                    })
                : transactions.GroupBy(t => t.TransactionDateTime.Year)
                    .Select(g => new TransactionsByPeriodDto
                    {
                        Period = g.Key.ToString(),
                        Income = g.Where(t => !t.IsTransfer && t.Value > 0).Sum(t => t.Value),
                        Expenses = g.Where(t => !t.IsTransfer && t.Value < 0).Sum(t => Math.Abs(t.Value)),
                        TransactionCount = g.Count()
                    });

            var result = grouped.OrderBy(g => g.Period).ToList();
            result.ForEach(r => r.Balance = r.Income - r.Expenses);

            return result;
        }

        /// <summary>
        /// Exports the budget data to an Excel file.
        /// </summary>
        /// <returns>An Excel file containing the budget data.</returns>
        [HttpGet("export-budget")]
        public async Task<IActionResult> ExportBudget()
        {
            var categories = await _categoryService.GetAllAsync();
            var transactions = _transactionService.GetAllTransactionsWithDetails();

            // Agrupar por mês
            var transactionsByMonth = transactions
                .GroupBy(t => new { t.TransactionDateTime.Year, t.TransactionDateTime.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month)
                .ToList();

            // Obter saldo inicial total
            var bankAccounts = _bankAccountService.GetAllBankAccounts();
            decimal initialBalance = bankAccounts.Sum(a => a.Balance);

            // Calcular saldo esperado usando CalculateBankAccountBalances
            var balancesByAccount = CalculateBankAccountBalances(transactions);
            decimal expectedBalance = balancesByAccount.Sum(b => b.CurrentBalance);
            
            // Log da diferença
            var sbComparacao = new System.Text.StringBuilder();
            sbComparacao.AppendLine("\n=== Comparação de Saldos ===");
            sbComparacao.AppendLine($"Saldo Total (CalculateBankAccountBalances): {expectedBalance:C2}");
            sbComparacao.AppendLine("\nSaldo por Conta:");
            foreach (var balance in balancesByAccount)
            {
                sbComparacao.AppendLine($"{balance.BankAccountName}:");
                sbComparacao.AppendLine($"  Saldo Inicial: {balance.InitialBalance:C2}");
                sbComparacao.AppendLine($"  (+) Receitas: {balance.TotalIncome:C2}");
                sbComparacao.AppendLine($"  (-) Despesas: {balance.TotalExpenses:C2}");
                sbComparacao.AppendLine($"  Transferências: {balance.TotalTransfers:C2}");
                sbComparacao.AppendLine($"  (=) Saldo Final: {balance.CurrentBalance:C2}");
            }

            var logPathComparacao = Path.Combine(Path.GetTempPath(), "comparacao_saldos.txt");
            System.IO.File.WriteAllText(logPathComparacao, sbComparacao.ToString());
            Console.WriteLine($"Log de comparação gravado em: {logPathComparacao}");

            var incomeCategories = categories
                .Where(c => c.Type == CategoryType.Income)
                .OrderBy(c => c.Name)
                .ToList();

            var fixedExpenses = categories
                .Where(c => c.Type == CategoryType.Expense && c.Nature == CategoryNature.Fixed)
                .OrderBy(c => c.Name)
                .ToList();

            var variableExpenses = categories
                .Where(c => c.Type == CategoryType.Expense && c.Nature == CategoryNature.Variable)
                .OrderBy(c => c.Name)
                .ToList();

            ExcelPackage.LicenseContext = LicenseContext.NonCommercial;
            using var package = new ExcelPackage();

            // Primeira aba - Orçamento
            var budgetWorksheet = package.Workbook.Worksheets.Add("Orçamento");

            // Segunda aba - Transações
            var transactionsWorksheet = package.Workbook.Worksheets.Add("Transações");

            // Configurar cabeçalho das transações
            transactionsWorksheet.Cells[1, 1].Value = "Data";
            transactionsWorksheet.Cells[1, 2].Value = "Descrição";
            transactionsWorksheet.Cells[1, 3].Value = "Categoria";
            transactionsWorksheet.Cells[1, 4].Value = "Conta";
            transactionsWorksheet.Cells[1, 5].Value = "Valor";
            transactionsWorksheet.Cells[1, 6].Value = "Tipo";

            // Estilo do cabeçalho
            var headerRange = transactionsWorksheet.Cells[1, 1, 1, 6];
            headerRange.Style.Font.Bold = true;
            headerRange.Style.Fill.PatternType = ExcelFillStyle.Solid;
            headerRange.Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(76, 175, 80));
            headerRange.Style.Font.Color.SetColor(System.Drawing.Color.White);

            // Preencher dados das transações
            int row = 2;
            foreach (var transaction in transactions.OrderByDescending(t => t.TransactionDateTime))
            {
                transactionsWorksheet.Cells[row, 1].Value = transaction.TransactionDateTime.ToString("dd/MM/yyyy");
                transactionsWorksheet.Cells[row, 2].Value = transaction.Description;
                transactionsWorksheet.Cells[row, 3].Value = categories.FirstOrDefault(c => c.Id == transaction.CategoryId)?.Name ?? "Sem Categoria";
                transactionsWorksheet.Cells[row, 4].Value = transaction.BankAccountName;
                transactionsWorksheet.Cells[row, 5].Value = transaction.Value;
                transactionsWorksheet.Cells[row, 5].Style.Numberformat.Format = "R$ #,##0.00";
                transactionsWorksheet.Cells[row, 6].Value = transaction.IsExpense ? "Despesa" : "Receita";

                // Destacar despesas em vermelho
                if (transaction.IsExpense)
                {
                    transactionsWorksheet.Cells[row, 5].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                }
                else
                {
                    transactionsWorksheet.Cells[row, 5].Style.Font.Color.SetColor(System.Drawing.Color.Green);
                }

                row++;
            }

            // Ajustar largura das colunas
            transactionsWorksheet.Column(1).Width = 12; // Data
            transactionsWorksheet.Column(2).Width = 40; // Descrição
            transactionsWorksheet.Column(3).Width = 20; // Categoria
            transactionsWorksheet.Column(4).Width = 20; // Conta
            transactionsWorksheet.Column(5).Width = 15; // Valor
            transactionsWorksheet.Column(6).Width = 10; // Tipo

            // Adicionar filtros
            var dataRange = transactionsWorksheet.Cells[1, 1, row - 1, 6];
            dataRange.AutoFilter = true;

            // Adicionar bordas
            dataRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            dataRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

            // Congelar cabeçalho
            transactionsWorksheet.View.FreezePanes(2, 1);

            // Continuar com a primeira aba (Orçamento)
            // Congelar primeira coluna e cabeçalho
            budgetWorksheet.View.FreezePanes(3, 2);

            // Cabeçalho SALDO
            budgetWorksheet.Cells[1, 1].Value = "SALDO";
            budgetWorksheet.Cells[1, 1].Style.Font.Bold = true;
            budgetWorksheet.Cells[1, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
            budgetWorksheet.Cells[1, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(33, 150, 243));
            budgetWorksheet.Cells[1, 1].Style.Font.Color.SetColor(System.Drawing.Color.White);

            // Estrutura da primeira coluna
            // Linha 3: Despesas Fixas
            budgetWorksheet.Cells[3, 1].Value = "Despesas Fixas";
            budgetWorksheet.Cells[3, 1].Style.Font.Bold = true;
            budgetWorksheet.Cells[3, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
            budgetWorksheet.Cells[3, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(76, 175, 80));
            budgetWorksheet.Cells[3, 1].Style.Font.Color.SetColor(System.Drawing.Color.White);

            int rowBudget = 4;
            foreach (var category in fixedExpenses)
            {
                budgetWorksheet.Cells[rowBudget, 1].Value = category.Name;
                budgetWorksheet.Cells[rowBudget, 1].Style.Font.Bold = false;
                rowBudget++;
            }

            // Agora, sem linha em branco extra, imediatamente Despesas Variáveis
            budgetWorksheet.Cells[rowBudget, 1].Value = "Despesas Variáveis";
            budgetWorksheet.Cells[rowBudget, 1].Style.Font.Bold = true;
            budgetWorksheet.Cells[rowBudget, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
            budgetWorksheet.Cells[rowBudget, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(76, 175, 80));
            budgetWorksheet.Cells[rowBudget, 1].Style.Font.Color.SetColor(System.Drawing.Color.White);
            rowBudget++;

            foreach (var category in variableExpenses)
            {
                budgetWorksheet.Cells[rowBudget, 1].Value = category.Name;
                budgetWorksheet.Cells[rowBudget, 1].Style.Font.Bold = false;
                rowBudget++;
            }

            // Adicionar seção de Receitas
            budgetWorksheet.Cells[rowBudget, 1].Value = "Receitas";
            budgetWorksheet.Cells[rowBudget, 1].Style.Font.Bold = true;
            budgetWorksheet.Cells[rowBudget, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
            budgetWorksheet.Cells[rowBudget, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(76, 175, 80));
            budgetWorksheet.Cells[rowBudget, 1].Style.Font.Color.SetColor(System.Drawing.Color.White);
            rowBudget++;

            foreach (var category in incomeCategories)
            {
                budgetWorksheet.Cells[rowBudget, 1].Value = category.Name;
                budgetWorksheet.Cells[rowBudget, 1].Style.Font.Bold = false;
                rowBudget++;
            }

            // Sem Categoria
            budgetWorksheet.Cells[rowBudget, 1].Value = "Sem Categoria";
            budgetWorksheet.Cells[rowBudget, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
            budgetWorksheet.Cells[rowBudget, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(244, 67, 54));
            budgetWorksheet.Cells[rowBudget, 1].Style.Font.Color.SetColor(System.Drawing.Color.White);
            budgetWorksheet.Cells[rowBudget, 1].Style.Font.Bold = true;
            rowBudget++;

            // TOTAL
            budgetWorksheet.Cells[rowBudget, 1].Value = "TOTAL";
            budgetWorksheet.Cells[rowBudget, 1].Style.Font.Bold = true;
            budgetWorksheet.Cells[rowBudget, 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
            budgetWorksheet.Cells[rowBudget, 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(76, 175, 80));
            budgetWorksheet.Cells[rowBudget, 1].Style.Font.Color.SetColor(System.Drawing.Color.White);

            // Guardar as linhas importantes
            int totalRow = rowBudget;
            // Calcular quantas linhas temos para fixas, variáveis, receitas, sem categoria, total
            int fixedCount = fixedExpenses.Count;
            int variableCount = variableExpenses.Count;
            int incomeCount = incomeCategories.Count;

            // Estrutura final, por exemplo:
            // 3: Despesas Fixas
            // 4..(3+fixedCount): fixas
            // (4+fixedCount): Despesas Variáveis
            // (5+fixedCount)..(4+fixedCount+variableCount): variáveis
            // (5+fixedCount+variableCount): Receitas
            // (6+fixedCount+variableCount)..(5+fixedCount+variableCount+incomeCount): receitas
            // (6+fixedCount+variableCount+incomeCount): Sem Categoria
            // (7+fixedCount+variableCount+incomeCount): TOTAL

            // Configurar meses
            int currentColumn = 4; // Iniciar a partir da coluna 4 para não conflitar com as colunas de saldo global

            foreach (var monthGroup in transactionsByMonth)
            {
                string monthName = new DateTime(monthGroup.Key.Year, monthGroup.Key.Month, 1)
                    .ToString("MMMM/yyyy", new System.Globalization.CultureInfo("pt-BR"))
                    .ToUpper();

                // Cabeçalho do mês (linha 1)
                budgetWorksheet.Cells[1, currentColumn, 1, currentColumn + 1].Merge = true;
                budgetWorksheet.Cells[1, currentColumn].Value = monthName;
                budgetWorksheet.Cells[1, currentColumn].Style.HorizontalAlignment = ExcelHorizontalAlignment.Center;
                budgetWorksheet.Cells[1, currentColumn].Style.Fill.PatternType = ExcelFillStyle.Solid;
                budgetWorksheet.Cells[1, currentColumn].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(76, 175, 80));
                budgetWorksheet.Cells[1, currentColumn].Style.Font.Color.SetColor(System.Drawing.Color.White);
                budgetWorksheet.Cells[1, currentColumn].Style.Font.Bold = true;

                // Saldo do mês (linha 2)
                budgetWorksheet.Cells[2, currentColumn].Value = "Saldo Planejado";
                budgetWorksheet.Cells[2, currentColumn + 1].Value = "Saldo Realizado";
                budgetWorksheet.Cells[2, currentColumn, 2, currentColumn + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                budgetWorksheet.Cells[2, currentColumn, 2, currentColumn + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(200, 255, 200));
                budgetWorksheet.Cells[2, currentColumn, 2, currentColumn + 1].Style.Font.Bold = true;

                // Planejado/Realizado (linha 3)
                budgetWorksheet.Cells[3, currentColumn].Value = "Planejado";
                budgetWorksheet.Cells[3, currentColumn + 1].Value = "Realizado";
                budgetWorksheet.Cells[3, currentColumn, 3, currentColumn + 1].Style.Fill.PatternType = ExcelFillStyle.Solid;
                budgetWorksheet.Cells[3, currentColumn, 3, currentColumn + 1].Style.Fill.BackgroundColor.SetColor(System.Drawing.Color.FromArgb(200, 255, 200));
                budgetWorksheet.Cells[3, currentColumn, 3, currentColumn + 1].Style.Font.Bold = true;

                // Inicializar variáveis para o mês
                decimal monthExpensesPlanned = 0;
                decimal monthExpensesRealized = 0;
                decimal monthIncomePlanned = 0;
                decimal monthIncomeRealized = 0;
                decimal monthTransfersIn = 0;
                decimal monthTransfersOut = 0;

                int dataRow = 4;

                // Despesas Fixas
                foreach (var category in fixedExpenses)
                {
                    var categoryTransactions = monthGroup
                        .Where(t => t.CategoryId == category.Id && !t.IsTransfer)
                        .ToList();

                    decimal plannedValue = category.PlannedAmount;
                    decimal realizedValue = categoryTransactions.Sum(t => Math.Abs(t.Value));

                    budgetWorksheet.Cells[dataRow, currentColumn].Value = plannedValue;
                    budgetWorksheet.Cells[dataRow, currentColumn + 1].Value = realizedValue;
                    budgetWorksheet.Cells[dataRow, currentColumn, dataRow, currentColumn + 1].Style.Numberformat.Format = "R$ #,##0.00";

                    if (realizedValue > plannedValue)
                        budgetWorksheet.Cells[dataRow, currentColumn + 1].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    monthExpensesPlanned += plannedValue;
                    monthExpensesRealized += realizedValue;
                    dataRow++;
                }

                // Despesas Variáveis
                dataRow++; // Pular a linha do cabeçalho
                foreach (var category in variableExpenses)
                {
                    var categoryTransactions = monthGroup
                        .Where(t => t.CategoryId == category.Id && !t.IsTransfer)
                        .ToList();

                    decimal plannedValue = category.PlannedAmount;
                    decimal realizedValue = categoryTransactions.Sum(t => Math.Abs(t.Value));

                    budgetWorksheet.Cells[dataRow, currentColumn].Value = plannedValue;
                    budgetWorksheet.Cells[dataRow, currentColumn + 1].Value = realizedValue;
                    budgetWorksheet.Cells[dataRow, currentColumn, dataRow, currentColumn + 1].Style.Numberformat.Format = "R$ #,##0.00";

                    if (realizedValue > plannedValue)
                        budgetWorksheet.Cells[dataRow, currentColumn + 1].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                    monthExpensesPlanned += plannedValue;
                    monthExpensesRealized += realizedValue;
                    dataRow++;
                }

                // Receitas
                dataRow++; // Pular a linha do cabeçalho
                foreach (var category in incomeCategories)
                {
                    var categoryTransactions = monthGroup
                        .Where(t => t.CategoryId == category.Id && !t.IsTransfer)
                        .ToList();

                    decimal plannedValue = category.PlannedAmount;
                    decimal realizedValue = categoryTransactions.Sum(t => t.Value); // Não usar Math.Abs() para receitas

                    budgetWorksheet.Cells[dataRow, currentColumn].Value = plannedValue;
                    budgetWorksheet.Cells[dataRow, currentColumn + 1].Value = realizedValue;
                    budgetWorksheet.Cells[dataRow, currentColumn, dataRow, currentColumn + 1].Style.Numberformat.Format = "R$ #,##0.00";

                    monthIncomePlanned += plannedValue;
                    monthIncomeRealized += realizedValue;
                    dataRow++;
                }

                // Sem Categoria
                int semCategoriaRow = 6 + fixedCount + variableCount + incomeCount;
                
                // Despesas sem categoria (não transferências)
                decimal uncategorizedExpenses = monthGroup
                    .Where(t => (t.CategoryId == null || !categories.Any(c => c.Id == t.CategoryId)) && !t.IsTransfer && t.Value < 0)
                    .Sum(t => Math.Abs(t.Value));

                // Receitas sem categoria (não transferências)
                decimal uncategorizedIncome = monthGroup
                    .Where(t => (t.CategoryId == null || !categories.Any(c => c.Id == t.CategoryId)) && !t.IsTransfer && t.Value > 0)
                    .Sum(t => t.Value);

                // Log de transações sem categoria
                foreach (var t in monthGroup.Where(t => (t.CategoryId == null || !categories.Any(c => c.Id == t.CategoryId)) && !t.IsTransfer))
                {
                    _logger.LogInformation($"Transação sem categoria: Data={t.TransactionDateTime:d}, Valor={t.Value:C2}, Descrição={t.Description}");
                }

                // Transferências
                var transfersIn = monthGroup
                    .Where(t => t.IsTransfer && bankAccounts.Any(a => t.DestinationBankAccountId == a.Id))
                    .ToList();

                var transfersOut = monthGroup
                    .Where(t => t.IsTransfer && bankAccounts.Any(a => t.BankAccountId == a.Id))
                    .ToList();

                monthTransfersIn = transfersIn.Sum(t => t.Value);
                monthTransfersOut = transfersOut.Sum(t => Math.Abs(t.Value));

                // Log de transferências
                foreach (var t in transfersIn)
                {
                    _logger.LogInformation($"Transferência entrada: Data={t.TransactionDateTime:d}, Valor={t.Value:C2}, Descrição={t.Description}");
                }
                foreach (var t in transfersOut)
                {
                    _logger.LogInformation($"Transferência saída: Data={t.TransactionDateTime:d}, Valor={t.Value:C2}, Descrição={t.Description}");
                }

                budgetWorksheet.Cells[semCategoriaRow, currentColumn].Value = 0;
                budgetWorksheet.Cells[semCategoriaRow, currentColumn + 1].Value = uncategorizedExpenses;
                budgetWorksheet.Cells[semCategoriaRow, currentColumn, semCategoriaRow, currentColumn + 1].Style.Numberformat.Format = "R$ #,##0.00";

                if (uncategorizedExpenses > 0)
                    budgetWorksheet.Cells[semCategoriaRow, currentColumn + 1].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                // Adicionar valores sem categoria aos totais
                monthExpensesRealized += uncategorizedExpenses;
                monthIncomeRealized += uncategorizedIncome;

                // TOTAL está em linha: (6 + fixedCount + variableCount + incomeCount)
                int totalRowForMonth = 7 + fixedCount + variableCount + incomeCount;

                // Somar totais (apenas despesas)
                decimal monthTotalPlanned = monthExpensesPlanned;
                decimal monthTotalRealized = monthExpensesRealized;

                budgetWorksheet.Cells[totalRowForMonth, currentColumn].Value = monthTotalPlanned;
                budgetWorksheet.Cells[totalRowForMonth, currentColumn + 1].Value = monthTotalRealized;
                budgetWorksheet.Cells[totalRowForMonth, currentColumn, totalRowForMonth, currentColumn + 1].Style.Numberformat.Format = "R$ #,##0.00";

                if (monthTotalRealized > monthTotalPlanned)
                    budgetWorksheet.Cells[totalRowForMonth, currentColumn + 1].Style.Font.Color.SetColor(System.Drawing.Color.Red);

                // Cálculo do saldo: Saldo Inicial + Receitas - Despesas
                decimal plannedBalance = initialBalance + monthIncomePlanned - monthExpensesPlanned;
                decimal realizedBalance = initialBalance;

                /*
                 * Lógica de cálculo do saldo realizado:
                 * 1. Começamos com o saldo inicial do mês
                 * 2. Processamos cada transação em ordem cronológica
                 * 3. Para transferências:
                 *    - Só consideramos o valor se for entre contas diferentes
                 *    - Isso evita dupla contagem quando transferindo entre contas próprias
                 * 4. Para transações normais:
                 *    - Receitas: Valor positivo é somado ao saldo
                 *    - Despesas: Valor negativo é subtraído do saldo
                 */
                foreach (var transaction in monthGroup.OrderBy(t => t.TransactionDateTime))
                {
                    if (transaction.IsTransfer)
                    {
                        // Para transferências, só considerar se for entre contas diferentes
                        if (transaction.BankAccountId != transaction.DestinationBankAccountId)
                        {
                            realizedBalance += transaction.Value;
                        }
                    }
                    else
                    {
                        realizedBalance += transaction.Value;
                    }
                }

                // Log detalhado para auditoria
                _logger.LogInformation($"Mês: {monthName}");
                _logger.LogInformation($"Saldo Inicial: {initialBalance:C2}");
                _logger.LogInformation($"Receitas Totais: {monthIncomeRealized:C2}");
                _logger.LogInformation($"Despesas Totais: {monthExpensesRealized:C2}");
                _logger.LogInformation($"Transferências Entrada: {monthTransfersIn:C2}");
                _logger.LogInformation($"Transferências Saída: {monthTransfersOut:C2}");
                _logger.LogInformation($"Saldo Final: {realizedBalance:C2}");
                _logger.LogInformation("--------------------");

                // Escrever os valores do saldo na linha 2
                budgetWorksheet.Cells[2, currentColumn].Value = plannedBalance;
                budgetWorksheet.Cells[2, currentColumn + 1].Value = realizedBalance;
                budgetWorksheet.Cells[2, currentColumn, 2, currentColumn + 1].Style.Numberformat.Format = "R$ #,##0.00";

                if (realizedBalance < plannedBalance)
                    budgetWorksheet.Cells[2, currentColumn + 1].Style.Font.Color.SetColor(System.Drawing.Color.Red);
                else
                    budgetWorksheet.Cells[2, currentColumn + 1].Style.Font.Color.SetColor(System.Drawing.Color.Green);

                // Atualizar saldo inicial para o próximo mês
                initialBalance = realizedBalance;

                // Log de auditoria
                LogBalanceCalculation(new DateTime(monthGroup.Key.Year, monthGroup.Key.Month, 1), initialBalance, monthIncomeRealized, monthExpensesRealized, monthTransfersIn, monthTransfersOut, realizedBalance, monthGroup);

                currentColumn += 2;
            }

            // Ajustar largura das colunas
            budgetWorksheet.Column(1).Width = 40; // Descrição das categorias
            for (int col = 2; col <= currentColumn; col++)
            {
                budgetWorksheet.Column(col).Width = 15; // Valores
            }

            // Adicionar bordas em toda a planilha
            var usedRange = budgetWorksheet.Cells[1, 1, totalRow, currentColumn - 1];
            usedRange.Style.Border.Top.Style = ExcelBorderStyle.Thin;
            usedRange.Style.Border.Left.Style = ExcelBorderStyle.Thin;
            usedRange.Style.Border.Right.Style = ExcelBorderStyle.Thin;
            usedRange.Style.Border.Bottom.Style = ExcelBorderStyle.Thin;

            // Formatar números em toda a planilha
            for (int col = 2; col <= currentColumn - 1; col++)
            {
                var columnRange = budgetWorksheet.Cells[2, col, totalRow, col];
                columnRange.Style.Numberformat.Format = "R$ #,##0.00";
            }

            // Alinhar valores à direita
            for (int col = 2; col <= currentColumn - 1; col++)
            {
                var columnRange = budgetWorksheet.Cells[1, col, totalRow, col];
                columnRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Right;
            }

            // Alinhar categorias à esquerda
            var categoriesRange = budgetWorksheet.Cells[1, 1, totalRow, 1];
            categoriesRange.Style.HorizontalAlignment = ExcelHorizontalAlignment.Left;

            // Salvar o arquivo
            var fileBytes = package.GetAsByteArray();
            return base.File(fileBytes, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "orcamento.xlsx");
        }

        private string GetExcelColumnName(int columnNumber)
        {
            string columnName = "";

            while (columnNumber > 0)
            {
                int modulo = (columnNumber - 1) % 26;
                columnName = Convert.ToChar('A' + modulo) + columnName;
                columnNumber = (columnNumber - modulo) / 26;
            }

            return columnName;
        }

        private void LogBalanceCalculation(DateTime month, decimal initialBalance, decimal monthIncomeRealized, 
            decimal monthExpensesRealized, decimal monthTransfersIn, decimal monthTransfersOut, decimal realizedBalance,
            IEnumerable<TransactionViewModel> monthTransactions)
        {
            var sb = new System.Text.StringBuilder();
            sb.AppendLine($"\n=== Auditoria de Saldo - {month:MM/yyyy} ===");
            sb.AppendLine($"Saldo Inicial: {initialBalance:C2}");
            sb.AppendLine($"(+) Receitas: {monthIncomeRealized:C2}");
            sb.AppendLine($"(-) Despesas: {monthExpensesRealized:C2}");
            sb.AppendLine($"(+) Transferências Entrada: {monthTransfersIn:C2}");
            sb.AppendLine($"(-) Transferências Saída: {monthTransfersOut:C2}");
            sb.AppendLine($"(=) Saldo Final: {realizedBalance:C2}");
            
            // Detalhamento das transações
            sb.AppendLine("\nDetalhamento das Transações:");
            
            // Receitas
            sb.AppendLine("\nReceitas:");
            foreach (var t in monthTransactions.Where(t => !t.IsTransfer && t.Value > 0).OrderByDescending(t => t.Value))
            {
                sb.AppendLine($"{t.TransactionDateTime:dd/MM} - {t.Description}: {t.Value:C2} ({t.CategoryId})");
            }

            // Despesas
            sb.AppendLine("\nDespesas:");
            foreach (var t in monthTransactions.Where(t => !t.IsTransfer && t.Value < 0).OrderByDescending(t => Math.Abs(t.Value)))
            {
                sb.AppendLine($"{t.TransactionDateTime:dd/MM} - {t.Description}: {t.Value:C2} ({t.CategoryId})");
            }

            // Transferências
            sb.AppendLine("\nTransferências:");
            foreach (var t in monthTransactions.Where(t => t.IsTransfer).OrderByDescending(t => Math.Abs(t.Value)))
            {
                sb.AppendLine($"{t.TransactionDateTime:dd/MM} - {t.Description}: {t.Value:C2} (De: {t.BankAccountId} Para: {t.DestinationBankAccountId})");
            }

            // Gravar em arquivo
            var logPath = Path.Combine(Path.GetTempPath(), $"auditoria_saldo_{month:yyyyMM}.txt");
            System.IO.File.WriteAllText(logPath, sb.ToString());
            Console.WriteLine($"Log de auditoria gravado em: {logPath}");
        }
    }
}

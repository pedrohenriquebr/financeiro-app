import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { BankAccountService } from '../../../services/bank-account.service';
import { ImportTransactionGridComponent } from './import-transaction-grid/import-transaction-grid.component';
import { ImportTransactionDto } from './models/import-transaction.dto';
import * as Papa from 'papaparse';
import { DescriptionMappingService } from '../../../services/description-mapping.service';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ImportTransactionFormComponent } from './import-transaction-form/import-transaction-form.component';
import { TransactionService } from '../../../services/transaction.service'; // Added import statement

@Component({
  selector: 'app-import-transactions',
  templateUrl: './import-transactions.component.html',
  styleUrls: ['./import-transactions.component.scss']
})
export class ImportTransactionsComponent implements OnInit {
  @ViewChild('stepper') stepper!: MatStepper;
  @ViewChild(ImportTransactionGridComponent) grid!: ImportTransactionGridComponent;

  fileForm: FormGroup;
  columnMappingForm: FormGroup;
  accountForm: FormGroup;
  bankAccounts: any[] = [];
  transactions: ImportTransactionDto[] = [];
  availableColumns: string[] = [];
  csvData: any[] = [];

  constructor(
    private fb: FormBuilder,
    private bankAccountService: BankAccountService,
    private descriptionMappingService: DescriptionMappingService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ImportTransactionsComponent>,
    private dialog: MatDialog,
    private transactionService: TransactionService // Added to constructor
  ) {
    this.fileForm = this.fb.group({
      file: [null, Validators.required]
    });

    this.columnMappingForm = this.fb.group({
      descriptionColumn: ['', Validators.required],
      amountColumn: ['', Validators.required],
      dateColumn: ['', Validators.required]
    });

    this.accountForm = this.fb.group({
      bankAccountId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadBankAccounts();
  }

  loadBankAccounts() {
    this.bankAccountService.getAll().subscribe(
      accounts => this.bankAccounts = accounts
    );
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.fileForm.patchValue({ file });
      this.parseCSV(file);
    }
  }

  
  parseCSV(file: File) {
    Papa.parse(file, {
      complete: (result) => {
        this.csvData = result.data;
        if (this.csvData.length > 0) {
          this.availableColumns = Object.keys(this.csvData[0]);
          this.autoMapColumns();
        }
      },
      header: true,
      skipEmptyLines: true,
      delimiter: ';',
      transform: (value, field) => {
        // Se o campo for uma data (você pode adicionar uma verificação mais robusta aqui)
        if (value.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          return this.parseBrazilianDate(value);
        }
        return value;
      }
    });
  }

  private parseBrazilianDate(dateStr: string): Date {
    const [day, month, year] = dateStr.split('/').map(Number);
    return new Date(year, month - 1, day);
  }


  autoMapColumns() {
    const columnMap = {
      description: ['descricao', 'descrição', 'desc', 'description'],
      amount: ['valor', 'amount', 'quantia', 'value'],
      date: ['data', 'date', 'dt']
    };

    for (const field of Object.keys(columnMap)) {
      const possibleNames = columnMap[field as keyof typeof columnMap];
      const matchedColumn = this.availableColumns.find(col => 
        possibleNames.some(name => col.toLowerCase().includes(name))
      );
      
      if (matchedColumn) {
        this.columnMappingForm.patchValue({ [`${field}Column`]: matchedColumn });
      }
    }
  }

  mapTransactions() {
    const formValue = this.columnMappingForm.value;
    const accountFormValue = this.accountForm.value;
    const selectedAccount = this.bankAccounts.find(acc => acc.id === accountFormValue.bankAccountId);

    if (!selectedAccount) {
      this.snackBar.open('Conta bancária não encontrada', 'Fechar', { duration: 3000 });
      return;
    }

    // Get all unique descriptions
    const descriptions = [...new Set(this.csvData.map(row => row[formValue.descriptionColumn]))];

    // Fetch category mappings for all descriptions
    forkJoin(
      descriptions.map(desc =>
        this.descriptionMappingService.findMatchingMapping(desc).pipe(
          catchError(() => of(null))
        )
      )
    ).subscribe(categoryMappings => {
      const descriptionToCategoryMap = new Map<string, { id: number | null, name: string | null }>();
      
      descriptions.forEach((desc, index) => {
        const mapping = categoryMappings[index];
        descriptionToCategoryMap.set(desc, mapping ? { 
          id: mapping.categoryId, 
          name: mapping.categoryName 
        } : { 
          id: null, 
          name: null 
        });
      });

      this.transactions = this.csvData.map((row): ImportTransactionDto => {
        const description = row[formValue.descriptionColumn];
        const categoryMapping = descriptionToCategoryMap.get(description);
        const amount = parseFloat(row[formValue.amountColumn]);
        const type = amount >= 0 ? 'INCOME' : 'EXPENSE';

        return {
          description,
          amount: amount,
          date: row[formValue.dateColumn],
          type,
          categoryId: categoryMapping?.id || null,
          categoryName: categoryMapping?.name || null,
          bankAccountId: selectedAccount.id,
          bankAccountName: selectedAccount.name
        };
      });

      if (this.grid) {
        this.grid.dataSource.data = [...this.transactions];
      }
    });
  }

  private parseAmount(value: string): number {
    if (typeof value === 'number') return value;
    return Number(value.replace(/[^0-9.-]+/g, ''));
  }

  private determineTransactionType(amount: string): 'INCOME' | 'EXPENSE' {
    const numericAmount = this.parseAmount(amount);
    return numericAmount >= 0 ? 'INCOME' : 'EXPENSE';
  }

  onStepChange(event: any) {
    //TODO: exibir um progress spinner enquanto os dados estiverem sendo carregados
    //após o carregamento, ocultar o spinner e exibir o grid
    //está ocorrendo um bug: após selecionar a conta e avançar a próxima etapa
    //o grid não carrega os dados de primeira,
    //é necessário voltar uma etapa, e avancar novamente 
    //para que aparecem os dados na grid
    if (event.selectedIndex === 3) { // Index of the grid step
      this.mapTransactions();
    }
  }

  importTransactions() {
    if (!this.transactions.length) {
      this.snackBar.open('Não há transações para importar', 'Fechar', { duration: 3000 });
      return;
    }

    const transactionsToImport = this.transactions.map(t => ({
      description: t.description,
      value: t.amount,
      transactionDateTime: t.date.toISOString(),
      categoryId: t.categoryId,
      bankAccountId: t.bankAccountId,
      isTransfer: false,
      isRecurring: false,
      recurrenceType: 0, // None
      recurrenceFrequency: 0,
      recurrenceEndDate: null
    }));

    this.transactionService.importTransactions(transactionsToImport)
      .subscribe({
        next: (result) => {
          this.snackBar.open('Transações importadas com sucesso!', 'Fechar', { duration: 3000 });
          this.dialogRef.close(result);
        },
        error: (error) => {
          console.error('Erro ao importar transações:', error);
          this.snackBar.open('Erro ao importar transações. Por favor, tente novamente.', 'Fechar', { duration: 3000 });
        }
      });
  }

  close() {
    this.dialogRef.close();
  }

  onTransactionEdit(transaction: ImportTransactionDto) {
    const dialogRef = this.dialog.open(ImportTransactionFormComponent, {
      width: '600px',
      data: transaction
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.transactions.findIndex(t => t === transaction);
        if (index !== -1) {
          this.transactions[index] = { ...result };
          if (this.grid) {
            this.grid.dataSource.data = [...this.transactions];
          }
        }
      }
    });
  }

  onTransactionDelete(transaction: ImportTransactionDto) {
    const index = this.transactions.findIndex(t => t === transaction);
    if (index !== -1) {
      this.transactions.splice(index, 1);
      if (this.grid) {
        this.grid.dataSource.data = [...this.transactions];
      }
    }
  }

  onSelectionChange(selectedTransactions: ImportTransactionDto[]) {
    // Handle selection change if needed
    console.log('Selected transactions:', selectedTransactions);
  }
}

import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin } from 'rxjs';
import * as Plotly from 'plotly.js-dist-min';
import { CategoryService } from '../../services/category.service';
import { TransactionService } from '../../services/transaction.service';
import { BankAccount, BankAccountService } from '../../services/bank-account.service';
import { FinancialGoalService } from '../../services/financial-goal.service';
import { ScheduledTransactionService } from '../../services/scheduled-transaction.service';
import { FinancialGoalDialogComponent } from './financial-goal-dialog/financial-goal-dialog.component';
import { Category } from '../../models/category.model';
import { DashboardData, DashboardFilter } from '../../models/dashboard.model';
import { CategoryAnalysis, FinancialGoal } from '../../models/financial-goal.model';
import { Transaction } from '../../models/transaction.model';
import { ScheduledTransaction } from '../../models/scheduled-transaction.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('cashFlowChart') cashFlowChart: ElementRef | undefined;
  @ViewChild('accountDistributionChart') accountDistributionChart: ElementRef | undefined;
  @ViewChild('projectionChart') projectionChart: ElementRef | undefined;
  @ViewChild('categoryChart') categoryChart: ElementRef | undefined;

  //@ts-ignore
  filterForm: FormGroup;
  totalBalance = 0;
  monthlyIncome = 0;
  monthlyExpenses = 0;
  monthOverMonthChange = 0;
  savingsRate = 0;
  transactionCount = 0;
  averageTransaction = 0;
  lastUpdate = new Date();
  
  bankAccounts: BankAccount[] = [];
  categories: CategoryAnalysis[] = [];
  accountBalances: any[] = [];
  topCategories: any[] = [];
  financialGoals: FinancialGoal[] = [];
  upcomingTransactions: ScheduledTransaction[] = [];
  selectedCategoryType = 'expenses';
  monthlyTransactions: any[] = [];
  expenseCategories: any[] = [];
  incomeCategories: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private transactionService: TransactionService,
    private bankAccountService: BankAccountService,
    private financialGoalService: FinancialGoalService,
    private scheduledTransactionService: ScheduledTransactionService
  ) {
    this.initializeForm();
  }

  ngOnInit() {
    this.loadData();
    this.filterForm.valueChanges.subscribe(() => {
      this.loadData();
    });
  }

  private initializeForm() {
    this.filterForm = this.fb.group({
      startDate: [new Date(new Date().getFullYear(), new Date().getMonth(), 1)],
      endDate: [new Date()],
      bankAccountIds: [[]],
      categoryIds: [[]],
      groupBy: ['month']
    });
  }

  private loadData() {
    const filters: DashboardFilter = this.filterForm.value;
    
    forkJoin({
      dashboard: this.transactionService.getDashboardData(filters),
      accounts: this.bankAccountService.getAll(),
      categories: this.categoryService.getTopCategories({
        startDate: filters.startDate,
        endDate: filters.endDate
      }),
      goals: this.financialGoalService.getGoals(),
      scheduled: this.scheduledTransactionService.getScheduledTransactions(),
      statistics: this.transactionService.getStatistics()
    }).subscribe({
      next: (data) => {
        console.log('Dashboard Data:', data);
        this.updateDashboardData(data);
        this.bankAccounts = data.accounts;
        this.financialGoals = data.goals;
        this.upcomingTransactions = data.scheduled;
        
        const stats = data.statistics;
        this.monthlyIncome = stats.totalIncome;
        this.monthlyExpenses = stats.totalExpenses;
        this.totalBalance = stats.balance;
        
        this.renderCharts();
        this.calculateDerivedMetrics();
      },
      error: (error) => {
        console.error('Error loading dashboard data:', error);
      }
    });
  }

  private updateDashboardData(data: any) {
    console.log('Updating dashboard data:', data);
    
    const dashboardData = data.dashboard;
    
    if (dashboardData?.overview) {
      this.totalBalance = dashboardData.overview.totalBalance;
      this.monthlyIncome = dashboardData.overview.totalIncome;
      this.monthlyExpenses = dashboardData.overview.totalExpenses;
      this.transactionCount = dashboardData.overview.totalTransactions;
      this.averageTransaction = dashboardData.overview.averageTransactionAmount;
      this.lastUpdate = new Date(dashboardData.overview.lastUpdateDate);
    }

    if (dashboardData?.bankAccountBalances) {
      this.accountBalances = dashboardData.bankAccountBalances;
    }

    if (dashboardData?.monthlyTransactions) {
      this.monthlyTransactions = dashboardData.monthlyTransactions;
    }

    // Handle categories
    if (data.categories) {
      // Split categories into income and expenses based on totalAmount
      this.expenseCategories = data.categories
        .filter(c => c.totalAmount < 0)
        .map(c => ({
          name: c.categoryName,
          total: Math.abs(c.totalAmount),
          transactionCount: c.transactions,
          percentageOfTotal: Math.abs(c.percentageOfTotal)
        }));

      this.incomeCategories = data.categories
        .filter(c => c.totalAmount >= 0)
        .map(c => ({
          name: c.categoryName,
          total: c.totalAmount,
          transactionCount: c.transactions,
          percentageOfTotal: c.percentageOfTotal
        }));
    }

    if (data.goals) {
      this.financialGoals = data.goals;
    }

    if (data.scheduled) {
      this.upcomingTransactions = data.scheduled;
    }

    // Calculate derived metrics
    const previousMonthTotal = dashboardData?.previousMonthTotal || 0;
    this.monthOverMonthChange = previousMonthTotal !== 0 ? 
      (this.totalBalance - previousMonthTotal) / Math.abs(previousMonthTotal) : 0;
    
    this.savingsRate = this.monthlyIncome !== 0 ? 
      (this.monthlyIncome - Math.abs(this.monthlyExpenses)) / this.monthlyIncome : 0;

    this.renderCharts();
  }

  private renderCharts() {
    if (this.monthlyTransactions?.length > 0) {
      this.renderCashFlowChart();
    }
    if (this.accountBalances?.length > 0) {
      this.renderAccountDistributionChart();
    }
    if (this.monthlyTransactions?.length > 0) {
      this.renderProjectionChart();
    }
    
    // Verifica se há categorias de despesa ou receita antes de renderizar
    const hasCategories = 
      (this.selectedCategoryType === 'expenses' && this.expenseCategories?.length > 0) ||
      (this.selectedCategoryType === 'income' && this.incomeCategories?.length > 0);
    
    if (hasCategories) {
      this.renderCategoryChart();
    } else {
      console.log('No categories available for:', this.selectedCategoryType);
    }
  }

  private renderCashFlowChart() {
    if (!this.cashFlowChart || !this.monthlyTransactions?.length) {
      console.log('No monthly transactions data for cash flow chart');
      return;
    }

    // Sort transactions by date and ensure dates are properly formatted
    const sortedTransactions = [...this.monthlyTransactions].sort((a, b) => {
      const dateA = this.parseDate(a.period);
      const dateB = this.parseDate(b.period);
      return dateA.getTime() - dateB.getTime();
    });

    const dates = sortedTransactions.map(t => this.parseDate(t.period));
    const incomes = sortedTransactions.map(t => t.income || 0);
    const expenses = sortedTransactions.map(t => Math.abs(t.expenses || 0));
    const balances = sortedTransactions.map(t => t.balance || 0);

    console.log('Cash Flow Data:', { dates, incomes, expenses, balances });

    const data = [
      {
        x: dates,
        y: incomes,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Receitas',
        line: { color: '#4caf50', width: 2 }
      },
      {
        x: dates,
        y: expenses,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Despesas',
        line: { color: '#f44336', width: 2 }
      },
      {
        x: dates,
        y: balances,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Saldo',
        line: { color: '#2196f3', width: 2 }
      }
    ];

    const layout = {
      title: 'Fluxo de Caixa Mensal',
      xaxis: { 
        title: 'Data',
        type: 'date',
        tickformat: '%d/%m/%Y'
      },
      yaxis: { 
        title: 'Valor (R$)',
        tickformat: ',.2f',
        tickprefix: 'R$ '
      },
      showlegend: true,
      legend: { orientation: 'h', y: -0.2 },
      hovermode: 'x unified'
    };

    Plotly.newPlot(this.cashFlowChart.nativeElement, data, layout);
  }

  private renderAccountDistributionChart() {
    if (!this.accountBalances?.length) {
      console.log('No account balances data');
      return;
    }

    // Filter out accounts with zero balance
    const accountsWithBalance = this.accountBalances.filter(a => a.currentBalance !== 0);
    
    if (accountsWithBalance.length === 0) {
      console.log('No accounts with non-zero balance found');
      return;
    }

    console.log('Accounts for distribution chart:', accountsWithBalance);

    const data = [{
      values: accountsWithBalance.map(a => Math.abs(a.currentBalance)),
      labels: accountsWithBalance.map(a => a.bankAccountName),
      type: 'pie',
      hole: 0.4,
      textinfo: 'label+percent',
      hovertemplate: '%{label}<br>R$ %{value:,.2f}<br>%{percent}<extra></extra>'
    }];

    const layout = {
      title: 'Distribuição por Conta',
      showlegend: true,
      legend: { orientation: 'h', y: -0.2 }
    };

    //@ts-ignore
    Plotly.newPlot(this.accountDistributionChart.nativeElement, data, layout);
  }

  private renderProjectionChart() {
    if (!this.monthlyTransactions?.length) {
      console.log('No monthly transactions data for projection chart');
      return;
    }

    // Sort transactions by date
    const sortedTransactions = [...this.monthlyTransactions].sort((a, b) => {
      const dateA = this.parseDate(a.period);
      const dateB = this.parseDate(b.period);
      return dateA.getTime() - dateB.getTime();
    });

    // Get last 12 months of data for more accurate projection
    const last12Months = sortedTransactions.slice(-12);
    
    if (last12Months.length < 3) {
      console.log('Not enough data for projection (need at least 3 months)');
      return;
    }

    const historicalDates = last12Months.map(t => this.parseDate(t.period));
    
    // Calculate net cash flow (income - expenses) for trend analysis
    const historicalCashFlow = last12Months.map(t => t.income - Math.abs(t.expenses));
    const historicalBalances = last12Months.map(t => t.balance);

    // Calculate moving averages
    const movingAverageWindow = 3;
    const smoothedCashFlow = this.calculateMovingAverage(historicalCashFlow, movingAverageWindow);
    const smoothedBalances = this.calculateMovingAverage(historicalBalances, movingAverageWindow);

    // Calculate linear regression using smoothed values
    const xHistorical = Array.from(Array(smoothedBalances.length).keys());
    const balanceSlope = this.calculateSlope(xHistorical, smoothedBalances);
    const balanceIntercept = this.calculateIntercept(xHistorical, smoothedBalances);
    const cashFlowSlope = this.calculateSlope(xHistorical, smoothedCashFlow);

    // Generate future dates (next 6 months)
    const lastDate = historicalDates[historicalDates.length - 1];
    const projectionMonths = 6;
    const futureDates = Array.from(Array(projectionMonths).keys()).map(i => {
      const date = new Date(lastDate);
      date.setMonth(date.getMonth() + i + 1);
      return date;
    });

    // Project future balances considering both current trend and cash flow trend
    const lastBalance = smoothedBalances[smoothedBalances.length - 1];
    const projectedValues = Array.from(Array(projectionMonths).keys()).map(i => {
      const x = xHistorical.length + i;
      const projectedBalance = balanceSlope * x + balanceIntercept;
      const cashFlowImpact = cashFlowSlope * i;
      return projectedBalance + cashFlowImpact;
    });

    // Calculate confidence intervals based on historical volatility
    const volatility = this.calculateVolatility(historicalBalances);
    const upperBound = projectedValues.map(val => val * (1 + volatility));
    const lowerBound = projectedValues.map(val => val * (1 - volatility));

    console.log('Projection Data:', {
      historicalDates,
      historicalBalances,
      smoothedBalances,
      historicalCashFlow,
      smoothedCashFlow,
      futureDates,
      projectedValues,
      upperBound,
      lowerBound,
      balanceSlope,
      cashFlowSlope,
      volatility
    });

    const data = [
      {
        x: historicalDates,
        y: historicalBalances,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Histórico',
        line: { color: '#2196f3', width: 2 }
      },
      {
        x: historicalDates,
        y: smoothedBalances,
        type: 'scatter',
        mode: 'lines',
        name: 'Média Móvel',
        line: { 
          color: '#ff9800',
          width: 1,
          dash: 'dot'
        },
        showlegend: false
      },
      {
        x: futureDates,
        y: projectedValues,
        type: 'scatter',
        mode: 'lines',
        name: 'Projeção',
        line: { 
          color: '#9c27b0',
          width: 2,
          dash: 'dash'
        }
      },
      {
        x: [...futureDates, ...futureDates.slice().reverse()],
        y: [...upperBound, ...lowerBound.slice().reverse()],
        fill: 'toself',
        fillcolor: 'rgba(156, 39, 176, 0.1)',
        line: { color: 'transparent' },
        name: 'Intervalo de Confiança',
        showlegend: true,
        type: 'scatter'
      }
    ];

    const layout = {
      title: 'Projeção Financeira',
      xaxis: { 
        title: 'Data',
        type: 'date',
        tickformat: '%d/%m/%Y'
      },
      yaxis: { 
        title: 'Saldo (R$)',
        tickformat: ',.2f',
        tickprefix: 'R$ ',
        automargin: true,
        rangemode: 'tozero'
      },
      showlegend: true,
      legend: { orientation: 'h', y: -0.2 },
      hovermode: 'x unified',
      plot_bgcolor: 'white',
      paper_bgcolor: 'white',
      margin: { 
        t: 30,
        r: 20,
        b: 60,
        l: 80  // Increased left margin for large numbers
      }
    };

    const config = {
      responsive: true,
      displayModeBar: false
    };

    if (!this.projectionChart?.nativeElement) {
      console.log('Projection chart element not found');
      return;
    }

    Plotly.newPlot(this.projectionChart.nativeElement, data, layout, config);
  }

  private calculateMovingAverage(values: number[], window: number): number[] {
    return values.map((_, index) => {
      const start = Math.max(0, index - window + 1);
      const end = index + 1;
      const windowValues = values.slice(start, end);
      return windowValues.reduce((sum, val) => sum + val, 0) / windowValues.length;
    });
  }

  private calculateVolatility(values: number[]): number {
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const squaredDiffs = values.map(val => Math.pow(val - mean, 2));
    const variance = squaredDiffs.reduce((sum, val) => sum + val, 0) / values.length;
    return Math.min(Math.sqrt(variance) / Math.abs(mean), 0.2); // Cap at 20% volatility
  }

  public renderCategoryChart() {
    if (!this.categoryChart?.nativeElement) {
      console.log('Category chart element not found');
      return;
    }

    const categories = this.selectedCategoryType === 'expenses' 
      ? this.expenseCategories 
      : this.incomeCategories;

    if (!categories || categories.length === 0) {
      console.log(`No ${this.selectedCategoryType} categories data`);
      return;
    }

    console.log(`Rendering ${this.selectedCategoryType} categories:`, categories);

    // Sort categories by total amount
    const sortedCategories = [...categories].sort((a, b) => Math.abs(b.total) - Math.abs(a.total));
    
    // Take top 10 categories
    const topCategories = sortedCategories.slice(0, 10);

    const data = [{
      x: topCategories.map(c => c.name),
      y: topCategories.map(c => Math.abs(c.total)),
      type: 'bar',
      marker: {
        color: this.selectedCategoryType === 'expenses' ? '#f44336' : '#4caf50'
      },
      text: topCategories.map(c => `${c.transactionCount} transações<br>${(c.percentageOfTotal).toFixed(1)}% do total`),
      hovertemplate: 'R$ %{y:,.2f}<br>%{text}<extra></extra>'
    }];

    const layout = {
      title: `Top ${this.selectedCategoryType === 'expenses' ? 'Despesas' : 'Receitas'} por Categoria`,
      xaxis: { 
        title: 'Categoria',
        tickangle: -45,
        automargin: true
      },
      yaxis: { 
        title: 'Valor (R$)',
        tickformat: ',.2f',
        tickprefix: 'R$ ',
        automargin: true
      },
      margin: {
        b: 120,
        l: 100,
        r: 20,
        t: 50
      },
      plot_bgcolor: 'white',
      paper_bgcolor: 'white'
    };

    const config = {
      responsive: true,
      displayModeBar: false
    };

    Plotly.newPlot(this.categoryChart.nativeElement, data, layout, config);
  }

  private calculateSlope(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const sumXY = x.reduce((a, b, i) => a + b * y[i], 0);
    const sumXX = x.reduce((a, b) => a + b * b, 0);
    return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  }

  private calculateIntercept(x: number[], y: number[]): number {
    const n = x.length;
    const sumX = x.reduce((a, b) => a + b, 0);
    const sumY = y.reduce((a, b) => a + b, 0);
    const slope = this.calculateSlope(x, y);
    return (sumY - slope * sumX) / n;
  }

  calculateMonthlyGoalAmount(goal: FinancialGoal): number {
    const remainingAmount = goal.targetAmount - goal.currentAmount;
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const monthsRemaining = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
      (targetDate.getMonth() - today.getMonth());
    return monthsRemaining > 0 ? remainingAmount / monthsRemaining : remainingAmount;
  }

  getRemainingTime(goal: FinancialGoal): string {
    const today = new Date();
    const targetDate = new Date(goal.targetDate);
    const months = (targetDate.getFullYear() - today.getFullYear()) * 12 + 
      (targetDate.getMonth() - today.getMonth());
    
    if (months <= 0) return 'Prazo expirado';
    if (months < 12) return `${months} meses`;
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} anos${remainingMonths > 0 ? ` e ${remainingMonths} meses` : ''}`;
  }

  openGoalDialog(goal?: FinancialGoal) {
    const dialogRef = this.dialog.open(FinancialGoalDialogComponent, {
      width: '400px',
      data: goal
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadData();
      }
    });
  }

  private calculateDerivedMetrics() {
    // Additional metrics can be calculated here if needed
  }

  private parseDate(dateStr: string): Date {
    if (!dateStr) return new Date();
    
    // Try parsing ISO format first
    let date = new Date(dateStr);
    if (!isNaN(date.getTime())) return date;

    // Try parsing dd/mm/yyyy format
    const parts = dateStr.split('/');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) return date;
    }

    // Try parsing Brazilian format dd/mm/yyyy with time
    const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{4})(?: \d{2}:\d{2}(?::\d{2})?)?$/);
    if (match) {
      const [, day, month, year] = match;
      date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
      if (!isNaN(date.getTime())) return date;
    }

    console.error('Invalid date format:', dateStr);
    return new Date(); // Fallback to current date if parsing fails
  }
}

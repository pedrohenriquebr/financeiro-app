# FinanceiroApp API Documentation

## Transactions

### Get All Transactions
```http
GET /api/transactions
```
Returns a list of all transactions with their details.

**Response** (200 OK)
```json
[
  {
    "id": 1,
    "description": "Grocery Shopping",
    "amount": 150.00,
    "date": "2024-01-15T10:30:00Z",
    "importedDate": null,
    "categoryId": 1,
    "categoryName": "Food",
    "bankAccountId": 1,
    "bankAccountName": "Main Account",
    "isTransfer": false,
    "destinationBankAccountId": null,
    "destinationBankAccountName": null,
    "isRecurring": false,
    "recurrenceType": 0,
    "recurrenceFrequency": null,
    "recurrenceEndDate": null,
    "parentTransactionId": null
  }
]
```

### Get Transaction by ID
```http
GET /api/transactions/{id}
```
Returns a specific transaction by ID.

**Parameters**
- `id` (path) - Transaction ID

**Response** (200 OK)
```json
{
  "id": 1,
  "description": "Grocery Shopping",
  "amount": 150.00,
  "date": "2024-01-15T10:30:00Z",
  "importedDate": null,
  "categoryId": 1,
  "categoryName": "Food",
  "bankAccountId": 1,
  "bankAccountName": "Main Account",
  "isTransfer": false,
  "destinationBankAccountId": null,
  "destinationBankAccountName": null,
  "isRecurring": false,
  "recurrenceType": 0,
  "recurrenceFrequency": null,
  "recurrenceEndDate": null,
  "parentTransactionId": null
}
```

### Create Transaction
```http
POST /api/transactions
```
Creates a new transaction.

**Request Body**
```json
{
  "description": "Grocery Shopping",
  "amount": 150.00,
  "date": "2024-01-15T10:30:00Z",
  "categoryId": 1,
  "bankAccountId": 1,
  "isTransfer": false,
  "destinationBankAccountId": null,
  "isRecurring": false,
  "recurrenceType": null,
  "recurrenceFrequency": null,
  "recurrenceEndDate": null
}
```

### Update Transaction
```http
PUT /api/transactions/{id}
```
Updates an existing transaction.

**Parameters**
- `id` (path) - Transaction ID

**Request Body**
```json
{
  "description": "Updated Grocery Shopping",
  "amount": 160.00,
  "date": "2024-01-15T10:30:00Z",
  "categoryId": 1,
  "bankAccountId": 1,
  "isTransfer": false,
  "destinationBankAccountId": null,
  "isRecurring": false,
  "recurrenceType": null,
  "recurrenceFrequency": null,
  "recurrenceEndDate": null
}
```

### Delete Transaction
```http
DELETE /api/transactions/{id}
```
Deletes a transaction.

**Parameters**
- `id` (path) - Transaction ID

**Response** (204 No Content)

### Get Transactions by Date Range
```http
GET /api/transactions/byDate
```
Returns transactions within the specified date range.

**Parameters**
- `startDate` (query) - Start date (format: YYYY-MM-DD)
- `endDate` (query) - End date (format: YYYY-MM-DD)

### Get Transactions by Category
```http
GET /api/transactions/byCategory/{categoryId}
```
Returns all transactions for a specific category.

**Parameters**
- `categoryId` (path) - Category ID

### Get Transactions by Account
```http
GET /api/transactions/byAccount/{accountId}
```
Returns all transactions for a specific bank account.

**Parameters**
- `accountId` (path) - Bank Account ID

### Import Transactions
```http
POST /api/transactions/import
```
Imports multiple transactions.

**Request Body**
```json
[
  {
    "description": "Imported Transaction",
    "value": 150.00,
    "transactionDateTime": "2024-01-15T10:30:00Z",
    "categoryId": 1,
    "bankAccountId": 1,
    "isTransfer": false,
    "isRecurring": false,
    "recurrenceType": 0,
    "recurrenceFrequency": null,
    "recurrenceEndDate": null
  }
]
```

### Get Account Balance
```http
GET /api/transactions/balance/{accountId}
```
Returns the current balance for a specific account.

**Parameters**
- `accountId` (path) - Bank Account ID

### Get Statistics
```http
GET /api/transactions/statistics
```
Returns overall financial statistics.

**Response** (200 OK)
```json
{
  "totalIncome": 5000.00,
  "totalExpenses": 3000.00,
  "balance": 2000.00
}
```

### Get Dashboard Data
```http
GET /api/transactions/dashboard
```
Returns comprehensive dashboard data including overview, balances, and trends.

**Parameters**
- `startDate` (query, optional) - Start date for filtering
- `endDate` (query, optional) - End date for filtering
- `bankAccountIds` (query, optional) - Array of bank account IDs
- `categoryIds` (query, optional) - Array of category IDs

**Response** (200 OK)
```json
{
  "overview": {
    "totalBalance": 2000.00,
    "totalIncome": 5000.00,
    "totalExpenses": 3000.00,
    "totalTransactions": 50,
    "averageTransactionAmount": 100.00,
    "lastUpdateDate": "2024-01-15T10:30:00Z"
  },
  "bankAccountBalances": [
    {
      "bankAccountId": 1,
      "bankAccountName": "Main Account",
      "initialBalance": 1000.00,
      "currentBalance": 2000.00,
      "totalIncome": 3000.00,
      "totalExpenses": 2000.00,
      "totalTransfers": 0.00
    }
  ],
  "monthlyTransactions": [
    {
      "period": "2024-01",
      "income": 5000.00,
      "expenses": 3000.00,
      "balance": 2000.00,
      "transactionCount": 25
    }
  ],
  "yearlyTransactions": [
    {
      "period": "2024",
      "income": 60000.00,
      "expenses": 36000.00,
      "balance": 24000.00,
      "transactionCount": 300
    }
  ],
  "previousMonthTotal": 1500.00
}
```

### Export Budget
```http
GET /api/transactions/export-budget
```
Exports transaction data to an Excel file.

**Response**
Returns an Excel file containing detailed budget information.

## Categories

### Get All Categories
```http
GET /api/categories
```
Returns a list of all categories.

**Response** (200 OK)
```json
[
  {
    "id": 1,
    "name": "Food",
    "type": "Expense",
    "nature": "Fixed",
    "plannedAmount": 1000.00,
    "parentCategoryId": null,
    "isActive": true
  }
]
```

### Create Category
```http
POST /api/categories
```
Creates a new category.

**Request Body**
```json
{
  "name": "New Category",
  "type": "Expense",
  "nature": "Fixed",
  "plannedAmount": 1000.00,
  "parentCategoryId": null
}
```

**Response** (200 OK)
```json
{
  "id": 2,
  "name": "New Category",
  "type": "Expense",
  "nature": "Fixed",
  "plannedAmount": 1000.00,
  "parentCategoryId": null,
  "isActive": true
}
```

### Get Category by ID
```http
GET /api/categories/{id}
```

**Parameters**
- `id` (path) - Category ID

**Response** (200 OK)
```json
{
  "id": 1,
  "name": "Food",
  "type": "Expense",
  "nature": "Fixed",
  "plannedAmount": 1000.00,
  "parentCategoryId": null,
  "isActive": true
}
```

### Update Category
```http
PUT /api/categories/{id}
```

**Parameters**
- `id` (path) - Category ID

**Request Body**
```json
{
  "name": "Updated Category",
  "type": "Income",
  "nature": "Variable",
  "plannedAmount": 2000.00,
  "parentCategoryId": null,
  "isActive": true
}
```

**Response** (200 OK)
```json
{
  "id": 1,
  "name": "Updated Category",
  "type": "Income",
  "nature": "Variable",
  "plannedAmount": 2000.00,
  "parentCategoryId": null,
  "isActive": true
}
```

### Delete Category
```http
DELETE /api/categories/{id}
```

**Parameters**
- `id` (path) - Category ID

**Response** (204 No Content)

## Description Mappings

### Get All Description Mappings
```http
GET /api/descriptionMappings
```
Returns a list of all description mappings.

**Response** (200 OK)
```json
[
  {
    "id": 1,
    "pattern": "GROCERY*",
    "description": "Grocery Shopping",
    "categoryId": 1,
    "categoryName": "Food"
  }
]
```

### Create Description Mapping
```http
POST /api/descriptionMappings
```
Creates a new description mapping.

**Request Body**
```json
{
  "pattern": "GROCERY*",
  "description": "Grocery Shopping",
  "categoryId": 1
}
```

**Response** (200 OK)
```json
{
  "id": 1,
  "pattern": "GROCERY*",
  "description": "Grocery Shopping",
  "categoryId": 1,
  "categoryName": "Food"
}
```

### Get Description Mapping by ID
```http
GET /api/descriptionMappings/{id}
```

**Parameters**
- `id` (path) - Description Mapping ID

**Response** (200 OK)
```json
{
  "id": 1,
  "pattern": "GROCERY*",
  "description": "Grocery Shopping",
  "categoryId": 1,
  "categoryName": "Food"
}
```

### Update Description Mapping
```http
PUT /api/descriptionMappings/{id}
```

**Parameters**
- `id` (path) - Description Mapping ID

**Request Body**
```json
{
  "pattern": "GROCERY-*",
  "description": "Grocery Store",
  "categoryId": 1
}
```

**Response** (200 OK)
```json
{
  "id": 1,
  "pattern": "GROCERY-*",
  "description": "Grocery Store",
  "categoryId": 1,
  "categoryName": "Food"
}
```

### Delete Description Mapping
```http
DELETE /api/descriptionMappings/{id}
```

**Parameters**
- `id` (path) - Description Mapping ID

**Response** (204 No Content)

### Match Description
```http
GET /api/descriptionMappings/match/{description}
```

**Parameters**
- `description` (path) - Transaction description to match

**Response** (200 OK)
```json
{
  "id": 1,
  "pattern": "GROCERY*",
  "description": "Grocery Shopping",
  "categoryId": 1,
  "categoryName": "Food"
}
```

## Financial Goals

### Get All Financial Goals
```http
GET /api/financialGoals
```
Returns a list of all financial goals.

**Response** (200 OK)
```json
[
  {
    "id": 1,
    "name": "Emergency Fund",
    "targetAmount": 10000.00,
    "currentAmount": 5000.00,
    "deadline": "2024-12-31T23:59:59Z",
    "status": "InProgress"
  }
]
```

### Create Financial Goal
```http
POST /api/financialGoals
```
Creates a new financial goal.

**Request Body**
```json
{
  "name": "New Goal",
  "targetAmount": 5000.00,
  "currentAmount": 0.00,
  "deadline": "2024-12-31T23:59:59Z"
}
```

**Response** (200 OK)
```json
{
  "id": 2,
  "name": "New Goal",
  "targetAmount": 5000.00,
  "currentAmount": 0.00,
  "deadline": "2024-12-31T23:59:59Z",
  "status": "InProgress"
}
```

### Get Financial Goal by ID
```http
GET /api/financialGoals/{id}
```

**Parameters**
- `id` (path) - Financial Goal ID

**Response** (200 OK)
```json
{
  "id": 1,
  "name": "Emergency Fund",
  "targetAmount": 10000.00,
  "currentAmount": 5000.00,
  "deadline": "2024-12-31T23:59:59Z",
  "status": "InProgress"
}
```

### Update Financial Goal
```http
PUT /api/financialGoals/{id}
```

**Parameters**
- `id` (path) - Financial Goal ID

**Request Body**
```json
{
  "name": "Updated Goal",
  "targetAmount": 15000.00,
  "currentAmount": 5000.00,
  "deadline": "2024-12-31T23:59:59Z"
}
```

**Response** (200 OK)
```json
{
  "id": 1,
  "name": "Updated Goal",
  "targetAmount": 15000.00,
  "currentAmount": 5000.00,
  "deadline": "2024-12-31T23:59:59Z",
  "status": "InProgress"
}
```

### Delete Financial Goal
```http
DELETE /api/financialGoals/{id}
```

**Parameters**
- `id` (path) - Financial Goal ID

**Response** (204 No Content)

## Banks

### Get All Banks
```http
GET /api/banks
```
Returns a list of all banks.

**Response** (200 OK)
```json
[
  {
    "id": 1,
    "name": "Example Bank",
    "code": "EXB",
    "isActive": true
  }
]
```

### Create Bank
```http
POST /api/banks
```
Creates a new bank.

**Request Body**
```json
{
  "name": "New Bank",
  "code": "NBK"
}
```

**Response** (200 OK)
```json
{
  "id": 2,
  "name": "New Bank",
  "code": "NBK",
  "isActive": true
}
```

### Get Bank by ID
```http
GET /api/banks/{id}
```

**Parameters**
- `id` (path) - Bank ID

**Response** (200 OK)
```json
{
  "id": 1,
  "name": "Example Bank",
  "code": "EXB",
  "isActive": true
}
```

### Update Bank
```http
PUT /api/banks/{id}
```

**Parameters**
- `id` (path) - Bank ID

**Request Body**
```json
{
  "name": "Updated Bank",
  "code": "UBK",
  "isActive": true
}
```

**Response** (200 OK)
```json
{
  "id": 1,
  "name": "Updated Bank",
  "code": "UBK",
  "isActive": true
}
```

### Delete Bank
```http
DELETE /api/banks/{id}
```

**Parameters**
- `id` (path) - Bank ID

**Response** (204 No Content)

## Bank Accounts

### Get All Bank Accounts
```http
GET /api/bankAccounts
```
Returns a list of all bank accounts.

**Response** (200 OK)
```json
[
  {
    "id": 1,
    "name": "Main Account",
    "bankId": 1,
    "bankName": "Example Bank",
    "balance": 1000.00,
    "type": "Checking",
    "isActive": true
  }
]
```

### Create Bank Account
```http
POST /api/bankAccounts
```
Creates a new bank account.

**Request Body**
```json
{
  "name": "New Account",
  "bankId": 1,
  "type": "Checking",
  "initialBalance": 0.00
}
```

**Response** (200 OK)
```json
{
  "id": 2,
  "name": "New Account",
  "bankId": 1,
  "bankName": "Example Bank",
  "balance": 0.00,
  "type": "Checking",
  "isActive": true
}
```

### Get Bank Account by ID
```http
GET /api/bankAccounts/{id}
```

**Parameters**
- `id` (path) - Bank Account ID

**Response** (200 OK)
```json
{
  "id": 1,
  "name": "Main Account",
  "bankId": 1,
  "bankName": "Example Bank",
  "balance": 1000.00,
  "type": "Checking",
  "isActive": true
}
```

### Update Bank Account
```http
PUT /api/bankAccounts/{id}
```

**Parameters**
- `id` (path) - Bank Account ID

**Request Body**
```json
{
  "name": "Updated Account",
  "bankId": 1,
  "type": "Savings",
  "isActive": true
}
```

**Response** (200 OK)
```json
{
  "id": 1,
  "name": "Updated Account",
  "bankId": 1,
  "bankName": "Example Bank",
  "balance": 1000.00,
  "type": "Savings",
  "isActive": true
}
```

### Delete Bank Account
```http
DELETE /api/bankAccounts/{id}
```

**Parameters**
- `id` (path) - Bank Account ID

**Response** (204 No Content)

### Get Bank Account Transactions
```http
GET /api/bankAccounts/{id}/transactions
```

**Parameters**
- `id` (path) - Bank Account ID

**Response** (200 OK)
```json
[
  {
    "id": 1,
    "description": "Transaction 1",
    "amount": 100.00,
    "date": "2024-01-15T10:30:00Z",
    "categoryId": 1,
    "categoryName": "Category 1",
    "bankAccountId": 1,
    "bankAccountName": "Main Account"
  }
]
```

## Scheduled Transactions

### Get All Scheduled Transactions
```http
GET /api/scheduledTransactions
```
Returns a list of all scheduled transactions.

**Response** (200 OK)
```json
[
  {
    "id": 1,
    "description": "Monthly Rent",
    "amount": 1000.00,
    "nextDate": "2024-02-01T00:00:00Z",
    "categoryId": 1,
    "categoryName": "Housing",
    "bankAccountId": 1,
    "bankAccountName": "Main Account",
    "recurrenceType": "Monthly",
    "recurrenceFrequency": 1,
    "recurrenceEndDate": "2024-12-31T23:59:59Z"
  }
]
```

### Create Scheduled Transaction
```http
POST /api/scheduledTransactions
```
Creates a new scheduled transaction.

**Request Body**
```json
{
  "description": "New Scheduled Payment",
  "amount": 500.00,
  "nextDate": "2024-02-01T00:00:00Z",
  "categoryId": 1,
  "bankAccountId": 1,
  "recurrenceType": "Monthly",
  "recurrenceFrequency": 1,
  "recurrenceEndDate": "2024-12-31T23:59:59Z"
}
```

**Response** (200 OK)
```json
{
  "id": 2,
  "description": "New Scheduled Payment",
  "amount": 500.00,
  "nextDate": "2024-02-01T00:00:00Z",
  "categoryId": 1,
  "categoryName": "Housing",
  "bankAccountId": 1,
  "bankAccountName": "Main Account",
  "recurrenceType": "Monthly",
  "recurrenceFrequency": 1,
  "recurrenceEndDate": "2024-12-31T23:59:59Z"
}
```

### Get Scheduled Transaction by ID
```http
GET /api/scheduledTransactions/{id}
```

**Parameters**
- `id` (path) - Scheduled Transaction ID

**Response** (200 OK)
```json
{
  "id": 1,
  "description": "Monthly Rent",
  "amount": 1000.00,
  "nextDate": "2024-02-01T00:00:00Z",
  "categoryId": 1,
  "categoryName": "Housing",
  "bankAccountId": 1,
  "bankAccountName": "Main Account",
  "recurrenceType": "Monthly",
  "recurrenceFrequency": 1,
  "recurrenceEndDate": "2024-12-31T23:59:59Z"
}
```

### Update Scheduled Transaction
```http
PUT /api/scheduledTransactions/{id}
```

**Parameters**
- `id` (path) - Scheduled Transaction ID

**Request Body**
```json
{
  "description": "Updated Scheduled Payment",
  "amount": 1200.00,
  "nextDate": "2024-02-01T00:00:00Z",
  "categoryId": 1,
  "bankAccountId": 1,
  "recurrenceType": "Monthly",
  "recurrenceFrequency": 1,
  "recurrenceEndDate": "2024-12-31T23:59:59Z"
}
```

**Response** (200 OK)
```json
{
  "id": 1,
  "description": "Updated Scheduled Payment",
  "amount": 1200.00,
  "nextDate": "2024-02-01T00:00:00Z",
  "categoryId": 1,
  "categoryName": "Housing",
  "bankAccountId": 1,
  "bankAccountName": "Main Account",
  "recurrenceType": "Monthly",
  "recurrenceFrequency": 1,
  "recurrenceEndDate": "2024-12-31T23:59:59Z"
}
```

### Delete Scheduled Transaction
```http
DELETE /api/scheduledTransactions/{id}
```

**Parameters**
- `id` (path) - Scheduled Transaction ID

**Response** (204 No Content)

### Process Scheduled Transactions
```http
POST /api/scheduledTransactions/process
```
Processes all due scheduled transactions and creates actual transactions.

**Response** (200 OK)
```json
{
  "processedCount": 2,
  "createdTransactions": [
    {
      "id": 100,
      "description": "Monthly Rent",
      "amount": 1000.00,
      "date": "2024-02-01T00:00:00Z",
      "categoryId": 1,
      "categoryName": "Housing",
      "bankAccountId": 1,
      "bankAccountName": "Main Account"
    }
  ]
}

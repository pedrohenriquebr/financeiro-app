import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CategoryListComponent } from './features/category/category-list/category-list.component';
import { CategoryFormComponent } from './features/category/category-form/category-form.component';
import { TransactionListComponent } from './features/transactions/transaction-list/transaction-list.component';
import { TransactionFormComponent } from './features/transactions/transaction-form/transaction-form.component';
import { BankAccountListComponent } from './features/bank-account/bank-account-list/bank-account-list.component';
import { BankAccountFormComponent } from './features/bank-account/bank-account-form/bank-account-form.component';
import { DescriptionMappingFormComponent } from './features/description-mapping/description-mapping-form/description-mapping-form.component';
import { DescriptionMappingListComponent } from './features/description-mapping/description-mapping-list/description-mapping-list.component';
import { LandingComponent } from './features/auth/landing/landing.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: LandingComponent },
  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule),
    canActivate: [AuthGuard]
  },
  { path: 'categories', component: CategoryListComponent, canActivate: [AuthGuard] },
  { path: 'categories/new', component: CategoryFormComponent, canActivate: [AuthGuard] },
  { path: 'categories/edit/:id', component: CategoryFormComponent, canActivate: [AuthGuard] },
  { path: 'transactions', component: TransactionListComponent, canActivate: [AuthGuard] },
  { path: 'transactions/new', component: TransactionFormComponent, canActivate: [AuthGuard] },
  { path: 'transactions/edit/:id', component: TransactionFormComponent, canActivate: [AuthGuard] },
  { path: 'bank-accounts', component: BankAccountListComponent, canActivate: [AuthGuard] },
  { path: 'bank-accounts/new', component: BankAccountFormComponent, canActivate: [AuthGuard] },
  { path: 'bank-accounts/edit/:id', component: BankAccountFormComponent, canActivate: [AuthGuard] },
  { path: 'description-mappings', component: DescriptionMappingListComponent, canActivate: [AuthGuard] },
  { path: 'description-mappings/new', component: DescriptionMappingFormComponent, canActivate: [AuthGuard] },
  { path: 'description-mappings/edit/:id', component: DescriptionMappingFormComponent, canActivate: [AuthGuard] },
  {
    path: 'banks',
    loadChildren: () => import('./features/banks/bank.module').then(m => m.BankModule),
    canActivate: [AuthGuard]
  },
  {
    path: 'financial-goals',
    loadChildren: () => import('./features/financial-goals/financial-goals.module').then(m => m.FinancialGoalsModule),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

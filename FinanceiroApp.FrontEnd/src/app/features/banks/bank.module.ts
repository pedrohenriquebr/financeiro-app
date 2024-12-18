import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../components/shared/shared.module';
import { BankListComponent } from './bank-list/bank-list.component';
import { BankFormComponent } from './bank-form/bank-form.component';

@NgModule({
  declarations: [
    BankListComponent,
    BankFormComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild([
      { path: '', component: BankListComponent },
      { path: 'new', component: BankFormComponent },
      { path: 'edit/:id', component: BankFormComponent }
    ])
  ]
})
export class BankModule { }

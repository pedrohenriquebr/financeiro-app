import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpreadsheetComponent } from './spreadsheet.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SpreadsheetComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SpreadsheetComponent }
    ]),
  ],
  exports: [
    SpreadsheetComponent
  ]
})
export class SpreadsheetModule { }

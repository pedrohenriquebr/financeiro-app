import * as core from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DescriptionMappingFormComponent } from './description-mapping-form/description-mapping-form.component';
import { DescriptionMappingListComponent } from './description-mapping-list/description-mapping-list.component';
import { SharedModule } from '../../components/shared/shared.module';
import { HelpDialogComponent } from './help-dialog/help-dialog.component';

@core.NgModule({
  declarations: [
    DescriptionMappingFormComponent,
    DescriptionMappingListComponent,
    HelpDialogComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    SharedModule
  ],
  exports: [
    DescriptionMappingListComponent,
    DescriptionMappingFormComponent
  ]
})
export class DescriptionMappingModule { }

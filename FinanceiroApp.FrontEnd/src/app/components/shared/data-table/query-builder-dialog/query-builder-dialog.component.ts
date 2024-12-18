import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { QueryBuilderConfig, QueryGroup } from '../../query-builder/models/query-builder.models';

@Component({
  selector: 'app-query-builder-dialog',
  templateUrl: './query-builder-dialog.component.html',
  styleUrls: ['./query-builder-dialog.component.scss']
})
export class QueryBuilderDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<QueryBuilderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      config: QueryBuilderConfig;
      group: QueryGroup;
    }
  ) {}

  onQueryChange(query: QueryGroup): void {
    this.data.group = query;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onApply(): void {
    this.dialogRef.close(this.data.group);
  }
}

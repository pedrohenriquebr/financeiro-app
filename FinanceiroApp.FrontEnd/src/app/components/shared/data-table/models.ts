export interface TableColumn {
  property: string;
  label: string;
  type?: 'text' | 'date' | 'currency' | 'number';
  format?: string;
  sortable?: boolean;
  transform?: (value: any) => any;
}

export interface TableAction {
  icon: string;
  tooltip: string;
  color?: string;
  type: string;
}

export interface ActionEvent {
  action: TableAction;
  row: any;
}

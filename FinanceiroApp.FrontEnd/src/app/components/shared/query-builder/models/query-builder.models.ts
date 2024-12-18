export interface QueryFieldOption {
  value: any;
  label: string;
}

export interface QueryField {
  field: string;
  label: string;
  dataType: 'string' | 'number' | 'date' | 'boolean' | 'select';
  operators?: string[];
  options?: QueryFieldOption[];
}

export interface QueryCondition {
  field: string;
  operator: string;
  value: any;
}

export interface QueryGroup {
  type: 'AND' | 'OR';
  conditions: (QueryCondition | QueryGroup)[];
}

export interface QueryBuilderConfig {
  fields: QueryField[];
  defaultOperators?: {
    string: string[];
    number: string[];
    date: string[];
    boolean: string[];
    select: string[];
  };
}

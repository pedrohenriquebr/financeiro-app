import { Component, EventEmitter, Input, OnInit, Output, Query } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { QueryBuilderConfig, QueryCondition, QueryFieldOption, QueryGroup } from '../models/query-builder.models';

@Component({
  selector: 'app-query-builder',
  templateUrl: './query-builder.component.html',
  styleUrls: ['./query-builder.component.scss']
})
export class QueryBuilderComponent implements OnInit {


  @Input() config!: QueryBuilderConfig;
  @Input() rootGroup!: QueryGroup;
  @Output() queryChange = new EventEmitter<QueryGroup>();

  defaultOperators = {
    string: ['contains', 'equals', 'startsWith', 'endsWith'],
    number: ['equals', 'greaterThan', 'lessThan', 'between'],
    date: ['equals', 'before', 'after', 'between'],
    boolean: ['equals'],
    select: ['equals', 'notEquals']
  };

  isQueryGroup(item: QueryGroup | QueryCondition): item is QueryGroup {
    return 'type' in item;
  }

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.config.defaultOperators = this.config.defaultOperators || this.defaultOperators;
  }

  addCondition(group: QueryGroup) {
    const field = this.config.fields[0];
    const condition: QueryCondition = {
      field: field.field,
      operator: field.operators?.[0] || this.getDefaultOperators(field.dataType)[0],
      value: null
    };
    group.conditions.push(condition);
    this.emitChange();
  }

  addGroup(parentGroup: QueryGroup) {
    const newGroup: QueryGroup = {
      type: 'AND',
      conditions: []
    };
    parentGroup.conditions.push(newGroup);
    this.emitChange();
  }

  removeCondition(group: QueryGroup, index: number) {
    group.conditions.splice(index, 1);
    this.emitChange();
  }

  removeGroup(parentGroup: QueryGroup, index: number) {
    parentGroup.conditions.splice(index, 1);
    this.emitChange();
  }

  toggleGroupType(group: any) {
    if ('type' in group) {
      group.type = group.type === 'AND' ? 'OR' : 'AND';
    }
    this.emitChange();
  }

  getOperatorsForField(field: string): string[] {
    debugger;
    const fieldConfig = this.config.fields.find(f => f.field === field);
    return fieldConfig?.operators || this.getDefaultOperators(fieldConfig?.dataType || 'string');
  }

  private getDefaultOperators(dataType: string): string[] {
    return this.config.defaultOperators?.[dataType as keyof typeof this.defaultOperators] || [];
  }

  isSelect(x: QueryCondition): boolean {
    const field = this.config.fields.find(f => f.field === x.field);
    return field?.dataType === 'select';
  }

  getOptionsForField(field: string): QueryFieldOption[] {
    const fieldConfig = this.config.fields.find(f => f.field === field);
    return fieldConfig?.options || [];
  }

  private emitChange() {
    this.queryChange.emit(this.rootGroup);
  }
}

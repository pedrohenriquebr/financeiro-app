export enum CategoryType {
  Expense = 0,
  Income = 1
}

export enum CategoryNature {
  Fixed = 0,
  Variable = 1
}

export interface Category {
  id: number;
  name: string;
  type: CategoryType;
  nature: CategoryNature;
  plannedAmount: number;
}

export interface CreateCategoryDto {
  name: string;
  type: CategoryType;
  nature: CategoryNature;
  plannedAmount: number;
}

export interface UpdateCategoryDto {
  name: string;
  type: CategoryType;
  nature: CategoryNature;
  plannedAmount: number;
}

import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Category } from '../models/category.model';
import { mockCategories } from './mock-data';

@Injectable({
  providedIn: 'root'
})
export class MockCategoryService {
  private categories: Category[] = [...mockCategories];

  getAll(): Observable<Category[]> {
    return of(this.categories);
  }

  getById(id: number): Observable<Category|null> {
    const category = this.categories.find(c => c.id === id);
    return of(category || null);
  }

  create(category: Category): Observable<Category> {
    const newCategory = {
      ...category,
      id: Math.max(...this.categories.map(c => c.id), 0) + 1,
      createdAt: new Date(),
      updatedAt: null
    };
    this.categories.push(newCategory);
    return of(newCategory);
  }

  update(id: number, category: Category): Observable<Category|null> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) {
      return of(null);
    }

    const updatedCategory = {
      ...category,
      id,
      updatedAt: new Date()
    };
    this.categories[index] = updatedCategory;
    return of(updatedCategory);
  }

  delete(id: number): Observable<void> {
    const index = this.categories.findIndex(c => c.id === id);
    if (index !== -1) {
      this.categories.splice(index, 1);
    }
    return of(void 0);
  }
}

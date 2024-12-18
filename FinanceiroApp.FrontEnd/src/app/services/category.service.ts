import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';
import { CategoryAnalysis } from '../models/financial-goal.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(this.apiUrl);
  }

  getById(id: number): Observable<Category> {
    return this.http.get<Category>(`${this.apiUrl}/${id}`);
  }

  create(category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.post<Category>(this.apiUrl, category);
  }

  update(id: number, category: Omit<Category, 'id'>): Observable<Category> {
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // Get top categories with their analysis
  getTopCategories(filter?: { startDate?: Date, endDate?: Date }): Observable<CategoryAnalysis[]> {
    let params = new HttpParams();
    
    if (filter?.startDate) {
      params = params.set('startDate', filter.startDate.toISOString());
    }
    if (filter?.endDate) {
      params = params.set('endDate', filter.endDate.toISOString());
    }

    return this.http.get<any[]>(`${this.apiUrl}/top`, { params }).pipe(
      map(categories => categories.map(cat => ({
        categoryId: cat.id,
        categoryName: cat.name,
        totalAmount: cat.totalAmount,
        percentageOfTotal: cat.percentageOfTotal,
        trend: cat.trend || 0,
        transactions: cat.transactionCount || 0
      })))
    );
  }
}

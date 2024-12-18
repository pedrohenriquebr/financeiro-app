import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Bank {
  id: number;
  name: string;
  code: string;
}

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private apiUrl = `${environment.apiUrl}/banks`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<Bank[]> {
    return this.http.get<Bank[]>(this.apiUrl);
  }

  getById(id: number): Observable<Bank> {
    return this.http.get<Bank>(`${this.apiUrl}/${id}`);
  }
}

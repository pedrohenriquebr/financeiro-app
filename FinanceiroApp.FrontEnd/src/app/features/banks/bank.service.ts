import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Bank {
  id?: number;
  name: string;
  code: string;
}

export interface CreateBankDTO {
  name: string;
  code: string;
}

export interface UpdateBankDTO {
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

  create(bank: CreateBankDTO): Observable<Bank> {
    return this.http.post<Bank>(this.apiUrl, bank);
  }

  update(id: number, bank: UpdateBankDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, bank);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}

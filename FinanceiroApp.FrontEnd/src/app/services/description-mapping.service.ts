import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { DescriptionMapping, CreateDescriptionMappingDto, UpdateDescriptionMappingDto } from '../models/description-mapping.model';

@Injectable({
  providedIn: 'root'
})
export class DescriptionMappingService {
  private apiUrl = `${environment.apiUrl}/descriptionmappings`;

  constructor(private http: HttpClient) { }

  getAll(): Observable<DescriptionMapping[]> {
    return this.http.get<DescriptionMapping[]>(this.apiUrl);
  }

  getById(id: number): Observable<DescriptionMapping> {
    return this.http.get<DescriptionMapping>(`${this.apiUrl}/${id}`);
  }

  create(mapping: CreateDescriptionMappingDto): Observable<DescriptionMapping> {
    return this.http.post<DescriptionMapping>(this.apiUrl, mapping);
  }

  update(id: number, mapping: UpdateDescriptionMappingDto): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, mapping);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  findMatchingMapping(description: string): Observable<DescriptionMapping> {
    return this.http.get<DescriptionMapping>(`${this.apiUrl}/match/${encodeURIComponent(description)}`);
  }

  applyMappings(): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/apply`, {});
  }
}

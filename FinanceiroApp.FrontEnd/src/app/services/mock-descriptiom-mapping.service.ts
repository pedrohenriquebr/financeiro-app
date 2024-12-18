import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { DescriptionMapping, CreateDescriptionMappingDto, UpdateDescriptionMappingDto } from "../models/description-mapping.model";

@Injectable({
    providedIn: 'root'
  })
  export class MockDescriptionMappingService{
    private descriptionMapping: Map<string, string> = new Map<string, string>([
      ['Salário', 'Salário'],
      ['Supermercado', 'Supermercado'],
      ['Restaurante', 'Restaurante'],
      ['Transporte', 'Transporte'],
    ]);
  
    findMatchingMapping(description: string): Observable<DescriptionMapping|null> {
      const mappedCategory = this.descriptionMapping.get(description);
      if (mappedCategory) {
        return of({ id: 1, pattern: description, categoryId: 1, categoryName: mappedCategory });
      } else {
        return of(null);
      }
    }
  
    
    getAll(): Observable<DescriptionMapping[]> {
      return of(Array.from(this.descriptionMapping.entries()).map(([pattern, categoryName]) => ({ pattern, categoryId: 1, categoryName, id: 1 })));
    }
  
    getById(id: number): Observable<DescriptionMapping> {
      return of({ id: 1, pattern: 'Teste', categoryId: 1, categoryName: 'Teste' });
    }
  
    create(mapping: CreateDescriptionMappingDto): Observable<DescriptionMapping> {
      return of({ id: 1, ...mapping, categoryId: 1, categoryName: '' });
    }
  
    update(id: number, mapping: UpdateDescriptionMappingDto): Observable<void> {
      return of(undefined);
    }
  
    delete(id: number): Observable<void> {
      return of(undefined);
    }
  }
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DriveInfoService {
  private readonly apiUrl = `${environment.apiUrl}/driveinfo`;

  constructor(private http: HttpClient) { }

  authenticate(userEmail: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/authenticate`, { userEmail });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }
}

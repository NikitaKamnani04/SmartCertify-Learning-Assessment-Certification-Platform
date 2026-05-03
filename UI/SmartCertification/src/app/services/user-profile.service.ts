import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { UserModel } from '../models/usermodel';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
 
  private baseUrl = `${environment.apiUrl}/User`;

  constructor(private http: HttpClient) { }

  getUserProfile(id: number): Observable<UserModel> {
    return this.http.get<UserModel>(`${this.baseUrl}/${id}`);
  }
  updateProfile(formData: FormData) {
    return this.http.post(`${this.baseUrl}/updateProfile`, formData);
  }
}

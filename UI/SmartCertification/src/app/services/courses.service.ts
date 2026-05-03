import {  Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Course } from '../models/course';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CoursesService {
  
  private baseUrl = `${environment.apiUrl}/Courses`;
  constructor(private http: HttpClient) { }

  getAllCourses(): Observable<Course[]> {
    return this.http.get<Course[]>(`${this.baseUrl}`);
  }

createCourse(data: any) {
    return this.http.post(this.baseUrl, data);
  }

  updateCourse(id: number, data: any) {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }

  getCourseById(id: number): Observable<Course> {
  return this.http.get<Course>(`${this.baseUrl}/${id}`);
}

  updateDescription(id: number, description: string) {
  return this.http.patch(`${this.baseUrl}/${id}`, {
    description: description
  });
}
}

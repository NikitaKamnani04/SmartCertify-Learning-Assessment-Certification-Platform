import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { LoginService } from './login.service';
import { QuestionDto } from '../models/question';
import { Observable } from 'rxjs';
import { Question } from '../models/exam-models';

@Injectable({
  providedIn: 'root'
})
export class QuestionService {

   private baseUrl = `${environment.apiUrl}/questions`;
  constructor(private http: HttpClient, private loginService: LoginService) { }

  createQuestion(question: QuestionDto): Observable<any>{
  return this.http.post(`${this.baseUrl}/CreateQuestionChoices`, question);
}

 updateQuestion(question: QuestionDto): Observable<any>{
  return this.http.put(
    `${this.baseUrl}/UpdateQuestionAndChoices/${question.questionId}`,
    question
  );
}

  getQuestions(): Observable<QuestionDto[]>{
    return this.http.get<QuestionDto[]>(`${this.baseUrl}`);
  }

  deleteQuestion(questionId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${questionId}`);
  }

  getQuestionById(id: number) {
    return this.http.get<QuestionDto>(`${this.baseUrl}/${id}`);
  }

 getCourses() {
  return this.http.get<any[]>(`${environment.apiUrl}/courses`);
}

getQuestionsByCourse(courseId: number) {
  return this.http.get(`${this.baseUrl}/by-course/${courseId}`);
}
}

import { Component } from '@angular/core';
import { UserExam } from '../../../models/exam-models';
import { ExamService } from '../../../services/exam.service';
import { LoginService } from '../../../services/login.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user-exams',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './user-exams.html',
  styleUrl: './user-exams.css',
})
export class UserExams {
userExams: UserExam[] = [];
userId: number = 0;

  constructor(private examService: ExamService, private router: Router,
    private loginService: LoginService
  ) {}

  ngOnInit(): void {
    this.userId = this.loginService.userId;

    const userId = 1 // Replace with actual user ID
    this.examService.getUserExams(userId).subscribe((data) => {
      this.userExams = data;
    });
  }

  resumeExam(examId: number): void {
    this.router.navigate(['/exam'], { state: { examId }, queryParams: { examId } });
  }
  takeToCompletedExam(examId: number): void {
    this.router.navigate(['/exam/view-result'], { state: { examId }, queryParams: { examId } });
  }
}

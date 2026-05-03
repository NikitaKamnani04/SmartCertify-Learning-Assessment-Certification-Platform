import { Component, Input } from '@angular/core';
import { Course } from '../../../models/course';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StartExamComponent } from '../start-exam/start-exam';

@Component({
  selector: 'app-exam',
  imports: [FormsModule,CommonModule, StartExamComponent],
  templateUrl: './exam.html',
  styleUrl: './exam.css',
})
export class Exam {
 
  examId: number | null = null;
  selectedCourse: Course | null = null;
  @Input() existingExamId!: number;

  constructor(private router: Router, private route: ActivatedRoute)
  {
     const navigation = this.router.getCurrentNavigation();
     const state = navigation?.extras.state as {examId: number} | undefined;
     this.examId = state?.examId ?? null;
  }

   ngOnInit(): void {
    if (!this.examId) {
      // Fallback to query parameters
      this.route.queryParams.subscribe((params) => {
        this.examId = +params['examId'] || null;

        if (!this.examId) {
          console.error('Exam ID not found in state or query parameters');
          this.router.navigate(['/user-exams']); 
        }
      });
    }
  }

}

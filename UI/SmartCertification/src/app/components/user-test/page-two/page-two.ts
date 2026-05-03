import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Course } from '../../../models/course';
import { Router } from '@angular/router';
import { CoursesService } from '../../../services/courses.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-page-two',
  imports: [CommonModule],
  templateUrl: './page-two.html',
  styleUrls: ['./page-two.css'],
})
export class PageTwo {
    @Input() course: Course | undefined | null = null;
  constructor(private router: Router, private courseService: CoursesService) {}

  ngOnInit(): void {
    const courseId = sessionStorage.getItem('courseId');

    if (courseId) {
      this.loadCourse(+courseId);
    } else {
      console.error("CourseId not found");
    }
  }

  loadCourse(id: number) {
  this.courseService.getCourseById(id).subscribe({
    next: (res: Course ) => {
      this.course = res;
      console.log("Course loaded:", res);
    },
    error: (err: any) => {
      console.error("Error loading course", err);
    }
  });
}
  
   goBack(): void {
    this.router.navigate(['/face-capture']);
    console.log('Navigating back to the previous page');
    // Add navigation logic 
  }

  startExam(): void {
    //trigger next page to start the exam
    this.router.navigate(['/exam/start-exam']);
    console.log('Starting the exam');
    // Add navigation to the exam page logic
     
  }

}

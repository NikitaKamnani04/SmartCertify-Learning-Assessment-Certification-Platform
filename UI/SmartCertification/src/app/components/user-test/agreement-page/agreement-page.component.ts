import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Course } from '../../../models/course';
import { CoursesService } from '../../../services/courses.service';

import { PageOneComponent } from '../page-one/page-one.component';
import { CommonModule } from '@angular/common';
import { PageTwo } from '../page-two/page-two';
import { FormsModule } from '@angular/forms';
import { StartExamComponent } from '../start-exam/start-exam';

@Component({
  selector: 'app-agreement-page',
  imports: [FormsModule, CommonModule, PageOneComponent, PageTwo, StartExamComponent],
  templateUrl: './agreement-page.component.html',
  styleUrl: './agreement-page.component.css'
})
export class AgreementPageComponent implements OnInit {
  userId: number =0;
  currentPage: number = 1;
  courses: Course[]=[];
  courseId: number=0;
  selectedCourse: Course | undefined | null = null;

 

  constructor(private router: Router, private courseService: CoursesService)
  {}

  ngOnInit() {
  const courseId = sessionStorage.getItem('courseId');

  if (courseId) {
    this.courseId = +courseId;
  }

  this.courseService.getAllCourses().subscribe((courses: Course[]) => {
    this.courses = courses;

    this.selectedCourse = this.courses.find(
      c => c.courseId === this.courseId
    );

    console.log("Selected Course:", this.selectedCourse);
  });
}

  proceedToNextPage(): void
  {
     const userId = this.userId;
     const courseId = this.courseId; // Replace with actual courseId
     sessionStorage.setItem('userId',userId.toString());
     sessionStorage.setItem('courseId',courseId.toString());
     this.router.navigate(['/start-a-test']);
  }

  fromPage(pageNumber: any)
  {
    this.currentPage = +pageNumber;
    console.log(`From Page ${+pageNumber}`);
  }

  loadCourses()
  {
    this.courseService.getAllCourses().subscribe((courses: Course[])=>
    {
      this.courses= courses;
       let course = this.courses.find((c) => c.courseId === this.courseId);
      this.selectedCourse = course;
    });
  }
}

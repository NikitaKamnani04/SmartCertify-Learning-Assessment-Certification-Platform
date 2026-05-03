import { Component } from '@angular/core';
import { CoursesService } from '../../../services/courses.service';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admincourseslist',
  imports: [FormsModule,CommonModule, RouterModule],
  templateUrl: './admincourseslist.html',
  styleUrl: './admincourseslist.css',
})
export class Admincourseslist {

  courses: any[] = [];

  constructor(
    private courseService: CoursesService,
    private router: Router
  ) {}
  
ngOnInit() {
  this.loadCourses();
}

loadCourses() {
  this.courseService.getAllCourses().subscribe((res: any) => {
    this.courses = res;
  });
}

addQuestion(courseId: number) {
  this.router.navigate(['/admin/question/create', courseId]);
}

viewQuestions(courseId: number) {
  this.router.navigate(['/admin/questions', courseId]);
}
}

import { Component } from '@angular/core';
import { CoursesService } from '../../../services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-course',
  imports: [FormsModule, CommonModule],
  templateUrl: './add-course.html',
  styleUrl: './add-course.css',
})
export class AddCourse {
 course: any = {
    title: '',
    description: ''
  };

  id: number | null = null;
  isEditMode = false;
  originalCourse: any = {};

  constructor(
    private service: CoursesService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const paramId = this.route.snapshot.paramMap.get('id');

    if (paramId) {
      this.id = +paramId;
      this.isEditMode = true;
      this.loadCourse(this.id);
    }
  }

  // ✅ Load course for edit
  loadCourse(id: number) {
    this.service.getCourseById(id).subscribe((res: any) => {
      this.course.title = res.title;
      this.course.description = res.description;

      this.originalCourse = { ...res }; // Store original for reset
    });
  }

  addQuestion(courseId: number | null) {
  if (!courseId) return;

  this.router.navigate(['/admin/question/create', courseId]);
}

  // ✅ Save (Add + Edit)
  // save() {

   
  //   if (!this.course.title) {
  //     alert("Title is required");
  //     return;
  //   }

  //   const payload = {
  //     title: this.course.title,
  //     description: this.course.description
  //   };

  //   if (this.isEditMode) {

  //     this.service.updateCourse(this.id!, payload).subscribe({
  //       next: () => {
  //         alert("Course Updated ✅");
  //         this.router.navigate(['/admin/courses']);
  //       },
  //       error: (err: any) => console.error(err)
  //     });

  //   } else {

  //     this.service.createCourse(payload).subscribe({
  //       next: () => {
  //         alert("Course Created ✅");
  //         this.router.navigate(['/admin/courses']);
  //       },
  //       error: (err: any) => console.error(err)
  //     });
  //   }
  // }
 save() {
  if (!this.course.title) {
    alert("Title is required");
    return;
  }

  const payload = {
    title: this.course.title,
    description: this.course.description
  };

  // ✅ CREATE MODE
  if (!this.isEditMode) {

    this.service.createCourse(payload).subscribe({
      next: () => {
        alert("Course Created ✅");
        this.router.navigate(['/admin/courses']);
      },
      error: (err: any) => console.error(err)
    });

    return; // 🚨 IMPORTANT (stop here)
  }

  // ✅ EDIT MODE starts here

  const titleChanged = this.course.title !== this.originalCourse.title;
  const descChanged = this.course.description !== this.originalCourse.description;

  // ✅ BOTH changed → PUT
  if (titleChanged && descChanged) {

    this.service.updateCourse(this.id!, payload).subscribe({
      next: () => {
        alert("Course Updated (Full) ✅");
        this.router.navigate(['/admin/courses']);
      }
    });

  }

  // ✅ ONLY description → PATCH
  else if (!titleChanged && descChanged) {

    this.service.updateDescription(this.id!, this.course.description).subscribe({
      next: () => {
        alert("Description Updated ✅");
        this.router.navigate(['/admin/courses']);
      }
    });

  }

  // ✅ ONLY title → PUT
  else if (titleChanged && !descChanged) {

    this.service.updateCourse(this.id!, payload).subscribe({
      next: () => {
        alert("Title Updated ✅");
        this.router.navigate(['/admin/courses']);
      }
    });

  }

  // ✅ NOTHING changed
  else {
    alert("No changes made");
  }
}
}

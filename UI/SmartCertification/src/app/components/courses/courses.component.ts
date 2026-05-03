import { CommonModule } from '@angular/common';
import { Component,OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TechFilterComponent } from '../tech-filter/tech-filter.component';
import { Course } from '../../models/course';
import { LoginService} from '../../services/login.service';
import { CoursesService } from '../../services/courses.service';



@Component({
  selector: 'app-courses',
  standalone: true,
  imports: [CommonModule, FormsModule,TechFilterComponent],
  templateUrl: './courses.component.html',
  styleUrl: './courses.component.css'
})
export class CoursesComponent implements OnInit {
  techData = [
    { name: 'Angular', image: 'assets/technologies/angular.svg' },
    { name: 'React', image: '../../../assets/technologies/react.svg' },
    { name: 'Azure', image: '../../../assets/technologies/azure.svg' },
    {
      name: '.Net Core',
      image: '../../../assets/technologies/dotnet-core.svg',
    },
    {
      name: 'Javascript',
      image: '../../../assets/technologies/javascript.svg',
    },
    { name: 'Java', image: '../../../assets/technologies/java.svg' },
    { name: 'SQL', image: '../../../assets/technologies/sql.svg' },
    {
      name: 'React Native',
      image: '../../../assets/technologies/react-native.svg',
    },
    { name: 'AWS', image: '../../../assets/technologies/aws.svg' },
    { name: 'Docker', image: '../../../assets/technologies/docker.svg' },
  ];
  technologySelected: string='';
  courses: Course[] = [];
  showAvailableTests: false | undefined;
  filteredCourses: Course[] = [];
    userId: number = 0;
  constructor(
    private router: Router,
    private loginService: LoginService,private coursesService: CoursesService  )
    {
    
    }

 ngOnInit(): void {
  this.loginService.claims$.subscribe(() => {
    this.userId = this.loginService.userId;
    console.log('UserId loaded:', this.userId);
  });

  this.coursesService.getAllCourses().subscribe(data => {
    console.log('Courses fetched:', data);
    this.courses = data;
    this.applyFilters();
  });
}


  onTechSelected(tech: string)
  {
    console.log(`Selected technology: ${tech}`);
    this.technologySelected = tech;
    this.applyFilters();
  }

  applyFilters():void
  {
    let filtered = this.courses.filter((course)=>
      course.title.toLocaleLowerCase().startsWith(this.technologySelected.toLocaleLowerCase())
    );

    if(this.showAvailableTests)
    {
      filtered = filtered.filter((course)=> course.questionsAvailable)
    }
    this.filteredCourses = filtered;
  }

   getCoursesForTech(tech: string): Course[] {
    return this.courses.filter((course) =>
      course.title.toLocaleLowerCase().startsWith(tech.toLocaleLowerCase())
    );
  }

  filterAvailableTests(): void {
    if(this.showAvailableTests)
    {
      this.filteredCourses = this.courses.filter(
        (course)=> course.questionsAvailable == this.showAvailableTests &&
        course.title.toLocaleLowerCase().startsWith(this.technologySelected.toLocaleLowerCase())
      );
    }
  }

  startTest(courseId: number): void {
  console.log(`Starting test for course ID: ${courseId}`);
  console.log('UserId at click:', this.userId);

  if (!this.userId) {
    console.error('UserId is still not loaded');
    return;
  }

  sessionStorage.setItem('userId', this.userId.toString());
  sessionStorage.setItem('courseId', courseId.toString());

  this.router.navigate(['/exam/start']);
}

}

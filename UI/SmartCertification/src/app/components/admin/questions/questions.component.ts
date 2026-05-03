import { Component } from '@angular/core';
import { QuestionService } from '../../../services/question.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-questions',
  imports: [FormsModule,CommonModule, RouterModule],
  templateUrl: './questions.component.html',
  styleUrl: './questions.component.css'
})
export class QuestionsComponent {

  courseId!: number;
  questions: any[]=[];

  constructor(private questionService: QuestionService, private route: ActivatedRoute) {}
ngOnInit() {
  const param = this.route.snapshot.paramMap.get('courseId');

  if (param) {
    this.courseId = +param;
    this.loadQuestionsByCourse();
  } 
}

loadQuestionsByCourse() {
  this.questionService.getQuestionsByCourse(this.courseId)
    .subscribe((res: any) => {
      this.questions = res;
    });
}

loadAllQuestions() {
  this.questionService.getQuestions()
    .subscribe((res: any) => {
      this.questions = res;
    });
}

delete(id: number) {
  if (confirm("Are you sure?")) {
    this.questionService.deleteQuestion(id).subscribe(() => {
       if (this.courseId) {
          this.loadQuestionsByCourse();
        } else {
          this.loadAllQuestions();
        }
    });
  }
}




}

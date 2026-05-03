import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { QuestionService } from '../../../services/question.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-questions-list',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './questions-list.component.html',
  styleUrl: './questions-list.component.css'
})
export class QuestionsListComponent {

   questions: any[] = [];

   constructor(private questionService: QuestionService) {}

   ngOnInit(): void {
    this.loadQuestions();
   }

   loadQuestions() {
      this.questionService.getQuestions().subscribe((res)=>{
        this.questions = res;
      })
   }


    delete(id: number) {
       this.questionService.deleteQuestion(id).subscribe(()=>{
         alert('Question deleted successfully');
         this.loadQuestions();
       })

    }
}

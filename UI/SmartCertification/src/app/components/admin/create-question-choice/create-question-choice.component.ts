import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { QuestionService } from '../../../services/question.service';
import { ExamService } from '../../../services/exam.service';
import { QuestionDto } from '../../../models/question';

@Component({
  selector: 'app-create-question-choice',
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './create-question-choice.component.html',
  styleUrl: './create-question-choice.component.css'
})
export class CreateQuestionChoiceComponent {

  id: number | null = null;
  isEditMode = false;
  courses: any[] = [];

 question: any = {
  questionText: '',
  optionA: '',
  optionB: '',
  optionC: '',
  optionD: '',
  correctAnswer: '',
    correctAnswers: [],
    codeSnippet: '',

  courseId: null,
  difficultyLevel: '',
  isCode: false,
  hasMultipleAnswers: false
};
  constructor(
    private route: ActivatedRoute,
    private examService: ExamService,
    private questionService: QuestionService,
    private router: Router
  ) {}

//   ngOnInit() {
//   // this.loadCourses();

//   const paramId = this.route.snapshot.paramMap.get('id');
//   if (paramId) {
//     this.id = +paramId;
//     this.isEditMode = true;
//     this.loadQuestion(this.id);
//   }
// }

ngOnInit() {

   this.loadCourses();
  const courseIdFromRoute = this.route.snapshot.paramMap.get('courseId');

  // ✅ If coming from course → auto assign
  if (courseIdFromRoute) {
    this.question.courseId = +courseIdFromRoute;

     
  } 
  // ✅ Else → load dropdown
  else {
   
  }

  const paramId = this.route.snapshot.paramMap.get('id');

  if (paramId) {
    this.id = +paramId;
    this.isEditMode = true;
    this.loadQuestion(this.id);
  }
}

toggleAnswer(opt: string, event: any) {
  if (!this.question.correctAnswers) {
    this.question.correctAnswers = [];
  }

  if (event.target.checked) {
    this.question.correctAnswers.push(opt);
  } else {
    this.question.correctAnswers =
      this.question.correctAnswers.filter((x: string) => x !== opt);
  }
}

loadCourses() {
  this.questionService.getCourses().subscribe((res: any) => {
     console.log("COURSES API:", res);
    this.courses = res;
  });
}

 loadQuestion(id: number) {
  this.questionService.getQuestionById(id).subscribe((res: any) => {
console.log("FULL RESPONSE:", res);   
    console.log("CHOICES:", res.choices);
    this.question = {
      questionText: res.questionText,
       codeSnippet: res.codeSnippet || '',  
       codeLanguage: res.codeLanguage || '', 

      optionA: res.choices[0]?.choiceText || '',
      optionB: res.choices[1]?.choiceText || '',
      optionC: res.choices[2]?.choiceText || '',
      optionD: res.choices[3]?.choiceText || '',

      choiceAId: res.choices[0]?.choiceId || 0,
      choiceBId: res.choices[1]?.choiceId || 0,
      choiceCId: res.choices[2]?.choiceId || 0,
      choiceDId: res.choices[3]?.choiceId || 0,

      correctAnswer: this.getCorrectAnswer(res.choices),

      courseId: res.courseId ?? null,
      difficultyLevel: res.difficultyLevel ?? '',
      isCode: res.isCode ?? false,
      hasMultipleAnswers: res.hasMultipleAnswers ?? false
    };
  });
}

getCorrectAnswer(choices: any[]): string {
  const index = choices.findIndex(c => c.isCorrect);
  return ['A', 'B', 'C', 'D'][index] || '';
}

getCourseTitle(courseId: number) {
  if (!this.courses || this.courses.length === 0) {
    return 'Loading...';
  }

  const course = this.courses.find(c => c.courseId === courseId);
  return course ? course.title : 'Not Found';
}

save() {

   if (!this.question.courseId) {
  alert("Please select course");
  return;
}

const payload: QuestionDto = {
  questionId: this.id ?? 0,
  courseId: this.question.courseId ?? 0,
  questionText: this.question.questionText,
  codeSnippet: this.question.codeSnippet,   
  codeLanguage: this.question.codeLanguage,
  difficultyLevel: this.question.difficultyLevel || 'Easy',
  isCode: this.question.isCode ?? false,
  hasMultipleAnswers: this.question.hasMultipleAnswers ?? false,

  choices: [
    {
      choiceId: this.question.choiceAId || 0,
      questionId: this.id ?? 0, 
      choiceText: this.question.optionA, 
      isCode: false,
      isCorrect: this.question.hasMultipleAnswers
  ? this.question.correctAnswers.includes('A')
  : this.question.correctAnswer === 'A'
    },
    {
      choiceId: this.question.choiceBId || 0,
      questionId: this.id ?? 0,
      choiceText: this.question.optionB,
      isCode: false,
      isCorrect: this.question.hasMultipleAnswers
  ? this.question.correctAnswers.includes('B')
  : this.question.correctAnswer === 'B'
    },
    {
      choiceId: this.question.choiceCId || 0,
      questionId: this.id ?? 0,
      choiceText: this.question.optionC,
      isCode: false,
      isCorrect: this.question.hasMultipleAnswers
  ? this.question.correctAnswers.includes('C')
  : this.question.correctAnswer === 'C'
    },
    {
      choiceId: this.question.choiceDId || 0,
      questionId: this.id ?? 0,
      choiceText: this.question.optionD,
      isCode: false,
      isCorrect: this.question.hasMultipleAnswers
  ? this.question.correctAnswers.includes('D')
  : this.question.correctAnswer === 'D'
    }
  ]
};
if (this.isEditMode) {
    this.questionService.updateQuestion(payload).subscribe({
      next: () => {
        alert('Updated successfully');
      },
      error: (err) => console.error(err)
    });
  } else {
    this.questionService.createQuestion(payload).subscribe({
      next: () => {
        alert('Created successfully');
        this.router.navigate(['/admin/courses/']);
      },
      error: (err) => console.error(err)
    });
  }
  
}
}

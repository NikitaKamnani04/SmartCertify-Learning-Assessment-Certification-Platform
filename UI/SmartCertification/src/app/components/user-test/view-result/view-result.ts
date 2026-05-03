import { Component } from '@angular/core';
import { ExamDetails } from '../exam-details/exam-details';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-view-result',
  imports: [ExamDetails],
  templateUrl: './view-result.html',
  styleUrl: './view-result.css',
})
export class ViewResult {
   
  examId: number = 0;
  showCertificate = false;

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe(params => {
      this.examId = +params['examId'] || 0;
    });
}
}

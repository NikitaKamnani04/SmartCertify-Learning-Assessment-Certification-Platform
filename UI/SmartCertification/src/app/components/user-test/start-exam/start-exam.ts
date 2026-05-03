import { CommonModule } from '@angular/common';
import * as faceapi from 'face-api.js';
import {
  AfterViewChecked,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../../services/login.service';
import { ExamService } from '../../../services/exam.service';
import {
  ExamMetaData,
  QuestionDetails,
  QuestionStatus,
  StartExamRequest,
  UpdateUserQuestionChoice,
  UserExamQuestions,
} from '../../../models/exam-models';
import { catchError, of } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Course } from '../../../models/course';
import { CoursesService } from '../../../services/courses.service';
import hljs from 'highlight.js';



@Component({
  selector: 'app-start-exam',
  imports: [FormsModule, CommonModule],
  standalone: true,
  templateUrl: './start-exam.html',
  styleUrl: './start-exam.css',
})
export class StartExamComponent implements OnInit, OnChanges, AfterViewChecked {
  showWarning = false;
  @Input() courseId: number = 0;
  @Input() existingExamId: number = 0;
  userId: number = 0;
  examMetaData: ExamMetaData | null = null; //has only examid and highlevel meta data, no questionids
  @Input() selectedCourse: Course | undefined | null = null;

  @ViewChild('videoElement') videoElement!: ElementRef;
  videoStream: MediaStream | null = null;

  questionStatuses: QuestionStatus[] = [];

  userExamQuestions: UserExamQuestions[] = []; // we fill this based on questionid

  currentQuestionIndex: number = 0;
  selectedChoice: number | null = null;
  currentQuestionDetails: any = null;
  markForReview: boolean = false;
  isCodeChecked: boolean = false;
  selectedChoices: number[] = [];
  warningCount = 0;
  faceDetectionInterval: any;
  isExamActive = true;
  noFaceCount = 0;
  tabSwitchCount = 0;
lastTabSwitchTime = 0;
tabSwitchCooldown = 5000; // 5 sec
referenceDescriptor: Float32Array | null = null;


  selectedChoiceText: string = '';
 lastWarningTime = 0;
warningCooldown = 5000; 
  faceMissingStartTime: number | null = null;
  constructor(
    private loginService: LoginService,
    private examService: ExamService,
    private router: Router,
    private toastr: ToastrService,
    private courseService: CoursesService, private route: ActivatedRoute
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.updateSelectedChoiceText();
    if (this.existingExamId > 0) {
      this.getExamMetaData();
    }
  }

  async loadFaceModels() {
  await faceapi.nets.tinyFaceDetector.loadFromUri('/assets/models');
  await faceapi.nets.faceLandmark68Net.loadFromUri('/assets/models');
  await faceapi.nets.faceRecognitionNet.loadFromUri('/assets/models');
}

 ngOnInit(): void {

 this.startCamera();

 
  document.addEventListener("visibilitychange", this.handleTabSwitch);
  window.addEventListener("blur", this.handleWindowBlur);
  const courseId = sessionStorage.getItem('courseId');
  const userId = sessionStorage.getItem('userId');

  this.courseId = courseId ? +courseId : 0;
  this.userId = userId ? +userId : 0;


  console.log("userId:", this.userId);
  console.log("courseId:", this.courseId);

  if (this.courseId > 0 && this.userId > 0) {
    this.startExam(); 
  } else {
    console.error("Invalid data!");
  }
}

async startCamera() {
  try {
    this.videoStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true
    });

    this.videoElement.nativeElement.srcObject = this.videoStream;
  } catch (error) {
    alert("Camera & Mic access is required!");
    this.router.navigate(['/']); 
  }
}

 async captureReferenceFace() {
  const detection = await faceapi
    .detectSingleFace(
      this.videoElement.nativeElement,
      new faceapi.TinyFaceDetectorOptions()
    )
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (!detection) {
    alert("Face not detected. Please sit properly.");
    return;
  }

  this.referenceDescriptor = detection.descriptor;
  console.log("Reference face saved");
}

handleTabSwitch = () => {
  if (document.hidden) {
    this.triggerTabWarning("Tab switched or minimized");
  }
};

handleWindowBlur = () => {
  this.triggerTabWarning("Window lost focus (Alt+Tab detected)");
};


triggerTabWarning(message: string) {
  const now = Date.now();

  if (now - this.lastTabSwitchTime < this.tabSwitchCooldown) {
    return;
  }

  this.lastTabSwitchTime = now;
  this.tabSwitchCount++;

  this.toastr.warning(`${message} (${this.tabSwitchCount}/3)`);

  if (this.tabSwitchCount >= 3) {
    this.endExam();
  }
}

ngOnDestroy(): void {
  document.removeEventListener("visibilitychange", this.handleTabSwitch);
  window.removeEventListener("blur", this.handleWindowBlur);
}

  getCourses() {
    this.courseService.getAllCourses().subscribe((courses) => {
      this.selectedCourse = courses.find(
        (course) => course.courseId === this.examMetaData?.courseId
      );
    });
  }

  toggleMultiChoice(choiceId: number, event: any) {
  if (event.target.checked) {
    this.selectedChoices.push(choiceId);
  } else {
    this.selectedChoices =
      this.selectedChoices.filter(id => id !== choiceId);
  }
}

  getExamMetaData() {
    this.examService
      .getExamMetaData(this.existingExamId)
      .pipe(
        catchError((error) => {
          console.error('Error retrieving exam metadata:', error);
          if (error.status === 404 || error.status === 403) {
            // Redirect to user-exams on specific errors
            this.router.navigate(['/user-exams']);
          }
          // Return an empty observable or alternative data to complete the stream
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          console.log('Exam retrieved successfully!', response);
          this.examMetaData = response;
          this.getCourses();
          if (!this.examMetaData.finishedOn) {
            this.loadExamQuestions();
          } else {
            const config: Partial<IndividualConfig> = {
              closeButton: false,
              progressBar: true,
              positionClass: 'toast-top-full-width',
            };
            this.toastr.info(
              'Your Exam has completed already!.',
              'Exam Completed',
              config
            );
            this.router.navigate(['/user-exams']);
            //dont need to collect feedback of finished exam
            // this.router.navigate(['/exam/feedback'], {
            //   queryParams: { examId: this.examMetaData?.examId },
            // });
          }
        }
      });
  }

  get currentQuestion() {
    return this.userExamQuestions &&
      this.currentQuestionIndex >= 0 &&
      this.currentQuestionIndex < this.userExamQuestions.length
      ? this.userExamQuestions[this.currentQuestionIndex]
      : null;
  }

  startExam() {
    const request: StartExamRequest = { 
      userId: this.userId,
      courseId: this.courseId,
    };

    //todo, handle errors and put user back to user-exams page or home page
    this.examService.startExam(request).subscribe(async (response) => {
      console.log('Exam started successfully!', response);
      this.examMetaData = response;
      // this.startCamera(); 
      await this.loadFaceModels();
      this.loadExamQuestions();
      this.startFaceDetection(); 

      await this.loadFaceModels();

setTimeout(async () => {
  await this.captureReferenceFace();
}, 3000); // wait camera stable
    });
  }

  initializeQuestionStatuses() {
    this.questionStatuses = this.userExamQuestions.map((question) => ({
      questionId: question.questionId,
      status: question?.selectedChoiceId != null && question.selectedChoiceId > 0
  ? 'Answered'
  : 'Not Started'
    }));
  }

  loadExamQuestions() {
    const examIdToLoad: number =
      this.existingExamId > 0
        ? this.existingExamId
        : this.examMetaData?.examId || 0;
    if (examIdToLoad < 1) return;

    this.examService
      .getUserExamQuestions(examIdToLoad)
      .subscribe((response) => {
        this.userExamQuestions = response; // this holds the questions associated with that particular exam.
        console.log('Loaded user exam questions:', response);
        this.initializeQuestionStatuses();
        this.loadQuestion(
          this.userExamQuestions[this.currentQuestionIndex].questionId
        ); //we pass questionid to get its choices and question details
      });
  }

  loadQuestion(questionId: number) {
  if (!questionId) return;

  const question = this.userExamQuestions.find(
    (q) => q.questionId === questionId
  );

  // 🔥 CALL BOTH APIs
  this.examService.getQuestion(questionId).subscribe((qRes) => {

    this.examService.getChoices(questionId).subscribe((cRes) => {

      // 🔥 COMBINE DATA (VERY IMPORTANT)
         this.currentQuestionDetails = {
        questionText: qRes.questionText,
        isCode: qRes.isCode,
        codeSnippet: qRes.codeSnippet,
        codeLanguage: qRes.codeLanguage,
        hasMultipleAnswers: qRes.hasMultipleAnswers,
        choices: cRes
      };

      // Restore previous state
      this.selectedChoice = null;
      this.selectedChoices = [];  
      this.markForReview = false;

      if (question) {
        this.selectedChoice = question.selectedChoiceId ?? null;
        this.markForReview = question.reviewLater ?? false;
      }

      console.log("Final Question Data:", this.currentQuestionDetails);
    });

  });
}

  goToPreviousQuestion() {
    // Save current user's choice before navigating
    this.saveCurrentQuestionState();

    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.loadQuestion(
        this.userExamQuestions[this.currentQuestionIndex].questionId
      );
    }
  }

  saveCurrentQuestionState() {
    // Save the current state of the question to the `userExamQuestions` array
    if (this.userExamQuestions[this.currentQuestionIndex]) {
      this.userExamQuestions[this.currentQuestionIndex].selectedChoiceId =
        this.selectedChoice || 0;
      this.userExamQuestions[this.currentQuestionIndex].reviewLater =
        this.markForReview;
    }
  }

  // submitAndNext() {
  //   if (!this.selectedChoice) {
  //     this.showWarning = true;
  //     return;
  //   }
  //   this.showWarning = false;

  //   if (this.selectedChoice !== null && this.examMetaData) {
  //     const userChoice: UpdateUserQuestionChoice = {
  //       examId: this.examMetaData.examId,
  //       examQuestionId:
  //         this.userExamQuestions[this.currentQuestionIndex].examQuestionId,
  //       selectedChoiceId: this.selectedChoice,
  //       reviewLater: this.markForReview,
  //     };

  //     this.examService.updateUserChoice(userChoice).subscribe(() => {
  //       //const currentStatus = this.markForReview ? 'Review Later' : 'Answered';
  //       const questionStatus = this.questionStatuses.find(
  //         (qs) =>
  //           qs.questionId ===
  //           this.userExamQuestions[this.currentQuestionIndex].questionId
  //       );

  //       if (questionStatus) questionStatus.status = 'Answered';

  //       this.saveCurrentQuestionState();

  //       if (this.currentQuestionIndex < this.userExamQuestions.length - 1) {
  //         this.currentQuestionIndex++;
  //         this.loadQuestion(
  //           this.userExamQuestions[this.currentQuestionIndex].questionId
  //         );
  //       } else {
  //         this.toastr.info('Exam completed. Submit for evaluation!');
  //         console.log('Exam completed. Submit for evaluation!');
  //         // Navigate to feedback page
  //         this.router.navigate(['/exam/feedback'], {
  //           queryParams: { examId: this.examMetaData?.examId },
  //         });
  //       }
  //     });
  //   }
  // }

  submitAndNext() {
    const isAnswered =
  this.currentQuestionDetails?.hasMultipleAnswers
    ? this.selectedChoices.length > 0
    : this.selectedChoice !== null;

if (!isAnswered) {
  this.showWarning = false;
  this.moveToNextQuestion();
  return;
}
  
    this.showWarning = false;
  
    if (this.examMetaData) {

  const userChoice: UpdateUserQuestionChoice = {
    examId: this.examMetaData.examId,
    examQuestionId:
      this.userExamQuestions[this.currentQuestionIndex].examQuestionId,
    selectedChoiceId: this.currentQuestionDetails.hasMultipleAnswers
  ? null
  : (this.selectedChoice ), // For single choice, use selectedChoice. For multiple, set to 0 or ignore on backend.

    selectedChoiceIds: this.currentQuestionDetails.hasMultipleAnswers
      ? this.selectedChoices
      : [],

    reviewLater: this.markForReview,  
     userId: this.userId
  };

  this.examService.updateUserChoice(userChoice).subscribe(() => {
    const questionStatus = this.questionStatuses.find(
      (qs) =>
        qs.questionId ===
        this.userExamQuestions[this.currentQuestionIndex].questionId
    );

    if (questionStatus) questionStatus.status = 'Answered';

    this.saveCurrentQuestionState();
    this.moveToNextQuestion();
  });
}
  }
  
  private moveToNextQuestion() {
    if (this.currentQuestionIndex < this.userExamQuestions.length - 1) {
      this.currentQuestionIndex++;
      this.loadQuestion(
        this.userExamQuestions[this.currentQuestionIndex].questionId
      );
    } else {
      this.toastr.info('Exam completed. Submit for evaluation!');
      console.log('Exam completed. Submit for evaluation!');
      this.router.navigate(['/exam/feedback'], {
        queryParams: { examId: this.examMetaData?.examId },
      });
    }
  }

  
  checkReviewStatus(questionId: number): boolean {
    return this.userExamQuestions.filter((f) => f.questionId === questionId)[0]
      .reviewLater;
  }

  splitQuestionText(questionText: string): { text: string; isCode: boolean }[] {
    const regex = /```([\s\S]*?)```/g;
    let result = [];
    let lastIndex = 0;

    questionText.replace(regex, (match, code, index) => {
      if (lastIndex < index) {
        result.push({
          text: questionText.substring(lastIndex, index),
          isCode: false,
        });
      }
      result.push({ text: code, isCode: true });
      lastIndex = index + match.length;
      return match;
    });

    if (lastIndex < questionText.length) {
      result.push({ text: questionText.substring(lastIndex), isCode: false });
    }

    return result;
  }

  isCodeQuestion(questionText: string | undefined): boolean {
    if (!questionText) return false;
    return questionText.includes('<code>') || questionText.includes('```');
  }

  ngAfterViewChecked(): void {
    document.querySelectorAll('pre code').forEach((block) => {
      hljs.highlightElement(block as HTMLElement);
    });
  }

updateSelectedChoiceText() {
    const selected = this.currentQuestionDetails?.choices.find(
        (c: any) => c.choiceId === this.selectedChoice
    );
    this.selectedChoiceText = selected ? selected.choiceText : '';
}


startFaceDetection() {
  console.log("Starting face detection...");

  this.faceDetectionInterval = setInterval(async () => {

    if (!this.isExamActive) return;
    if (!this.videoElement?.nativeElement) return;

    const detection = await faceapi
      .detectSingleFace(
        this.videoElement.nativeElement,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks()
      .withFaceDescriptor();

    // ✅ FACE NOT DETECTED (your existing logic)
    if (!detection) {

      if (!this.faceMissingStartTime) {
        this.faceMissingStartTime = Date.now();
      }

      const missingDuration = Date.now() - this.faceMissingStartTime;

      if (missingDuration > 10000) {
        this.handleWarning("Face not visible properly");
        this.faceMissingStartTime = null;
      }

      return; // 🔥 IMPORTANT (stop further checks)
    } else {
      this.faceMissingStartTime = null;
    }

    // ✅ FACE RECOGNITION (NEW AI PART)
    if (this.referenceDescriptor) {
      const distance = faceapi.euclideanDistance(
        this.referenceDescriptor,
        detection.descriptor
      );

      console.log("Face distance:", distance);

      if (distance > 0.6) {
        this.handleWarning("Different person detected");
      }
    }

    // ❗ MULTIPLE FACE CHECK (keep separate if needed)
    const allDetections = await faceapi.detectAllFaces(
      this.videoElement.nativeElement,
      new faceapi.TinyFaceDetectorOptions()
    );

    if (allDetections.length > 1) {
      this.handleWarning("Multiple faces detected");
    }

  }, 500);
}

handleWarning(msg: string) {
  const now = Date.now();

  if (now - this.lastWarningTime < this.warningCooldown) {
    return;
  }

  this.lastWarningTime = now;
  this.warningCount++;

  this.toastr.warning(msg);

  if (this.warningCount >= 3) {
    this.endExam();
  }
}

endExam() {
  // ✅ STOP DETECTION LOOP
  if (this.faceDetectionInterval) {
    clearInterval(this.faceDetectionInterval);
  }

  // ✅ STOP CAMERA
  this.videoStream?.getTracks().forEach(t => t.stop());
this.isExamActive = false;
  alert("Exam terminated due to violations");
  this.router.navigate(['/']);
}
}
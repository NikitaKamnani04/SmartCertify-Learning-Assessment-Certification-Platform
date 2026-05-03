import { Routes } from '@angular/router';
import { CoursesComponent } from './components/courses/courses.component';
import { AgreementPageComponent } from './components/user-test/agreement-page/agreement-page.component';
import { UserExams } from './components/user-test/user-exams/user-exams';
import { HomeComponent } from './components/home/home.component';
import { Login } from './pages/login/login';
import { StartExamComponent } from './components/user-test/start-exam/start-exam';
import { GetExamFeedbackAndSubmitComponent } from './components/user-test/get-exam-feedback-and-submit/get-exam-feedback-and-submit';
import { ViewResult } from './components/user-test/view-result/view-result';

import { Exam } from './components/user-test/exam/exam';
import { canActivateGuard } from './guards/login-guard';
import { canActivateAdminGuard } from './guards/admin-guard';
import { QuestionsListComponent } from './components/admin/questions-list/questions-list.component';
import { CreateQuestionChoiceComponent } from './components/admin/create-question-choice/create-question-choice.component';
import { AddCourse } from './components/admin/add-course/add-course';
import { Admincourseslist } from './components/admin/admincourseslist/admincourseslist';
import { QuestionsComponent } from './components/admin/questions/questions.component';
import { FaceCapture } from './components/user-test/face-capture/face-capture';
import { PageTwo } from './components/user-test/page-two/page-two';


export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {path: 'login',component: Login},
    {
        path:'about',
        loadComponent:()=>
            import('./pages/about/about.component').then(m=>m.AboutComponent),
    },
    {
        path:'contact-us',
        loadComponent:()=>
            import('./pages/contact-us/contact-us.component').then(m=>m.ContactUsComponent),
    },
    {
        path:'courses', 
        component: CoursesComponent,
    },
    {
    path: 'exam/start',
    component: AgreementPageComponent,
     canActivate: [canActivateGuard],
  },
  {
    path: 'user-exams',
    component: UserExams,
    canActivate: [canActivateGuard],

  },
  {
    path: 'exam/start-exam',
    component : StartExamComponent
  },
  {
    path: 'exam/feedback',
    component : GetExamFeedbackAndSubmitComponent,
    canActivate: [canActivateGuard],
  },
  {
    path: 'exam/view-result',
    component: ViewResult,
    canActivate: [canActivateGuard],
  },
  {
    path: 'exam',
    component: Exam, canActivate: [canActivateGuard]
  },
  {
    path: 'admin/question/list',
    component: QuestionsListComponent,
    canActivate: [canActivateAdminGuard],
  },
  {
    path: 'admin/question/create/:courseId',
    component: CreateQuestionChoiceComponent,
    canActivate: [canActivateAdminGuard],
  },
  {
    path: 'admin/question/edit/:id',
    component: CreateQuestionChoiceComponent,
    canActivate: [canActivateAdminGuard],
  },
  { path: 'admin/course/create', component: AddCourse },
{ path: 'admin/course/edit/:id', component: AddCourse },
  { path: 'admin/courses', component: Admincourseslist,canActivate:[canActivateAdminGuard] },
    {
  path: 'admin/questions/:courseId',
  component: QuestionsComponent, canActivate: [canActivateAdminGuard],
},
{
  path: 'face-capture',
  component: FaceCapture,
  canActivate: [canActivateGuard]
},
{
  path: 'exam/details',
  component: PageTwo
}
];

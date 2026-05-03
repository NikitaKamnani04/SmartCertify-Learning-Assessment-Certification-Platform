import { Component, EventEmitter, Output, TemplateRef } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';



@Component({
  selector: 'app-page-one',
  imports: [],
  templateUrl: './page-one.component.html',
  styleUrl: './page-one.component.css'
})
export class PageOneComponent {
  @Output() pageOneAccepted = new EventEmitter<number>();
  modalRef?: BsModalRef;
  courseId: number = 0;
  
  constructor(private router: Router,private modalService: BsModalService){}

  openDisagreeModal(template: TemplateRef<void>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-md' });
  }

  // proceedToNextPage() {
  //   console.log('Proceeding to the next page');
  //   //Emit event to show second page
  //   this.pageOneAccepted.emit(2);
  // }

  ngOnInit() {
    const stored = sessionStorage.getItem('courseId');
    if (stored) {
      this.courseId = +stored;
    }
  }
  proceedToNextPage() {
  sessionStorage.setItem('courseId', this.courseId.toString());

  this.router.navigate(['/face-capture']);
}

  exitApplication(): void{
    console.log('User has chosen to exit the application');
    this.closeDisagreeModal();
    this.router.navigate(['/courses']);
  }

  closeDisagreeModal(): void {
    if (this.modalRef) {
      this.modalRef.hide();
    }
  }

}

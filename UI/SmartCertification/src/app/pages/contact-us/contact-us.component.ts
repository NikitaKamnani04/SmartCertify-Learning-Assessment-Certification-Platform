import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-contact-us',
  imports: [FormsModule,ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.css'
})
export class ContactUsComponent {
 contactForm! :FormGroup;
 UserId = 0;

 constructor(private fb: FormBuilder)
 {
  this.contactForm = this.fb.group({
    name: ['',Validators.required],
    email: ['',Validators.required,Validators.email],
    subject: ['',Validators.required],
    message: ['',Validators.required]
  });
 }

 onSubmit()
 {
  if(this.contactForm.valid)
  {
    alert("Thankyou for contacting us, we will get back to you soon!");
    this.contactForm.reset();
  }
  else
  {
    alert("Please fill all the details");
    return;
  }
}



}

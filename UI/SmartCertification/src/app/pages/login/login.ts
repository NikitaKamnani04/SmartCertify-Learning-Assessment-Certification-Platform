import { Component } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  loginData = {
    email: '',
    password: ''
  };

  constructor(private loginService: LoginService, private router: Router) {}

   onLogin() {
  if (this.loginData.email && this.loginData.password) {

    this.loginService.login(this.loginData.email, this.loginData.password);

    alert('Login Successful');

    if (this.loginData.email === 'admin@gmail.com' && this.loginData.password === 'admin123') {
      this.router.navigate(['/admin/courses']);
    } else {
      this.router.navigate(['/user-exams']);
    }

  } else {
    alert('Please enter email and password');
  }
}

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}

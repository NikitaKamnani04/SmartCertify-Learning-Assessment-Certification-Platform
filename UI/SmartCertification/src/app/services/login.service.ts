import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Claim } from '../models/claim';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private claimsSubject = new BehaviorSubject<Claim[]>([]);
  claims$ = this.claimsSubject.asObservable();
  
  private userIdSubject = new BehaviorSubject<number>(0);
  userId$ = this.userIdSubject.asObservable();

  userId: any;
  isLoggedIn!: boolean;
  loginDisplay!: boolean;
  UserName!: string;
  UserRoles: string[]=[];

  constructor() { }

  login(email: string, password: string) {
  this.isLoggedIn = true;
  this.loginDisplay = true;

  this.UserName = email;
  this.userId = 1;

  if (email === 'admin@gmail.com' && password === 'admin123') {
    this.UserRoles = ['Admin'];
  } else {
    this.UserRoles = ['User'];
  }

  const claims = [
    { claim: 'userId', value: '1', description: 'User Id' },
    { claim: 'name', value: email, description: 'User Name' },
  ];

  this.claimsSubject.next(claims);
  this.userIdSubject.next(this.userId);
}

  logout(){
    this.isLoggedIn=false;
    this.loginDisplay=false;

    this.userId = 0;
    this.UserRoles=[];
    this.UserName='';

    this.claimsSubject.next([]);
    this.userIdSubject.next(0);
  }
}

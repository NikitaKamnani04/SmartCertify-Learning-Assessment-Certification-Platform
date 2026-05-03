import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../../services/login.service';
import { UserService } from '../../services/user.service';
import { Claim } from '../../models/claim';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-header',
  imports: [CommonModule,FormsModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
 isLoggedIn = false;
 isAdmin = false;
 profilePictureUrl = ' ';
 claims: Claim[] = [];
 loginDisplay = false;

 private readonly _destroy$ = new Subject<void>();

 constructor(
  private loginService: LoginService,
  private UserService: UserService,
  private router: Router
 ){}

  ngOnInit(): void {
    this.loginService.claims$.subscribe((claims: Claim[]) => {
      this.claims = claims;

      const roles = this.claims.filter(c=>c.claim ==='role');

      if(roles.length)
      {
        this.isAdmin = roles[0].value === 'admin';
      }

      
    })
  }

  setLoginDisplay()
  {
    this.loginDisplay = !this.loginService.userId;
  }

  login()
  {
    this.router.navigate(['/login']);
  }

  logout()
  {
    // this.loginService.logout();
    this.loginDisplay=false;
    this.router.navigate(['/']);
  }

  loginRedirect() {
  this.router.navigate(['/login']);
}                                             
  // getUserInfo()
  // {
  //   if(this.loginService.userId)
  //   {
  //      this.UserService.getUserProfile(this.loginService.userId).subscribe((res:any)=>{
  //       this.profilePictureUrl = res.profilePictureUrl;
  //      }
  //     );
  //   }
  // }  

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

}


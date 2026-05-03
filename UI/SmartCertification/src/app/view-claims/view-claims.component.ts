import { Component, OnInit } from '@angular/core';
import { Claim } from '../models/claim';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-view-claims',
  imports: [],
  templateUrl: './view-claims.component.html',
  styleUrl: './view-claims.component.css'
})
export class ViewClaimsComponent implements OnInit {
claims: Claim[]=[];

  constructor(private loginService: LoginService){}
    ngOnInit(): void {
      this.loginService.claims$.subscribe((c:any)=>
      {
       this.claims = c;
      });
    }
  }



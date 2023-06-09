import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit{
  constructor(
    private authService: AuthService,
    private router: Router,
      
  ) { 
  }
  ngOnInit(): void{
    if(this.authService.isAuthenticated$){
      this.router.navigate(['/home']);
    } else{
      this.authService.error$
    }
  }
  login(): void{
    this.authService.loginWithRedirect();
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login-routing.module';
import { AuthButtonComponent } from 'src/app/@core/components/auth-button/auth-button.component';



@NgModule({
  declarations: [
    LoginComponent,
    AuthButtonComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule
  ]
})
export class LoginModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { HomeRoutingModule } from './home-routing.module';
import { AuthButtonComponent } from 'src/app/@core/components/auth-button/auth-button.component';
import { SidebarComponent } from 'src/app/@core/shared/theme/sidebar/sidebar.component';
import { NavbarComponent } from 'src/app/@core/shared/theme/navbar/navbar.component';
import { ThemeModule } from 'src/app/@core/shared/theme/theme.module';



@NgModule({
  declarations: [
    HomeComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    ThemeModule
  ]
})
export class HomeModule { }

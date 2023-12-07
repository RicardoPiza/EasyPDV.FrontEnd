import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FixedPluginModule } from './fixedplugin/fixedplugin.module';
import { SpinnerComponent } from './spinner/spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CronometerComponent } from './cronometer/cronometer.component';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SpinnerComponent,
    CronometerComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FixedPluginModule,
    MatProgressSpinnerModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SpinnerComponent,
    CronometerComponent
  ]
})
export class ThemeModule { }

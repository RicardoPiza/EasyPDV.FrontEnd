import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FixedPluginModule } from './fixedplugin/fixedplugin.module';
import { SpinnerComponent } from './spinner/spinner.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { CronometroComponent } from './cronometro/cronometro.component';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SpinnerComponent,
    CronometroComponent
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
    CronometroComponent
  ]
})
export class ThemeModule { }

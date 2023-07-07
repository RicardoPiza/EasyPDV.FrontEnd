import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FooterComponent } from './footer/footer.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { FixedPluginModule } from './fixedplugin/fixedplugin.module';
import { SpinnerComponent } from './spinner/spinner.component';



@NgModule({
  declarations: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SpinnerComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FixedPluginModule
  ],
  exports: [
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    SpinnerComponent
  ]
})
export class ThemeModule { }

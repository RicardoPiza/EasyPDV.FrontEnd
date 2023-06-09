import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () => import('./Pages/login/login.module').then(m => m.LoginModule)
  },{
    path: '',
    loadChildren: () => import('./Pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./Pages/home/home.module').then(m => m.HomeModule), 
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}

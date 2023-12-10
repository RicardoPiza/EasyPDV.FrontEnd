import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@auth0/auth0-angular';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./Pages/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'home',
    loadChildren: () => import('./Pages/home/home.module').then(m => m.HomeModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'sale-mode',
    loadChildren: () => import('./Pages/sale-mode/sale-mode.module').then(m => m.SaleModeModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'products',
    loadChildren: () => import('./Pages/products/products.module').then(m => m.ProductsModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./Pages/dashboard/dashboard.module').then(m => m.DashboardModule), 
    canActivate: [AuthGuard]
  },
  {
    path: 'user',
    loadChildren: () => import('./Pages/user/user.module').then(m => m.UserModule), 
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { 
  
}

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
  },
  {
    path: 'modo-venda',
    loadChildren: () => import('./Pages/modo-venda/modo-venda.module').then(m => m.ModoVendaModule), 
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

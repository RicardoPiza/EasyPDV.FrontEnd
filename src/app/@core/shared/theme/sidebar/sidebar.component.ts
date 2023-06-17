import { Component, OnInit, Inject} from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { DOCUMENT } from '@angular/common';


export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}

export const ROUTES: RouteInfo[] = [
  { path: '/modo-venda',     title: 'Modo Venda',        icon:'nc-bank',       class: '' },
  { path: '/products',      title: 'Produtos',          icon:'nc-diamond',    class: '' },
  { path: '/dashboard',     title: 'Dashboard',         icon:'nc-bank',       class: '' },
  { path: '/user',          title: 'Usuário',           icon:'nc-single-02',  class: '' },
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  public menuItems: any[]=[];
    ngOnInit() {
        this.menuItems = ROUTES.filter(menuItem => menuItem);
    }
    constructor(
      public authService : AuthService,
      @Inject(DOCUMENT) 
      public document: Document
    ){
    }
}

import { Injectable } from '@angular/core';
import { AuthService } from '@auth0/auth0-angular';
import { SecurityRequestService } from './security-request.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    public securityRequestService: SecurityRequestService
    ) { }
  
  postProduct(parameters: any): Observable<any> {
    return this.securityRequestService.post(`${environment.webAppApi}/Product/Add`, parameters);
  }
  listProducts(parameters: any): Observable<any> {
    return this.securityRequestService.post(`${environment.webAppApi}/Product/List`, parameters);
  }
  removeProduct(parameters: any): Observable<any> {
    return this.securityRequestService.post(`${environment.webAppApi}/Product/Remove`, parameters);
  }
}

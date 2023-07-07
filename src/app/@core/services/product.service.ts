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
  updateProduct(parameters: any): Observable<any> {
    return this.securityRequestService.put(`${environment.webAppApi}/Product/Update`, parameters);
  }
  listProducts(parameters: any): Observable<any> {
    return this.securityRequestService.post(`${environment.webAppApi}/Product/List`, parameters);
  }
  removeProduct(id: any): Observable<any> {
    return this.securityRequestService.delete(`${environment.webAppApi}/Product/Remove/${id}`);
  }
  getById(id: any): Observable<any> {
    return this.securityRequestService.get(`${environment.webAppApi}/Product/GetById/${id}`);
  }
  saveImage(File: any, id: any): Observable<any> {
    return this.securityRequestService.post(`${environment.webAppApi}/Product/SaveImage/${id}`, File);
  }
}

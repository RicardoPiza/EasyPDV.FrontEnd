import { Injectable } from '@angular/core';
import { SecurityRequestService } from './security-request.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  constructor(
    public securityRequestService: SecurityRequestService
    ) { }
  prepareSale(parameters: any): Observable<any> {
    return this.securityRequestService.post(`${environment.webAppApi}/Sale/PrepareSale`, parameters);
  }
  
  postSale(parameters: any): Observable<any> {
    return this.securityRequestService.post(`${environment.webAppApi}/Sale/MakeSale`, parameters);
  }

  getSoldProductsReport(responsible: any, id: any): Observable<any> {
    return this.securityRequestService.get(`${environment.webAppApi}/Sale/GetSoldProductsReport/${responsible}/${id}`);
  }
  getSalesReport(responsible: any, id: any): Observable<any> {
    return this.securityRequestService.get(`${environment.webAppApi}/Sale/GetSalesReport/${responsible}/${id}`);
  }
  getSales(responsible: any, id: any): Observable<any> {
    return this.securityRequestService.get(`${environment.webAppApi}/Sale/GetSales/${responsible}/${id}`);
  }
}

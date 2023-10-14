import { Injectable } from '@angular/core';
import { SecurityRequestService } from './security-request.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(
    public securityRequestService: SecurityRequestService
  ) { }
  startEvent(parameters: any): Observable<any> {
    return this.securityRequestService.post(`${environment.webAppApi}/Event/StartEvent`, parameters);
  }
  stopEvent(parameters: any): Observable<any> {
    return this.securityRequestService.post(`${environment.webAppApi}/Event/StopEvent`, parameters);
  }
  getEvent(parameters: any): Observable<any> {
    return this.securityRequestService.get(`${environment.webAppApi}/Event/GetEvent/${parameters}`);
  }
  addSale(parameters: any): Observable<any> {
    return this.securityRequestService.post(`${environment.webAppApi}/Event/AddSale`, parameters);
  }
  getEventResult(parameters: any): Observable<any> {
    return this.securityRequestService.get(`${environment.webAppApi}/Event/GetEventResult/${parameters}`);
  }
}

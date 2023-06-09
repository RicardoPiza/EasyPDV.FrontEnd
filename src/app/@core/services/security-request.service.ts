import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from '@auth0/auth0-angular';


@Injectable({
  providedIn: 'root'
})
export class SecurityRequestService {

  constructor(
    private httpClient: HttpClient,
    private authService:AuthService 
  ) { }

  get(url: string, options?: any): Observable<any> {

    return this.sendRequest("GET", url, options);

  }

  delete(url: string, options?: any): Observable<any> {

    return this.sendRequest("DELETE", url, options);

  }

  remove(url: string, bory: any, options?: any): Observable<any> {

    let options1: any = {
      body: bory
    };

    options1 = Object.assign({}, options, options1);
    return this.sendRequest("DELETE", url, options1);

  }

  post(url: string, bory: any, options?: any): Observable<any> {

    let options1: any = {
      body: bory
    };

    options1 = Object.assign({}, options, options1);
    return this.sendRequest("POST", url, options1);
  }

  put(url: string, bory: any, options?: any): Observable<any> {

    let options1: any = {
      body: bory
    };

    options1 = Object.assign({}, options, options1);
    return this.sendRequest("PUT", url, options1);
  }

  private sendRequest(method: string, url: string, options?: any): Observable<any> {
    return of({})
      .pipe(
        switchMap(request => this.authService.getAccessTokenSilently()),
        map(request => {        
          return Object.assign({}, options, {
            headers: new HttpHeaders().set('Authorization', `Bearer ${request}`)
          });
        }),
        switchMap(options1 => this.httpClient.request(method, url, options1))
      );      
  }
}

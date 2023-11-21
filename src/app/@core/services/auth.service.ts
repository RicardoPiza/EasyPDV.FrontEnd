import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as auth0 from 'auth0-js';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private auth0Client: auth0.WebAuth;

  public bearer: string = '';

  constructor() {
    this.auth0Client = new auth0.WebAuth({
      clientID: environment.clientID,
      domain: environment.domain,
      responseType: environment.responseType,
      redirectUri: environment.redirectUri,
      audience: environment.audience
    });
  }

  public login(): void {
    this.auth0Client.authorize();
  }

  public handleAuthentication(): void {
    this.auth0Client.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        this.bearer = authResult.accessToken;
        // Faça algo com os tokens, como armazená-los localmente
      } else if (err) {
        console.error(err);
      }
    });
  }
  public isAuthenticated(): boolean{
    if (this.bearer.length > 0){
      return true;
    }
    return false;
  }
}

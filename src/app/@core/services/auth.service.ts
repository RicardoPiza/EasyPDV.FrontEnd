import { Injectable } from '@angular/core';
import * as auth0 from 'auth0-js';


@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private auth0Client: auth0.WebAuth;

  public bearer: string = '';

  constructor() {
    this.auth0Client = new auth0.WebAuth({
      clientID: 'LZiOO0SDH1vtHcGdArrRh7ExvzGrXa9a',
      domain: 'dev-45cr7h6fi351b8w1.us.auth0.com',
      responseType: 'token id_token',
      redirectUri: 'http://localhost:4200/callback',
      audience: 'https://localhost:44347'
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

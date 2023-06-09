import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthModule, AuthService } from '@auth0/auth0-angular';
import { HomeModule } from './Pages/home/home.module';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot({
      domain: 'dev-45cr7h6fi351b8w1.us.auth0.com',
      clientId: 'LZiOO0SDH1vtHcGdArrRh7ExvzGrXa9a',
      authorizationParams: {
        redirect_uri: window.location.origin,
        audience: 'https://localhost:44347'
      }
    }),
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

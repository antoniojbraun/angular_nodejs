import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { IUser } from '../interfaces/models/user.model.interface';
import { share } from 'rxjs';
import { Router } from '@angular/router';
export interface Session {
  accessToken: string;
  refreshToken: string;
  user: IUser;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient);
  session?: Session;
  router = inject(Router);
  constructor() {
    this.checkLocalStorageForSession();
  }

  checkLocalStorageForSession() {
    let localStorageSession = localStorage.getItem('session');
    // Check if the access token is valid
    if (localStorageSession) this.session = JSON.parse(localStorageSession);
  }

  register({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    let ob = this.http
      .post<Session>(environment.BACKEND_API_URL + '/api/auth/register', {
        name,
        email,
        password,
      })
      .pipe(share());

    ob.subscribe({
      next: (res) => {
        // Criar página falando que o cadastro está pendente e que precisa confirmar o link enviado por email.
        this.router.navigate(['/auth/login']);
      },
      error: (err) => {
        alert('Register failed: ' + err);
      },
    });
    return ob;
  }

  resetPassword({ token, password }: { token: string; password: string }) {
    return this.http.post(
      environment.BACKEND_API_URL + '/api/auth/reset-password',
      { token, password }
    );
  }

  login({ email, password }: { email: string; password: string }) {
    let ob = this.http
      .post<Session>(environment.BACKEND_API_URL + '/api/auth/login', {
        email,
        password,
      })
      .pipe(share());

    ob.subscribe({
      next: (res) => {
        this.session = res;
        localStorage.setItem('session', JSON.stringify(res));
        this.router.navigate(['/']);
      },
      error: (err) => {
        return err;
      },
    });
    return ob;
  }

  logout() {
    this.session = undefined;
    localStorage.removeItem('session');
    this.router.navigate(['/auth/login']);
  }

  ForgotPassword(email: string) {
    return this.http.post(
      environment.BACKEND_API_URL + '/api/auth/forgot-password',
      { email }
    );
  }
}

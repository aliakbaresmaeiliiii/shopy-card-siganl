import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';

export interface UserDto {
  id?: number;
  email: string;
  password: string;
}

const TOKEN_KEY = 'token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  http = inject(HttpClient);

  private api = 'http://localhost:3000/api/auth';

  isLoggedIn(): boolean {
    return typeof localStorage !== 'undefined' && !!localStorage.getItem(TOKEN_KEY);
  }

  login(data: {
    email: string;
    password: string;
  }): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      `${this.api}/login`,
      data,
    );
  }
}

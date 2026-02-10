import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/app/environment/environment';

export interface UserDto {
  id?: number;
  email: string;
  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private url = `${environment.apiUrl}/auth`;

  http = inject(HttpClient);

  private api = 'http://localhost:3000/api/auth';

  login(data: {
    email: string;
    password: string;
  }): Observable<{ accessToken: string }> {
    return this.http.post<{ accessToken: string }>(
      'http://localhost:3000/api/auth/login',
      data,
    );
  }
}

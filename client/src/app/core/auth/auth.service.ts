import { HttpClient } from '@angular/common/http';
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

  // login(user: any): Observable<UserDto> {
  //   return this.http.post<UserDto>(`${this.url}/login`, user);
  // }
private api = 'http://localhost:3000/api/auth';

login(data: { email: string; password: string }) {
  return this.http.post(`${this.api}/login`, data);
}

}

import { Component, inject, signal } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { email, form, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { AuthService, UserDto } from '../auth.service';
@Component({
  selector: 'pm-login',
  imports: [ReactiveFormsModule, FormField],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  service = inject(AuthService);
  router = inject(Router);
  // Signal با مقدار اولیه خالی
  signupModel = signal({ email: '', password: '' });

  // فرم reactive ساده
  signupForm = form(this.signupModel, (schemaPath) => {
    email(schemaPath.email);
  });

  login() {
    const data: UserDto = this.signupForm().value();
    console.log('DATA SENT:', data);

    this.service.login(data).subscribe({
      next: (res) => {
        console.log('USER LOGGED IN', res);
        localStorage.setItem('token', res.accessToken);
        this.router.navigate(['/welcome']);
      },
      error: (err) => console.error('ERROR', err),
    });
  }

  // login() {
  //   const data = this.signupModel();
  //   console.log('DATA SENT:', data);
  //   this.service.login(data).subscribe({
  //     next: (res) => console.log('USER LOGGED IN', res),
  //     error: (err) => console.error('ERROR', err),
  //   });
  // }
}

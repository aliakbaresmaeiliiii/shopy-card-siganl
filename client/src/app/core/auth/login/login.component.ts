import { Component, inject, signal } from '@angular/core';

import { ReactiveFormsModule } from '@angular/forms';
import { AuthService, UserDto } from '../auth.service';
import { form, FormField, email, required } from '@angular/forms/signals';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'pm-login',
  imports: [ReactiveFormsModule, FormField],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
 service = inject(AuthService);

  // Signal با مقدار اولیه خالی
  signupModel = signal({ email: '', password: '' });

  // فرم reactive ساده
  signupForm = form(this.signupModel, (schemaPath) => {
    email(schemaPath.email);
  });

  login() {
    const data = this.signupModel();
    console.log('DATA SENT:', data);
    this.service.login(data).subscribe({
      next: (res) => console.log('USER LOGGED IN', res),
      error: (err) => console.error('ERROR', err),
    });
  }
}

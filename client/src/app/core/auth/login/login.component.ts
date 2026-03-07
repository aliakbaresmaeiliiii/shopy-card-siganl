import { Component, inject, signal } from '@angular/core';

import { ReactiveFormsModule, Validators } from '@angular/forms';
import {
  email,
  form,
  FormField,
  minLength,
  required,
} from '@angular/forms/signals';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService, UserDto } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

export interface login {
  email: string;
  password: string;
}
@Component({
  selector: 'pm-login',
  imports: [ReactiveFormsModule, FormField],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  service = inject(AuthService);
  router = inject(Router);
  private route = inject(ActivatedRoute);
  toast = inject(ToastrService);
  loginModel = signal<login>({ email: '', password: '' });
  // 2. Set up the form with validation rules in the schema function
  loginForm = form(this.loginModel, (login) => {
    required(login.email, { message: 'Email is required' });
    email(login.email, { message: 'Enter a valid email address' });
    required(login.password, { message: 'Password is required' });
    minLength(login.password, 6, {
      message: 'Password must be at least 6 characters',
    });
  });

  // Access the fields for use in the template
  emailField = this.loginForm.email;
  passwordField = this.loginForm.password;

  login() {
    const data: UserDto = this.loginForm().value();
    console.log('DATA SENT:', data);

    this.service.login(data).subscribe({
      next: (res) => {
        console.log('USER LOGGED IN', res);
        localStorage.setItem('token', res.accessToken);
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/products';
        this.router.navigateByUrl(returnUrl);
        this.toast.success('Login Successful!', 'Welcome Back');
      },
      error: (err) => {
        this.toast.error('Login Failed!', 'Error');
        console.error('ERROR', err);
      },
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

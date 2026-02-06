import { Component } from '@angular/core';

import { LoginComponent } from '../auth/login/login.component';

@Component({
    selector: 'pm-auth-layout',
    imports: [LoginComponent],
    templateUrl: './auth-layout.component.html',
    styleUrls: ['./auth-layout.component.css']
})
export class AuthLayoutComponent {

}

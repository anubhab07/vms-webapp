import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { LoginService } from './login.service';
import { CookieService } from 'ngx-cookie-service';
import { IResponse } from '../Class/IResponse';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  title = 'Test';
  hide = true;
  email = new FormControl('', [Validators.required, Validators.email]);
  pass = new FormControl('', [Validators.required]);

  constructor(private loginService: LoginService, 
              private storageService: StorageService,
              private cookieService: CookieService,
              private routerObj: Router,
              private ngxLoader: NgxUiLoaderService) { }

  ngOnInit() {
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email cannot be empty' :
      this.email.hasError('email') ? 'Not a valid email' : '';
  }
  getPasswordErrorMessage() {
    return this.pass.hasError('required') ? 'Password cannot be empty' : '';
  }

  login() {
    if (this.email.value && this.pass.value) {
      console.log(this.email.value && this.pass.value);
      const loginArgs = {
        email: this.email.value,
        password: this.pass.value
      };
      this.ngxLoader.start();
      this.loginService.loginToApp(loginArgs).subscribe((loginRes: IResponse) => {
        console.log(loginRes);
        if (loginRes.status === 1) {
          this.storageService.userDetails = loginRes.data;
          this.cookieService.set('token', loginRes.data.token);
          this.ngxLoader.stop();
          this.routerObj.navigateByUrl('/employee');
        } else {
          this.ngxLoader.stop();
          alert('Invalid Password');
        }
      }, error => {
        this.ngxLoader.stop();
        alert('Some error Occured');
      });
    }
  }

}
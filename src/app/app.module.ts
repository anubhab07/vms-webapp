import { BrowserModule } from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { CookieService } from 'ngx-cookie-service';
import { MatInputModule, MatCardModule, MatIconModule, MatButtonModule, MatSelectModule } from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { EmployeeComponent } from './employee/employee.component';
import { SecurityComponent } from './security/security.component';

import { MatDatepickerModule, MatMomentDateModule } from '@coachcare/datepicker';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, POSITION, PB_DIRECTION } from 'ngx-ui-loader';

const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  bgsType: SPINNER.threeStrings,
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5, // progress bar thickness
};

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    EmployeeComponent,
    SecurityComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatMomentDateModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig)
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

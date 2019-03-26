import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';

import { Visitor } from '../Class/Visitor';
import { SecurityService } from './security.service';
import { StorageService } from '../storage.service';
import { IUserRes } from '../Class/IUserRes';
import { IVisitorTypeAccess } from '../Class/IVisitorTypeAccess';
import { IResponse } from '../Class/IResponse';
import { IResponseImgVerify } from '../Class/IResponseImgVerify';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.scss']
})
export class SecurityComponent implements OnInit {
  visitor: Visitor;
  userDetails: IUserRes;
  accessType = new FormControl();
  newVisitor: Visitor;
  visitorTypeAccess: IVisitorTypeAccess[] = [];
  email = new FormControl('', [Validators.required, Validators.email]);
  mobile = new FormControl('', [Validators.required, Validators.pattern(/^[6-9]\d{9}$/)]);
  name = new FormControl('', [Validators.required]);
  photo = new FormControl('', [Validators.required]);
  reffered = new FormControl('', [Validators.required]);
  inTime = new FormControl('', [Validators.required]);
  outTime = new FormControl('', [Validators.required]);
  photoUploadError = false;

  constructor(private securityService: SecurityService,
              private storageService: StorageService,
              private sanitizer: DomSanitizer,
              private ngxLoader: NgxUiLoaderService) { }

  ngOnInit() {
    // console.log(this.photo);
    if (!this.storageService.userDetails) {
      this.userDetails = JSON.parse(localStorage.getItem('userData'));
    } else {
      this.userDetails = this.storageService.userDetails;
    }
    this.visitorTypeAccess = this.userDetails.visitorTypeAccess;
    this.accessType.setValue(this.visitorTypeAccess[0].typeCode);
    this.initializeVisitor();
  }

  addData(dataType, event) {
    // console.log(event)
    this.newVisitor[dataType] = event.target.value;
  }

  addDate(dateType, event) {
    console.log(typeof (event.value));
    const time = event.value;
    // console.log(time.format('YYYY-MM-DD HH:mm:ss'));
    this.newVisitor[dateType] = time.format('YYYY-MM-DD HH:mm:ss');
  }

  uploadImage(event) {
    console.log(this.photo);
    console.log(this.photo.value);
    const imgFile = event.target.files[0];
    this.validateFile(imgFile);
  }

  validateFile(file) {
    this.photoUploadError = false;
    // let self = this;
    // self.showSpinner = true;
    // let file = (<HTMLInputElement>document.getElementById('visitorImage')).files[0];
    console.log('start loader');
    this.ngxLoader.start();
    // console.log('index: ' + index);

    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = (e) => {
      const fileText = fileReader.result;
      const fileBase64 = (fileText as string).split(',')[1];
      // console.log(fileBase64);

      const filePayload = {
        image: fileBase64
      };

      this.securityService.validateImageBase64(filePayload)
        .subscribe((response: IResponseImgVerify) => {
          console.log(response);
          // this.photoId = response['image_id'];
          // self.showSpinner = false;
          this.newVisitor.photoId = response.image_id;
          this.newVisitor.photo = this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,' + response.image_text);
          // alert('Image Validation successful');
          console.log('Image Validation successful');
          this.ngxLoader.stop();
        }, (httpError) => {
          console.log(httpError.error);
          // self.showSpinner = false;
          this.ngxLoader.stop();
          alert(httpError.error.error);
        });
    };
  }

  submitRequest() {
    if (this.email.valid && this.mobile.valid && this.name.valid && this.reffered.valid && this.inTime.valid && this.outTime.valid && !this.photoUploadError) {
      const visitorPayloadLst = [];
      this.ngxLoader.start();
      const visitorPayload = {
        Name: this.newVisitor.name,
        Email: this.newVisitor.email,
        Photo: this.newVisitor.photo,
        Mobile: this.newVisitor.mobile,
        VisitorType: this.accessType.value,
        Reffered: this.newVisitor.reffered,
        IN: this.newVisitor.inTime,
        OUT: this.newVisitor.outTime
      };
      visitorPayloadLst.push(visitorPayload);
      console.log(visitorPayloadLst);

      this.securityService.requestGuestAccess(visitorPayloadLst)
        .subscribe((response: IResponse) => {
          if (response.status === 1) {
            alert(response.data[0].message);
          }
          console.log(response);
          // this.imageSource = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/jpg;base64,'
          // + response['data']['Photo']);
          this.ngxLoader.stop();
          this.initializeVisitor();
          // alert(response.message);
        }, error => {
          this.ngxLoader.stop();
          alert('Sorry some error occured');
          console.log(error);
        });
    } else {
      this.photoUploadError = true;
    }
  }

  getEmailErrorMessage() {
    return this.email.hasError('required') ? 'Email cannot be empty' :
      this.email.hasError('email') ? 'Not a valid email' : '';
  }
  getMobileErrorMessage() {
    return this.mobile.hasError('required') ? 'Mobile cannot be empty' :
      this.mobile.hasError('pattern') ? 'Not a valid Mobile no.' : '';
  }
  getNameErrorMessage() {
    return this.name.hasError('required') ? 'Name cannot be empty' : '';
  }
  getPhotoErrorMessage() {
    return this.photo.hasError('required') ? 'Photo cannot be empty' : '';
  }
  getRefferedErrorMessage() {
    return this.reffered.hasError('required') ? 'Reffered cannot be empty' : '';
  }
  getInTimeErrorMessage() {
    return this.inTime.hasError('required') ? 'In Time cannot be empty' : '';
  }
  getOutTimeErrorMessage() {
    return this.outTime.hasError('required') ? 'Out Time cannot be empty' : '';
  }

  initializeVisitor() {
    this.newVisitor = new Visitor();
  }
}

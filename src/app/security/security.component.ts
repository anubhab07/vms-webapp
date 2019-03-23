import { Component, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormControl, Validators } from '@angular/forms';

import { Visitor } from '../Class/Visitor';
import { SecurityService } from './security.service';
import { StorageService } from '../storage.service';
import { IUserRes } from '../Class/IUserRes';
import { IVisitorTypeAccess } from '../Class/IVisitorTypeAccess';
import { IResponse } from '../Class/IResponse';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-security',
  templateUrl: './security.component.html',
  styleUrls: ['./security.component.sass']
})
export class SecurityComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}

import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { AuthService } from "../auth.service";
import { AuthData } from "../auth-data.model";
import { Subscription } from "rxjs";

@Component({
  templateUrl: './customize.component.html',
  styleUrls: ['./customize.component.css']
})
export class CustomizeComponent implements OnInit, OnDestroy {

  userId!: string | null;
  isLoading = false;
  userDetails!: any;
  isLoggedIn: boolean = false;
  loginListenerSub!: Subscription;

  constructor(private authService: AuthService, private route: ActivatedRoute,  private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.userId = paramMap.get('userId');
        console.log('Fetched Id to customize');
        this.isLoggedIn = this.authService.getIsLoggedIn();
        if(this.isLoggedIn) {
          this.authService.getUserDetails(this.userId)
          .subscribe((userDetails) => {
            this.userDetails = userDetails;
            this.isLoading = false;
          });}
      }});
      this.loginListenerSub = this.authService.getUserLoginStatusListener().subscribe((userUpdateData: {user: AuthData | null, loginStatus: boolean, validationErrors: boolean}) => {
        this.isLoggedIn = userUpdateData.loginStatus;
      })
  }

  onUpdate(){
    this.isLoading = true;
    let customizedUser = {
        "id": this.userId,
        "customize": {
        "description": this.userDetails.customize.description,
        "severity": this.userDetails.customize.severity,
        "status": this.userDetails.customize.status,
        "createdDate": this.userDetails.customize.createdDate,
        "resolvedDate": this.userDetails.customize.resolvedDate,
        "creator": this.userDetails.customize.creator,
        "lastModifiedBy": this.userDetails.customize.lastModifiedBy
        }
    }
    this.authService.customizeUser(customizedUser);
  }

  ngOnDestroy() {
    this.loginListenerSub.unsubscribe();
  }
}

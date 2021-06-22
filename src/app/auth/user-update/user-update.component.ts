import { Component, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from "../auth.service";

import { AuthData } from "../auth-data.model";
import { Subscription } from "rxjs";

@Component({
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})
export class UserUpdateComponent implements OnInit, OnDestroy {
  userId!: string | null;
  isLoading = false;
  userDetails!: any;
  isLoggedIn: boolean = false;
  locations: string[] = ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Hyderabad", "Kochi", "Kolkata", "Mumbai", "Pune"];
  updateErrors: boolean = false;
  private errorsListenerSub!: Subscription;


  constructor(private authService: AuthService, private route: ActivatedRoute) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('userId')) {
        this.userId = paramMap.get('userId');
        console.log('Fetched Id');
        this.isLoggedIn = this.authService.getIsLoggedIn();
        if(this.isLoggedIn) {
          this.authService.getUserDetails(this.userId)
          .subscribe((userDetails) => {
            this.userDetails = userDetails;
            this.isLoading = false;
          });}
      }});
      this.errorsListenerSub = this.authService.getUserLoginStatusListener().subscribe((userUpdateData: {user: AuthData | null, loginStatus: boolean, validationErrors: boolean}) => {
        this.updateErrors = userUpdateData.validationErrors;
      })
  }

  onSubmit(formValue: any) {
    this.isLoading = true;
    let updatedUser = {
        "id": this.userId,
        "email": formValue.email,
        "firstName": formValue.firstName,
        "lastName": formValue.lastName,
        "location": formValue.location,
        "mobile": formValue.mobile
    }
    this.authService.updateUser(updatedUser);
    this.isLoading = false;
  }

  ngOnDestroy() {
    this.errorsListenerSub.unsubscribe();
  }
}

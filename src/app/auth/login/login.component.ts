import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";

import { AuthData } from "../auth-data.model";
import { NgForm } from "@angular/forms";

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private userLoginListenerSub!: Subscription;
  loginErrors!: boolean;

    @ViewChild(NgForm, {static: false}) loginForm!: NgForm;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = false;
    this.userLoginListenerSub = this.authService.getUserLoginStatusListener().subscribe((userLoginData: {user: AuthData | null, loginStatus: boolean, validationErrors: boolean}) => {
      this.loginErrors = userLoginData.validationErrors;
    })
  }

  onSubmit(formValue: any) {
    this.isLoading = true;
    let loginUserData = {
      "email": formValue.email,
      "password": formValue.password
    }
    this.authService.login(loginUserData);
    this.loginForm.reset();
    this.isLoading = false;
  }


ngOnDestroy() {
  this.userLoginListenerSub.unsubscribe();
}
}

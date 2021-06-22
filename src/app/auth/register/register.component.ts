import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { AuthService } from "../auth.service";
import { NgForm } from "@angular/forms";

import { AuthData } from "../auth-data.model";

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  locations: string[] = ["Ahmedabad", "Bangalore", "Chennai", "Delhi", "Hyderabad", "Kochi", "Kolkata", "Mumbai", "Pune"];
  private userRegisterListenerSub!: Subscription;
  registrationErrors!: boolean;

  @ViewChild(NgForm, {static: false}) registerForm!: NgForm;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isLoading = false;
    this.userRegisterListenerSub = this.authService.getUserLoginStatusListener().subscribe((userRegistrationData: {user: AuthData | null, loginStatus: boolean, validationErrors: boolean}) => {
      this.registrationErrors = userRegistrationData.validationErrors;
    })
  }

  onSubmit(formValue: any) {
    this.isLoading = true;
    let newUser = {
        "email": formValue.email,
        "password": formValue.password,
        "firstName": formValue.firstName,
        "lastName": formValue.lastName,
        "location": formValue.location,
        "mobile": formValue.mobile,
    }
    this.authService.createUser(newUser);
    this.registerForm.reset();
    this.isLoading = false;
  }


ngOnDestroy() {
  this.userRegisterListenerSub.unsubscribe();
}
}

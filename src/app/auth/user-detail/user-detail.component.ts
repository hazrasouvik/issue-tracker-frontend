import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from "../auth.service";

import { AuthData } from "../auth-data.model";

@Component({
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.css']
})
export class UserDetailComponent implements OnInit {
  userId!: string | null;
  isLoading = false;
  userDetails!: any;
  isLoggedIn: boolean = false;

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
  }

  onDelete(userId: any) {
    this.isLoading = true;
    this.authService.deleteUser(userId);
  }
}

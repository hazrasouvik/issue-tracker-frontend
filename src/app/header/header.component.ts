import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from "rxjs";

import { AuthService } from '../auth/auth.service';
import { AuthData } from '../auth/auth-data.model';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{

  flag: boolean = false;
  private userLoginListenerSub!: Subscription;
  isLoggedIn!: boolean;
  userId?: string | null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.flag = false;
    this.isLoggedIn = this.authService.getIsLoggedIn();
    this.userId = this.authService.getloggedInUserId();
    this.userLoginListenerSub = this.authService.getUserLoginStatusListener().subscribe((userLoginData: {user: AuthData | null, loginStatus: boolean, validationErrors: boolean}) => {
      this.isLoggedIn = userLoginData.loginStatus;
      this.userId = userLoginData.user?.id;
    })
  }

  logout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.userLoginListenerSub.unsubscribe();
  }
}


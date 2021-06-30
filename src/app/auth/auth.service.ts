import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';


import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root'})
export class AuthService {

 private _usersUrl = "/api/users";
  private token!: string | null;
  private tokenTimer: any;
  private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
  private isLoggedIn = false;
  private userLoginListener = new Subject<{ user: AuthData | null, loginStatus: boolean, validationErrors: boolean }>();
  private loggedInUsersDetails!: any;
  private userId!: string | null;
  loginCount: number = 0;

    constructor(private _http: HttpClient, private router: Router){}

    getUserLoginStatusListener() {
      return this.userLoginListener.asObservable();
    }

    getToken() {
      return this.token;
    }

    getIsLoggedIn () {
      return this.isLoggedIn;
    }

    getloggedInUserId() {
      return this.userId;
    }

    createUser(user: any) {
      this.userLoginListener.next({user: null, loginStatus:false, validationErrors: false});
      let newUser: any = {
        "email": user.email,
        "password": user.password,
        "firstName": user.firstName,
        "lastName": user.lastName,
        "location": user.location,
        "mobile": user.mobile,
        "customize": {
          "description": true,
          "severity": true,
          "status": true,
          "createdDate": true,
          "resolvedDate": true,
          "creator": true,
          "lastModifiedBy": true
        }
      }
        this._http.post(this._usersUrl + "/register", newUser, this.httpOptions)
        .subscribe((response: any) => {
            this.router.navigate(["/auth/login"]);
            this.userLoginListener.next({user: response.result, loginStatus:false, validationErrors: false});
            this.isLoggedIn = false;
            console.log(response.message);
        }, (error) => {
          this.router.navigate(["/auth/register"]);
          this.userLoginListener.next({user: null, loginStatus:false, validationErrors: true});
          this.isLoggedIn = false;
          console.log(error.message);
        });
      }


    login(userDetails: any) {
      this.userLoginListener.next({user: null, loginStatus:false, validationErrors: false});
      this._http.post(this._usersUrl +"/login", userDetails, this.httpOptions)
      .subscribe((response: any) => {
        const token = response.token;
        this.token = token;
        if(token) {
          const expiresInDuration = response.expiresIn;
          this.userId = response.userId;
          this.getUserDetails(response.userId)
          .subscribe((usersDetails: any) => {
            this.loggedInUsersDetails = userDetails;
            this.setAuthTimer(expiresInDuration);
            this.isLoggedIn = true;
            const now = new Date();
            const expirationDate = new Date(now.getTime() + (expiresInDuration * 1000));
            this.saveAuthData(token, expirationDate, this.userId);
            this.userLoginListener.next({user: usersDetails, loginStatus:true, validationErrors: false});
            this.router.navigate(["/issues"]);
            console.log("Login success");
          }, (error) => {
            console.log("Error fetching user details!" + error.message);
            this.router.navigate(["/auth/login"]);
            this.userLoginListener.next({user: null, loginStatus:false, validationErrors: true});
            this.isLoggedIn = false;
          });
        }
      }, (error) => {
        this.router.navigate(["/auth/login"]);
          this.userLoginListener.next({user: null, loginStatus:false, validationErrors: true});
          console.log(error.message);
          this.isLoggedIn = false;
      });
    }

    private setAuthTimer(duration: number) {
      console.log("Setting Timer:" + duration);
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, duration * 1000);
    }

    getUserDetails(userId: string | null) {
      return this._http.get(this._usersUrl + "/" + userId);
    }


  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    console.log("Auto Auth user")
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isLoggedIn = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      if(this.getIsLoggedIn()) {
      this.getUserDetails(this.userId)
          .subscribe((usersDetails: any) => {
            this.userLoginListener.next({user: usersDetails, loginStatus:true, validationErrors: false});
            this.loggedInUsersDetails = usersDetails;
          });
        }
    }
  }

    logout() {
      this.token = null;
      this.isLoggedIn = false;
      this.userLoginListener.next({user: null, loginStatus: false, validationErrors: false});
      console.log("Logged out");
      clearTimeout(this.tokenTimer);
      this.userId = null;
      this.clearAuthData();
      this.router.navigate(["/auth/login"]);
    }

    updateUser(user: any) {
          this._http.patch(this._usersUrl + '/' + user.id, user, this.httpOptions)
          .subscribe(() => {
            this.router.navigate(["/auth/user/" + user.id]);
          }, (error) => {
            this.isLoggedIn = true;
            this.getUserDetails(user.id)
            .subscribe((usersDetails: any) => {
              this.userLoginListener.next({user: usersDetails, loginStatus:true, validationErrors: true});
              this.loggedInUsersDetails = usersDetails;
            });
            console.log(error.message)
          });
    }

    customizeUser(user: any) {
      this._http.patch(this._usersUrl + '/' + user.id, user, this.httpOptions)
      .subscribe(() => {
        console.log("Customize success");
        this.router.navigate(["/issues"]);
      });
    }

    deleteUser(userId: any) {
      this._http.delete(this._usersUrl + "/" + userId)
      .subscribe(() => {
        this.logout();
      });
    }

  private saveAuthData(token: string, expirationDate: Date, userId: string | null) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    if(userId)
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");
    if(!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';


import { AuthData } from './auth-data.model';

@Injectable({ providedIn: 'root'})
export class AuthService {

  private _usersUrl = "http://localhost:3001/users";
  private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };
  private isLoggedIn = false;
  private userLoginListener = new Subject<{ user: AuthData | null, loginStatus: boolean, validationErrors: boolean }>();
  private loggedInUsersDetails!: AuthData;
  private userId!: string | null;
  loginCount: number = 0;

    constructor(private _http: HttpClient, private router: Router){}

    getUserLoginStatusListener() {
      return this.userLoginListener.asObservable();
    }

    getIsLoggedIn () {
      return this.isLoggedIn;
    }

    getloggedInUserId() {
      return this.userId;
    }

    createUser(user: any) {
      let id = uuidv4();
      let newUser: AuthData = {
        "id": id,
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
      this._http.get((this._usersUrl + "?email=" + user.email))
      .subscribe((response: any) => {
        if(response.length === 1) {
          this.router.navigate(["/auth/register"]);
          this.userLoginListener.next({user: null, loginStatus:false, validationErrors: true});
          this.isLoggedIn = false;
          console.log("User already exists!")}
        else if(response.length === 0) {
        this._http.post(this._usersUrl, newUser, this.httpOptions)
        .subscribe(() => {

            this.router.navigate(["/auth/login"]);
            this.userLoginListener.next({user: null, loginStatus:false, validationErrors: false});
            this.isLoggedIn = false;
            console.log("User Created!");

        });
        }
      });
    }

    login(userDetails: any) {
      this._http.get((this._usersUrl + "?email=" + userDetails.email + "&password=" + userDetails.password))
      .subscribe((response: any) => {
        if(response.length === 1) {
          if(this.loginCount === 0)
        this.router.navigate(["/issues"]);
        this.loggedInUsersDetails = response[0];
        this.userId = this.loggedInUsersDetails.id;
        this.userLoginListener.next({user: this.loggedInUsersDetails, loginStatus:true, validationErrors: false});
        this.isLoggedIn = true;
        this.saveAuthData("true", this.userId);
        console.log("Login success");
    }
        else if(response.length === 0) {
          this.router.navigate(["/auth/login"]);
          this.userLoginListener.next({user: null, loginStatus:false, validationErrors: true});
          console.log("Invalid Login Credentials!");
          this.isLoggedIn = false;
        }
      });
    }

    getUserDetails(userId: string | null) {
      return this._http.get(this._usersUrl + "/" + userId);
    }


  autoAuthUser() {
    const authInformation = this.getAuthData();
    if(!authInformation){
      return;
    }
    this.loginCount+=1;
    console.log("Auto Auth user")
      this.isLoggedIn = (authInformation.isLoggedIn === "true");
      this.userId = authInformation.userId;
      this.getUserDetails(this.userId).subscribe((userDetails) => {
        this.login(userDetails);
      })

  }

    logout() {
      this.userLoginListener.next({user: null, loginStatus: false, validationErrors: false});
      console.log("Logged out");
      this.loginCount = 0;
      this.userId = null;
      this.clearAuthData();
      this.isLoggedIn = false;
      this.router.navigate(["/auth/login"]);
    }

    updateUser(user: any) {
      this._http.get((this._usersUrl + "?email=" + user.email))
      .subscribe((response: any) => {
        if(response.length === 1) {
          this.isLoggedIn = true;
          this.userLoginListener.next({user: this.loggedInUsersDetails, loginStatus:true, validationErrors: true});
          console.log("Another user with the same email already exists!")
        }
        else if(response.length === 0) {
          this._http.patch(this._usersUrl + '/' + user.id, user, this.httpOptions)
          .subscribe(() => {
            this.router.navigate(["/auth/user/" + user.id]);
          });
        }
      });
    }

    customizeUser(user: any) {
      this._http.patch(this._usersUrl + '/' + user.id, user, this.httpOptions)
      .subscribe(() => {
        console.log("Customize success");
        this.userLoginListener.next({user: this.loggedInUsersDetails, loginStatus:true, validationErrors: false});
        this.router.navigate(["/issues"]);
      });
    }

    deleteUser(userId: any) {
      this._http.delete(this._usersUrl + "/" + userId)
      .subscribe(() => {
        this.logout();
      });
    }


  private saveAuthData(isLoggedIn: string, userId: string) {
    localStorage.setItem('isLoggedIn', isLoggedIn);
    localStorage.setItem('userId', userId);
  }

  private clearAuthData(){
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    const userId = localStorage.getItem("userId");
    if(!isLoggedIn) {
      return;
    }
    return {
      isLoggedIn: isLoggedIn,
      userId: userId
    }
  }
}

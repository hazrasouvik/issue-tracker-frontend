import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

import { Issue } from '../issue.model';
import { IssuesService } from '../issues.service';
import { AuthData } from 'src/app/auth/auth-data.model';

@Component({
  selector: 'app-issues-list',
  templateUrl: './issues-list.component.html',
  styleUrls: ['./issues-list.component.css']
})
export class IssuesListComponent implements OnInit, OnDestroy  {
isLoading: boolean = false;
totalIssues: number = 0;
issues: Issue[] = [];
issueIdArr: string[] = [];
isCheckedArr: boolean[] = [];
issueIdIsChecked: {[key: string]: boolean} = {};
flag: boolean = false;
descriptionFilter: string = '';
private issuesSub!: Subscription;
private userLoginListenerSub!: Subscription;
isLoggedIn!: boolean;
userCustomization: any;


constructor(public issuesService: IssuesService, private router: Router, private authService: AuthService) {}

ngOnInit() {
  console.log("Issues List NgOninit");
  this.isLoading = true;
  this.flag = false;
  this.issuesService.getIssues();
  this.issuesSub = this.issuesService.getIssueUpdateListener().subscribe((issueData: {issues: Issue[], issueCount: number, loggedInUserCustomize: {} | null}) => {
    this.isLoading=false;
    this.issues = issueData.issues;
    this.totalIssues = issueData.issueCount;
    this.userCustomization = issueData.loggedInUserCustomize;
    console.log("From Issue Sub "+JSON.stringify(this.userCustomization));
    for(let i=0; i < this.totalIssues; i++){
      this.issueIdArr[i] = this.issues[i].id;
      this.isCheckedArr[i] = false;
      this.issueIdIsChecked[this.issues[i].id] = false;
    }
  });
  this.isLoggedIn = this.authService.getIsLoggedIn();
  this.userLoginListenerSub = this.authService.getUserLoginStatusListener().subscribe((userLoginData: {user: AuthData | null, loginStatus: boolean, validationErrors: boolean}) => {
    this.isLoggedIn = userLoginData.loginStatus;
    /*if(userLoginData.user?.customize)
    this.userCustomization = userLoginData.user.customize;
    console.log(this.userCustomization);*/
  });
}

onChecked($event: any) {

}

deleteMultiple() {
  this.isLoading = true;
  this.flag = false;
  if(this.isLoggedIn) {
  for(let i=0; i < this.totalIssues; i++){
    if(this.issueIdIsChecked[this.issues[i].id]) {
      this.flag = true;
      this.issuesService.deleteIssue(this.issues[i].id).subscribe(() => {
        delete this.issueIdIsChecked[this.issues[i].id];
        this.issuesService.getIssues();
       }, () => {
         this.isLoading = false;
       });
    }
  }
  if(!this.flag) {
    this.isLoading = false;
    alert("Please select at least 1 Issue.");
  }}
  else {
    this.isLoading = false;
    this.router.navigate(["/auth/login"]);
  }
}

onDelete(issueId: string){
  this.isLoading = true;
  if(this.isLoggedIn) {
  this.issuesService.deleteIssue(issueId).subscribe(() => {
    delete this.issueIdIsChecked[issueId];
   this.issuesService.getIssues();
  }, () => {
    this.isLoading = false;
  });}
  else {
    this.isLoading = false;
    this.router.navigate(["/auth/login"]);
  }
}

ngOnDestroy() {
  this.issuesSub.unsubscribe();
  this.userLoginListenerSub.unsubscribe();
}
}

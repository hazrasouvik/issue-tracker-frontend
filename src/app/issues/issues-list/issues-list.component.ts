import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
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
issuesPerPage = 2;
currentPage = 1;
pageSizeOptions = [1, 2, 5, 10];
issuesDisplayedPerPage!: number;//As in the last page issuesPerPage maybe greater than actual issues diplayed.

constructor(public issuesService: IssuesService, private router: Router, private authService: AuthService) {}


ngOnInit() {
  console.log("Issues List NgOninit");
  this.isLoading = true;
  this.flag = false;
  this.issuesService.getIssues(this.issuesPerPage, this.currentPage);
  this.issuesSub = this.issuesService.getIssueUpdateListener().subscribe((issueData: {issues: Issue[], issueCount: number, loggedInUserCustomize: {} | null}) => {
    this.issues = issueData.issues;
    for(let i=0; i < issueData.issueCount; i++){
      if(this.issues[i].lastModifiedBy && this.issues[i].lastModifiedBy!=="") {
        this.authService.getUserDetails(this.issues[i].lastModifiedBy)
      .subscribe((lastModifierDetails: any) => {
        this.issues[i].lastModifiedBy = lastModifierDetails.firstName + " " + lastModifierDetails.lastName
      })
      }
      this.authService.getUserDetails(this.issues[i].creator)
      .subscribe((creatorDetails: any) => {
        this.issues[i].creator = creatorDetails.firstName + " " + creatorDetails.lastName
      })

      this.issueIdArr[i] = this.issues[i].id;
      this.isCheckedArr[i] = false;
      this.issueIdIsChecked[this.issues[i].id] = false;
    }
    this.issuesService.getAllIssues()
    .subscribe((allIssuesData) => {
      this.totalIssues = allIssuesData.maxIssues;
      this.isLoading = false
    });
    this.issuesDisplayedPerPage = issueData.issueCount;
    this.userCustomization = issueData.loggedInUserCustomize;

   /* for(let i=0; i < issueData.issueCount; i++){
      this.issueIdArr[i] = this.issues[i].id;
      this.isCheckedArr[i] = false;
      this.issueIdIsChecked[this.issues[i].id] = false;
    }*/
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
  var idsToDelete: string[] = [];
  let j = 0;
  //delete this.issueIdIsChecked[this.issues[i].id];
  if(this.isLoggedIn) {
  for(let i=0; i < this.issuesDisplayedPerPage; i++){
    if(this.issueIdIsChecked[this.issues[i].id]) {
      this.flag = true;
      /*this.issuesService.deleteIssue(this.issues[i].id).subscribe(() => {
        delete this.issueIdIsChecked[this.issues[i].id];
        this.issuesService.getIssues(this.issuesPerPage, this.currentPage);
       }, () => {
         this.isLoading = false;
       });*/
       idsToDelete[j] = `"${this.issues[i].id}"`;
       j++;
    }
  }
  if(!this.flag) {
    this.isLoading = false;
    alert("Please select at least 1 Issue.");
    return;
  }

  this.issuesService.deleteMultipleIssues(idsToDelete)
  .subscribe((response) => {
    idsToDelete.forEach((eachId) => delete this.issueIdIsChecked[eachId]);
    this.issuesService.getIssues(this.issuesPerPage, this.currentPage);
    console.log(response);
  }, (error) => {
    console.log(error);
  })
}
  else {
    this.isLoading = false;
    this.router.navigate(["/auth/login"]);
  }
}

onChangedPage (pageData: PageEvent) {
  this.isLoading = true;
  this.currentPage = pageData.pageIndex + 1;
  this.issuesPerPage = pageData.pageSize;
  this.issuesService.getIssues(this.issuesPerPage, this.currentPage);
}

onDelete(issueId: string){
  this.isLoading = true;
  if(this.isLoggedIn) {
  this.issuesService.deleteIssue(issueId).subscribe(() => {
    delete this.issueIdIsChecked[issueId];
   this.issuesService.getIssues(this.issuesPerPage, this.currentPage);
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

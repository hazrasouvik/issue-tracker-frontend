import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Issue } from '../issue.model';

import { IssuesService } from '../issues.service';


@Component({
  selector: 'app-issue-create',
  templateUrl: './issue-create.component.html',
  styleUrls: ['./issue-create.component.css']
})
export class IssueCreateComponent implements OnInit {
  statuses: string[] = ["Open", "In Progress", "Closed"];
  severities: string[] = ["Minor", "Major", "Critical"];
  date = new Date(Date.now());
  isLoading = false;
  issue!: any;
  mode = 'add';
  private issueId!: string | null;
  loggedInUserId!: string | null;
  creator!: string;
  lastModifiedBy!: string;

  @ViewChild(NgForm, {static:false}) addIssueForm!: NgForm;

  constructor(private issuesService: IssuesService, private route: ActivatedRoute, private authService: AuthService) {}

  ngOnInit() {
    this.issue = {'description': '', 'severity': '', 'status': '', 'createdDate': '', 'resolvedDate': ''};
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('issueId')) {
        this.mode = 'edit';
        this.issueId = paramMap.get('issueId');
        this.isLoading = true;
        this.issuesService.getIssue(this.issueId).subscribe((issueData: any) => {
          this.isLoading = false;
          if(issueData.resolvedDate !== "") {
          this.issue = {id: issueData.id, description: issueData.description, severity: issueData.severity, status: issueData.status, createdDate: new Date(issueData.createdDate), resolvedDate: new Date(issueData.resolvedDate)};
          }
          else {
            this.issue = {id: issueData.id, description: issueData.description, severity: issueData.severity, status: issueData.status, createdDate: new Date(issueData.createdDate), resolvedDate: new Date()};
          }
        this.loggedInUserId = this.authService.getloggedInUserId();
          this.authService.getUserDetails(this.loggedInUserId)
        .subscribe((user: any) => {
          this.lastModifiedBy = user.firstName + " " + user.lastName;
          console.log(this.lastModifiedBy);
        });
          });
      } else {
        this.mode = 'add';
        this.issueId = null;
        this.loggedInUserId = this.authService.getloggedInUserId();
        this.authService.getUserDetails(this.loggedInUserId)
        .subscribe((user: any) => {
          this.creator = user.firstName + " " + user.lastName;
          this.isLoading = false;
        });
      }
    });
  }


  onSubmit(formValue: any) {
    this.isLoading = true;
    if(formValue.resolvedDate !== null) {
    if( this.mode === 'add') {
      let newIssue = {
        "description": formValue.description,
        "severity": formValue.severity,
        "status": formValue.status,
        "createdDate": formValue.createdDate,
        "resolvedDate": formValue.resolvedDate,
        "creator": this.creator
      }
      this.issuesService.addIssue(newIssue);
     } else {
       let updatedIssue = {
         "id": this.issue.id,
        "description": formValue.description,
        "severity": formValue.severity,
        "status": formValue.status,
        "createdDate": formValue.createdDate,
        "resolvedDate": formValue.resolvedDate,
        "lastModifiedBy": this.lastModifiedBy
       }
       this.issuesService.updateIssue(updatedIssue);
     }}
     else {
      if( this.mode === 'add') {
        let newIssue = {
          "description": formValue.description,
          "severity": formValue.severity,
          "status": formValue.status,
          "createdDate": formValue.createdDate,
          "resolvedDate": "",
          "creator": this.creator
        }
        this.issuesService.addIssue(newIssue);
       } else {
         let updatedIssue = {
           "id": this.issue.id,
          "description": formValue.description,
          "severity": formValue.severity,
          "status": formValue.status,
          "createdDate": formValue.createdDate,
          "resolvedDate": "",
          "lastModifiedBy": this.lastModifiedBy
         }
         this.issuesService.updateIssue(updatedIssue);
         this.addIssueForm.reset();
       }
     }
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
import { AuthService } from 'src/app/auth/auth.service';
import { Issue } from '../issue.model';
import { IssuesService } from '../issues.service';


@Component({
  selector: 'app-issue-detail',
  templateUrl: './issue-detail.component.html',
  styleUrls: ['./issue-detail.component.css']
})
export class IssuesDetailComponent implements OnInit {
    isLoading: boolean = false;
    id: any;
    issue: any = {'description': '', 'severity': '', 'status': '', 'createdDate': '', 'resolvedDate': '', 'issueViewCount': 0, 'creator': '', 'lastModifiedBy': ''};

    constructor(public issuesService: IssuesService, public route: ActivatedRoute, private authService: AuthService) {}
    ngOnInit() {
      this.isLoading = true;
      this.route.paramMap.forEach((params: Params) => {
        this.id = params.get('issueId')
      });
      this.issuesService.getIssue(this.id).subscribe((issue: any) => {
        this.authService.getUserDetails(issue.creator)
        .subscribe((creatorDetails: any) => {
          if(issue.lastModifiedBy && issue.lastModifiedBy!=="") {
            this.authService.getUserDetails(issue.lastModifiedBy)
        .subscribe((lastModifierDetails: any) => {
            this.issue.creator = creatorDetails.firstName + " " + creatorDetails.lastName;
            this.issue.description = issue.description;
            this.issue.severity = issue.severity;
            this.issue.status = issue.status;
            this.issue.createdDate = issue.createdDate;
            this.issue.resolvedDate = issue.resolvedDate;
            this.issue.lastModifiedBy = lastModifierDetails.firstName + " " + lastModifierDetails.lastName;
            this.isLoading = false;
        });
          }
          else {
            this.issue.creator = creatorDetails.firstName + " " + creatorDetails.lastName
            this.issue.description = issue.description;
            this.issue.severity = issue.severity;
            this.issue.status = issue.status;
            this.issue.createdDate = issue.createdDate;
            this.issue.resolvedDate = issue.resolvedDate;
            this.issue.lastModifiedBy = issue.lastModifiedBy;
            this.isLoading = false;
          }
        })
        this.issue.issueViewCount = issue.issueViewCount + 1;
        let updatedCountIssue = {
          "id": this.id,
          "issueViewCount": this.issue.issueViewCount
        }
        this.issuesService.updateIssueCount(updatedCountIssue);
      });
    }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params } from '@angular/router';
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
    issue: any = {'description': '', 'severity': '', 'status': '', 'createdDate': '', 'resolvedDate': ''};

    constructor(public issuesService: IssuesService, public route: ActivatedRoute) {}
    ngOnInit() {
      this.isLoading = true;
      this.route.paramMap.forEach((params: Params) => {
        this.id = params.get('issueId')
      });
      this.issuesService.getIssue(this.id).subscribe((issue: any) => {
        this.issue.description = issue.description;
        this.issue.severity = issue.severity;
        this.issue.status = issue.status;
        this.issue.createdDate = issue.createdDate;
        this.issue.resolvedDate = issue.resolvedDate;
        this.isLoading = false;
      });
    }
}

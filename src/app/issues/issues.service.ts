import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthData } from '../auth/auth-data.model';
import { AuthService } from '../auth/auth.service';

import { Issue } from './issue.model';

@Injectable({ providedIn: 'root'})
export class IssuesService {

  private _issuesUrl = "https://issue-tracker-backend1.herokuapp.com/api/issues";
  /*private _issuesUrl = "https://my-json-server.typicode.com/hazrasouvik/issue-tracker-json-server/issues";*/
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    private issues: Issue[] = [];
    private topViewedIssues: Issue[] = [];
    private issuesUpdated = new Subject<{ issues: Issue[], issueCount: number, loggedInUserCustomize: {} | null}>();
    private topViewedIssuesUpdated = new Subject<{ issues: Issue[], issueCount: number, customIssues: number}>();

    constructor(private _http: HttpClient, private router: Router, private authService: AuthService){}

    getAllIssues() {
      return this._http.get<any>(this._issuesUrl);
    }

    getIssues(issuesPerPage: number, currentPage: number){
        if(this.authService.getIsLoggedIn()) {
          this.authService.getUserDetails(this.authService.getloggedInUserId())
          .subscribe((userDetails: any) => {
        this._http.get<{message: string, issues: any, maxIssues: number}>(this._issuesUrl + "?_page=" + currentPage + "&_limit=" + issuesPerPage)
        .pipe(map((issueData) => {
          return { issues: issueData.issues.map((issue: any) => {
              return {
                id: issue._id,
                description: issue.description,
                severity: issue.severity,
                status: issue.status,
                createdDate: issue.createdDate,
                resolvedDate: issue.resolvedDate,
                issueViewCount: issue.issueViewCount,
                creator: issue.creator,
                lastModifiedBy: issue.lastModifiedBy
              };
          }), maxIssues: issueData.maxIssues};
        }))
        .subscribe((transformedIssueData: any) => {
          this.issues = transformedIssueData.issues,
          this.issuesUpdated.next({issues: [...this.issues], issueCount: this.issues.length, loggedInUserCustomize: userDetails.customize});
        });
          });
        } else if(!this.authService.getIsLoggedIn()) {
          this._http.get<{message: string, issues: any, maxIssues: number}>(this._issuesUrl + "?_page=" + currentPage + "&_limit=" + issuesPerPage)
          .pipe(map((issueData) => {
            return { issues: issueData.issues.map((issue: any) => {
              return {
                id: issue._id,
                description: issue.description,
                severity: issue.severity,
                status: issue.status,
                createdDate: issue.createdDate,
                resolvedDate: issue.resolvedDate,
                issueViewCount: issue.issueViewCount,
                creator: issue.creator,
                lastModifiedBy: issue.lastModifiedBy
              };
            }), maxIssues: issueData.maxIssues};
          }))
        .subscribe((transformedIssueData: any) => {
          this.issues = transformedIssueData.issues,
          this.issuesUpdated.next({issues: [...this.issues], issueCount: this.issues.length, loggedInUserCustomize: null});
        });
        }
    }


    getIssue(issueId: string | null) {
      return this._http.get(this._issuesUrl + "/" + issueId);
    }

    getTopViewedSortedIssues(customIssues: any) {
      this._http.get<Issue[]>(this._issuesUrl + "?_sort=issueViewCount&_order=desc")
        .subscribe((issueData: any) => {
          this.topViewedIssues = issueData.issues,
          this.topViewedIssuesUpdated.next({issues: [...this.topViewedIssues], issueCount: this.topViewedIssues.length, customIssues: customIssues});
          });
    }

    getIssueUpdateListener() {
      return this.issuesUpdated.asObservable();
    }

    getTopViewedIssueUpdateListener() {
      return this.topViewedIssuesUpdated.asObservable();
    }

    addIssue(issue: any){
      let issueViewCount = 0;
      let newIssue: any = {
          "description": issue.description,
          "severity": issue.severity,
          "status": issue.status,
          "createdDate": issue.createdDate,
          "resolvedDate": issue.resolvedDate,
          "issueViewCount": issueViewCount
      }
      this._http.post(this._issuesUrl, newIssue, this.httpOptions)
      .subscribe(() => {
        this.router.navigate(["/issues"]);
      });
  }

    updateIssue(issue: any) {
      this._http.patch(this._issuesUrl + '/' + issue.id, issue, this.httpOptions)
  .subscribe(() => {
    this.router.navigate(["/issues"]);
  });
    }

    updateIssueCount(issue: any) {
      this._http.patch(this._issuesUrl + '/' + issue.id, issue, this.httpOptions)
      .subscribe(() => {
        console.log("Issue Count update success");
      });
    }


  deleteMultipleIssues(issueIds: string[]) {
    return this._http.delete(this._issuesUrl + "/deleteMultiple?ids=[" + issueIds + "]");
  }

  deleteIssue(issueId: string){
    return this._http.delete(this._issuesUrl + "/" + issueId);
  }

}

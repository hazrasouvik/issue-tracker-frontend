import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { AuthData } from '../auth/auth-data.model';
import { AuthService } from '../auth/auth.service';

import { Issue } from './issue.model';

@Injectable({ providedIn: 'root'})
export class IssuesService {

  private _issuesUrl = "http://localhost:3001/issues";
    private httpOptions = {
        headers: new HttpHeaders({
            'Content-Type': 'application/json'
        })
    };

    private issues: Issue[] = [];
    private issuesUpdated = new Subject<{ issues: Issue[], issueCount: number, loggedInUserCustomize: {} | null}>();

    constructor(private _http: HttpClient, private router: Router, private authService: AuthService){}

    getIssues(){
        if(this.authService.getIsLoggedIn()) {
          this.authService.getUserDetails(this.authService.getloggedInUserId())
          .subscribe((userDetails: any) => {
        this._http.get<Issue[]>(this._issuesUrl)
        .subscribe((issues: any) => {
          this.issues = issues,
          this.issuesUpdated.next({issues: [...this.issues], issueCount: this.issues.length, loggedInUserCustomize: userDetails.customize});
        });
          });
        } else {
          this._http.get<Issue[]>(this._issuesUrl)
        .subscribe((issues: any) => {
          this.issues = issues,
          this.issuesUpdated.next({issues: [...this.issues], issueCount: this.issues.length, loggedInUserCustomize: null});
        });
        }
    }

    getIssue(issueId: string | null) {
      return this._http.get(this._issuesUrl + "/" + issueId);
    }

    getIssueUpdateListener() {
      return this.issuesUpdated.asObservable();
    }

    addIssue(issue: any){
      let id = uuidv4();
      let newIssue: Issue = {
          "id": id,
          "description": issue.description,
          "severity": issue.severity,
          "status": issue.status,
          "createdDate": issue.createdDate,
          "resolvedDate": issue.resolvedDate
      }
      this._http.post(this._issuesUrl, newIssue, this.httpOptions)
      .subscribe(() => {
        this.router.navigate(["/issues"]);
      });
  }

    updateIssue(issue: any) {
      this._http.put(this._issuesUrl + '/' + issue.id, issue, this.httpOptions)
  .subscribe(() => {
    this.router.navigate(["/issues"]);
  });
    }

  deleteIssue(issueId: string){
    return this._http.delete(this._issuesUrl + "/" + issueId);
  }

}

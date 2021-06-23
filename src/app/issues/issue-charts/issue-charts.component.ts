import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTabGroup } from '@angular/material/tabs';
import { Issue } from '../issue.model';
import { Subscription } from 'rxjs';

import { IssuesService } from '../issues.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-issue-charts',
  templateUrl: './issue-charts.component.html',
  styleUrls: ['./issue-charts.component.css']
})
export class IssueChartsComponent implements OnInit, OnDestroy{

  isLoading: boolean = false;
 totalIssues: number = 0;
 issuesToDisplay: number = 5;
  issues: Issue[] = [];
  issueIdArr: string[] = [];
  issuesChart: [{}] = [{}];
  customIssuesChart: [{}] = [{}];
  options: number[] = [3, 5, 10, 20, 50, 100];
  dropdownNumOfTopIssuesToDispaly!: number;
  customNumOfTopIssuesToDispaly!: number;
  private issuesSub!: Subscription;

  @ViewChild(MatTabGroup, {static: false}) tabGroup!: MatTabGroup;

  constructor(private issuesService: IssuesService, private router: Router) {}

  ngOnInit() {
    this.isLoading = true;
    this.issuesService.getTopViewedSortedIssues(this.issuesToDisplay);
    this.issuesSub = this.issuesService.getTopViewedIssueUpdateListener().subscribe((issueData: {issues: Issue[], issueCount: number, customIssues: number}) => {
    this.isLoading=false;
    this.issues = issueData.issues;
    this.totalIssues = issueData.issueCount;
    if(issueData.customIssues > issueData.issueCount) {
      this.issuesToDisplay = issueData.issueCount
    } else {
      this.issuesToDisplay = issueData.customIssues;
    }
    this.issuesChart = [{}];
    for(let i=0; i<issueData.issueCount; i++) {
      this.issuesChart[i] = { name: issueData.issues[i].description, value: issueData.issues[i].issueViewCount };
    }
    this.customIssuesChart = [{}];
    for(let i=0; i<this.issuesToDisplay; i++) {
      this.customIssuesChart[i] = { name: issueData.issues[i].description, value: issueData.issues[i].issueViewCount };
    }
  });
  }

  colorScheme = {
    domain: ['#00876c', '#78ab63', '#dac767', '#e18745', '#d43d51']
  };

  onSubmit(formValue: any) {
    this.isLoading = true;
    if(formValue.dropdownIssues) {
      this.issuesToDisplay = formValue.dropdownIssues;
    }
    else if(formValue.customIssues) {
      this.issuesToDisplay = formValue.customIssues;
    }
    this.issuesService.getTopViewedSortedIssues(this.issuesToDisplay);
    /*this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate(["/issues/data/analysis"])
    );*/
    setTimeout(() => {
      if (this.tabGroup)
      this.tabGroup.selectedIndex = 0;
      this.isLoading = false;
    }, 500);
  }

  ngOnDestroy() {
    this.issuesSub.unsubscribe();
  }
}

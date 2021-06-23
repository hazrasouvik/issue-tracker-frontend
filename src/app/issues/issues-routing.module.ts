import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { IssueCreateComponent } from "./issue-create/issue-create.component";
import { IssuesListComponent } from "./issues-list/issues-list.component";
import { IssuesDetailComponent } from "./issue-detail/issue-detail.component";
import { IssueChartsComponent } from "./issue-charts/issue-charts.component";
import { AuthGuard } from "../auth/auth-guard.service";
import { IssueCreateDeactivateGuard } from "./issue-create-deactivate-guard.service";

const issueRoutes: Routes = [
    { path: '', component: IssuesListComponent },
    { path: 'add', component: IssueCreateComponent, canActivate: [AuthGuard], canDeactivate: [IssueCreateDeactivateGuard] },
    { path: 'edit/:issueId', component: IssueCreateComponent, canActivate: [AuthGuard] },
    { path: ':issueId', component: IssuesDetailComponent, canActivate: [AuthGuard] },
    { path: 'data/analysis', component: IssueChartsComponent, canActivate: [AuthGuard] }
  ];
@NgModule({
  imports: [
    RouterModule.forChild(issueRoutes)
],
exports: [RouterModule]
})
export class IssuesRoutingModule {}

import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxChartsModule }from '@swimlane/ngx-charts';

import { AngularMaterialModule } from "../angular-material.module";
import { IssueCreateComponent } from "./issue-create/issue-create.component";
import { IssuesListComponent } from "./issues-list/issues-list.component";
import { IssuesDetailComponent } from "./issue-detail/issue-detail.component";
import { IssueChartsComponent } from "./issue-charts/issue-charts.component";
import { SearchFilterPipe } from "../search-filter.pipe";
import { IssuesRoutingModule } from "./issues-routing.module";
import { IssueCreateDeactivateGuard } from "./issue-create-deactivate-guard.service";


@NgModule({
  declarations: [
    IssueCreateComponent,
    IssuesListComponent,
    IssuesDetailComponent,
    IssueChartsComponent,
    SearchFilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule,
    FlexLayoutModule,
    IssuesRoutingModule,
    NgxChartsModule
  ],
  providers: [IssueCreateDeactivateGuard],
  exports: []
})
export class IssuesModule {}

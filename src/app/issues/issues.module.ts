import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularMaterialModule } from "../angular-material.module";
import { IssueCreateComponent } from "./issue-create/issue-create.component";
import { IssuesListComponent } from "./issues-list/issues-list.component";
import { IssuesDetailComponent } from "./issue-detail/issue-detail.component";
import { SearchFilterPipe } from "../search-filter.pipe";
import { IssuesRoutingModule } from "./issues-routing.module";
import { IssueCreateDeactivateGuard } from "./issue-create-deactivate-guard.service";


@NgModule({
  declarations: [
    IssueCreateComponent,
    IssuesListComponent,
    IssuesDetailComponent,
    SearchFilterPipe
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule,
    FlexLayoutModule,
    IssuesRoutingModule
  ],
  providers: [IssueCreateDeactivateGuard],
  exports: []
})
export class IssuesModule {}

import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AboutComponent } from "./about/about.component";
import { PageNotFoundComponent } from "./page-not-found.component";

const appRoutes: Routes = [

  { path: '', component: AboutComponent },
  { path: 'issues', loadChildren: () => import('./issues/issues.module').then(m => m.IssuesModule)},
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
      RouterModule.forRoot(appRoutes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}

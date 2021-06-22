import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { FlexLayoutModule } from '@angular/flex-layout';

import { AngularMaterialModule } from "../angular-material.module";
import { AuthRoutingModule } from "./auth-routing.module";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { UserUpdateComponent } from "./user-update/user-update.component";
import { CustomizeComponent } from "./customize-dashboard/customize.component";

@NgModule({
  declarations: [
    RegisterComponent,
    LoginComponent,
    UserDetailComponent,
    UserUpdateComponent,
    CustomizeComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    AngularMaterialModule,
    RouterModule,
    FlexLayoutModule,
    AuthRoutingModule
  ],
  exports: []
})
export class AuthModule {}

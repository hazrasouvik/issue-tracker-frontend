import { NgModule } from "@angular/core";
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UserDetailComponent } from "./user-detail/user-detail.component";
import { UserUpdateComponent } from "./user-update/user-update.component";
import { AuthGuard } from "./auth-guard.service";
import { CustomizeComponent } from "./customize-dashboard/customize.component";

const authRoutes: Routes = [
  {path: 'auth',
  children: [
{ path: 'login', component: LoginComponent },
{ path: 'register', component: RegisterComponent },
{ path: 'user/:userId', component: UserDetailComponent, canActivate: [AuthGuard] },
{ path: 'user/update/:userId', component: UserUpdateComponent, canActivate: [AuthGuard] },
{ path: 'user/customize/:userId', component: CustomizeComponent, canActivate: [AuthGuard] }
]
}]
@NgModule({
  imports: [RouterModule.forChild(authRoutes)],
  exports: [RouterModule]
})
export class AuthRoutingModule {}

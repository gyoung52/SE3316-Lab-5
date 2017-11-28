import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UserService } from './user.service';
import { AuthGuard } from './auth.guard';
import { UserComponent } from './user/user.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { CreateAccountComponent } from './create-account/create-account.component';

const appRoutes:Routes = [
  {
    path: '',
    component: LoginFormComponent
  },
  {
    path: 'createaccount',
    component: CreateAccountComponent
  },
  {
    path: 'users',
    //component: UserComponent
    children: [
      {
        path: ':name',
        component: UserComponent
      },
      {
        path: ':name/:id',
        component: UserComponent
      }
      ]
  },
  {
    path: 'dashboard',
    canActivate: [AuthGuard],
    component: DashboardComponent
  },
  {
    path: '**',
    component: NotfoundComponent
  }
]

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginFormComponent,
    DashboardComponent,
    UserComponent,
    NotfoundComponent,
    CreateAccountComponent
  ],
  imports: [
    RouterModule.forRoot(appRoutes),
    BrowserModule,
    HttpClientModule
  ],
  providers: [
    UserService,
    AuthGuard
    ],
  bootstrap: [AppComponent]
})
export class AppModule { }

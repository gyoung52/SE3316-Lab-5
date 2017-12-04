import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http'; 

import { AppComponent } from './app.component';
import { LoginFormComponent } from './login-form/login-form.component';
import { UserService} from './user.service';
import { SearchService} from './search.service'; 
import { RouterModule, Routes} from '@angular/router';
import { CreateAccountComponent } from './create-account/create-account.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { VerifyComponent } from './verify/verify.component';
import { AuthGuard } from './auth.guard'; 
import { LoginGuard } from './login.guard';
import { CollectionComponent } from './collection/collection.component';
import { SearchComponent } from './search/search.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home/home.component';
import { PrivacypolicyComponent } from './privacypolicy/privacypolicy.component';
import { UnauthhomeComponent } from './unauthhome/unauthhome.component';
import { UnauthhomeGuard } from './unauthhome.guard';
import { AdminComponent } from './admin/admin.component';
import { AdminGuard } from './admin.guard';
import { AdminDmcaComponent } from './admin-dmca/admin-dmca.component';


const appRoutes:Routes = [

  {
    path: 'login', 
    component: LoginFormComponent,
    canActivate: [LoginGuard]
  }, 
  {
    path: 'createaccount', 
    component: CreateAccountComponent,
    canActivate: [LoginGuard]
  }, 
  {
    path: 'verify', 
    component: VerifyComponent,
    canActivate: [LoginGuard]
  }, 
  {
    path: 'search', 
    component: SearchComponent, 
    canActivate: [AuthGuard]
  },
  {
    path: 'collection', 
    component: CollectionComponent, 
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard' ,
    component: DashboardComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [UnauthhomeGuard]
  },
  {
    path: 'unauthhome',
    component: UnauthhomeComponent,
    canActivate: [LoginGuard]
  },
  {
    path: 'privacypolicy',
    component: PrivacypolicyComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AdminGuard]
  },
  {
    path: 'adminDMCA',
    component: AdminDmcaComponent,
    canActivate: [AdminGuard]
  },
  {
    path: '**', 
    component : NotfoundComponent
  }
  
]

@NgModule({
  declarations: [
    AppComponent,
    LoginFormComponent,
    CreateAccountComponent,
    DashboardComponent,
    VerifyComponent,
    CollectionComponent,
    SearchComponent,
    NotfoundComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    PrivacypolicyComponent,
    UnauthhomeComponent,
    AdminComponent,
    AdminDmcaComponent,
  ],
  imports: [
    BrowserModule, 
    HttpClientModule, 
    RouterModule.forRoot(appRoutes)
  ],
  providers: [LoginGuard, AuthGuard, UserService, SearchService, UnauthhomeGuard, AdminGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
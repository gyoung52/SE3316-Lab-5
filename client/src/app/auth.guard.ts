import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { UserService } from './user.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {
  
  constructor(private user:UserService, private router:Router) {  }
  
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {
      if (!this.user.getUserLoggedIn()) {
        alert('You must log in to access the dashboard');
        this.router.navigate(['/login']);
      }
      
    return this.user.getUserLoggedIn();
  }
}

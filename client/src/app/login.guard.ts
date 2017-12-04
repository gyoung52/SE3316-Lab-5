import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
 
@Injectable()
export class LoginGuard implements CanActivate {
 
    constructor(private router: Router) { }
 
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('user') == null) {
            // logged in so return true
            return true;
        }
        
        if (localStorage.getItem('user') == 'admin') {
                this.router.navigate(['/admin']);
            }
            
        // not logged in so redirect to login page with the return url
        this.router.navigate(['/dashboard']);
        return false;
    }
    
}
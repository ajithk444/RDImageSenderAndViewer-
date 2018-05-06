import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, Routes } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AuthService } from '../services/auth.service';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/take';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {
    console.log('Se llamo el auth guard');
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | boolean {
      
      // return this.authService.user
      //   .take(1)
      //   .map(user => !!user)
      //   .do(loggedIn => {
      //     if (!loggedIn) {
      //       console.log('access denied');
      //       this.router.navigate(['/login']);
      //     }        
      //   });

      // If isAdmin is undefined it means the route should be valid for both admin and doctors
      const isAdmin = next.data.isAdmin;

      return this.authService.user
        .take(1)
        .map(user => {
          if (user) {
            if (isAdmin !== undefined) {
              return user.loggedAsAdmin === isAdmin;
            } 
            return true;           
          } else {
            console.log('access denied');
            this.router.navigate(['/login']);
          }
          return false;
        });
  }
}

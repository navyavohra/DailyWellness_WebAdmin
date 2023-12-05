import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { ServiceService } from './services/service.service';
@Injectable({
  providedIn: 'root'
})
export class AuthGaurdGuard implements CanActivate {
  result: any;
  constructor(public router:Router, private service:ServiceService) {
  }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (localStorage.getItem('userid')) {
      this.service.checkUserName(localStorage.getItem('userid')).subscribe((data: any) => {
        this.result = data;
      });
        if(this.result != ''){
          return true;
        }
        else{
          return false;
        }
      }
    else{
      alert('Please Login To Proceed');
      this.router.navigate(['/login']);
      return false;
    }
  }
  
}

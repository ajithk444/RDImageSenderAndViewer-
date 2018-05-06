import { AuthService } from './../../services/auth.service';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { GoogleAuthProvider } from '@firebase/auth-types';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {

  user: Observable<firebase.User>;
  authenticated = false;
  isAdmin: boolean;

  constructor(public af: AngularFireAuth,
    private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.getUser().subscribe(user => {
      if (user) {
        this.authenticated = true;
        this.isAdmin = user.loggedAsAdmin;
      } else {
        this.authenticated = false;
      }
    });
  }

  logout() {
    this.authService.logout();
    this.authenticated = false;
  }

}

import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import { StringLike } from '@firebase/util';
import { User } from '../models/user';

@Injectable()
export class AuthService {

  user: Observable<User>;

  constructor(private afAuth: AngularFireAuth,
              private afs: AngularFirestore,
              private router: Router) {
      
    this.user = this.afAuth.authState.switchMap(
      user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return Observable.of(null);
        }
      }
    );
  }

  getUser() {
    return this.user;
  }

  googleLogin(loggedAsAdmin) {
    const provider = new firebase.auth.GoogleAuthProvider;
    return this.oAuthLogin(provider, loggedAsAdmin);
  }

  private oAuthLogin(provider, loggedAsAdmin) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then(credential => {
        this.updateUserData(credential.user, loggedAsAdmin);
        this.router.navigate(['/contact']);
      });
  }

  private updateUserData(user, paramLoggedAsAdmin) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email,
      loggedAsAdmin: paramLoggedAsAdmin,
      displayName: user.displayName
    };

    return userRef.set(data);
  }

  logout() {
    this.afAuth.auth.signOut();
    this.router.navigate(['/login']);
  }

}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from '../model/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject : BehaviorSubject<firebase.User>;
  public currentUser: Observable<firebase.User>;

  constructor(public afAuth: AngularFireAuth) {
    this.currentUserSubject = new BehaviorSubject<firebase.User>(null);
    this.currentUser = this.currentUserSubject.asObservable();
    let context = this;

    this.afAuth.auth.onAuthStateChanged(function(user) {
      if (user) {
        context.currentUserSubject.next(user);
      } else {
        context.currentUserSubject.next(null);
      }
    });
  }

  login() {
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(function(result) {
      // The signed-in user info.
      var user = result.user;
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      // ...
      console.log(error);
    });
  }

  logout() {
    this.afAuth.auth.signOut();
  }
}

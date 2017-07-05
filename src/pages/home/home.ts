import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	displayName;
	items: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, public afDB: AngularFireDatabase, private afAuth: AngularFireAuth) {
  	afAuth.authState.subscribe(user => {
 	if (!user) {
 		this.displayName = null;        
		return;
	}
 		this.displayName = user.displayName;      
	});
	this.items = afDB.list('/cuisines');
  }

  signInWithFacebook() {
    this.afAuth.auth
      .signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .then(res => console.log(res));
  }

  signOut() {
		this.afAuth.auth.signOut();
	}

}

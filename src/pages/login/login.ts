import { Component } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { Facebook } from '@ionic-native/facebook';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

	displayName;
	items: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, private fb: Facebook, private platform: Platform, public afDB: AngularFireDatabase, private afAuth: AngularFireAuth) {
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
  	 if (this.platform.is('cordova')) {
      return this.fb.login(['email', 'public_profile']).then(res => {
        const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
        return firebase.auth().signInWithCredential(facebookCredential);
      })
    }
    else {
      return this.afAuth.auth
        .signInWithPopup(new firebase.auth.FacebookAuthProvider())
        .then(res => console.log(res));
    }
  }

  signOut() {
		this.afAuth.auth.signOut();
	}

}

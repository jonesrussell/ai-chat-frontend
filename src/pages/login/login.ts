import { Component } from '@angular/core';
import { Platform, NavController, ToastController } from 'ionic-angular';
import { SignupPage } from '../signup/signup';
import { Facebook } from '@ionic-native/facebook';
import { AngularFireAuth } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { ShareService } from '../../services/share';

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})

export class LoginPage {
	// Store credentials
	loginData = {
		email: '',
		password: ''
	}

	constructor(
		public navCtrl: NavController,
		private _facebook: Facebook,
		private _platform: Platform,
		private _auth: AngularFireAuth,
		private _toast: ToastController,
		private _share: ShareService) {
			_auth.authState.subscribe(user => {
				if (!user) { return; }
			});
		}
	;

	public login(): void {
		this._auth.auth.signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
			.then(auth => {
				this._share.setUID(this._auth.auth.currentUser.uid);
			})
			.catch(err => {	
				// Show error message
				let toast = this._toast.create({
					message: err.message,
					duration: 1000
				});
				toast.present();
			});
	}

	public signup(): void {
		// Show signup screen, pass in email address if entered in login form
		this.navCtrl.push(SignupPage, { email: this.loginData.email });
	}

	public signInWithFacebook(): any {
		// First condition is to detect if we're on a mobile device
		if (this._platform.is('cordova')) { 
			return this._facebook.login(['email', 'public_profile']).then(res => {
				// Retrieve access token from Facebook
				const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
				return firebase.auth().signInWithCredential(facebookCredential);
			})
		}
		// We're not on mobile
		else {
			return this._auth.auth
				.signInWithPopup(new firebase.auth.FacebookAuthProvider())
				.then(res => console.log(res));
		}
	}

	public signOut(): void {
		this._share.uid = '';
		this._auth.auth.signOut();
	}

}

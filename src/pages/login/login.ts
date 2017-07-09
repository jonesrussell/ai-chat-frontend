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
	loginData = {
		email: '',
		password: ''
	}

	constructor(
		public navCtrl: NavController,
		private _FB: Facebook,
		private _platform: Platform,
		private _auth: AngularFireAuth,
		private _toast: ToastController,
		private _share: ShareService) {
		_auth.authState.subscribe(user => {
			if (!user) {
				return;
			}
		});
	}

	login() {
		this._auth.auth.signInWithEmailAndPassword(this.loginData.email, this.loginData.password)
			.then(auth => {
				this._share.setUID(this._auth.auth.currentUser.uid);
			})
			.catch(err => {
				// Handle error
				let toast = this._toast.create({
					message: err.message,
					duration: 1000
				});
				toast.present();
			});
	}

	signup() {
		this.navCtrl.push(SignupPage, { email: this.loginData.email });
	}

	signInWithFacebook() {
		if (this._platform.is('cordova')) {
			return this._FB.login(['email', 'public_profile']).then(res => {
				const facebookCredential = firebase.auth.FacebookAuthProvider.credential(res.authResponse.accessToken);
				return firebase.auth().signInWithCredential(facebookCredential);
			})
		}
		else {
			return this._auth.auth
				.signInWithPopup(new firebase.auth.FacebookAuthProvider())
				.then(res => console.log(res));
		}
	}

	signOut() {
		this._share.uid = '';
		this._auth.auth.signOut();
	}

}

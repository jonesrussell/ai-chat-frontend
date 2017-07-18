import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html',
})
export class SignupPage {
	signupData = {
		email: '',
		password: '',
		passwordRetyped: ''
	};

	constructor(
		public navCtrl: NavController, 
		public navParams: NavParams, 
		private alertCtrl: AlertController, 
		private _auth: AngularFireAuth) {
			this.signupData.email = this.navParams.get('email');
		}
	;

	public signup(): void {
		if(this.signupData.password !== this.signupData.passwordRetyped) {
			let alert = this.alertCtrl.create({
				title: 'Error',
				message: 'Your password and your re-entered password does not match each other.',
				buttons: ['OK']
			});
			alert.present();
			return;
		}

		// Firebase Signup Code
		this._auth.auth.createUserWithEmailAndPassword(this.signupData.email, this.signupData.password)
			.then(auth => {
				// Could do something with the Auth-Response
			})
			.catch(err => {
				// Handle error
				console.log(err);
				let alert = this.alertCtrl.create({
					title: 'Error',
					message: err.message,
					buttons: ['OK']
				});
				alert.present();
			});
	}

	ionViewDidLoad() {
		console.log('ionViewDidLoad SignupPage');
	}
}

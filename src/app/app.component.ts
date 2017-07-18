import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ShareService } from '../services/share';
import { LoginPage } from '../pages/login/login';
import { MessagePage } from '../pages/message/message';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
	templateUrl: 'app.html',
	providers: [ShareService]
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;
	rootPage: any = LoginPage;
	pages: Array<{title: string, component: any}>;

	constructor(
		public platform: Platform,
		public statusBar: StatusBar,
		public splashScreen: SplashScreen,
		private _auth: AngularFireAuth,
		private _share: ShareService) {
		this._auth.authState.subscribe(auth => {
			if (!auth) {
				this.rootPage = LoginPage;
			}
			else {
				this.rootPage = MessagePage;
				_share.setUID(this._auth.auth.currentUser.uid);
			}
		});

		this.initializeApp();

		// used for an example of ngFor and navigation
		this.pages = [
			{ title: 'Login', component: LoginPage },
			{ title: 'Bot', component: MessagePage }
		];
	}

	initializeApp() {
		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();
		});
	}

	openPage(page) {
		// Reset the content nav to have just this page
		// we wouldn't want the back button to show in this scenario
		this.nav.setRoot(page.component);
	}
}

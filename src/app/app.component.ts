import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { LoginPage } from '../pages/login/login';
//import { SignupPage } from '../pages/signup/signup';
import { MessagePage } from '../pages/message/message';

import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = MessagePage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, private _auth: AngularFireAuth, public statusBar: StatusBar, public splashScreen: SplashScreen) {
	this._auth.authState.subscribe(auth => {
		if (!auth) {
			this.rootPage = LoginPage;
		}
		else {
			this.rootPage = MessagePage;
		}
	});

    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Login', component: LoginPage },
    //      { title: 'Signup', component: SignupPage },
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

import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { EnvironmentsModule } from '../../environment-variables/environment-variables.module';
import { MyApp } from './app.component';
import { LoginPage } from '../pages/login/login';
import { SignupPage } from '../pages/signup/signup';
import { MessagePage } from '../pages/message/message';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { Facebook } from '@ionic-native/facebook';
import { HttpModule } from '@angular/http';
import { ShareService } from '../services/share';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import { TextToSpeech } from '@ionic-native/text-to-speech' 

export const firebaseConfig = {
	apiKey: "AIzaSyBbA4W3GmHNeW4p-2n0rxEeU8EUFC-fQL0",
	authDomain: "chat-test-b95fe.firebaseapp.com",
	databaseURL: "https://chat-test-b95fe.firebaseio.com",
	projectId: "chat-test-b95fe",
	storageBucket: "chat-test-b95fe.appspot.com",
	messagingSenderId: '2416292784'
};

@NgModule({
	declarations: [
		MyApp,
		LoginPage,
		SignupPage,
		MessagePage
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp),
		AngularFireModule.initializeApp(firebaseConfig),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		HttpModule,
		EnvironmentsModule
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp,
		LoginPage,
		SignupPage,
		MessagePage
	],
	providers: [
		StatusBar,
		SplashScreen,
		{provide: ErrorHandler, useClass: IonicErrorHandler},
		Facebook,
		ShareService,
		SpeechRecognition,
		TextToSpeech
	]
})
	export class AppModule {}

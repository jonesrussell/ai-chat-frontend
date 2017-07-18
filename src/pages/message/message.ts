import { Component, Inject } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as fb from 'firebase/app';
import { Http, Headers } from '@angular/http';
import { ShareService } from '../../services/share';
import { EnvVariables } from '../../../environment-variables/environment-variables.token';
import { SpeechRecognition } from '@ionic-native/speech-recognition';
import {  NgZone } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';

@Component({
	selector: 'page-message',
	templateUrl: 'message.html'
})
export class MessagePage {
	chatForm: FormGroup;
	messages: FirebaseListObservable<any[]>;
	answer: string;
	uid: string;
	isListening: boolean = false;
	matches: Array<String>;

	constructor(
		public navCtrl: NavController,
		public db: AngularFireDatabase,
		private _FB: FormBuilder,
		private _http: Http,
		private _share: ShareService,
		@Inject(EnvVariables) private _env,
		public speech: SpeechRecognition,
		private zone: NgZone,
		private _tts: TextToSpeech) {
			this.uid = _share.getUID();
			this.messages = db.list('/messages/' + this.uid,
				{ 
					query: { limitToLast: 5 } 
				}
			);
		this.chatForm = _FB.group({ messageInput: [''] })
	}

	public logMessage(form) {
		let message = form.messageInput;
		this._messageToDB(message);
		this._queryAi(message);
	}

	private _messageToDB(message) {
		let messageRef = fb.database().ref('/messages/' + this.uid).push();
		messageRef.set({ body: message });
		this.chatForm.reset();
	}

	public messageTapped(event, message) {
		this._queryAi(message.body);
	}

	private _queryAi(message) {
		let endpoint = this._env.aiEndpoint + this._env.messagePath;
		console.log(endpoint);
		let payload = JSON.stringify({ message: message });
		console.log(payload);
		let headers = new Headers({
			'Content-Type': 'application/json',
			//'x-access-token': this._env.token
		});

		this._http.post(endpoint, payload, { headers: headers })
			.subscribe(data => {
				this.answer = JSON.parse(data["_body"]).answer;
				this.sayText();
			}, error => {
				console.log("http error in queryAi");
				console.error(error);
			});
	}

	ionViewCanEnter(): boolean {
		if (this.uid != '') {
			return true;
		}
		return false;
	}

	async hasPermission():Promise<boolean> {
		try {
			const permission = await this.speech.hasPermission();

			return permission;
		} catch(e) {
			console.log(e);
		}
	}

	async getPermission():Promise<void> {
		try {
			this.speech.requestPermission();
		} catch(e) {
			console.log(e);
		}
	}

	listen(): void {
		console.debug('listen action triggered');
		console.log('listen action triggered');
		if (this.isListening) {
			this.speech.stopListening();
			this.toggleListenMode();
			return;
		}

		this.toggleListenMode();
		let _this = this;

		this.speech.startListening()
		.subscribe(matches => {
			_this.zone.run(() => {
				_this.chatForm.setValue({ messageInput: matches[0] });
				_this.logMessage({ messageInput: matches[0] });
				_this.matches = matches;
			})
		}, error => console.error(error));

	}

	toggleListenMode():void {
		this.isListening = this.isListening ? false : true;
		console.log('listening mode is now : ' + this.isListening);
	}

	async sayText():Promise<any> {
		console.debug('===================================');
		try{
			await this._tts.speak(this.answer);
		}
		catch(e){
			console.debug(e);
		}
		console.debug('===================================');
  	}
}

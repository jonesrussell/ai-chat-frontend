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
import {TextToSpeech} from '@ionic-native/text-to-speech';

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
			this.chatForm = _FB.group({ messageInput: [''] });
	}

	public logMessage(form) {
		let message = form.messageInput;
		this._messageToDB(message);
		this._queryAI(message);
	}

	private _messageToDB(message) {
		let messageRef = fb.database().ref('/messages/' + this.uid).push();
		messageRef.set({ body: message });
		this.chatForm.reset();
	}

	public messageTapped(event, message) {
		this._queryAI(message.body);
	}

	private _queryAI(message) {
		let endpoint = this._env.aiEndpoint + '/messages';
		let payload = JSON.stringify({ message: message });
		let headers = new Headers({ 'Content-Type': 'application/json' });

		this._http.post(endpoint, payload, { headers: headers })
			.subscribe(data => {
				this.answer = JSON.parse(data["_body"]).text;
				this.sayText();
			}, error => {
				console.log("http error in queryAI");
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
			let permission = await this.speech.hasPermission();
			console.log('hasPermission()?: ' + permission);
			return permission;
		}
		catch(e) {
			console.log(e);
		}
	}

	async getPermission():Promise<void> {
		try {
			return await this.speech.requestPermission();
		}
		catch(e) {
			console.debug(e);
		}
	}

	public listen(): void {
		console.log('============================');
		console.log('=== listen action triggered ===');
		let __this = this;
		this.hasPermission().then((permission) => {
			console.log('permission: ' + permission);
			if (!permission) {
				__this.getPermission().then((result) => {
					console.log('Got permission?: ' + result);
					__this.listen();
				});
			}
			else {
				if (__this.isListening) {
					__this.speech.stopListening();
					__this.toggleListenMode();
					return;
				}

				__this.toggleListenMode();
				let ___this = __this;

				this.speech.startListening()
					.subscribe(matches => {
						___this.zone.run(() => {
							___this.chatForm.setValue({ messageInput: matches[0] });
							___this.logMessage({ messageInput: matches[0] });
							___this.matches = matches;
						})
					}, error => console.error(error))
				;
			}
		}); 
		console.log('=======================================================');
	}

	toggleListenMode():void {
		this.isListening = this.isListening ? false : true;
		console.log('listening mode is now : ' + this.isListening);
	}

	async sayText():Promise<any> {
		try{
			await this._tts.speak(this.answer);
		}
		catch(e){
			console.debug(e);
		}
  	}
}

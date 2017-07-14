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

	async getPermission():Promise<boolean> {
		try {
			return await this.speech.requestPermission().then(
					() => { console.log('Granted'); return true; },
					() => { console.log('Denied'); return false; }
				);

		}
		catch(e) {
			console.debug(e);
		}
	}

	public listen(): void {
		let __this = this;
		this.hasPermission().then((hasPermission: boolean) => {
			if (!hasPermission) {
				__this.getPermission().then(
					(permission) => {
						console.log(permission);
						if (permission) {
							__this.listen();
						}
					}
				);
			}
			else {
				this.speech.startListening()
					.subscribe(matches => {
						__this.zone.run(() => {
							__this.chatForm.setValue({ messageInput: matches[0] });
							__this.logMessage({ messageInput: matches[0] });
							__this.matches = matches;
						})
					}, error => console.error(error))
				;
			}
		}); 
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

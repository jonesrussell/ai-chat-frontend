import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as fb from 'firebase/app';
import { Http, Headers } from '@angular/http';
import { ShareService } from '../../services/share';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {
	chatForm: FormGroup;
	messages: FirebaseListObservable<any[]>;
	answer: string;
	uid: string;

	constructor(
		public navCtrl: NavController,
		public db: AngularFireDatabase,
		private _FB: FormBuilder,
		private _http: Http,
		private _share: ShareService) {
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
		let link = 'http://192.168.2.238:3000/messages';
		let payload = JSON.stringify({ message: message });
		let headers = new Headers({ 'Content-Type': 'application/json' });

		this._http.post(link, payload, { headers: headers })
			.subscribe(data => {
				this.answer = JSON.parse(data["_body"]).text;
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

}

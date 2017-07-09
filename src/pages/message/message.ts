import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as fb from 'firebase/app';
import { Http, Headers } from '@angular/http';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {
	chatForm: FormGroup;
	messages: FirebaseListObservable<any[]>;
	data:any = {};

	constructor(public navCtrl: NavController, public db: AngularFireDatabase, private _FB: FormBuilder, private _http: Http) {
		this.messages = db.list('/messages',
			{ 
				query: { limitToLast: 5 } 
			}
		);
		this.chatForm = _FB.group({ messageInput: [''] })
	}

	public logMessage(form) {
		let messageRef = fb.database().ref('/messages').push();
		messageRef.set({ body: form.messageInput });
		this.chatForm.reset();

		this._queryAI(form.messageInput);
	}

	private _queryAI(message) {
		let link = 'http://192.168.2.238:3000/messages';
		let payload = JSON.stringify({ message: message });
		let headers = new Headers({ 'Content-Type': 'application/json' });

		this._http.post(link, payload, { headers: headers })
			.subscribe(data => {
				this.data.response = data["_body"];
				console.log(this.data);
			}, error => {
				console.log("http error in queryAI");
			});
	}

}
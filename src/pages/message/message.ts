import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { FormBuilder, FormGroup } from '@angular/forms';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import * as firebase from 'firebase/app';

@Component({
  selector: 'page-message',
  templateUrl: 'message.html'
})
export class MessagePage {
	chatForm: FormGroup;
	messages: FirebaseListObservable<any[]>;

	constructor(public navCtrl: NavController, public db: AngularFireDatabase, private _FB: FormBuilder) {
		this.messages = db.list('/messages');
		this.chatForm = _FB.group({ messageInput: [''] })
	}

	public logMessage(form) {
		console.log(form.messageInput);
		let messageRef = firebase.database().ref('/messages').push();
		messageRef.set({ body: form.messageInput });
		this.chatForm.reset();
	}

}

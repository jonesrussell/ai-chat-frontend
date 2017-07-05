import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	items: FirebaseListObservable<any[]>;

  constructor(public navCtrl: NavController, afDB: AngularFireDatabase) {
	this.items = afDB.list('/cuisines');
  }

}

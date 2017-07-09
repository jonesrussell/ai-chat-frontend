export class ShareService {  
	uid: string;
	firstName: string;
	lastName: string;

	constructor() {
		this.uid = '';
		this.firstName = '';
		this.lastName = '';
	}

	setUserName(firstName, lastName) {
		this.firstName = firstName;
		this.lastName = lastName;       
	}

	getUserName() {
		return this.firstName + ' ' + this.lastName;
	} 

	setUID(uid) {
		this.uid = uid;
	}

	getUID() {
		return this.uid;
	}
}

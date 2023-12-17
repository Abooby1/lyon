import * as Utils from '../utils.js'

export class Group {
	constructor(dataObj) {
		let data = { ...dataObj }
		this._data = data;
		this._init = null;

		return new Promise(async (res) => {
			if(this._data.data) {
				this._init = true;
				this._response = this._data.data;

				res(this)
			}

			let url = 'groups';
			if(this._data.id) {
				url += `?groupid=${this._data.id}`;
			}

			if(this._data.before) {
				url += `&before=${this._data.before}`;
			}
			if(this._data.after) {
				url += `&after=${this._data.after}`;
			}

			let [code, response] = await Utils.request('GET', url)
			this._code = code;

			if(this._code == 200) {
				this._init = true;
				this._response = response;
			} else {
				console.error(`Group class errored: ${response}`)
			}
		})
	}

	get members() {
		//
	}
	get invites() {
		//
	}

	async post() {
		//
	}
	async edit() {
		//
	}
	async invite() {
		//
	}
	async leave() {
		//
	}

	async onPost() {
		//
	}
}

export class GroupInvite {
	constructor() {
		//
	}

	async accept() {
		//
	}
	async reject() {
		//
	}
}
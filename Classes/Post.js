import * as Utils from '../utils.js'

export class Post {
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

			let url = 'posts/get';
			if(this._data.postid) {
				url += `?postid=${this._data.postid}`;
			} else if(this._data.userid) {
				url += `?userid=${this._data.userid}`;
			}

			if(this._data.groupid) {
				url += `?groupid=${this._data.groupid}`;
			}
			if(this._data.exclude) {
				url += `?exclude=${this._data.exclude.toString()}`;
			}
			if(this._data.before) {
				url += `?before=${this._data.before}`;
			}
			if(this._data.after) {
				url += `?after=${this._data.after}`;
			}

			let [code, response] = await Utils.request('GET', url)
			this._code = code;

			if(this._code == 200) {
				this._response = JSON.parse(response).posts[0];
				this._init = true;
			} else {
				console.error(`Post class errored: ${this._response}`)
			}

			res(this)
		})
	}

	get id() {
		//
	}
	get content() {
		//
	}
	get created() {
		//
	}
	get media() {
		//
	}
	get likes() {
		//
	}
	get quotes() {
		//
	}
	get chats() {
		//
	}
	async author() {
		//
	}

	async onChat() {
		//
	}
	async onDelete() {
		//
	}

	async reply() {
		//
	}
	async edit() {
		//
	}
	async delete() {
		//
	}

	async like() {
		//
	}
	async unlike() {
		//
	}

	async pin() {
		//
	}
	async unpin() {
		//
	}
}
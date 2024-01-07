import * as Utils from '../utils.js'
import * as Listeners from '../listeners.js'
import { User } from './index.js'

export class Chat {
	constructor(dataObj) {
		const data = { ...dataObj }
		this._data = data;
		this._init = null;

		return new Promise(async (res, rej) => {
			if(this._data.data) {
				this._init = true;
				this._response = this._data.data;

				res(this)
			}

			let url = 'chats';
			if(this._data.postid) {
				url += `?postid=${this._data.postid}`;
			} else if(this._data.id) {
				url += `?chatid=${this._data.id}`;
			} else if(this._data.userid) {
				url += `?userid=${this._data.userid}`;
			}

			if(this._data.groupid) {
				url += `&groupid=${this._data.groupid}`;
			}

			let [code, response] = await Utils.request('GET', url)
			this._code = code;

			if(this._code == 200) {
				this._response = JSON.parse(response).chats[0];
				this._init = true;
			} else {
				console.error(`Chat class errored: ${response}`)
			}

			res(this)
		})
	}

	get id() {
		if(!this._init) return;

		return this._response._id;
	}
	get postid() {
		if(!this._init) return;

		return this._response.PostID;
	}
	get replyid() {
		if(!this._init) return;

		return this._response.ReplyID;
	}
	get created() {
		if(!this._init) return;

		return this._response.Timestamp;
	}
	get content() {
		if(!this._init) return;

		return this._response.Text;
	}
	async author() {
		if(!this._init) return;

		return await new User({ id: this._response.UserID })
	}

	async edit(text) {
		if(!this._init) return;

		return new Promise(async (res, rej) => {
			let [code, response] = await Utils.request('POST', `chats/edit?chatid=${this._response._id}`, {
				text
			})
			this._response.Text = text;

			if(code == 200) {
				res(this)
			} else {
				res(response)
			}
		})
	}
	async delete() {
		if(!this._init) return;

		return new Promise(async (res, rej) => {
			let [code, response] = await Utils.request('DELETE', `chats/delete?chatid=${this._response._id}`)
			if(code == 200) {
				delete this;
			}

			res(response)
		})
	}
	async reply(text) {
		if(!this._init) return;

		return new Promise(async (res, rej) => {
			let [code, response] = await Utils.request('POST', `chats/new?postid=${this._response.PostID}`, {
				text,
				replyID: this._response._id
			})

			if(code == 200) {
				res(await new Chat({ id: response }))
			} else {
				res(response)
			}
		})
	}

	async onDelete(callback) {
		Listeners.addChat({ type: 'deleted', id: this._response._id, groupid: this._response.GroupID, postid: this._response.PostID, callback })

		return ['delete;chat', callback];
	}
	async onEdit(callback) {
		Listeners.addChat({ type: 'edited', id: this._response._id, groupid: this._response.GroupID, postid: this._response.PostID, callback })

		return ['edit;chat', callback];
	}

	async disconnect(listener) {
		if(typeof listener != 'object') return;

		try {
			let [type, callback] = listener;

			Listeners.removeListener({ callback, type, contentid: this._response._id, groupid: this._groupid })
			return true;
		} catch(err) {
			console.error(`Listener given is invalid: ${listener}`)
			return;
		}
	}

	async report({ reason, report }) {
		if(!this._init) return;

		let [_, response] = await Utils.request('PUT', `mod/report?contentid=${this._response._id}&type=chat`, {
			reason, report
		})
		return response;
	}
}
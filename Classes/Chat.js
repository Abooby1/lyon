import * as Utils from '../utils.js'
import { User } from './index.js'
import { ClientAuth } from '../index.js'

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
			}
			if(this._data.chatid) {
				url += `?chatid=${this._data.chatid}`;
			}
			if(this._data.userid) {
				url += `?userid=${this._data.userid}`;
			}
			if(this._data.groupid) {
				url += `?groupid=${this._data.groupid}`;
			}

			let [code, response] = await Utils.request('GET', url)
			this._code = code;

			if(this._code == 200) {
				this._response = JSON.parse(response)
				if(this._data.chatid) {
					this._response = this._response.chats[0];
				}

				this._init = true;
			} else {
				console.error(`Chat ${this._data.id} errored: ${this._response}`)
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

		return await new User({ data: this._response.UserID })
	}

	async edit(text) {
		if(!this._init) return;

		return new Promise(async (res, rej) => {
			let [code, response] = await Utils.request('POST', `chats/edit?chatid=${this._response._id}`, {
				text
			}, ClientAuth)
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
			let [code, response] = await Utils.request('DELETE', `chats/delete?chatid=${this._response._id}`, undefined, ClientAuth)
			if(code == 200) {
				delete this;
			}

			res(response)
		})
	}
	async reply(text) {
		if(!this._init) return;

		return new Promise(async (res, rej) => {
			let [code, response] = await Utils.request('POST', `chats/reply?chatid=${this._response._id}`, {
				text
			}, ClientAuth)
			
			if(code == 200) {
				res(await new Chat({ id: response }))
			} else {
				res(response)
			}
		})
	}

	async onDelete() {
		//
	}
	async onEdit() {
		//
	}
}
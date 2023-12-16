import * as Utils from '../utils.js'
import { User } from './index.js'

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
			if(this._data.id) {
				url += `?postid=${this._data.id}`;
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
				console.error(`Post class errored: ${response}`)
			}

			res(this)
		})
	}

	get id() {
		if(!this._init) return;

		return this._response._id;
	}
	get content() {
		if(!this._init) return;;

		return this._response.Text;
	}
	get created() {
		if(!this._init) return;

		return this._response.Timestamp;
	}
	get media() {
		//
	}
	get likes() {
		if(!this._init) return;

		return this._response.Likes;
	}
	get quotes() {
		if(!this._init) return;

		return this._response.Quotes;
	}
	get chats() {
		if(!this._init) return;

		return this._response.Chats;
	}
	async author() {
		if(!this._init) return;

		return await new User({ id: this._response.UserID })
	}

	async onChat() {
		//
	}
	async onDelete() {
		//
	}

	async edit(text) {
		if(!this._init) return;
		
		return new Promise(async (res) => {
			let [code, response] = await Utils.request('POST', `posts/edit?postid=${this._response._id}`, {
				text
			})

			if(code != 200) {
				res(response)
			}

			res(await new Post({ id: response }))
		})
	}
	async delete() {
		if(!this._init) return;

		let [_, response] = await Utils.request('DELETE', `posts/delete?postid=${this._response._id}`)
		return response;
	}

	async like() {
		if(!this._init) return;

		let [_, response] = await Utils.request('PUT', `posts/like?postid=${this._response._id}`)
		return response;
	}
	async unlike() {
		if(!this._init) return;

		let [_, response] = await Utils.request('DELETE', `posts/unlike?postid=${this._response._id}`)
		return response;
	}

	async pin() {
		if(!this._init) return;

		let [_, response] = await Utils.request('PUT', `posts/pin?postid=${this._response._id}`)
		return response;
	}
	async unpin() {
		if(!this._init) return;

		let [_, response] = await Utils.request('DELETE', `posts/unpin?postid=${this._response._id}`)
		return response;
	}
}
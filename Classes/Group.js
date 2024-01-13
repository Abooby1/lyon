import * as Utils from '../utils.js'
import * as Listeners from '../listeners.js'
import * as Classes from './index.js'

import { CurrentClient, ClientAuth } from '../index.js'

import FormData from 'form-data'
import fs from 'fs'
import axios from 'axios'

let groupCache = new Object()

export class Group {
	constructor(dataObj) {
		let data = { ...dataObj }
		this._data = data;
		this._init = null;

		let url = 'groups';
		if(this._data.id) {
			url += `?groupid=${this._data.id}`;

			if(groupCache[this._data.id]) {
				this._data.data = groupCache[this._data.id];
			}
		}

		return new Promise(async (res) => {
			if(this._data.data) {
				this._init = true;
				this._response = this._data.data;

				res(this)
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
				this._response = JSON.parse(response).groups[0];

				groupCache[this._response._id] = this._response;
			} else {
				console.error(`Group class errored: ${response}`)
			}
		})
	}

	get id() {
		if(!this._init) return;

		return this._response._id;
	}
	get name() {
		if(!this._init) return;

		return this._response.Name;
	}
	get icon() {
		if(!this._init) return;
		if(!this._response.Icon) return;

		return `https://photop-content.s3.amazonaws.com/GroupImages/${this._response.Icon}`;
	}
	get created() {
		if(!this._init) return;

		return this._response.Timestamp;
	}
	async owner() {
		if(!this._init) return;

		return new Classes.User({ id: this._response.Owner })
	}
	async members() {
		if(!this._init) return;

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', `groups/members?groupid=${this._response._id}`)
			if(code == 200) {
				response = JSON.parse(response)
				let users = response.Members;

				let formattedUsers = users.map(async (a) => {
					return await new Classes.GroupUser({ id: a._id, groupid: this._response._id })
				})
				res(formattedUsers)
			} else {
				res(response)
			}
		})
	}
	async moderators() {
		if(!this._init) return;

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', `groups/members?groupid=${this._response._id}`)
			if(code == 200) {
				response = JSON.parse(response)
				let users = response.Moderators;

				let formattedUsers = users.map(async (a) => {
					return await new Classes.GroupUser({ id: a, groupid: this._response._id })
				})
				res(formattedUsers)
			} else {
				res(response)
			}
		})
	}
	async invites() {
		if(!this._init) return;

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', `groups/sentinvites?groupid=${this._response._id}&type=user&amount=200`)

			if(code == 200) {
				let invites = JSON.parse(response).members;
				let formattedInvites = invites.map(async (a) => {
					return await new GroupInvite({ data: a })
				})

				res(formattedInvites)
			} else {
				res(response)
			}
		})
	}

	async post(text, data) {
		if(!this._init) return;
		data = { ...data };
		if((!text || text.length == 0) && !(data.images || data.poll)) return 'Text is needed.';

		let images = data.images || [];
		let poll = data.poll;

		return new Promise(async (res, rej) => {
			let formData = new FormData()
			formData.append('data', JSON.stringify({ text, poll }))
			for(let i=0;i<images.length;i++) {
				formData.append(`image${i}`, fs.createReadStream(images[i]))
			}

			axios.post(`https://photop.exotek.co/posts/new?groupid=${this._response._id}`, formData, {
				headers: {
					auth: ClientAuth
				}
			}).then(async (response) => {
				res(await new Classes.Post({ id: response.data }))
			}).catch(response => {
				res(response.response.data)
			})
		})
	}
	async edit({ name, invite, image }) {
		if(!this._init) return;

		let form = new FormData()
		form.append('data', JSON.stringify({ name, invite }))
		if(image) {
			form.append('image', fs.createReadStream(image))
		}

		return new Promise(async (res) => {
			let [_, response] = await Utils.request('PUT', `groups/edit?groupid=${this._response._id}`, form)

			res(response)
		})
	}
	async invite(userid) {
		if(!this._init) return;

		return new Promise(async (res) => {
			let [_, response] = await Utils.request('POST', `groups/invite?groupid=${this._response._id}`, {
				type: 'user',
				data: userid
			})

			res(response)
		})
	}
	async leave() {
		if(!this._init) return;

		let [_, response] = await Utils.request('DELETE', `groups/leave?groupid=${this._response._id}`)
		return response;
	}

	async onPost(callback) {
		Listeners.addListener({ type: 'newpost;post', callback, groupid: this._response._id })

		return ['newpost;main', callback];
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
}

export class GroupInvite {
	constructor(dataObj) {
		let data = { ...dataObj }
		this._data = data;
		this._init = null;

		if(this._data.data) {
			this._response = this._data.data;
			this._init = true;
		}

		return this;
	}

	async group() {
		if(!this._init) return;

		return await new Group({ id: this._response._id })
	}
	async accept() {
		if(!this._init) return;

		let [code, _] = await Utils.request('PUT', `groups/join?code=${this._response._id}`)
		if(code != 200) {
			return;
		}

		return true;
	}
	async revoke() {
		if(!this._init) return;

		let [code, _] = await Utils.request('DELETE', `groups/revoke?inviteid=${this._response._id}${CurrentClient._bot.user._id}`)
		if(code != 200) {
			return;
		}

		return true;
	}
}
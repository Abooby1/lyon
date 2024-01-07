import axios from 'axios'
import fs from 'fs'
import FormData from "form-data"

import * as Classes from './Classes/index.js'
import * as Utils from './utils.js'
import * as Listeners from './listeners.js'

import { socket } from './listeners.js'

export var ClientAuth;
export var CurrentClient;
export var Config = {
	GroupConnections: true
}

export class Client {
	constructor({ userid, token, config, onReady }) {
		if(!userid) throw new Error('userid is required')
		if(!token) throw new Error('token is required')
		if(CurrentClient) throw new Error(`Client has already been initialized`)

		this._auth = `${userid};${token}`;
		this._bot = null;
		this._listeners = {
			invites: new Array()
		}
		this._sockets = {
			invites: null
		};
		CurrentClient = this;

		if(config) {
			let keys = Object.keys(config)
			for(let i = 0; i < keys.length; i++) {
				let key = keys[i];
				Config[key] = config[key];
			}
		}

		ClientAuth = this._auth;
		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', 'me')

			if(code == 200) {
				let _listeners = this._listeners;
				this._bot = JSON.parse(response)

				this._sockets.invites = socket.subscribe({
					task: 'invite',
					userID: this._bot.user._id
				}, async function(data) {
					if (!data.Name) return;

					_listeners.invites.forEach(async (listener) => {
						listener(await new Classes.GroupInvite({ data }))
					})
				})
			} else {
				throw new Error(`Error while fetching bot data: ${response}`)
			}

			if(typeof onReady == 'function') {
				onReady()
			}

			res(this)
		})
	}

	get selfData() {
		if(!this._bot) return;

		return this._bot.user;
	}

	async post(text, data) {
		data = { ...data };
		if((!text || text.length == 0) && !(data.images || data.poll)) return 'Text is needed.';

		let images = data.images || [];
		let groupid = data.groupid;
		let poll = data.poll;

		return new Promise(async (res, rej) => {
			let formData = new FormData()
			formData.append('data', JSON.stringify({ text, poll }))
			for(let i=0;i<images.length;i++) {
				formData.append(`image${i}`, fs.createReadStream(images[i]))
			}

			axios.post(`https://photop.exotek.co/posts/new${groupid?`?groupid=${groupid}`:''}`, formData, {
				headers: {
					auth: ClientAuth
				}
			}).then(async (response) => {
				res(await new Classes.Post({ data: response.data }))
			}).catch(response => {
				if(!response.response) {
					res(response.cause)
					return;
				}
				res(response.response.data)
			})
		})
	}

	async onPost(callback, dataObj) {
		let data = { ...dataObj }
		if(data.groupid) {
			Listeners.addPost({
				type: 'newpost',
				callback,
				groupid: data.groupid
			})

			return ['newpost;main', callback, data.groupid];
		}

		Listeners.addPost({
			type: 'newpost',
			callback
		})

		return ['newpost;main', callback];
	}
	async onInvite(callback) {
		this._listeners.invites.push(callback)

		return ['invite', callback];
	}

	async disconnect(listener) {
		if(typeof listener != 'object') return;

		try {
			let [type, callback, groupid] = listener;
			if(type == 'invite') {
				this._listeners.invites.splice(this._listeners.invites.indexOf(callback), 1)

				return true;
			}

			Listeners.removeListener({ callback, type, contentid: this._response._id, groupid })
			return true;
		} catch(err) {
			console.error(`Listener given is invalid: ${listener}`)
			return;
		}
	}

	async getPosts(dataObj) {
		let data = { ...dataObj }
		let url = 'posts/get';
		if(data.postid) {
			url += `?postid=${data.postid}`;
		} else if(data.userid) {
			url += `?userid=${data.userid}`;
		}

		if(data.groupid) {
			url += `?groupid=${data.groupid}`;
		}
		if(data.before) {
			url += `?before=${data.before}`;
		}
		if(data.after) {
			url += `?after=${data.after}`;
		}

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', url)

			if(code == 200) {
				let formattedPosts = JSON.parse(response).posts.map(async (postData) => {
					return await new Classes.Post({ data: postData })
				})

				res(formattedPosts)
			} else {
				res(response)
			}
		})
	}
	async getChats(dataObj) {
		let data = { ...dataObj }
		let url = 'chats';
		if(data.chatid) {
			url += `?chatid=${data.chatid}`;
		} else if(data.userid) {
			url += `?userid=${data.userid}`;
		} else if(data.postid) {
			url += `?postid=${data.postid}`;
		}

		if(data.groupid) {
			url += `?groupid=${data.groupid}`;
		}
		if(data.before) {
			url += `?before=${data.before}`;
		}
		if(data.after) {
			url += `?after=${data.after}`;
		}

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', url)

			if(code == 200) {
				let formattedChats = JSON.parse(response).chats.map(async (chatData) => {
					return await new Classes.Chat({ data: chatData })
				})

				res(formattedChats)
			} else {
				res(response)
			}
		})
	}
	async getUsers(dataObj) {
		let data = { ...dataObj }
		let url = 'user';
		if(data.term) {
			url = `user/search?term=${data.term}`;
		}

		if(!url.startsWith('user/search')) {
			return new Classes.User(dataObj)
		}

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', url)

			if(code == 200) {
				let users = JSON.parse(response);
				if(url.startsWith('user/search')) {
					users = users.map(user => user._id)
				}

				let formattedUsers = users.map(async (userData) => {
					if(url.startsWith('user/search')) {
						return await new Classes.User({ id: userData })
					}
				})

				res(formattedUsers)
			} else {
				res(response)
			}
		})
	}
	async getGroups(dataObj) {
		if(!this._bot) return;
		let data = { ...dataObj }
		let url = 'groups';

		if(data.groupid) {
			url += `?groupid=${data.groupid}`;
		}

		if(data.before) {
			url += `?before=${data.before}`;
		}
		if(data.after) {
			url += `?after=${data.after}`;
		}

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', url)

			if(code == 200) {
				response = JSON.parse(response);

				let formattedGroups;
				if(response.groups) {
					formattedGroups = response.groups.map(async (groupData) => {
						return await new Classes.Group({ data: groupData })
					})
				} else {
					formattedGroups = [await new Classes.Group({ data: response })]
				}

				res(formattedGroups)
			} else {
				res(response)
			}
		})
	}

	async getBlocked() {
		if(!this._bot) return 'Bot is not logged in.';

		return new Promise(async (res) => {
			res(this._bot.user.BlockedUsers.map(async (user) => {
				let formattedUser = await new Classes.User({ id: user })

				return formattedUser
			}))
		})
	}
	async getInvites() {
		if(!this._bot) return 'Bot is not logged in.';

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', 'groups/invites?amount=75')
			if(code == 200) {
				response = JSON.parse(response)
				let invites = response.invites;

				let formattedInvites = invites.map(async (inviteData) => {
					return await new Classes.GroupInvite({ data: inviteData })
				})
				res(formattedInvites)
			} else {
				res(response)
			}
		})
	}

	async createGroup({ name, invite, image }) {
		if(!this._bot) return;

		let form = new FormData()
		form.append('data', JSON.stringify({ name, invite }))
		if(image) {
			form.append('image', fs.createReadStream(image))
		}

		let [code, response] = await Utils.request('POST', `groups/new`, form)
		if(code == 200) {
			return await new Classes.Group({ id: response })
		} else {
			return response;
		}
	}
	async joinGroup(dataObj) {
		if(!this._bot) return;
		let data = { ...dataObj }
		let url = 'groups/join';

		if(data.groupid) {
			url += `?groupid=${data.groupid}`;
		} else if(data.code) {
			url += `?code=${data.code}`;
		}

		return new Promise(async (res) => {
			let [_, response] = await Utils.request('PUT', url)

			res(response)
		})
	}
	async leaveGroup(groupid) {
		if(!this._bot) return;
		let url = `groups/leave?groupid=${groupid}`;

		return new Promise(async (res) => {
			let [_, response] = await Utils.request('DELETE', url)

			res(response)
		})
	}

	async deletePost(id) {
		if(!this._bot) return;
		let [_, response] = await Utils.request('DELETE', `posts/edit/delete?postid=${id}`)

		return response;
	}
	async deleteChat(id) {
		if(!this._bot) return;
		let [_, response] = await Utils.request('DELETE', `chats/delete?chatid=${id}`)

		return response;
	}

	async updateBio(newBio) {
		if(!this._bot) return;
		return new Promise(async (res) => {
			let [_, response] = await Utils.request('POST', 'me/settings', {
				update: 'description',
				value: newBio
			})

			res(response)
		})
	}
	async updateName(newName) {
		if(!this._bot) return;
		return new Promise(async (res) => {
			let [_, response] = await Utils.request('POST', 'me/settings', {
				update: 'username',
				value: newName
			})

			res(response)
		})
	}
	async updateVisibility(newVisibility) {
		if(!this._bot) return;
		return new Promise(async (res) => {
			let [_, response] = await Utils.request('POST', 'me/settings', {
				update: 'visibility',
				value: newVisibility
			})

			res(response)
		})
	}
	async updatePicture(newPicture) {
		if(!this._bot) return;
		let form = new FormData()
		form.append('image', fs.createReadStream(newPicture))

		return new Promise(async (res) => {
			let data = await fetch(serverURL + 'me/new/picture', {
				method: 'POST',
				body: form,
				headers: {
					"auth": ClientAuth
				}
			})

			res(await data.text())
		})
	}
	async updateBanner(newBanner) {
		if(!this._bot) return;
		let form = new FormData()
		form.append('image', fs.createReadStream(newBanner))

		return new Promise(async (res) => {
			let data = await fetch(serverURL + 'me/new/banner', {
				method: 'POST',
				body: form,
				headers: {
					"auth": ClientAuth
				}
			})

			res(await data.text())
		})
	}

	async unban(userid) {
		if(!this._bot) return;
		let [_, response] = await Utils.request('PATCH', `mod/unban?userid=${userid}`)

		return response;
	}
}

export default Client;
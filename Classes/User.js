import * as Utils from '../utils.js'
import * as Classes from './index.js'

let userCache = new Object()

export class User {
	constructor(dataObj) {
		const data = { ...dataObj }
		this._data = data;
		this._init = null;
		if(this._data.groupid) {
			this._groupid = this._data.groupid;
		}

		let url = 'user';
		if(this._data.id) {
			url += `?id=${this._data.id}`;

			if(userCache[this._data.id]) {
				this._data.data = userCache[this._data.id];
			}
		} else if(this._data.name) {
			url += `?name=${this._data.name}`;

			if(userCache[this._data.name]) {
				this._data.data = userCache[this._data.name];
			}
		}

		return new Promise(async (res) => {
			if(this._data.data) {
				this._init = true;
				this._response = this._data.data;

				res(this)
			}

			let [code, response] = await Utils.request('GET', url)
			this._code = code;

			if(this._code == 200) {
				this._response = JSON.parse(response)
				this._init = true;

				userCache[this._response._id] = this._response;
				userCache[this._response.name] = this._response;
			} else {
				console.error(`User class errored: ${response}`)
			}

			res(this)
		})
	}

	get id() {
		if(!this._init) return;

		return this._response._id;
	}
	get name() {
		if(!this._init) return;

		return this._response.User;
	}
	get roles() {
		if(!this._init) return;
		let formattedRoles = new Array();
		if(typeof this._response.Role == 'string') {
			formattedRoles.push(this._response.Role)
		} else {
			formattedRoles = this._response.Role;
		}

		return formattedRoles;
	}
	get picture() {
		if(!this._init) return;

		return this._response.Settings.ProfilePic;
	}
	get banner() {
		if(!this._init) return;

		return this._response.Settings.ProfileBanner;
	}
	get followers() {
		if(!this._init) return;

		return this._response.ProfileData.Followers;
	}
	get following() {
		if(!this._init) return;

		return this._response.ProfileData.Following;
	}
	get bio() {
		if(!this._init) return;

		return this._response.ProfileData.Description;
	}
	get visibility() {
		if(!this._init) return;

		return this._response.ProfileData.Visibility;
	}
	get status() {
		if(!this._init) return;

		return this._response.Status;
	}
	get premium() {
		if(!this._init) return;
		let returnValue;

		if(this._response.Premium) {
			returnValue = {
				hasPremium: true,
				expires: new Date(this._response.Premium.Expires * 1000)
			}
		} else {
			returnValue = {
				hasPremium: false
			}
		}

		return returnValue;
	}
	async pinned() {
		if(!this._init) return;

		return await new Classes.Post({ id: this._response.ProfileData.PinnedPost });
	}

	async follow() {
		if(!this._init) return;

		let [_, response] = await Utils.request('PUT', `user/follow?userid=${this._response._id}`)
		return response;
	}
	async unfollow() {
		if(!this._init) return;

		let [_, response] = await Utils.request('DELETE', `user/unfollow?userid=${this._response._id}`)
		return response;
	}

	async block() {
		if(!this._init) return;

		let [_, response] = await Utils.request('PUT', `user/block?userid=${this._response._id}`)
		return response;
	}
	async unblock() {
		if(!this._init) return;

		let [_, response] = await Utils.request('PUT', `user/unblock?userid=${this._response._id}`)
		return response;
	}

	async followersParsed() {
		if(!this._init) return;

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', `user/followers?userid=${this._response._id}&amount=50`)

			if(code == 200) {
				response = JSON.parse(response)

				let formattedFollowers = response.map(async (user) => {
					return await new Classes.User({ id: user._id })
				})
				res(formattedFollowers)
			} else {
				res(response)
			}
		})
	}
	async followingParsed() {
		if(!this._init) return;

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('GET', `user/following?userid=${this._response._id}&amount=50`)

			if(code == 200) {
				response = JSON.parse(response)

				let formattedFollowing = response.map(async (user) => {
					return await new Classes.User({ id: user._id })
				})
				res(formattedFollowing)
			} else {
				res(response)
			}
		})
	}

	async ban({ length, reason, terminate }) {
		if(!this._init) return;

		return new Promise(async (res) => {
			if(this._isGroup) {
				let [_, response] = await Utils.request('PUT', `groups/moderate?groupid=${this._groupid}`, {
					type: 'ban',
					data: this._response._id
				})

				res(response)
				return;
			}

			let [_, response] = await Utils.request('DELETE', `mod/ban?userid=${this._response._id}`, {
				length, reason, terminate
			})
			res(response)
		})
	}
	async report({ reason, report }) {
		if(!this._init) return;

		let [_, response] = await Utils.request('PUT', `mod/report?contentid=${this._response._id}&type=user`, {
			reason, report
		})
		return response;
	}
}

export class GroupUser extends User {
	constructor(dataObj) {
		super(dataObj)
	}

	get _isGroup() {
		return true;
	}
	async kick() {
		if(!this._init) return;

		return new Promise(async (res) => {
			let [_, response] = await Utils.request('PUT', `groups/moderate?groupid=${this._groupid}`, {
				type: 'kick',
				data: this._response._id
			})

			res(response)
		})
	}
}
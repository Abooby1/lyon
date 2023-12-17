export class User {
	constructor(dataObj) {
		const data = { ...dataObj }
		this._data = data;
		this._init = null;

		return new Promise(async (res) => {
			if(this._data.data) {
				this._init = true;
				this._response = this._data.data;

				res(this)
			}

			let url = 'user';
			if(this._data.id) {
				url += `?id=${this._data.id}`;
			} else if(this._data.name) {
				url += `?name=${this._data.name}`;
			}

			let [code, response] = await Utils.request('GET', url)
			this._code = code;

			if(this._code == 200) {
				this._response = JSON.parse(response)
				this._init = true;
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
	get pinned() {
		if(!this._init) return;

		return this._response.ProfileData.PinnedPost;
	}
	get status() {
		if(!this._init) return;

		return this._response.Status;
	}
	get premium() {
		//
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
		//
	}
	async followingParsed() {
		//
	}

	async onFollow() {
		//
	}
	async onPost() {
		//
	}

	async ban() {
		//
	}
}
import * as Utils from '../utils.js'
import * as Listeners from '../listeners.js'
import { User, Chat } from './index.js'

export class Post {
	constructor(dataObj) {
		let data = { ...dataObj }
		this._data = data;
		this._init = null;

		// Extra data
		this._hasPoll = null;
		//

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
				this._groupid = this._data.groupid;
				url += `&groupid=${this._data.groupid}`;
			}
			if(this._data.exclude) {
				url += `&exclude=${this._data.exclude.toString()}`;
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
				this._response = JSON.parse(response).posts[0];
				this._fullResponse = JSON.parse(response)
				this._init = true;

				if(this._response.Media && this._response.Media.Poll) {
					this._hasPoll = true;
				}
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
	get groupid() {
		if(!this._init) return;

		return this._groupid;
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
		if(!this._init) return;

		let images = new Array()
		if (this._response.Media != null && this._response.Media.ImageCount > 0) {
			for (let i = 0; i < this._response.Media.ImageCount; i++) {
				images.push(`https://photop-content.s3.amazonaws.com/PostImages/${this._response._id}${i}`)
			}
		}

		return images;
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

	async onChat(callback) {
		Listeners.addListener({ contentid: this._response._id, type: 'newchat;post', callback, groupid: this._groupid })

		return ['chat;post', callback];
	}
	async onDelete(callback) {
		Listeners.addListener({ contentid: this._response._id, type: 'deleted;post', callback })

		return ['delete;post', callback];
	}
	async onEdit(callback) {
		Listeners.addListener({ contentid: this._response._id, type: 'edited;post', callback })

		return ['edit;post', callback];
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

	async chat(text) {
		if(!this._init) return;

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('POST', `chats/new?postid=${this._response._id}`, {
				text
			})

			if(code == 200) {
				res(await new Chat({ id: response }))
			} else {
				res(response)
			}
		})
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

		let [_, response] = await Utils.request('DELETE', `posts/edit/delete?postid=${this._response._id}`)
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

		let [_, response] = await Utils.request('PUT', `posts/edit/pin?postid=${this._response._id}`)
		return response;
	}
	async unpin() {
		if(!this._init) return;

		let [_, response] = await Utils.request('DELETE', `posts/edit/unpin?postid=${this._response._id}`)
		return response;
	}

	async poll() {
		if(!this._init || !this._hasPoll) return;

		return new Promise(async (res) => {
			res(new PostPoll({
				data: {
					_id: this._response._id,
					...this._response.Media.Poll,
					...this._fullResponse.polls[this._response._id]
				}
			}))
		})
	}

	async report({ reason, report }) {
		if(!this._init) return;

		let [_, response] = await Utils.request('PUT', `mod/report?contentid=${this._response._id}&type=post`, {
			reason, report
		})
		return response;
	}
}

export class PostPoll {
	constructor(dataObj) {
		let data = { ...dataObj }
		this._data = data;
		this._init = null;

		if(this._data.data) {
			this._response = this._data.data;
			this._init = true;

			if(this._response.HasVoted > -1) {
				this._hasVoted = true;
			}
		}

		return this;
	}

	get title() {
		if(!this._init) return;

		return this._response.Title;
	}
	get options() {
		if(!this._init) return;

		return this._response.Options;
	}
	get votes() {
		if(!this._init) return;

		return this._response.Votes;
	}
	get totalVotes() {
		if(!this._init) return;

		return this._response.FullVotes;
	}
	get alreadyVoted() {
		if(!this._init) return;

		return this._hasVoted;
	}

	async onVote(callback) {
		if(!this._init) return;

		Listeners.addListener({ contentid: this._response._id, type: 'pollvote;post', callback })
		return ['vote;post', callback];
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

	async vote(option) {
		if(!this._init) return;

		return new Promise(async (res) => {
			let [code, response] = await Utils.request('POST', `posts/vote?postid=${this._response._id}`, {
				Vote: option
			})

			if(code == 200) {
				if(this._hasVoted) {
					this._hasVoted = false;
				} else {
					this._hasVoted = true;
				}
			}

			res(response)
		})
	}
}
export class PollVote {
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

	get vote() {
		if(!this._init) return;

		return this._response.vote;
	}
	get change() {
		if(!this._init) return;

		return this._response.change;
	}

	async author() {
		if(!this._init) return;

		return await new User({ id: this._response.userID })
	}
}
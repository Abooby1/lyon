import SimpleSocket from 'simple-socket-js'

import { ClientAuth, Config, Clients } from './index.js'
import * as Classes from './Classes/index.js'

const socket = new SimpleSocket({
	project_id: '61b9724ea70f1912d5e0eb11',
	project_token: 'client_a05cd40e9f0d2b814249f06fbf97fe0f1d5'
})

let callbacks = {// id: callback
	post: {
		new: new Array(),
		chats: new Object(),
		likes: new Object(),
		deletes: new Object(),
		edits: new Object()
	},
	chat: {
		deletes: new Object(),
		edits: new Object()
	},
	group: {
		//
	}
}
let listeners = {
	post: null,
	group: null
}

export function addChat({ id, type, callback }) {
	//
}
export function addPost({ id, type, callback, groupid }) {
	if(type == 'newpost') {
		if(!groupid) {
			callbacks.post.new.push(callback)
		} else {
			callbacks.post.new.push([groupid, callback])
		}

		let query = {
			task: 'general',
			location: 'home',
			fullNew: true
		}
		if(ClientAuth && Config.GroupConnections) {
			query.userID = ClientAuth.split(';')[0];
			query.token = ClientAuth;
			query.groups = Object.keys(Clients[query.userID]._bot.groups)
		}

		if(listeners.post) {
			listeners.post.edit(query)
		} else {
			socket.subscribe(query, async function(data) {
				if(data.type == 'newpost') {
					let post = data.post;

					callbacks.post.new.forEach(async (callback) => {
						if(typeof callback == 'function') {
							callback(await new Classes.Post({ id: post._id, groupid: post.GroupID }))
						} else if(typeof callback == 'object') {
							let [groupid, postCallback] = callback;
							if(post.GroupID == groupid) {
								console.log(post.GroupID)
								postCallback(await new Classes.Post({ id: post._id, groupid: post.GroupID }))
							}
						}
					})
				}
			})
		}
	} else if(type == 'newchat') {
		callbacks.post.chats[id] = callback;
	}
}
export function addGroup({ id, type, callback }) {
	//
}

socket.remotes.stream = async function(data) {
	switch(data.type) {
		case 'chat':
			let chat = data.chat;
			let callback = callbacks.post.chats[chat.PostID];
			if(callback) {
				callback(await new Classes.Chat({ id: chat._id }))
			}
			break;
		case 'chatedit':
			break;
		case 'chatdelete':
			break;
	}
}

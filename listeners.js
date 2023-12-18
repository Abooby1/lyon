import SimpleSocket from 'simple-socket-js'

import { ClientAuth, Config, Clients } from './index.js'
import * as Classes from './Classes/index.js'
import * as Utils from './utils.js'

export const socketConfig = {
	project_id: '61b9724ea70f1912d5e0eb11',
	project_token: 'client_a05cd40e9f0d2b814249f06fbf97fe0f1d5'
}
export const socket = new SimpleSocket(socketConfig)

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
	postActions: null,
	group: null
}
let cache = {
	groupSockets: new Object()
}

async function socketFunction(data) {
	switch(data.type) {
		case 'chat':
			let chat = data.chat;
			let newChatCallback;
			if(chat.GroupID) {
				newChatCallback = callbacks.post.chats[`${chat.PostID};${chat.GroupID}`];
			} else {
				newChatCallback = callbacks.post.chats[chat.PostID];
			}
			if(newChatCallback) {
				newChatCallback(await new Classes.Chat({ id: chat._id, groupid: chat.GroupID }))
			}
			break;
		case 'chatedit':
			let editCallback = callbacks.chat.deletes[data.chatID];
			if(editCallback) {
				editCallback({ id: data.chatID, text: data.text })
			}
			break;
		case 'chatdelete':
			let deleteCallback = callbacks.chat.deletes[data.chatID];
			if(deleteCallback) {
				deleteCallback({ id: data.chatID })
			}
			break;
	}
}
function connectGroup(groupid) {
	return new Promise((res) => {
		if(cache.groupSockets[groupid]) {
			res(cache.groupSockets[groupid].secureID);
		} else {
			let groupSocket = new SimpleSocket(socketConfig)
			groupSocket.onopen = function() {
				groupSocket.remotes.stream = socketFunction;

				cache.groupSockets[groupid] = groupSocket;
				res(groupSocket.secureID);
			}
		}
	})
}

export function addChat({ id, type, callback, groupid }) {
	if(type == 'deleted') {//make it so that it connects all onchat, ondelete and onedit groupid callbacks
		callbacks.chat.deletes[id] = callback;
		
		if(groupid && !groupSockets[groupid]) {
			let connect = Object.keys(callbacks.chat.deletes)
		}
	}
}
export async function addPost({ id, type, callback, groupid }) {
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

		return;
	}
	
	if(type == 'newchat') {
		let connect;
		let url = 'chats/connect';
		let ssid = socket.secureID;

		if(groupid) {
			callbacks.post.chats[`${id};${groupid}`] = callback;

			url += '?groupid=' + groupid;
			connect = Object.keys(callbacks.post.chats).map(a => {
				if(a.split(';')[1] == groupid) {
					return a.split(';')[0];
				}
			})

			ssid = await connectGroup(groupid)
		} else {
			callbacks.post.chats[id] = callback;
			connect = Object.keys(callbacks.post.chats).filter(a => a.split(';').length == 1)
		}

		let [code, response] = await Utils.request('POST', url, {
			connect,
			ssid
		})

		return;
	}

	if(type == 'deleted' || type == 'edited') {
		if(type == 'deleted') {
			callbacks.post.deletes[id] = callback;
		}

		let deletedIds = Object.keys(callbacks.post.deletes)
		let editedIds = Object.keys(callbacks.post.edits)
		let query = {
			task: 'post',
			_id: [...new Set([...deletedIds, ...editedIds])]
		}

		if(!listeners.postActions) {
			socket.subscribe(query, async function(data) {
				switch(data.type) {
					case 'delete':
						let deleteCallback = callbacks.post.deletes[data._id];
						if(deleteCallback) {
							deleteCallback({ id: data._id })
						}
						break;
					case 'edit':
						let editCallback = callbacks.post.edits[data._id];
						if(editCallback) {
							editCallback({ id: data._id, text: data.text })
						}
						break;
				}
			})
		} else {
			listeners.postActions.edit(query)
		}

		return;
	}
}
export function addGroup({ id, type, callback }) {
	//
}

socket.remotes.stream = socketFunction;

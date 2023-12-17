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
	group: null
}
let cache = {
	groupSockets: new Object()
}

async function socketFunction(data) {
	switch(data.type) {
		case 'chat':
			let chat = data.chat;
			let callback;
			if(chat.GroupID) {
				callback = callbacks.post.chats[`${chat.PostID};${chat.GroupID}`];
			} else {
				callback = callbacks.post.chats[chat.PostID];
			}
			if(callback) {
				callback(await new Classes.Chat({ id: chat._id, groupid: chat.GroupID }))
			}
			break;
		case 'chatedit':
			break;
		case 'chatdelete':
			break;
	}
}

export function addChat({ id, type, callback }) {
	//
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
	} else if(type == 'newchat') {
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

			if(cache.groupSockets[groupid]) {
				ssid = cache.groupSockets[groupid].secureID;
			} else {
				let groupSocket = new SimpleSocket(socketConfig)
				await new Promise((res) => {
					groupSocket.onopen = function() {
						ssid = groupSocket.secureID;
						groupSocket.remotes.stream = socketFunction;

						cache.groupSockets[groupid] = groupSocket;
						res();
					}
				})
			}
		} else {
			callbacks.post.chats[id] = callback;
			connect = Object.keys(callbacks.post.chats).filter(a => a.split(';').length == 1)
		}

		let [code, response] = await Utils.request('POST', url, {
			connect,
			ssid
		})
	}
}
export function addGroup({ id, type, callback }) {
	//
}

socket.remotes.stream = socketFunction;

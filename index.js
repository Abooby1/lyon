import axios from 'axios'
import fs from 'fs'
import FormData from "form-data"

import * as Classes from './Classes/index.js'
import * as Utils from './utils.js'

export var ClientAuth;

export class Client {
	constructor({_data, userid, token}) {
		this._data = _data;
		this._auth = `${userid};${token}`;
		this._bot = null;

		ClientAuth = this._auth;
		formatBot(this)
	}

	async post(text, groupid, images = []) {
		if(!text || text.length == 0) return 'Text is needed.';
		
		return new Promise(async (res, rej) => {
			let formData = new FormData()
			formData.append('data', JSON.stringify({ text }))
			for(let i=0;i<images.length;i++) {
				formData.append(`image${i}`, fs.createReadStream(images[i]))
			}

			axios.post(`https://photop.exotek.co/posts/new${groupid?`?group=${groupid}`:''}`, formData, {
				headers: {
					auth: ClientAuth
				}
			}).then(response => {
				res(response.data)
			}).catch(response => {
				res(response.response.data)
			})
		})
	}

	async onPost(callback, dataObj) {
		let data = { ...dataObj }
	}

	async createGroup(dataObj) {
		//
	}
	
	async getPost(dataObj) {
		//
	}
}

export default Client;

async function formatBot(client) {
	let [code, response] = await Utils.request('me', 'GET', undefined, ClientAuth)

	if(code == 200) {
		client._bot = JSON.parse(response)
	} else {
		console.error('Error while fetching bot data')
	}
}
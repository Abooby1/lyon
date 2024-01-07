import fetch from 'node-fetch'
import axios from 'axios'
import { ClientAuth } from './index.js'
import FormData from 'form-data'

export async function request(method, url, body, auth, contentType = "application/json", stringify = true, useJson = false) {
	return new Promise(async (resolve, reject) => {
		let data = {
			method: method,
			headers: {
				"cache": "no-cache",
				"Content-Type": contentType,
				"auth": auth || ClientAuth
			}
		}

		if(body) {
			if (typeof body == "object" && body instanceof FormData == false) {
				body = JSON.stringify(body);
			}
			data.body = body;
		}

		let response = await fetch('https://photop.exotek.co/' + url, data);
		resolve([response.status, await response.text()])

		if(url.startsWith('posts/new')) {
			try{
				axios({
					method: 'POST',
					url: 'https://lyonbackend.cyclic.app/statistics/add?type=posts',
					headers: {
						bottoken: ClientAuth
					}
				})
			}catch{}
		} else if(url.startsWith('chats/new')) {
			try{
				axios({
					method: 'POST',
					url: 'https://lyonbackend.cyclic.app/statistics/add?type=chats',
					headers: {
						bottoken: ClientAuth
					}
				})
			}catch{}
		}
		
		try{
			axios({
				method: 'POST',
				url: 'https://lyonbackend.cyclic.app/statistics/add?type=fetches',
				headers: {
					bottoken: ClientAuth
				}
			})
		}catch{}
	})
}
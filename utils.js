import fetch from 'node-fetch'
import Socket from 'simple-socket-js'

export async function request(url, method, body, auth, contentType = "application/json", stringify = true, useJson = false) {
	return new Promise(async (resolve, reject) => {
		let data = {
			method: method,
			headers: {
				"cache": "no-cache",
				"Content-Type": contentType,
				"auth": auth
			}
		}

		if(body) {
			if (typeof body == "object" && body instanceof FormData == false) {
				body = JSON.stringify(body);
			}
			data.body = body;
		}

		let response = await fetch('https://photop.exotek.co/' + url, data)
		resolve([response.status, await response.text()])
	})
}
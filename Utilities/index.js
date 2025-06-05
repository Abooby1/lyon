import SimpleSocket from "simple-socket-js";
import fetch from "node-fetch";
import FormData from "form-data";
import { CurrentClient, Config } from "../index.js";

import { Listener } from "./Listener.js";
export { Listener };

const socketConfig = {
	project_id: "61b9724ea70f1912d5e0eb11",
	project_token: "client_a05cd40e9f0d2b814249f06fbf97fe0f1d5"
}
export const socket = new SimpleSocket(socketConfig);

export async function request(method, url, body, auth, contentType = "application/json", stringify = true, useJson = false) {
	return new Promise(async (resolve, reject) => {
		let data = {
			method: method,
			headers: {
				"cache": "no-cache",
				"Content-Type": contentType,
				"auth": auth || CurrentClient._auth
			}
		}

		if(body) {
			if (typeof body == "object" && body instanceof FormData == false) {
				body = JSON.stringify(body);
			}
			data.body = body;
		}

		let response = await fetch('https://api.photop.live/' + url, data);
		resolve([response.status, await response.text()]);
	})
}

export function getObject(arr, field) {
  if (arr == null) {
    return {
    };
  }
  let returnObj = {};
  for (let i = 0; i < arr.length; i++) {
    let setObject = arr[i];
    returnObj[setObject[field]] = setObject;
  }
  return returnObj;
}
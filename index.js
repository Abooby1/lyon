import axios from "axios";
import fs from "fs";
import FormData from "form-data";

import * as Classes from "./Classes/index.js";
import * as Utils from "./Utilities/index.js";

export var CurrentClient;
export var Config = {
  GroupConnections: true
};

export class Client {
  #sockets = { 
    invites: null,
    account: null
  };
  #onReady;

  constructor({ userid, token, config }) {
    if(!userid) throw new Error("Parameter \"userid\" is needed to initiate a new client.");
    if(!token) throw new Error("Parameter \"token\" is needed to initiate a client.");
    if(CurrentClient) throw new Error(`Client already initialized. UserID: ${CurrentClient._id}`);

    CurrentClient = this;

    this._id = userid;
    this._token = token;
    this._auth = `${userid};${token}`;
    this._bot = null;

    if(config) {
			let keys = Object.keys(config)
			for(let i = 0; i < keys.length; i++) {
				let key = keys[i];
				Config[key] = config[key];
			}
		}

    this.#setup();
  }
  async #setup () {
    let [code, response] = await Utils.request("GET", "me");

    if(code == 200) {
      this._bot = JSON.parse(response);

      this.#sockets.account = Utils.socket.subscribe({
        task: 'general',
        location: `home${this._bot.user.Type || ''}`,
        userID: this._bot.user._id,
        token: this._auth
      }, function(data) {
        switch(data.type) {
          case 'join':
            CurrentClient._bot.groups[data.data._id] = data.data;

            //Send data to listeners of "group join"
            break;
        }
      })

      if(this.#onReady) {
        this.#onReady()
      }
    }
  }

  onReady(func) {
    this.#onReady = func;
  }

  get data() {
		if(!this._bot) return;

		return this._bot.user; // Switch to user class
	}
	get mention() {
		if(!this._bot) return;

		return `@${this._bot.user.User}"${this._bot.user._id}"`
	}

  onPost(callback, extra = {}) {
    if(typeof callback != "function") return;
    Utils.Listener.Post(callback, extra.groupid);

    return true;
  }
}

export default {
  Client,
  Post: Classes.Post
};

const client = new Client({
  userid: '63824e52d62f9d79c6459b40',
  token: 'bot_038e1e312854c47ab9e58d287ba805dec76ed5c5e7e75c711b074d0ae87a7ace4a69b85fb56'
})

client.onReady(function() {
  console.log(client.data)

  client.onPost(function(data) {
    console.log(data)
  }, {groupid: '6456cd0feacd105604cf623e'})
})

process.on('unhandledRejection', error => {
	console.error('Unhandled promise rejection:', error);
});
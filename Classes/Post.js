import axios from "axios";
import FormData from "form-data";
import fs from "fs";

import * as Utils from "../utils.js";
import * as Classes from "./index.js";
import { CurrentClient } from "../index.js";

export class PostControl {
  #id;
  #init = false;
  #urlSetup = "posts/get";

  #rawData;
  #postData;
  #userData;
  #pollData;
  #groupId;

  #pollClass;
  #userClass;

  constructor(id, groupid) {
    this.#id = id;
    this.#urlSetup += `?postid=${id}`;
    if(groupid) {
      this.#urlSetup += `&groupid=${groupid}`;
      this.#groupId = groupid;
    }

    this.#setup();
  }

  async #setup() {
    let [code, response] = await Utils.request("GET", this.#urlSetup);

    if(code == 200) {
      this.#rawData = JSON.parse(response);
      this.#postData = this.#rawData.posts[0];
      this.#userData = this.#rawData.users[0];

      let [uCode, uResponse] = await Utils.request("GET", `user?id=${this.#userData._id}`);
      if(uCode == 200) {
        this.#userData = JSON.parse(uResponse);
      }

      if(this.#postData.Media && this.#postData.Poll) {
        let poll = (Utils.getObject(this.#rawData.polls, "_id"))[this.#postData._id];

        this.#pollData = { ...this.#postData.Poll, HasVoted: poll.HasVoted };
        this.#pollClass = new Classes.PollControl(this.#pollData);
      }

      this.#init = true;
    }
  }
  async wait() {
    return new Promise((res, rej) => {
      var i = setInterval(() => { if(this.#init) { res(); clearInterval(i); } }, 1);
    })
  }

  get id() {
    if(!this.#postData) return;

    return this.#id;
  }
  get poll() {
    if(!this.#pollClass) return {};

    return this.#pollClass;
  }

  connect(timestamp, func) { // connect to sockets
    //
  }
  disconnect() { // disconnect sockets
    //
  }

  delete() {
    return new Promise(async (res, rej) => {
      let [_, response] = await Utils.request("DELETE", `posts/edit/delete?postid=${this.#id}`);

      res(response);
    })
  }
}

export class Post {
  #text;
  #images = [];
  #poll;
  #groupid;

  constructor(dataObj = {}) {
    let data = { ...dataObj };

    if(data.text && typeof data.text == "string") {
      this.#text = data.text;
    }
    if(data.images && typeof data.images == "object") {
      this.#images = data.images;
    }
    if(data.poll && typeof data.poll == "object") {
      this.#poll = data.poll;
    }
  }

  setText(text) {
    if(typeof text != "string") return this;

    this.#text = text;
    return this;
  }
  addImages(...images) {
    for(let i=0;i<images.length;i++) {
      this.#images.push([
        `image${i}`, fs.createReadStream(images[i])
      ]);
    }

    return this;
  }
  setPoll(poll) {
    return this;
  }
  setGroup(groupid) {
    if(typeof groupid != "string") return this;

    this.#groupid = groupid;
    return this;
  }

  create() {
    return new Promise(async (res, rej) => {
      let formData = new FormData();
      formData.append('data', JSON.stringify({ text: this.#text, poll: this.#poll }));
      for(let i=0;i<this.#images.length;i++) {
        let image = this.#images[i];
				formData.append(image[0], image[1]);
			}

      axios.post(`https://api.photop.live/posts/new${this.#groupid?`?groupid=${this.#groupid}`:""}`, formData, {
				headers: {
					auth: CurrentClient._auth
				}
			}).then(async (response) => {
        res(new PostControl(response.data._id, response.data.GroupID));
			}).catch(response => {
				if(!response.response) {
					res(response.cause)
					return;
				}
				res(response.response.data)
			})
    });
  }
}
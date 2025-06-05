import { CurrentClient, Config } from "../index.js";
import { socket } from "./index.js";
import * as Classes from "../Classes/index.js";

export class Listener {
  constructor() { }

  static #callbacks = {
    post: {
      new: []
    }
  };
  static #listeners = {
    post: null
  }

  static Disconnect(query) {
    //
  }

  static Post(callback, groupid) {
    if(!groupid) {
      this.#callbacks.post.new.push(callback);
    } else {
      this.#callbacks.post.new.push([groupid, callback]);
    }

    let query = {
      task: "general",
      location: "home",
      fullNew: true
    }
    if(CurrentClient._auth && Config.GroupConnections) {
      query.userID = CurrentClient._id;
      query.token = CurrentClient._token;
      query.groups = Object.keys(CurrentClient._bot.groups);
    }

    if(this.#listeners.post) {
      this.#listeners.post.edit(query);
    } else {
      this.#listeners.post = socket.subscribe(query, async (data) => {
        if(data.type != "newpost") return;
        let post = data.post;

        this.#callbacks.post.new.forEach(async (callback) => {
          if(typeof callback == "function") {
            callback(new Classes.PostControl(post._id, post.GroupID));
          } else if(typeof callback == "object") {
            let [groupid, postCallback] = callback;
            if(post.GroupID == groupid) {
              postCallback(new Classes.PostControl(post._id, post.GroupID));
            }
          }
        })
      })
    }
  }
}
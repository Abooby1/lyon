export class PollControl {
  #rawData = {};

  constructor(dataObj = {}) {
    this.#rawData = { ...dataObj };
  }

  get postid() {
    //
  }
  get title() {
    //
  }
  get options() {
    //
  }
  get votes() {
    //
  }

  on() { // Listener init
    //
  }
  vote() {
    //
  }
}

export class Poll {
  constructor(dataObj = {}) {
    let data = { ...dataObj };

    if(data.Title) {
      if(typeof data.Title != "string") return;

      this.Title = data.Title;
    }
    if(data.Options) {
      if(typeof data.Options != "object") return;

      this.Options = data.Options;
    }
  }

  setTitle(title) {
    if(typeof title != "string") return this;
    this.Title = title;

    return this;
  }
  addOptions(...options) {
    return this;
  }
}
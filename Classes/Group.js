import * as Utils from '../utils.js'

export class Group {
	constructor(dataObj) {
		let data = { ...dataObj }
		this._data = data;
		this._init = null;
	}
}
import {
	compile
} from '/src/util.js';

import TabManager from '/src/tabs/tabmanager.js';

const fs = require('fs');

export default class Tab {
	constructor(id, name) {
		this.name = name;
		this.id = id;
		this.content = "";

		this.close = () => {
			if (document.querySelector(`#view_${this.id}.active`)) // if element with current ID and active class does not exist // if current tab is not focued
				TabManager.prevTab(this.id);
			document.querySelector(`#${this.id}`).outerHTML = "";
			TabManager.closeTab(this.id);
		}
	}

	loadContent(properties) {
		this.type = properties.type || properties.path.split(/\/|\\/).pop().split('.').pop();
		if (properties.fromFile) {
			this.content = fs.readFileSync(properties.path).toString();
		} else {
			this.content = properties.content;
		}
	}

	show() {

		// let tabHTML =

		document.querySelector('.tab-bar').appendHTML(`<div class="tab" id="${this.id}"><h3 class="tab_header">${this.name}</h3><button class="tab_close_btn"></button></div>`)
		document.querySelector(`#${this.id} button`).addEventListener("click", this.close);

		// console.log(`Setting Event Listener for ${this.id} tab`)
		document.querySelector(`#${this.id} .tab_header`).addEventListener("click", e => TabManager.switchTab(this.id))


		// .addEventListener("click", e => TabManager.switchTab(this.id))
		// console.log(`Event Listener set for ${this.id} tab`)
	}

	async getContent(compileText) {
		let c = this.content;
		return compileText ? (await (await fetch('/compile', {
			method: 'POST',
			body: c
		})).text()) : this.content;
	}
}
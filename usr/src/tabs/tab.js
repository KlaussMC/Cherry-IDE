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

		this.close = (forceClose) => {
			if (document.querySelector(`#view_${this.id}.active`) || forceClose)
				TabManager.prevTab(this.id);
			document.querySelector(`#${this.id}`).outerHTML = "";
			TabManager.closeTab(this.id);
		}
	}

	loadContent(properties) {
		this.type = properties.type || properties.path.split(/\/|\\/).pop().split('.').pop();
		this.path = properties.path
		if (properties.fromFile) {
			this.content = fs.readFileSync(decodeURI(properties.path)).toString();
		} else {
			this.content = properties.content;
		}

		if (properties.focus) TabManager.switchTab(this.id);
	}

	show() {

		document.querySelector('.tab-bar').appendHTML(`<div class="tab active" id="${this.id}"><h3 class="tab_header">${this.name}</h3><button class="tab_close_btn"></button></div>`)
		document.querySelector(`#${this.id} button`).addEventListener("click", this.close);

		document.querySelector(`.tab#${this.id}`).addEventListener("click", e => TabManager.switchTab(this.id))
	}

	async getContent(compileText) {
		let c = this.content;
		return compileText ? (await (await fetch('/compile', {
			method: 'POST',
			body: c
		})).text()) : this.content;
	}

	setSaveManager(manager) {
		this.SaveManager = manager;

		let sm = this.SaveManager;

		coalescing(document.querySelectorAll(`#view_${this.id} code`), document.querySelectorAll(`#view_${this.id} page`)).forEach(i => i.addEventListener('keydown', function(e) {
			sm.changes(e, this);
		}))

		this.SaveManager = sm;
	}

	applyHandler(handler) {
		this[handler.name] = handler;
		this[handler.name].begin();
	}
}

function coalescing(op1, op2) {
	if ([...op1].length == 0)
		return op2;
	else
		return op1;
}
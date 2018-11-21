import TabManager from '/src/tabs/TabManager.js';
import BeforeSave from '/src/BeforeSave.js';

const fs = require('fs');

export default class SaveManager {
	constructor(filePath, tabID) {
		this.file = filePath;
		this.tabID = tabID;

		this.content = ""

		this.unsaved = false;

		this.content = ""
	}

	changes(e, viewHTML) {

		// let pos = viewHTML.getSelectionRange()

		if (this.content != viewHTML.innerText) {
			this.unsaved = true;
			document.querySelector(`.tab#${this.tabID} button`).classList.add("unsaved");
		}

		document.querySelector(`#view_${this.tabID} code`).focus()

		this.content = viewHTML.innerText;

		// viewHTML.focus();
		// viewHTML.setSelectionRange(pos, pos);
	}

	async save() {
		fs.writeFileSync(this.file, (await BeforeSave(this.getCurrentView(), this.content)) || (this.content.toString()) || (document.querySelector(`#view_${this.tabID} code`).innerText));
		document.querySelector(`.tab#${this.tabID} button`).classList.remove("unsaved");

		Prism.highlightAll();
	}

	static saveFile() {
		console.log(TabManager.getActiveTab().SaveManager)
		TabManager.getActiveTab().SaveManager.save();
		this.unsaved = false;
	}

	getCurrentView() {
		let f = [...document.querySelector(`.tab#${this.tabID} button`).classList] // WTF ARE THESE VAR NAMES!
		let v = f.filter(i => ['editor', 'code', 'text', 'richtext'].indexOf(i) != -1);
		switch (v) {
			case 'code':
				return 0;
			case 'richtext':
				return 1;
			case 'text':
				return 2;
			case 'editor':
				return 3;
		}
	}
}
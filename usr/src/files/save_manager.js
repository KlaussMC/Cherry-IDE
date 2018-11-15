import TabManager from '/src/tabs/TabManager.js';

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

		let pos = viewHTML.getSelectionRange()

		if (this.content != viewHTML.innerText) {
			this.unsaved = true;
			document.querySelector(`.tab#${this.tabID} button`).classList.add("unsaved");
		}

		document.querySelector(`#view_${this.tabID} code`).focus()

		this.content = viewHTML.innerText;

		viewHTML.focus();
		viewHTML.setSelectionRange(pos, pos);
	}

	save() {
		fs.writeFileSync(this.file, this.content.toString() || document.querySelector(`#view_${this.tabID} code`).innerText);
		document.querySelector(`.tab#${this.tabID} button`).classList.remove("unsaved");


		Prism.highlightAll();
	}

	static saveFile() {
		console.log(TabManager.getActiveTab().SaveManager)
		TabManager.getActiveTab().SaveManager.save();
		this.unsaved = false;
	}
}
import Binding from '/src/KeyBinding.js'
import Handler from '/src/handler.js';
import TabManager from '/src/tabs/TabManager.js';

export default class EditorFunction extends Handler {
	constructor(name, id) {
		super(arguments, ["overrideKeyPress"]);
		this.id = id;

		this.bindings = [];

		this.zoomLevel = 100;

		document.querySelector(`#view_${this.id} textarea`).value = TabManager.getTabByID(this.id).content;

		[...document.querySelectorAll(`#view_${this.id} .page`)].forEach(i => i.addEventListener("click", e => document.querySelector(".view.editor textarea").focus()))

		let self = this;
		document.querySelector('.zoom').addEventListener('input', function (e) {
			self.setZoom(this.value);
		})
		document.querySelector('.zoom-out-btn').addEventListener('click', e => self.zoomOut());
		document.querySelector('.zoom-in-btn').addEventListener('click', e => self.zoomIn());
	}

	overrideKeyPress() {

		let rewrite = ["Enter", "*", "_", "~", "\\", "Backspace", "Delete"];
		let replace = ["\\\n", "\\*", "\\_", "\\~", "\\\\", "", ""]; // two blank strings are important

		let deleteChars = "*_~";

		let self = this;

		[...document.querySelectorAll(`#view_${this.id} .page`)].forEach(e => this.addBindings());
		[...document.querySelectorAll(`#view_${this.id} textarea`)].forEach(i => i.addEventListener("keydown", async function(e) {

			let cursorPos = this.selectionStart;

			if (e.key === "Backspace") {
				e.preventDefault();

				let targetCharacter = deleteChars.indexOf(this.value[cursorPos]) > -1 ? this.value[cursorPos] : null;

				if (EditorFunction.shouldDeletePattern(this, targetCharacter, cursorPos)) {
					let newInput = EditorFunction.deletePattern(this, targetCharacter, cursorPos);
					this.value = newInput.cont;
					this.setSelectionRange(newInput.cursorPos, newInput.cursorPos);
				} else {
					this.value = this.value.substring(0, this.selectionStart - 1) + this.value.substring(this.selectionEnd);
					this.setSelectionRange(cursorPos - 1, cursorPos - 1);

					// cursorPos = this.selectionStart;
				}

			}

			 else if (e.key === "Delete") {
				e.preventDefault();

				let targetCharacter = deleteChars.indexOf(this.value[cursorPos]) > -1 ? this.value[cursorPos] : null;

				if (EditorFunction.shouldDeletePattern(this, targetCharacter, cursorPos)) {
					let newInput = EditorFunction.deletePattern(this, targetCharacter, cursorPos);
					this.value = newInput.cont;
					this.setSelectionRange(newInput.cursorPos, newInput.cursorPos);
				} else {

					this.value = this.value.substring(0, this.selectionStart - 1) + this.value.substring(this.selectionEnd);
					this.setSelectionRange(cursorPos, cursorPos);

					// cursorPos = this.selectionStart;
				}

			} else {
				let index = rewrite.indexOf(e.key);

				if (index > -1) {
					e.preventDefault();
					let cursorPos = this.selectionStart + replace[index].length;
					let beforeCursor = this.value.substring(0, this.selectionStart);
					let afterCursor = this.value.substring(this.selectionEnd);
					this.value = replace[index];
					this.value = beforeCursor + this.value + afterCursor;

					this.setSelectionRange(cursorPos, cursorPos);
				}

			}

			setTimeout(() => {
				self.compile().then(res => {
					document.querySelector(".page").innerHTML = `${document.querySelector(".page").innerHTML.substring(0, this.getCursorPosition())}<span class="editor_cursor"></span>${document.querySelector(".page").innerHTML.substring(this.getCursorPosition())}`
				});
			}, 1);

		}))
	}

	addBindings() {
		this.bindings.push(new Binding("ctrl+b", e => this.bold()));
		this.bindings.push(new Binding("ctrl+i", e => this.italic()));
		this.bindings.push(new Binding("ctrl+t", e => this.strikethrough()));
		this.bindings.push(new Binding("ctrl+;", e => this.code()));

		this.bindings.push(new Binding("ctrl+=", e => this.zoomIn()));
		this.bindings.push(new Binding("ctrl+-", e => this.zoomOut()));
	}

	bold() {
		this.insertText("****");
		// .value += "****";
	}

	italic() {
		// document.querySelector(`#view_${this.id} textarea`).value += "__";
		this.insertText("__");
	}

	code() {
		// document.querySelector(`#view_${this.id} textarea`).value += "``";
		this.insertText("``");
	}

	strikethrough() {
		// document.querySelector(`#view_${this.id} textarea`).value += "~~~~";
		this.insertText("~~~~");
	}

	async compile() {
		TabManager.getTabByID(this.id).content = document.querySelector(`#view_${this.id} textarea`).value;
		document.querySelector(`#view_${this.id} .page`).innerHTML = await (await (fetch('/compile', {
			method: 'post',
			body: TabManager.getTabByID(this.id).content
		}))).text();
	}

	insertText(textToInsert) {
		let val = document.querySelector(`#view_${this.id} textarea`);
		let cursorPos = val.selectionStart;
		document.querySelector(`#view_${this.id} textarea`).value = val.value.substring(0, val.selectionStart) + textToInsert + val.value.substring(val.selectionEnd);
		val.setSelectionRange(cursorPos + (textToInsert.length / 2), cursorPos + (textToInsert.length / 2));
	}

	static deletePattern(self, targetCharacter, cursorPos) {
		let j = cursorPos + 1;
		while (self.value[j] === targetCharacter) ++j;
		let i = cursorPos;
		while (self.value[i] === targetCharacter) --i;
		return {cont: self.value.substring(0, i) + self.value.substring(j), cursorPos: cursorPos};
	}

	static shouldDeletePattern(self, targetChar, cursorPos) {
		return (self.value[cursorPos - 1] + self.value[cursorPos]) === new Array(3).join(targetChar);
	}

	getCursorPosition() {
		// return this.
		return this.selectionStart;
	}

	async setZoom(lvl) {

		// let level = Math.min(Math.max(lvl, 1000), 0);
		let level = Math.max(Math.min(lvl, 1000), 12.5);

		document.querySelector(".editor_page_view").style.zoom = level + "%";
		document.querySelector(".zoom").value = level;

		this.zoomLevel = level;
	}

	async zoomIn() {
		// this.zoomLevel *= 2;
		// this.zoomLevel = Math.max(this.zoomLevel * 2, 1000);
		this.setZoom(this.zoomLevel * 2);
	}

	async zoomOut() {
		// this.zoomLevel = Math.max(this.zoomLevel / 2, 1000);
		this.setZoom(this.zoomLevel / 2);
	}
}
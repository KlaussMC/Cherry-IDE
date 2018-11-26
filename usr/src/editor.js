import Binding from '/src/KeyBinding.js'
import Handler from '/src/handler.js';
import TabManager from '/src/tabs/TabManager.js';

export default class EditorFunction extends Handler {
	constructor(name, id) {
		super(arguments, ["overrideKeyPress"]);
		this.id = id;

		this.bindings = [];

		document.querySelector(`#view_${this.id} textarea`).value = TabManager.getTabByID(this.id).content;

		[...document.querySelectorAll(`#view_${this.id} .page`)].forEach(i => i.addEventListener("click", e => document.querySelector(".view.editor textarea").focus()))
	}

	overrideKeyPress() {

		let rewrite = ["Enter", "*", "_", "~", "Backspace", "Delete"];
		let replace = ["\\\n", "\\*", "\\_", "\\~", "", ""];

		let deleteChars = "*_~";

		let self = this;

		[...document.querySelectorAll(`#view_${this.id} .page`)].forEach(e => this.addBindings());
		[...document.querySelectorAll(`#view_${this.id} textarea`)].forEach(i => i.addEventListener("keydown", async function(e) {

			let cursorPos = this.selectionStart;

			if (e.key === "Backspace") {
				e.preventDefault();

				let targetCharacter = deleteChars.indexOf(this.value[cursorPos]) > -1 ? this.value[cursorPos] : null;

				this.value = this.value.substring(0, this.selectionStart - 1) + this.value.substring(this.selectionEnd);
				this.setSelectionRange(cursorPos - 1, cursorPos - 1);

				cursorPos = this.selectionStart;
			} else if (e.key === "Delete") {
				e.preventDefault();

				let targetCharacter = deleteChars.indexOf(this.value[cursorPos]) > -1 ? this.value[cursorPos] : null;

				this.value = this.value.substring(0, this.selectionStart - 1) + this.value.substring(this.selectionEnd);
				this.setSelectionRange(cursorPos, cursorPos);

				cursorPos = this.selectionStart;
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

			setTimeout(() => self.compile(), 1);
		}))
	}

	addBindings() {
		this.bindings.push(new Binding("ctrl+b", this.bold));
		this.bindings.push(new Binding("ctrl+i", this.italic));
		this.bindings.push(new Binding("ctrl+t", this.strikethrough));
		this.bindings.push(new Binding("ctrl+;", this.code));
	}

	bold() {
		document.querySelector(`#view_${this.id} textarea`).value += "****";
	}

	italic() {
		document.querySelector(`#view_${this.id} textarea`).value += "__";
	}

	code() {
		document.querySelector(`#view_${this.id} textarea`).value += "``";
	}

	strikethrough() {
		document.querySelector(`#view_${this.id} textarea`).value += "~~~~";
	}

	async compile() {
		TabManager.getTabByID(this.id).content = document.querySelector(`#view_${this.id} textarea`).value
		document.querySelector(`#view_${this.id} .page`).innerHTML = await (await (fetch('/compile', {
			method: 'post',
			body: TabManager.getTabByID(this.id).content
		}))).text();
	}
}
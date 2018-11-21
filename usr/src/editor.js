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

		let rewrite = ["Enter", "*", "_"];
		let replace = ["\\\n", "\\*", "\\_"];

		// console.log(this.id);
		// console.log([...document.querySelectorAll(`.view#view_${this.id} .page`)]);

		let self = this;

		[...document.querySelectorAll(`#view_${this.id} .page`)].forEach(e => this.addBindings());
		[...document.querySelectorAll(`#view_${this.id} textarea`)].forEach(i => i.addEventListener("keydown", async function(e) {

			let index = rewrite.indexOf(e.key)

			if (index > -1) {
				e.preventDefault();
				let cursorPos = this.selectionStart + replace[index].length;
				let beforeCursor = this.value.substring(0, this.selectionStart);
				let afterCuror = this.value.substring(this.selectionEnd);
				this.value = replace[index];
				this.value = beforeCursor + this.value + afterCuror;

				this.setSelectionRange(cursorPos, cursorPos);
			}

			setTimeout(e => self.compile(), 1);
		}))
	}

	addBindings() {
		this.bindings.push(new Binding("ctrl+b", this.bold));
		this.bindings.push(new Binding("ctrl+i", this.italic));
		this.bindings.push(new Binding("ctrl+u", this.underline));
		this.bindings.push(new Binding("ctrl+;", this.code));
	}

	bold() {
		document.querySelector(`#view_${this.id} textarea`).value += "****";
	}

	italic() {
		console.log("italic");
		document.querySelector(`#view_${this.id} textarea`).value += "__";
	}

	underline() {
		console.log("underline");
	}

	code() {
		console.log("code");
	}

	async compile() {
		TabManager.getTabByID(this.id).content = document.querySelector(`#view_${this.id} textarea`).value
		document.querySelector(`#view_${this.id} .page`).innerHTML = await (await (fetch('/compile', {
			method: 'post',
			body: TabManager.getTabByID(this.id).content
		}))).text();
	}
}
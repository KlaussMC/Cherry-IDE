import Binding from '/src/KeyBinding.js'
import Handler from '/src/handler.js';
import TabManager from '/src/tabs/TabManager.js';

export default class EditorFunction extends Handler {
	constructor(name, id) {
		super(arguments, ["begin"]);
		this.id = id;

		this.bindings = [];

		this.zoomLevel = 100;

	}

	async begin() {
		document.querySelector(`#view_${this.id} .page`).innerHTML = await (await fetch('/compile', {
			method: 'POST',
			body: TabManager.getTabByID(this.id).content
		})).text();

		const self = this;
		document.querySelector('.zoom').addEventListener('input', function (e) {
			self.setZoom(this.value);
		});
		document.querySelector('.zoom-out-btn').addEventListener('click', e => self.zoomOut());
		document.querySelector('.zoom-in-btn').addEventListener('click', e => self.zoomIn());

		[...document.querySelectorAll(`#view_${this.id}`)].forEach(e => this.addBindings());

		document.querySelector(".bold").addEventListener("click", e => this.bold());
		document.querySelector(".italic").addEventListener("click", e => this.italic());
		document.querySelector(".strikethrough").addEventListener("click", e => this.strikethrough());
		document.querySelector(".underline").addEventListener("click", e => this.underline());

		[...document.querySelectorAll(".page")].forEach(i => {
			i.addEventListener("click", e => this.updateUI());
			i.addEventListener("keydown", e => this.updateUI());
			i.addEventListener("keyup", e => this.updateUI());
			i.addEventListener("keypress", e => this.updateUI());
		});
		[...document.querySelectorAll("tool")].forEach(i => {
			i.addEventListener("click", e => this.updateUI());
			i.addEventListener("keydown", e => this.updateUI());
			i.addEventListener("keyup", e => this.updateUI());
			i.addEventListener("keypress", e => this.updateUI());
		});

		document.querySelector('.font-size').addEventListener('input', function (e) {
			document.execCommand('fontSize', false, this.value);
		})
	}

	addBindings() {
		this.bindings.push(new Binding("ctrl+b", e => this.bold()));
		this.bindings.push(new Binding("ctrl+i", e => this.italic()));
		this.bindings.push(new Binding("ctrl+t", e => this.strikethrough()));
		this.bindings.push(new Binding("ctrl+u", e => this.underline()));
		this.bindings.push(new Binding("ctrl+;", e => this.code()));

		this.bindings.push(new Binding("ctrl+=", e => this.zoomIn()));
		this.bindings.push(new Binding("ctrl+-", e => this.zoomOut()));

		this.bindings.push(new Binding("ctrl+shift+,", e => this.reduceFontSize()));
		this.bindings.push(new Binding("ctrl+shift+.", e => this.increaseFontSize()));
	}

	increaseFontSize() {
		document.execCommand('increaseFontSize', false, null);
		this.updateUI();
	}

	reduceFontSize() {
		document.execCommand('decreaseFontSize', false, null);
		this.updateUI();
	}

	setFontSize(size) {
		document.execCommand('fontSize', false, size);
		this.updateUI();
	}

	bold() {
		document.execCommand('bold', false, null);
		this.updateUI();
	}

	italic() {
		document.execCommand('italic', false, null);
		this.updateUI();
	}

	code() {
		console.log('c');
		this.updateUI();
	}

	strikethrough() {
		document.execCommand('strikeThrough', false, null);
		this.updateUI();
	}

	underline() {
		document.execCommand('underline', false, null);
		this.updateUI();
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

	static getSelectionStart() {
		const node = document.getSelection().anchorNode.parentElement;
		return node;
		// return (node.nodeType == 3 ? node.parentNode : node)
		// return node.parentNode;
	}

	async updateUI(el) {
		el = el || EditorFunction.getSelectionStart();
		// console.log(el);

		document.querySelector('tool.bold').classList.remove('active');
		document.querySelector('tool.italic').classList.remove('active');
		document.querySelector('tool.underline').classList.remove('active');
		document.querySelector('tool.strikethrough').classList.remove('active');

		if (getComputedStyle(el)["font-weight"] === "900")
		// console.log('bold');
			document.querySelector(`.editor#view_${this.id} tool.bold`).classList.add('active');

		if (getComputedStyle(el)["font-style"] === "italic")
		// console.log('italic');
			document.querySelector(`.editor#view_${this.id} tool.italic`).classList.add('active');

		if (getComputedStyle(el)["text-decoration"].indexOf("underline") > -1)
		// console.log('underline');
			document.querySelector(`.editor#view_${this.id} tool.underline`).classList.add('active');

		if (getComputedStyle(el)["text-decoration"].indexOf("line-through") > -1)
		// console.log('strkethrough');
			document.querySelector(`.editor#view_${this.id} tool.strikethrough`).classList.add('active');

		document.querySelector(".font-size").value = getComputedStyle(el)["font-size"].split("pt")[0];

		if (el.parentElement.classList.contains("page")) this.updateUI(el.parentElement);

	}
}
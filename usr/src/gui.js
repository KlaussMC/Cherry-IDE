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
	begin() {

	}
}
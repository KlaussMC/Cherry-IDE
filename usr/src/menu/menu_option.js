import KeyBinding from '/src/KeyBinding.js';

export default class MenuOption {
	constructor(callback, keyBinding) {
		this.keyBinding = keyBinding;
		this.callback = callback;

		if (this.keyBinding) {
			if (this.keyBinding instanceof KeyBinding) {
				this.keyBinding.callback = this.callback;
			} else {
				this.keyBinding = new KeyBinding(this.keyBinding, this.callback);
			}
		}
	}
}
export default class KeyBinding {
	constructor(binding, callback) {
		this.binding = binding;
		this.callback = callback;

		Mousetrap.prototype.stopCallback = () => false;

		Mousetrap.bind(this.binding, this.callback);

		keyBindings.push(this);
	}
}
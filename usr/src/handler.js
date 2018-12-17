export default class Handler {
	constructor(name, functions) {
		this.name = name;
		this.functions = functions;
	}
	begin() {
		this.functions.forEach(i => this[i]());
	}
}
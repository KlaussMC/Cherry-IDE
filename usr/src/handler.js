export default class Handler {
	constructor(name, functions) {
		this.name = name;
		this.functions = functions;
	}
	begin() {
		console.log("begin")
		// let p = Object.keys(this).filter(i => typeof this[i] == "function").forEach(i => i());
		this.functions.forEach(i => this[i]());
	}
}
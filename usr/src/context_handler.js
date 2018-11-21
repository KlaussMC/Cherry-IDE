import TabManager from '/src/tabs/tabmanager.js';

export default class ContextHandler {
	static async preview(file) {
		await open(file, 1)
	}
	static async code(file) {
		await open(file, 0);
	}
	static async text(file) {
		await open(file, 2);
	}
	static async editor(file) {
		await open(file, 3);
	}
}

async function open(file, view) {
	console.log(view);
	await TabManager.openTab(file.split(/[\/\\]/).pop(), true, require('path').join(dir, file), view, file.split(/[\/\\]/).pop().split('.').pop() == "md" && view == 1)
	await TabManager.switchTab(TabManager.getActiveTab().id);
}
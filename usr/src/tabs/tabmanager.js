import Tab from '/src/tabs/tab.js';
import escapeHtml from '/src/util.js';

import {
	toCodeView,
	toMDView,
	showWelcomeScreen
} from '/src/views.js';

let tabs = [];
let activeTab = ""

export default class TabManager {
	static async openTab(tabName, focusesTab, loc, view, compile) {

		if (tabs.length > 0 && focusesTab) {
			let attr = document.querySelector('#view_' + this.getActiveTab().id).getAttribute('class').split(' ')
			attr.splice(attr.indexOf('active'), 1);
			document.querySelector('#view_' + this.getActiveTab().id).setAttribute('class', attr.join(' '))
		}

		let tab = this.newTab(tabName, focusesTab);
		this.getActiveTab().loadContent({
			fromFile: true,
			path: loc
		})

		if (view == 0) {
			document.querySelector('.view_container').innerHTML += toCodeView(tab.id, escapeHtml(await tab.getContent()), focusesTab);
			Prism.highlightAll();
		} else
			document.querySelector('.view_container').innerHTML += toMDView(tab.id, await tab.getContent(compile), focusesTab);

	}

	static switchTab(id) {
		if (idExists(id)) {
			document.querySelector('.view.active').classList.remove('active');
			document.querySelector(`#view_${id}`).classList.add('active');

			document.querySelector('.tab.active').classList.remove('active');
			document.querySelector(`.tab#${id}`).classList.add('active');
		}

	}

	static newTab(name, activateTab) {
		let id = generateId();
		tabs.push(new Tab(id, name))

		if (activateTab) {
			activeTab = id;
			this.getActiveTab().show();
			// this.switchTab(id);

			try {
				document.querySelector('.tab.active').classList.remove('active');
			} catch (e) {}
			document.querySelector(`.tab#${activeTab}`).classList.add('active');
		}

		return tabs[tabs.length - 1];

	}
	static getActiveTab() {
		for (let i of tabs) {
			if (i.id == activeTab)
				return i;
		}
		return {};
	}
	static updateTabContent(id, content) {
		for (let i of tabs) {
			if (id == i.id) {
				i.loadContent({
					fromFile: false,
					content
				})
			}
		}
	}
	static closeTab(id) {
		for (let i in tabs) {
			if (tabs[i].id == id) {
				document.querySelector(`#view_${id}`).outerHTML = ""
				tabs.splice(i, 1);
				if (tabs.length == 0) showWelcomeScreen();
			}
		}
	}
	static prevTab(id) {
		for (let i in tabs) {
			i = Number(i);
			if (tabs[i].id == id) {
				console.log('swithing')
				this.switchTab(tabs[(i + 1) % tabs.length].id);
			}
		}
	}
}

function generateId() {
	let id = "tab_"
	let alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	do {
		for (let i = 0; i < Math.floor(Math.random() * 15) + 10; i++) {
			id += alphabet[Math.floor(Math.random() * alphabet.length - 1) + 1];
		}
	} while (idExists(id));

	return id;
}

function idExists(id) {
	for (let i of tabs) {
		if (i.id == id) return true;
	}
	return false;
}
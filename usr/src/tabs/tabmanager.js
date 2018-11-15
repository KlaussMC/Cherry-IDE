import Tab from '/src/tabs/tab.js';
import escapeHtml from '/src/util.js';
import SaveManager from '/src/files/Save_Manager.js';

import {
	toCodeView,
	toMDView,
	showWelcomeScreen,
	toTextView
} from '/src/views.js';

window.tabs = [];
window.activeTab = ""

export default class TabManager {
	static async openTab(tabName, focusesTab, loc, view, compile) {

		try {
			let e = document.querySelector('#view_' + this.getActiveTab().id)
			if (e) e.classList.remove('active')

		} finally {
			let tab = this.newTab(tabName, focusesTab);
			this.getActiveTab().loadContent({
				fromFile: true,
				path: loc,
				type: loc.split(/[\/\\]/).pop().split('.').pop()
			})

			await this.displayContent(view, tab, focusesTab, compile)

			if (view == 0) {
				tab.setSaveManager(new SaveManager(loc, tab.id));
			}

			// console.log(tabs, activeTab)

			Prism.highlightAll();
		}

	}

	static async displayContent(view, tab, focusesTab, compile) {
		if (view == 0) {
			document.querySelector('.view_container').innerHTML += toCodeView(tab.id, escapeHtml(await tab.getContent()), focusesTab);
			document.querySelector(`.tab#${activeTab}`).querySelector('.tab_header').innerHTML = "[Code] " + tab.name
		} else if (view == 1) {
			document.querySelector('.view_container').innerHTML += toMDView(tab.id, await tab.getContent(compile), focusesTab);
			document.querySelector(`.tab#${activeTab}`).querySelector('.tab_header').innerHTML = "[Rendered] " + tab.name
		} else {
			document.querySelector('.view_container').innerHTML += toTextView(tab.id, escapeHtml(await tab.getContent()), focusesTab);
			document.querySelector(`.tab#${activeTab}`).querySelector('.tab_header').innerHTML = "[Text] " + tab.name
		}
		Prism.highlightAll();
	}

	static switchTab(id) {
		if (idExists(id)) {
			let el = document.querySelector('.view.active')
			if (el) {
				el.classList.remove('active');
				el = document.querySelector(`#view_${id}`)
				if (el) el.classList.add('active');
			} // check to make sure the current tab is no longer the current.

			document.querySelector('.tab.active').classList.remove('active');
			document.querySelector(`.tab#${id}`).classList.add('active');

			activeTab = id;
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
				// console.log('swithing')
				this.switchTab(tabs[(i + 1) % tabs.length].id);
			}
		}
	}
	static getTabs() {
		return tabs;
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
import {
	parseXML
} from '/src/util.js';
import TabManager from '/src/tabs/tabmanager.js'

const fs = require('fs');
const path = require('path')

let tree;

export default class FileManager {
	static async show() {
		tree = await (await fetch(`/getdir`, {
			method: 'POST',
			body: encodeURI(dir)
		})).json();
		let displayTreeNode = (node, depth, directory) => {
			let output = ``;

			Object.keys(node).forEach(i => {
				if (depth <= 10) {
					output += `<li class="${typeof node[i] == 'object' ? 'directory' : 'file'}">${
						node[i] != 'file' ? "<span class=\"label hidden\">" + i + "</span>" + "<ul class=\"dir_view\">" + displayTreeNode(node[i], depth + 1, path.join(directory || '/', i)) + "</ul>" : "<span class=\"file_view\" value=" + encodeURI(directory) + ">" + i + "</span>"
					}</li>`
				}
			})

			return output;
		}

		document.querySelector('.dir_view').appendHTML(displayTreeNode(tree, 0, '/'))
		addEventListeners();

	}

	static async openAsCode() {

	}
}

async function openFile(file, view) {

	if (["html", "md", "css", "js", "mjs", "jade", "pug", "ejs", "hbs", "scss", "sass", "less", "htm"].indexOf(file.split(/[\/\\]/).pop().split('.').pop()) > -1) {
		await TabManager.openTab(file.split(/[\/\\]/).pop(), true, path.join(dir, file), view == -1 ? (["html", "htm", "md"].indexOf(file.split(/[\/\\]/).pop().split('.').pop()) > -1 ? 1 : 0) : view, file.split(/[\/\\]/).pop().split('.').pop() == "md");
	} else {
		await TabManager.openTab(file.split(/[\/\\]/).pop(), true, path.join(dir, file), 2, file.split(/[\/\\]/).pop().split('.').pop() == "md")
	}
	await TabManager.switchTab(TabManager.getActiveTab().id);
}

function addEventListeners() {
	[...document.querySelectorAll('.label')].forEach(i => i.addEventListener('click', e => i.classList.toggle('hidden')));
	[...document.querySelectorAll('li.file')].forEach(i => i.addEventListener('click', e => {
		if (window.event.ctrlKey)
			openFile(path.join(decodeURI(i.children[0].getAttribute('value')), i.children[0].innerHTML), -1) // Pick appropriate view
		else
			openFile(path.join(decodeURI(i.children[0].getAttribute('value')), i.children[0].innerHTML), 0) // Open in code view
	}))
}
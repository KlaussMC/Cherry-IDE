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
}

function openFile(file) {
	if (["html", "md", "css", "js", "mjs", "jade", "pug", "ejs", "hbs", "scss", "sass", "less", "htm"].indexOf(file.split(/[\/\\]/).pop().split('.').pop()) > -1)
		TabManager.openTab(file.split(/[\/\\]/).pop(), true, path.join(dir, file), ["html", "htm", "md"].indexOf(file.split(/[\/\\]/).pop().split('.').pop()) > -1 ? 1 : 0, file.split(/[\/\\]/).pop().split('.').pop() == "md");
	else {
		TabManager.newTab("Error", true)
		TabManager.getActiveTab().loadContent({
			fromFile: false,
			type: 'txt',
			path: '/',
			content: "There was an error during the parsing of this file, it is either of an unsupported format, has an incorrect file extension or is not supported in general. If you wish for this type of file to be recognised, feel free to leave an issue on GitHub, or write a plugin (coming) for this file Type",
			focus: true
		})
	}
}

function addEventListeners() {
	[...document.querySelectorAll('.label')].forEach(i => i.addEventListener('click', e => i.classList.toggle('hidden')));
	[...document.querySelectorAll('li.file')].forEach(i => i.addEventListener('dblclick', e => openFile(path.join(decodeURI(i.children[0].getAttribute('value')), i.children[0].innerHTML))))
}
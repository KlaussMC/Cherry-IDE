const fs = require('fs');
const path = require('path')

let currentPath = [];

export default class FileManager {
	static async show() {
		(await (await fetch(`/getdir?path=${encodeURI(dir)}`, {
			method: 'POST'
		})).json()).forEach(i => {
			document.querySelector('.dir_view').appendHTML(`<li>${i}</li>`)
			document.querySelector('.dir_view li').addEventListener('click', toggleTree)
		})
	}
}

const toggleTree = function(e) {
	fs.lstatSync(path.join(dir, currentPath));
}
import {
	toMDView,
	toCodeView
} from '/src/views.js';
import escapeHtml from '/src/util.js';
import TabManager from '/src/tabs/tabmanager.js';
import FileManager from '/src/files/filemanager.js'

const {
	ipcRenderer
} = require('electron');

let fullscreen = false;

const path = require('path');
const fs = require('fs')

addEventListener('load', async e => {

	await TabManager.openTab("New Tab", true, 'C:/Users/Jacob Schneider/Code/GIT/Mardown-IDE/usr/test/full_test.md', 1, true)
	await TabManager.openTab("New Tab 2", true, 'C:/Users/Jacob Schneider/Code/GIT/Mardown-IDE/usr/test/test.md', 1, true)
	await TabManager.openTab("New Tab 3", true, 'C:/Users/Jacob Schneider/Code/GIT/Mardown-IDE/usr/test/full_test.js', 0, false)

	Prism.highlightAll();

	FileManager.show();

	document.addEventListener('contextmenu', e => {
		if (menu)
			menu.show(e.clientX, e.clientY);
		e.preventDefault();
	})

	document.addEventListener('click', e => {
		if (menu)
			menu.unrender();
	})
})

Mousetrap.bind('ctrl+r', e => window.location.reload());
Mousetrap.bind('ctrl+shift+r', e => window.location.reload());
Mousetrap.bind('f5', e => window.location.reload());
Mousetrap.bind('f11', e => ipcRenderer.send('fullscreen', fullscreen = !fullscreen))
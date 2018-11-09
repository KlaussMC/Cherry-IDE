import {
	toMDView,
	toCodeView
} from '/src/views.js';
import escapeHtml from '/src/util.js';
import TabManager from '/src/tabs/tabmanager.js';
import FileManager from '/src/files/filemanager.js'

const path = require('path');
const fs = require('fs')

addEventListener('load', async e => {

	await TabManager.openTab("New Tab", true, 'C:/Users/Jacob Schneider/Code/GIT/Mardown-IDE/usr/test/full_test.md', 1, true)
	await TabManager.openTab("New Tab 2", true, 'C:/Users/Jacob Schneider/Code/GIT/Mardown-IDE/usr/test/test.md', 1, true)
	await TabManager.openTab("New Tab 3", true, 'C:/Users/Jacob Schneider/Code/GIT/Mardown-IDE/usr/test/full_test.js', 0, false)

	Prism.highlightAll();

	FileManager.show();
})

Mousetrap.bind('ctrl+r', e => window.location.reload());
Mousetrap.bind('f5', e => window.location.reload());
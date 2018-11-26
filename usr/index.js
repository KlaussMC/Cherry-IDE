import TabManager from '/src/tabs/tabmanager.js';
import FileManager from '/src/files/filemanager.js';
import MenuManager from '/src/menu/menumanager.js';
import ContextHandler from '/src/context_handler.js';
import MenuOption from '/src/menu/menu_option.js';
import KeyBinding from '/src/keybinding.js';
import SaveManager from '/src/files/Save_Manager.js';
import applyToolBarFunctions from '/src/toolbar.js';
import ThemeManager from '/src/ThemeManager.js';
import {
	toMDView,
	toCodeView,
	toEditorView,
	showWelcomeScreen
} from '/src/views.js';


const {
	ipcRenderer
} = require('electron');

let fullscreen = false;

MenuManager.renderMenu({
	File: {
		New: new MenuOption(e => console.log("New File"), "ctrl+n"),
		Open: new MenuOption(e => console.log("Open File"), "ctrl+o"),
		Save: new MenuOption(e => SaveManager.saveFile(), "ctrl+s")
	},
	Edit: {
		Undo: new MenuOption(e => console.log("Undo")),
		Redo: new MenuOption(e => console.log("Redo"))
	},
	View: {
		Theme: {
			Light: new MenuOption(e => ThemeManager.lightTheme()),
			Dark: new MenuOption(e => ThemeManager.darkTheme())
		},
		"Colour Scheme": {
			Purple: new MenuOption(e => console.log("Purple"))
		}
	},
	Help: {
		About: new MenuOption(e => Alert(`The Cherry IDE was designed based on a cross between the Atom Text Editor and Microsoft Office Word. It uses the following libraries to bring you the experience: <br/><br/> <ul> <li> Electron </li> <li> Markdown-It </li> <li> Prism.JS </li> <li> UI.JS </li> <li> Mousetrap.JS </li>`, "Credits"))
	}
});

const path = require('path');
const fs = require('fs')

addEventListener('load', async e => {
	showWelcomeScreen();

	ThemeManager.initTheme();

	Prism.highlightAll();

	FileManager.show();

	window.openContext = function(view) {
		switch (view) {
			case 0:
				ContextHandler.code(contextFocus);
				break;
			case 1:
				ContextHandler.preview(contextFocus);
				break;
			case 2:
				ContextHandler.text(contextFocus);
				break;
			case 3:
				ContextHandler.editor(contextFocus);
		}
	};

	document.addEventListener('contextmenu', function(e) {
		focused = e.path[0].querySelector('.file_view');
		e.preventDefault();
		if (focused) {
			contextFocus = require('path').join(focused.getAttribute('value'), focused.innerHTML);
			if (menu)
				menu.show(e.clientX, e.clientY);
			else {
				menu = new UIbox(new template({
					content: {
						"View Code": e => openContext(0),
						"View Preview": e => openContext(1),
						"View Text": e => openContext(2),
						"Edit File": e => openContext(3)
					},
					type: 'menu',
					settings: {
						contentIsArray: true
					}
				}), "Context Menu", () => {}, () => {}, () => {})

				menu.show(e.clientX, e.clientX);
			}
		}
	});

	addEventListener('click', () => {
		if (menu) // this is the UIBox Menu
			menu.unrender();
	});

	applyToolBarFunctions([{
		file: "editor_view.svg",
		callback: e => {
			let tab = TabManager.getActiveTab();
			TabManager.openTab(tab.name, true, tab.path, 3, false);
		}
	}, {
		file: "settings.svg",
		callback: () => console.log("Opening Settings")
	}])

	// console.log(await Prompt("What's your name?", "Information required", "Name"));
});

new KeyBinding("ctrl+r", () => window.location.reload());
new KeyBinding("ctrl+shift+r", () => window.location.reload());
new KeyBinding("f5", () => window.location.reload());
new KeyBinding("f11", () => ipcRenderer.send('fullscreen', fullscreen = !fullscreen));
new KeyBinding('ctrl+w', () => {
	try {
		TabManager.getActiveTab().close(true)
	} catch (e) {}
});
new KeyBinding("alt", () => document.querySelector('.menu_bar').classList.toggle('hidden'));
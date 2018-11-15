import MenuOption from '/src/menu/menu_option.js';
import {
	parseClick
} from '/src/menu/menu_click_handler.js';

let defaultMenu;
let callBacks = [];

export default class MenuManager {
	static async renderMenu(menu) {
		document.querySelector('.menu_bar').appendHTML(this.genHTML(menu));

		callBacks = callBacks.map(i => i.callback);

		getAllMenuOptions().forEach(i => {
			let b = callBacks.shift()
			i.addEventListener("click", e => {
				b();
				this.hideMenu()
			})
		})

		defaultMenu = menu;

	}
	static genHTML(option, name) {
		let HTML = `<div class="option">`;
		if (name) HTML += `<span class="name">${name}<span class="FA">&#xf0da</span></span>`
		HTML += `<div class="submenu">`

		Object.keys(option).forEach(i => {
			if (option[i] instanceof MenuOption) {
				HTML += `<div class="option"><span class="name">${i}</span>`
				if (option[i].keyBinding)
					HTML += `<span class="binding">${option[i].keyBinding.binding}</span>`
				HTML += `</div>`

				callBacks.push(option[i]);
			} else {
				HTML += this.genHTML(option[i], i)
			}
		})

		return HTML + "</div></div>";
	}

	static hideMenu() {
		document.querySelector('.menu_bar').classList.add('hidden'); // this is the Application Menu Bar
	}
}

function getAllMenuOptions() {
	return [...document.querySelectorAll(".option")].filter(i => i.querySelector('.submenu') == null)
}
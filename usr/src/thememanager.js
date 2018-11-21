export default class ThemeManager {
	static async darkTheme() {
		try {
			document.head.innerHTML += (`<style>${await (await fetch('/css/themes/dark.css')).text() }</style>`);
			window.localStorage.theme = "darkTheme"
		} catch (e) {
			null;
		}
	}
	static async lightTheme() {
		try {
			document.head.querySelector("style").outerHTML = "";
			window.localStorage.theme = "lightTheme"
		} catch (e) {
			null;
		}

	}
	static async initTheme() {
		this[window.localStorage.theme || "lightTheme"]();
	}
}
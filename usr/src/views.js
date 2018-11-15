import TabManager from '/src/tabs/tabmanager.js'
import escapeHtml from '/src/util.js'

export function toMDView(id, input, activateView) {
	try {
		isOk(document.createElement('img').src = `data:image;base64,${hexToBase64(input)}`);
		return `<div class="richtext view${activateView ? " active" : ""}" id="view_${id}"><iframe name="iframe_${id}" src="data:text/html;charset=utf-8,${escapeHtml(input)}"></iframe></div>` // .rtv  is a RichTextView displayer, It can display the output of the HTML, MD or the Live RT editor
	} catch (e) {
		showWelcomeScreen();
	}
}

export function toCodeView(id, code, activateView) {
	try {
		return `<div class="code view${activateView ? " active" : ""}" id="view_${id}"><pre class="editor_direct"><code class="language-${TabManager.getActiveTab().type} line-numbers" contenteditable=true>${code}</code></pre></div>`
	} catch (e) {
		showWelcomeScreen();
	}
}

export function toTextView(id, code, activateView) {
	try {
		return `<div class="text view ${activateView ? " active" : ""}" id="view_${id}"><textarea class="text_view">${code}</textarea></div>`
	} catch (e) {
		showWelcomeScreen();
	}
}
export function showWelcomeScreen() {
	document.querySelector('.view_container').innerHTML = `<div class="welcome view active"><h1>Welcome to MD IDE</h1>. Open a file to being</div>`
}

export function toEditorView() {
	return require('fs').readFileSync(require('path').join(__dirname, '/views/editor_view.xml'))
}

function hexToBase64(str) {
	return btoa(String.fromCharCode.apply(null, str.replace(/\r|\n/g, "").replace(/([\da-fA-F]{2}) ?/g, "0x$1 ").replace(/ +$/, "").split(" ")));
}

function isOk(img) {
	if (!img.complete) {
		return false;
	}

	// However, they do have two very useful properties: naturalWidth and
	// naturalHeight. These give the true size of the image. If it failed
	// to load, either of these should be zero.
	if (typeof img.naturalWidth != "undefined" && img.naturalWidth == 0) {
		return false;
	}

}
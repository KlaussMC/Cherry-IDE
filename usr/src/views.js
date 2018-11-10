import TabManager from '/src/tabs/tabmanager.js'

export function toMDView(id, code, activateView) {
	try {
		return `<div class="richtext view${activateView ? " active" : ""}" id="view_${id}">${code}</div>` // .rtv  is a RichTextView displayer, It can display the output of the HTML, MD or the Live RT editor
	} catch (e) {
		// display welcome screen
		showWelcomeScreen();
	}
}

export function toCodeView(id, code, activateView) {
	try {
		return `<div class="code view${activateView ? " active" : ""}" id="view_${id}"><pre class="editor_direct line-numbers"><code class="language-${TabManager.getActiveTab().type}" contenteditable=true>${code}</code></pre></div>`
	} catch (e) {
		// display welcome screen
		showWelcomeScreen();
	}

}
export function showWelcomeScreen() {
	document.querySelector('.view_container').innerHTML = `<div class="welcome view active"><h1>Welcome to MD IDE</h1>. Open a file to being</div>`
}
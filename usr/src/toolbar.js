export default function applyToolBarFunctions(toolbar) {
	toolbar.forEach(i => {
		document.querySelector(".tool-bar").appendHTML(convertToHTML(i));
		[...document.querySelectorAll(".tool-wrapper")].pop().addEventListener('click', i.callback)
	})
}

function convertToHTML(tool) {
	return `<div class="tool-wrapper"><div class="tool"><img src="/res/${tool.file}"></div></div>`
}
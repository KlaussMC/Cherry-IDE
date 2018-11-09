export default function escapeHtml(unsafe = "") {
	return unsafe.toString()
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#039;");
}
export async function compile(string) {
	return await (await fetch('/compile', {
		method: 'POST',
		body: string
	})).text();

}

HTMLElement.prototype.appendHTML = function(html) {
	[...new DOMParser().parseFromString(html, "text/html").body.children].forEach(i => {
		this.appendChild(i);
	})
}
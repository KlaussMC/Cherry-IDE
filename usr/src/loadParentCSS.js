// HTMLElement.prototype.appendHTML = function(html) {
// 	[...new DOMParser().parseFromString(html, "text/html").body.children].forEach(i => {
// 		this.appendChild(i);
// 	})
// }
//
// window.onload = function() {
// 	if (parent) {
// 		[...parent.document.querySelectorAll("head link")].forEach(i => {
// 			document.querySelector("head").appendChild(i);
// 		})
// 	}
// }
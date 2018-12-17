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

export function parseXML(o, tab) {
	let toXml = function(v, name, ind) {
			let xml = "";
			if (v instanceof Array) {
				for (let i = 0, n = v.length; i < n; i++)
					xml += ind + toXml(v[i], name, ind + "\t") + "\n";
			} else if (typeof(v) === "object") {
				let hasChild = false;
				xml += ind + "<" + name;
				for (let m in v) {
					if (m.charAt(0) === "@")
						xml += " " + m.substr(1) + "=\"" + v[m].toString() + "\"";
					else
						hasChild = true;
				}
				xml += hasChild ? ">" : "/>";
				if (hasChild) {
					for (let m in v) {
						if (m === "#text")
							xml += v[m];
						else if (m === "#cdata")
							xml += "<![CDATA[" + v[m] + "]]>";
						else if (m.charAt(0) !== "@")
							xml += toXml(v[m], m, ind + "\t");
					}
					xml += (xml.charAt(xml.length - 1) === "\n" ? ind : "") + "</" + name + ">";
				}
			} else {
				xml += ind + "<" + name + ">" + v.toString() + "</" + name + ">";
			}
			return xml;
		},
		xml = "";
	for (let m in o)
		xml += toXml(o[m], m, "");
	return tab ? xml.replace(/\t/g, tab) : xml.replace(/\t|\n/g, "");
}

HTMLElement.prototype.appendHTML = function(html) {
	[...new DOMParser().parseFromString(html, "text/html").body.children].forEach(i => {
		this.appendChild(i);
	});

	return this;
};
HTMLElement.prototype.toggleClass = function(c) {
	this.classList.toggle(c);
};
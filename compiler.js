// console.clear();
//
// const fs = require('fs');
// const token = require('./string.js');
// const control = require('./control.js');
//
// String.prototype.splice = function(...args) {
// 	let tmp = [...this];
// 	tmp.splice(args[0], args[1], args[2]);
// 	return tmp.join('');
// }
//
// module.exports = function(markdown) {
// 	// return evaluate(parse(lex(markdown)));
// 	return parse(lex(markdown))
// }
//
// function lex(markdown) {
//
// 	markdown = markdown.trim() + "\r";
//
// 	let paragraphs = markdown.split('\n\n')
//
// 	let toks = [new control('paragraph')],
// 		tok = "",
// 		line = 1;
//
// 	for (let p of paragraphs) {
// 		for (let i of p) {
// 			tok += i;
//
// 			if (i == "\n") tok = ""
//
// 			let match = tok.match(/`(.*)`$/g)
// 			if (match) {
// 				toks.push(new control("code", null, line))
// 				toks.push(new token(match[0].substring(1, match[0].length - 1), line));
// 				toks.push(new control("code", null, line))
// 				tok = ""
// 				continue;
// 			}
//
// 			match = tok.match(/([_\*]{2})(.*)\1$/g)
// 			if (match) {
// 				toks.push(new control("bold", null, line))
// 				// toks.push(new token(match[0].substring(2, match[0].length - 2), line));
// 				// toks.push(new control("bold", null, line))
// 				tok = ""
// 				continue;
// 			}
//
// 			// match = tok.match(/(?<=[^_|\*]|^)(_|\*){1}[^_|\*](.*)?(_|\*){1}(?=[^_|\*]|$)/g)
// 			// if (match) {
// 			// 	toks.push(new control("italic", null, line))
// 			// 	// toks.push(new token(match[0].substring(1, match[0].length - 1), line));
// 			// 	// toks.push(new control("italic", null, line))
// 			// 	tok = ""
// 			// 	continue;
// 			// }
//
// 			// match = tok.match(/(?<!\*)\*(?!\*)/)
// 			// if (match) {
// 			// 	toks.push('italic', null, line);
// 			// 	tok = ""
// 			// 	continue;
// 			// }
//
// 			match = tok.match(/^\w*[-\*]\w*(.+[\r\n])/gm)
// 			if (match) {
// 				toks.push(new control('list', null, line))
// 				// toks.push(new token(match[0].substring(1).trim(), line))
// 				// toks.push(new control('list', null, line))
// 				tok = ""
// 				continue;
// 			}
//
// 			match = tok.match(/^[\-\*]{3,}$/g);
// 			if (match) {
// 				toks.push(new control("divider", null, line))
// 				tok = ""
// 				continue;
// 			}
//
// 			match = tok.match(/ {2,}[\r\n]/g);
// 			if (match) {
// 				toks.push(new control("linebreak", null, line))
// 				tok = ""
// 				continue;
// 			}
//
// 			match = tok.match(/(\r|\n){2,}/)
// 			if (match) {
// 				toks.push(new control('paragraph', null, line))
// 				toks.push(new control('paragraph', null, line))
// 				tok = ""
// 				continue;
// 			}
//
// 			toks.push(i);
// 			// tok = ""
//
// 		}
// 	}
// 	return [...toks, new control('paragraph', null, line + 1)]
// }
//
// function parse(toks) {
// 	let HTML = ``
//
// 	let codeStarted = false,
// 		boldStarted = false,
// 		italicStarted = false,
// 		paragraphStarted = false,
// 		listStarted = false;
//
// 	toks.forEach(i => {
// 		HTML += i instanceof control ? (function(i) {
// 			switch (i.type) {
// 				case "italic":
// 					italicStarted = !italicStarted
// 					return italicStarted ? i.toHTML() : i.closeTag()
// 				case "bold":
// 					boldStarted = !boldStarted
// 					return boldStarted ? i.toHTML() : i.closeTag()
// 				case "code":
// 					codeStarted = !codeStarted
// 					return codeStarted ? i.toHTML() : i.closeTag()
// 				case "paragraph":
// 					paragraphStarted = !paragraphStarted;
// 					return paragraphStarted ? i.toHTML() : i.closeTag();
// 				case "list":
// 					listStarted = !listStarted;
// 					return listStarted ? i.toHTML() : i.closeTag();
// 				case "divider":
// 					return i.toHTML();
// 				case "linebreak":
// 					return i.toHTML();
// 				default:
// 					return typeof i == "string" ? i : i.toHTML();
// 			}
//
// 		})(i) : i ? (i.value || i) : '';
//
// 		// console.log(i);
//
// 		HTML += '\n';
// 	})
//
// 	return clean(HTML);
//
// 	// return /(<(.+)( .+=(\'|\").+\4)*>\s*<\/\2>)/.exec(HTML);
// }
//
// function clean(HTML) {
// 	let r = /(<(.+)( .+=(\'|\").+\4)*>\s*<\/\2>)+|[\r\n\t]/
//
// 	while (r.test(HTML)) {
// 		let m = HTML.match(r);
// 		HTML = HTML.splice(m['index'], m[0].length);
// 	}
//
// 	return HTML.replace(/\s*/, '');
// }
//
// console.log(parse(lex('* __ Hello __ *')))
//
// /*
//
// __*BOLD & ITALIC*__
// **_BOLD & ITALIC_**
// ***BOLD & ITALIC***
// ___BOLD & ITALIC___
// */

module.exports = md => require('markdown-it')().render(md);
const md = require('markdown-it');
const Plugin = require('markdown-it-regexp');

const css = Plugin(/{(.*)}\((.*)\)/, function(match) {
	return `<span style="${match[1]}">${match[2]}</span>`
});

module.exports = code => md().use(css).render(code);
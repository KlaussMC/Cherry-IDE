const fs = require('fs');
const path = require('path');

const usr = path.join(__dirname, 'usr');
const lib = path.join(usr, 'lib');

const compiler = require('./compiler')

const http = require('http');
const server = http.createServer((req, res) => {

	let parsed = parseURL(req.url);

	if (req.method == 'GET') {
		switch (parsed.path) {
			case '/': // switch block simply defines file aliases, so what will be requested as '/' is read from 'index.html' etc.
				res.writeHead(200, {
					'Content-type': 'text/HTML'
				});
				res.write(fs.readFileSync(path.join(usr, 'index.html')))
				break;
			default:
				let output;
				try {
					output = fs.readFileSync(path.join(usr, parsed.path))
				} catch (e) {
					console.log(parsed.path);
					res.writeHead(404);
					res.write('not found');
					return;
				} finally {
					res.writeHead(200, {
						"Content-Type": getContentType(parsed.file)
					})
					res.write(fs.readFileSync(path.join(usr, parsed.path)))
				}
		}
		res.end();
	} else if (req.method == "POST") {
		req.body = [];
		req.on('data', (chunk) => {
			req.body.push(chunk);
		}).on('end', async () => {
			req.body = Buffer.concat(req.body).toString();

			try {
				switch (parsed.path) {
					case '/compile':
						res.writeHead(200, {
							'Content-type': 'text/html'
						})
						res.write(compiler(req.body));
						break;
					case '/getdir':
						res.writeHead(200, {
							'Content-type': 'application/json'
						});

						res.write(JSON.stringify(convertToJSON(decodeURI(req.body), 0)))

				}
				res.end();
			} catch (e) {
				console.error(e);
			}
		});
	}
})

let parseURL = url => {
	let tmpParams = url.split('?'),
		path = tmpParams.shift(),
		file = path.split('/').pop().toLowerCase(),
		params = {};

	tmpParams.forEach(p => {
		let s = p.split('=')
		params[s[0]] = s[1]
	})

	return {
		path,
		file,
		params
	}
}

let getContentType = function(file) {
	switch (file.split('.').pop()) {
		case 'html':
			return 'text/html';
		case 'css':
			return 'text/css';
		case 'js':
			return 'text/javascript';
		case 'json':
			return 'application/json';
		case 'svg':
			return 'image/svg+xml';
		case 'png':
			return 'image/png';
		case 'jpg':
			return 'image/mpeg';
		default:
			return 'text/plain';
	}
}

let convertToJSON = (input, depth) => {
	let output = {}
	if (depth < 10) {
		try {
			fs.readdirSync(input).forEach(item => {
				if (item != "node_modules" && item != ".git")
					output[item] = fs.lstatSync(path.join(input, item)).isDirectory() ? convertToJSON(path.join(input, item), depth + 1) : "file";
			})
		} catch (e) {
			return "Error";
		}
	} else {
		return "Too Deep";
	}

	return output;
}

module.exports = server;
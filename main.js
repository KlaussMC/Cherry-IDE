let win, loaderWin;

const server = require('./server');

const port = 1024;

const path = require('path');

server.listen(port, err => {

	console.log('listening on port ' + port);

	const {
		app,
		BrowserWindow,
		ipcMain
	} = require('electron');
	const startUrl = "http://localhost:" + String(port);

	app.on('ready', function() {
		win = new BrowserWindow({
			width: 720,
			height: 360,
			title: 'Cherry IDE',
			icon: path.join(__dirname, 'usr/res/icon.png')
			// frame: false
		});
		win.setMenu(null);

		win.loadURL(startUrl);
		win.on('closed', () => {
			win = null;
		});

		win.on('resize', e => {
			win.webContents.send('resize', win.isMaximized());
		})

		win.webContents.send('resize', win.isMaximized());
		win.webContents.openDevTools();

		win.maximize();
	});

	app.on('window-all-closed', () => {
		app.quit();
		// console.log('close')
		server.close();
	});

	app.on('activate', () => {
		if (win === null) {
			app.emit('ready');
		}
	});

	ipcMain.on("fullscreen", (e, state) => {
		win.setFullScreen(state);

		// win.webContents.send('fullscreen_status', state);
	})
})
let main = require('child_process').spawn('electron.bat') // launch cherry
main.on('exit', e => process.exit()); // exit when cherry does
main.stdout.on("data", e => console.log(e.toString())); // forward any messages from electron onto the console
main.stderr.on("data", e => console.log(e.toString())); // forward any error from electron onto the console
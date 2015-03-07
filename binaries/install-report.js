
var spawn = require('child_process').spawn;
var path = require('path');

function track(cmd) {
  spawn(process.execPath, [path.join(__dirname, 'track.js'), cmd, 'UA-51369650-5'], {
    detached: true,
    stdio: 'ignore'
  }).unref();
}

track('install');

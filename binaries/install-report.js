
var spawn = require('child_process').spawn;
var path = require('path');

function track(cmd) {
  spawn(process.execPath, [path.join(__dirname, 'track.js'), cmd], {
    detached: true,
    stdio: 'ignore'
  }).unref();
}

track('install');

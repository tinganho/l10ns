const fs = require('fs');
const path = require('path');

let hasCompiledSource = false;
try {
    fs.lstatSync(path.join(__dirname, 'Build/Source/Service/System'));
    hasCompiledSource = true;
}
catch(err) {}
if (hasCompiledSource) {
    global.L10ns = require('./Build/Source/Service/System').L10ns;
}

function setup(grunt) {
    grunt.loadTasks('Build/Tasks');
}

module.exports = setup;

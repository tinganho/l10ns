install: install_node install_jshint install_uglify

install_node:
	brew install node

install_npm:
	curl https://npmjs.org/install.sh | sudo sh

install_jshint:
	npm install jshint -g

install_uglify:
	npm install uglify-js

jshint:
	jshint src/transition-end.js

minify:
	uglifyjs src/transition-end.js --compress --mangle --output src/transition-end.min.js
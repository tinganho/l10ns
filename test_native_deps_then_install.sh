#!/usr/bin/env bash

$(command -v bundle >/dev/null 2>&1 || { echo -e >&2 '\033[31mError: ruby is needed: https://github.com/rbenv/rbenv\nInstall it then run \`npm run installdeps\`\n\033[0m'; exit 1; } )
rubyInstalled=$?
$(command -v cwebp  >/dev/null 2>&1 || { echo -e >&2 '\033[31mError: webp library is needed: https://developers.google.com/speed/webp/download\nInstall it then run \`npm run installdeps\`\n\033[0m'; exit 1; } )
webpInstalled=$?

if [ $rubyInstalled -eq 0 ] && [ $webpInstalled -eq 0 ]; then
  npm run installdeps;
fi

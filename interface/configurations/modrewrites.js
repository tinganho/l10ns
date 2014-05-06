
/**
 * @fileoverview specify modrewrites of urls. Check rules
 * and other infos at the link below.
 *
 * More info: https://github.com/tinganho/connect-modrewrite
 */

module.exports = [
  // For application cache
  '^/(yourapp.appcache)$ /$1 [L,T=text/cache-manifest]',
  // Robots.txt
  '^/robots.txt /public/robots.txt [L]'
];

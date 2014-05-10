
var findup = require('findup-sync');

module.exports.initiatedProject = function() {
  return !!findup('gt.json');
}

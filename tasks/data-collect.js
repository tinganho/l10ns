"use strict";

var path = require('path'),
  moment = require('moment');

module.exports = function (grunt) {
  grunt.registerTask('data-collect', '4. Collect all data from zdump(8) into a single json file.', function (version) {
    version = version || 'latest';

    var files = grunt.file.expand({ filter : 'isFile', cwd : 'temp/zdump/' + version }, '**/*.zdump'),
      data  = {};

    files.forEach(function (file) {
      var lines   = grunt.file.read(path.join('temp/zdump/' + version, file)).split('\n'),
        untils  = [],
        offsets = [];

      lines.forEach(function (line) {
        var parts  = line.split(/\s+/),
          format = "MMM D HH:mm:ss YYYY",
          utc    = moment.utc(parts.slice(2, 6).join(' '), format),
          local  = moment.utc(parts.slice(9, 13).join(' '), format);

        if (parts.length < 13) { return; }

        if(+utc > 0) {
          offsets.push(+utc.diff(local, 'minutes', true).toFixed(4));
          untils.push(+utc);
        }
      });

      var temporaryTypes = {};
      for(var i in offsets) {
        var key = offsets[i] + '';
        if(!(key in temporaryTypes)) {
          temporaryTypes[key] = 0;
        }
        else {
          temporaryTypes[key]++;
        }
      }

      var types = [];
      var length = Object.keys(temporaryTypes).length;
      if(length === 1) {
        for(var i = 0; i<offsets.length; i++) {
          types.push('s');
        }
      }
      else if(length === 2) {
        var type1, type2, n = 0;
        for(var type in temporaryTypes) {
          if(n === 0) {
            type1 = type;
          }
          else {
            type2 = type;
          }
          n++;
        }
        var map = {};
        if(type1 > type2) {
          map[type1] = 'd';
          map[type2] = 's';
        }
        else {
          map[type1] = 's';
          map[type2] = 'd';
        }
        for(var i = 0; i<offsets.length; i++) {
          types.push(map[offsets[i] + '']);
        }
      }
      else {
        for(var i = 0; i<offsets.length; i++) {
          types.push('g');
        }
      }
      data[file.replace(/\.zdump$/, '')] = {
        types   : types,
        untils  : untils,
        offsets : offsets
      };
    });

    grunt.file.mkdir('IANA');
    grunt.file.write('IANA/' + version + '.json', JSON.stringify(data, null, 2));

    grunt.log.ok('Collected data for ' + version);
  });
};

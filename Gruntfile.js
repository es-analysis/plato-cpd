'use strict';

var path = require('path');

module.exports = function(grunt) {
  var config = require('load-grunt-config')(grunt, {
    configPath: path.join(__dirname, '.grunt', 'config'),
    config: {
      env: process.env,
      projectRoot: __dirname
    },
    init: false
  });
  //grunt.loadTasks('.grunt/custom');
  grunt.initConfig(config);
};

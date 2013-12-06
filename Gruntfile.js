'use strict';

var path = require('path');

module.exports = function(grunt) {
  require('load-grunt-config')(grunt, {
    configPath: path.join(process.cwd(), '.grunt', 'config'),
    loadGruntTasks: {
      pattern: 'grunt-*',
      config: require('./package.json'),
      scope: 'devDependencies'
    }
  });
};

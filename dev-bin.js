'use strict';

var q = require('q'),
    reporter = require('./reporter'),
    deferred = q.defer();

reporter.setup({
  title: 'Plato Report Title',
  output: 'reports',
  files: [
    'test/fixture/a.js',
    'test/fixture/b.js',
    'test/fixture/c.js',
  ],
  reports: {}
}, deferred);

deferred.promise.then(function () {
  reporter.process({
    file : 'test/fixture/a.js',
    options : {}
  }, q.defer());

  // reporter.process({
  //   file : 'test/fixture/b.js',
  //   options : {}
  // }, q.defer());

  // reporter.process({
  //   file : 'test/fixture/c.js',
  //   options : {}
  // }, q.defer());
  reporter.aggregate({}, deferred);
});

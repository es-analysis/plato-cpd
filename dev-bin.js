'use strict';

var reporter = require('./reporter'),
    report;

reporter.setup({
  title: 'Plato Report Title',
  output: 'reports',
  files: [
    'test/fixture/a.js',
    'test/fixture/b.js',
    'test/fixture/c.js',
  ],
  reports: {}
}).then(function () {
  reporter.process({
    file : 'test/fixture/a.js',
    options : {}
  });

  reporter.process({
    file : 'test/fixture/b.js',
    options : {}
  });

  reporter.process({
    file : 'test/fixture/c.js',
    options : {}
  });

  report = reporter.aggregate({});
  console.log(report);
});

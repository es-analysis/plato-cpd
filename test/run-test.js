'use strict';

var reporter = require('../reporter');

/*
 ======== A Handy Little Nodeunit Reference ========
 https://github.com/caolan/nodeunit

 Test methods:
 test.expect(numAssertions)
 test.done()
 Test assertions:
 test.ok(value, [message])
 test.equal(actual, expected, [message])
 test.notEqual(actual, expected, [message])
 test.deepEqual(actual, expected, [message])
 test.notDeepEqual(actual, expected, [message])
 test.strictEqual(actual, expected, [message])
 test.notStrictEqual(actual, expected, [message])
 test.throws(block, [error], [message])
 test.doesNotThrow(block, [error], [message])
 test.ifError(value)
 */

exports['plato-cpd'] = {
  'test runner' : function(test) {
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
      var report = reporter.process({
        file : 'test/fixture/a.js',
        options : {}
      });
      test.ok(report.messages.length);
      test.ok(true, 'Positive test');
      test.done();
    }).fail(function () {
      test.ok(false, "Setup Failed");
      test.done();
    });
  }
};

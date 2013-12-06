'use strict';

var q = require('q');

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
  setUp: function(done) {
    done();
  },
  'test runner' : function(test) {
    test.expect(1);

    var deferred = q.defer();

    reporter.setup({}, q.defer());

    reporter.process({
      file : 'file.js',
      source : 'var a = 2; b = 3',
      options : {}
    }, deferred);

    deferred.promise.then(
      function (report) {
        test.ok(report.length);
        test.ok(true, 'Positive test');
        test.done();
      },
      function(){
        test.ok(false, 'Negative test');
        test.done();
      }
    );

  }
};


'use strict';
var _        = require('lodash'),
    q        = require('q'),
    csv      = require('../lib/csv_parser'),
    path     = require('path'),
    exec     = require('child_process').exec,
    packageConfig = require('../package'),
    pmdWarnings, reports;

_.str = require('underscore.string');
_.mixin(_.str.exports());

// `pmd` can only process a folder. We find the common root and run the analysis
// on all the files. During the processing for each file, we'll only report on
// the files we need by pulling the cpd data from the parsed csv.
exports.setup = function(config) {
  var pmdCommand,
      reportOutput = {},
      deferred = q.defer(),
      pmdDeferred = q.defer();

  reports = {
    total   : {},
    summary : {}
  };

  pmdCommand = _.sprintf(
      '%s cpd  --minimum-tokens %d --files %s --language ecmascript --format csv',
      packageConfig.pmdbin,
      config.minimumTokens || 10,
      findRootDir(config.files)
  );

  // If copies are found then the process errors, but in our case, we're
  // reporting and not failing on errors, so we ignore the `error` for now.
  exec(pmdCommand, function (error, stdout, stderr) {
    reportOutput.stdout = stdout;
    reportOutput.stderr = stderr;
    pmdDeferred.resolve(reportOutput);
  });

  pmdDeferred.promise.then(function () {
    pmdWarnings = csv.process(reportOutput.stdout);
    deferred.resolve();
  });

  return deferred.promise;
};

// Run for each file and search for it in the pmdWarnings report
exports.process = function(options) {
  var report, processFilename = options.filename, warnings = [];

  warnings = findFileInReport(pmdWarnings, processFilename);
  report = generateReport(warnings);

  reports.summary[processFilename] = {
    messages : report.messages.length
  };
  return {
    detail  : report,
    summary : {
      messages : report.messages.length
    }
  };
};

exports.teardown = function() {
  reports = undefined;
};

exports.aggregate = function() {
  return reports;
};

function findRootDir(files) {
  var rootDir = _.chain(files)
    .sortBy(function (filename) {return filename.length; })
    .first()
    .value();
  return path.dirname(rootDir);
}

function findFileInReport(warnings, filename) {
  return _.find(warnings, function (warning, warningFilename) {
    return _.str.include(warningFilename, filename);
  });
}

function generateReport(data) {
  var out = {
    messages : []
  };

  if (data && data.length) {
    data.forEach(function (result) {
      out.messages.push({
        severity : 'warning',
        line     : result.from,
        column   : 0,
        message  : result.message
      });
    });
  }

  return out;
}

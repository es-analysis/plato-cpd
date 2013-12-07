'use strict';
var _        = require('lodash'),
    q        = require('q'),
    csv      = require('./csv_parser'),
    path     = require('path'),
    exec     = require('child_process').exec,
    packageConfig = require('../package'),
    pmdWarnings, reports;

_.str = require('underscore.string');
_.mixin(_.str.exports());

// `pmd` can only process a folder. We find the common root and run the analysis
// on all the files. During the processing for each file, we'll only report on
// the files we need by pulling the cpd data from the parsed csv.
exports.setup = function(config, deferred) {
  var pmdCommand, reportOutput = {}, pmdDeferred = q.defer();

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
};

// Run for each file and search for it in the pmdWarnings report
exports.process = function(options, deferred) {
  var report, processFilename = options.file, warnings = [];
  _.each(pmdWarnings, function (warning) {
    var fileList = _.pluck(warning.files, 'filename');
    if (fileList.join(',').indexOf(processFilename)) {
      warnings.push(warning);
    }
  });

  try {
    report = generateReport(warnings);
  } catch(e) {
    deferred.reject(e);
  }

  reports.summary[options.file] = {
    messages : report.messages.length
  };

  deferred.resolve(report);
};

exports.teardown = function(config, deferred) {
  reports = undefined;
  deferred.resolve();
};

exports.aggregate = function(options, deferred) {
  deferred.resolve(reports);
};

function findRootDir(files) {
  var rootDir = _.chain(files)
    .sortBy(function (filename) {return filename.length; })
    .first()
    .value();
  return path.dirname(rootDir);
}

function generateReport(warnings) {
  var out = {
    messages : []
  };

  console.log(warnings);

  return out;
}

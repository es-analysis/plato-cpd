"use strict";

// CPD csv row output format.
// =============================================================================
//
// 0 : number lines duplicated
// 1 : number of tokens
// 2 : number of files matched
// 3 : starting at line of file [4]
// 4 : filename
// 5 : starting at line of file [6]
// 6 : filename
// repeated for subsequent files
//

var _      = require('lodash'),
    fs     = require('fs'),
    csvrow = require('csvrow');

exports.process = function (source, options, reportInfo) {
  // Lookup the current file in the cpd report
  var lines = [], matches = [],
      out = { messages : [] };

  // pluck a list of files from the csv and see if this source is in it.
  lines = fs.readFileSync(reportInfo.cpdfile).toString().split("\n");
  lines.shift();

  // Keep only the lines that include the current file, tested as a string
  matches = _.filter(lines, function (line) {
    return (line.indexOf(reportInfo.file) >= 0);
  });

  // Convert our matches to arrays by parsing csv format
  matches = _.map(matches, function (line) { return csvrow.parse(line); });

  _.each(matches, function (duplicate) {
    var from = duplicate[3],
        to   = ~~duplicate[3] + ~~duplicate[2];

    // build the display message by combining all the files

    out.messages.push({
      severity : 'error',
      line     : duplicate[3],
      column   : 0,
      message  : 'Duplicate of lines ' + from + ' - ' + to + ' in file ' + duplicate[4],
      source   : ''
    });
  });

console.log(out);

  return out;
};

exports.processOverview = function(reportCsvFile) {
  var pastes = [], paste, lines, line, i;

  // Fetch the csv file as an array and discard the header row
  lines = fs.readFileSync(reportCsvFile).toString().split("\n");
  lines.shift();

  // Process each of the pastes that were detected.
  for (i in lines) {
    line = csvrow.parse(lines[i]);

    // This is the data structure that goes to the template
    paste = {
      lines  : line[0],
      tokens : line[1],
      files  : []
    };

    // Add each file from the list of duplicates
    for (i = 3; i < 3 + (2 * line[2]); i += 2) {
      paste.files.push({
        line: line[i],
        filename: line[i+1]
      });
    }

    pastes.push(paste);
  }
  return pastes;
};

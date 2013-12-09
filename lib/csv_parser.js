"use strict";

var _      = require('lodash'),
    csvrow = require('csvrow');

_.str = require('underscore.string');
_.mixin(_.str.exports());

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

exports.process = function (csvData) {
  var lines, line, i, pmdWarnings = {},
      filename, fromLine, toLine, fileList;

  // Fetch the csv file as an array and discard the header row
  lines = csvData.split("\n");
  lines.shift();

  // Process each of the pastes that were detected, we'll store a reference for
  // each file
  for (i in lines) {
    line = csvrow.parse(lines[i]);
    fileList = [];

    // Aggregate all the filenames together for easier output
    for (i = 3; i < 3 + (2 * line[2]); i += 2) {
      fileList.push(_.sprintf(
        '%s (%s)',
        line[i+1],
        line[i]
      ));
    }

    // Add each file from the list of duplicates
    for (i = 3; i < 3 + (2 * line[2]); i += 2) {
      filename = line[i+1];
      fromLine = line[i];
      toLine   = (~~line[i] + ~~line[0]);

      // TODO: we /could/ pop the current filename out of the fileList so that
      //       it's not duplicated in the list
      pmdWarnings[filename] = pmdWarnings[filename] || [];
      pmdWarnings[filename].push({
        filename : filename,
        from     : fromLine,
        to       : toLine,
        message  : _.sprintf(
          'Duplicate of lines %s - %s in files %s',
          fromLine,
          toLine,
          fileList.join(', ')
        )
      });
    }
  }

  //console.log(pmdWarnings);

  return pmdWarnings;
};

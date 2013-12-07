"use strict";

var csvrow = require('csvrow');

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
  var paste, lines, line, i, pmdWarnings = [];

  // Fetch the csv file as an array and discard the header row
  lines = csvData.split("\n");
  lines.shift();

  // Process each of the pastes that were detected.
  for (i in lines) {
    line = csvrow.parse(lines[i]);

    // This is the data structure that goes to the template
    paste = {
      lines    : line[0],
      tokens   : line[1],
      files    : [],
      filelist : ''
    };

    // Add each file from the list of duplicates
    for (i = 3; i < 3 + (2 * line[2]); i += 2) {
      paste.files.push({
        filename : line[i+1],
        from     : line[i],
        to       : (line[i] + line[0]),
      });
      // Aggregate all the filenames together for easier output
      paste.filelist += ', ' + line[i+1];
    }

    pmdWarnings.push(paste);
  }

  return pmdWarnings;
};

var path = require('path');

module.exports = function( parsed ) {
  // Set up a property on parsed.map if it hasn't already been set.
  if ( !parsed.maps.hasOwnProperty('files') ) {
    parsed.maps.files = {
      prop: 'files',
      indexes: {},
      get: function( filename ) {
        return parsed[this.prop][this.indexes[filename]];
      }
    };
  }
  // Loop through all code files in each doc/code pair of each file.
  parsed.files.forEach(function( file, index ){
    file.forEach(function( docCodePairs ){
      docCodePairs.code.forEach(function( codeFile ){
        // Map the filename of the code to the index of this file in the
        // files array so we can retrieve the whole file by filename.
        parsed.maps.files.indexes[codeFile.filename] = index;
      });
    });
  });
  return parsed;
};

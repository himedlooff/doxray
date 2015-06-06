module.exports = function( parsed ) {
  // Create a map of filenames.
  var filemap = {};
  parsed.files.forEach(function( file, fileIndex ){
    if (file[0] && file[0].code) {
        file[0].code.forEach(function(code) {
            filemap[code.filename] = fileIndex;
        });
    }
  });
  parsed.filemap = filemap;
  // Provide a function to grab an object by filename.
  parsed.getFile = function(file) {
        var map = this.filemap[file];
        return this.files[map];
  };
  return parsed;
};

module.exports = function( parsed ) {
  // Create a map of slugs.
  var slugmap = {};
  parsed.files.forEach(function( file, fileIndex ){
    file.forEach(function( docCodePair, docCodePairIndex ){
      // Some docs are arrays and some are just objects.
      // Loop through it if it's an array.
      if ( Array.isArray( docCodePair.docs ) ) {
        docCodePair.docs.forEach(function( doc, docIndex ){
          if (doc.slug) {
            slugmap[doc.slug] = [fileIndex, docCodePairIndex, docIndex];
          }
        });
      } else {
        if (docCodePair.docs.slug) {
          slugmap[docCodePair.docs.slug] = [fileIndex, docCodePairIndex];
        }
      }
    });
  });
  parsed.slugmap = slugmap;
  // Provide a function to grab an object by filename.
  parsed.getSlug = function(slug) {
    var map = this.slugmap[slug];
    if (map && map.length === 2) {
      return this.files[map[0]][map[1]].docs;
    } else if (map && map.length === 3) {
      return this.files[map[0]][map[1]].docs[map[2]];
    }
    return undefined;
  };
  return parsed;
};

module.exports = function( parsed ) {
  var slugify = function(text) {
    return text
      .toLowerCase()
      .replace(/ /g,'-')
      .replace(/[^\w-]+/g,'');
  };
  // Set up a property on parsed.map if it hasn't already been set.
  if ( !parsed.maps.hasOwnProperty('slugs') ) {
    parsed.maps.slugs = {
      prop: 'slugs',
      indexes: {},
      get: function( slug, parsed ) {
        var indexPath = parsed.maps[this.prop].indexes[slug];
        var returnDoc;
        if ( indexPath && indexPath.length === 2 ) {
          returnDoc = parsed.files[indexPath[0]][indexPath[1]];
        } else if ( indexPath && indexPath.length === 3 ) {
          returnDoc = parsed.files[indexPath[0]][indexPath[1]].docs[indexPath[2]];
        }
        return returnDoc;
      }
    };
  }
  // Loop through all code files in each doc/code pair of each file.
  parsed.files.forEach(function( file, fileIndex ){
    var currentHeader = '';
    file.forEach(function( docCodePair, docCodePairIndex ){
      // Some docs are arrays of docs, some are just doc objects.
      // If it's an array of docs, loop through it.
      if ( Array.isArray( docCodePair.docs ) ) {
        docCodePair.docs.forEach(function( doc, docIndex ){
          doc.slug = slugify( doc.label );
          // If there is a header property prepend it to the slug. This is an
          // effort to make slugs mor unique.
          if ( doc.header ) {
            currentHeader = doc.slug;
          } else if ( currentHeader !== '' ) {
            doc.slug = currentHeader + '-' + doc.slug;
          }
          // Save the indexes needed to get to this slug.
          parsed.maps.slugs.indexes[ doc.slug ] = [ fileIndex, docCodePairIndex, docIndex ];
        });
      } else {
        docCodePair.docs.slug = slugify( docCodePair.docs.label );
        // Save the indexes needed to get to this slug.
        parsed.maps.slugs.indexes[ docCodePair.docs.slug ] = [ fileIndex, docCodePairIndex ];
      }
    });
  });
  return parsed;
};

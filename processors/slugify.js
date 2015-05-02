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
        return parsed[this.prop][this.indexes[slug]];
      }
    };
  }
  // Loop through all code files in each doc/code pair of each file.
  parsed.files.forEach(function( file, index ){
    var currentHeader = '';
    file.forEach(function( docCodePair ){
      if ( Array.isArray( docCodePair.docs ) ) {
        docCodePair.docs.forEach(function( doc ){
          // Map the filename of the code to the index of this file in the
          // files array so we can retrieve the whole file by filename.
          doc.slug = slugify(doc.label);
          if ( doc.header ) {
            currentHeader = doc.slug;
          } else if ( currentHeader !== '' ) {
            doc.slug = currentHeader + '-' + doc.slug;
          }
          // parsed.maps.slugs.indexes[doc.label] = index;
        });
      } else {
        docCodePair.docs.slug = slugify(docCodePair.docs.label);
      }
    });
  });
  return parsed;
};

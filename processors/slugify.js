module.exports = function( parsed ) {
  var slugify = function(text) {
    return text
      .toLowerCase()
      .replace(/ /g,'-')
      .replace(/[^\w-]+/g,'');
  };
  // Use the label property of each doc/code pair to create a slug.
  parsed.files.forEach(function( file ){
    var currentHeader = '';
    file.forEach(function( docCodePair ){
      // Some docs are arrays and some are just objects.
      // Loop through it if it's an array.
      if ( Array.isArray( docCodePair.docs ) ) {
        docCodePair.docs.forEach(function( doc ){
          if ( doc.label ) {
            doc.slug = slugify( doc.label );
          }
        });
      } else {
        if ( docCodePair.docs.label ) {
          docCodePair.docs.slug = slugify( docCodePair.docs.label );
        }
      }
    });
  });
  return parsed;
};

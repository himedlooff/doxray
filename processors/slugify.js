module.exports = function( doxrayObject ) {

  // Use the label property of each pattern to create a slug property.
  doxrayObject.patterns.forEach(function( pattern ){
    if ( pattern.label ) {
      pattern.slug = pattern.label
        .toLowerCase()
        .replace( / /g, '-' )
        .replace( /[^\w-]+/g, '' );
    }
  });

  // Always return doxrayObject.
  return doxrayObject;

};

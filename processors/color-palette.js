module.exports = function( doxrayObject ) {

  doxrayObject.patterns.forEach(function( pattern ){
    // Check to see if we have everything that we need.
    if ( typeof pattern.colorPalette === 'undefined' ) return;
    if ( typeof pattern[ pattern.colorPalette ] === 'undefined' ) return;
    // Grab the code from file type specified in the colorPalette property.
    var palette = [];
    var code = pattern[ pattern.colorPalette ];
    // Cleans up the code string and splits it on semicolons placing each
    // property/value pair in an array that can be looped through.
    code = code
      .replace( /(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '' )
      .replace( / +?/gm, '' )
      .replace( /(\r\n|\n|\r)/gm, '' )
      .split(';');
    code.forEach(function( keyValPair ) {
      var keyValPairAsArray = keyValPair.split(':');
      if ( keyValPairAsArray.length !== 2 ) return;
      var key = keyValPairAsArray[ 0 ];
      var val = keyValPairAsArray[ 1 ];
      // Ignore values that are Less or SASS variables.
      if ( val.charAt( 0 ) === '@' || val.charAt( 0 ) === '$' ) return;
      palette.push({
        variable: key,
        value: val
      });
    });
    pattern.colorPalette = palette;
  });

  // Always return doxrayObject.
  return doxrayObject;

};

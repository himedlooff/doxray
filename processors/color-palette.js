module.exports = function( parsed ) {
  function makeColorPalette( docCodePair, docObject ) {
    var results = docCodePair.code.filter(function( oneCodeFile ) {
      // Only return a code file if it matches the file type specified in the
      // colorPalette property.
      return oneCodeFile.type === ('.' + docObject.colorPalette);
    });
    var palette = [];
    if ( results.length ) {
      code = results[ 0 ].code
        .replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '')
        .replace(/ +?/gm, '')
        .replace(/(\r\n|\n|\r)/gm, '')
        .split(';');
      for ( k = 0; k < code.length; k++ ) {
        var ruleAsArray = code[ k ].split(':');
        if ( ruleAsArray.length === 2 ) {
          var key = ruleAsArray[ 0 ];
          var val = ruleAsArray[ 1 ];
          if ( val.charAt( 0 ) === '#' ) {
            palette.push({
              variable: key,
              hex: val
            });
          }
        }
      }
      docObject.colorPalette = palette;
    }
  }
  parsed.files.forEach(function( file, fileIndex ){
    file.forEach(function( docCodePair, docCodePairIndex ){
      // Some docs are arrays of docs, some are just doc objects.
      // If it's an array of docs, loop through it.
      if ( Array.isArray( docCodePair.docs ) ) {
        docCodePair.docs.forEach(function( doc, docIndex ){
          if ( docCodePair.docs[ docIndex ].colorPalette ) {
            makeColorPalette( docCodePair, doc );
          }
        });
      } else {
        if ( docCodePair.docs.colorPalette ) {
          var palette = [];
          makeColorPalette( docCodePair, docCodePair.docs );
        }
      }
    });
  });
  return parsed;
};

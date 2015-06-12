module.exports = function( doxrayObject ) {

  doxrayObject.patterns.forEach(function( pattern ){
    // Check to see if we have everything that we need.
    if ( typeof pattern.colorPalette === 'undefined' ) return;
    if ( typeof pattern[ pattern.colorPalette ] === 'undefined' ) return;

    // Grab the code from file type specified in the colorPalette property.
    var palette = [];
    var code = pattern[ pattern.colorPalette ];
    code = code
      .replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '')
      .replace(/ +?/gm, '')
      .replace(/(\r\n|\n|\r)/gm, '')
      .split(';');
    for ( var i = 0; i < code.length; i++ ) {
      var ruleAsArray = code[ i ].split(':');
      if ( ruleAsArray.length === 2 ) {
        var key = ruleAsArray[ 0 ];
        var val = ruleAsArray[ 1 ];
        // Ignore Less or SASS variables.
        if ( val.charAt( 0 ) === '@' || val.charAt( 0 ) === '$' ) return;
        palette.push({
          variable: key,
          value: val
        });
      }
    }
    pattern.colorPalette = palette;
  });

  // Always return doxrayObject.
  return doxrayObject;

};

/* ==========================================================================
   Dox-ray utility methods
   ========================================================================== */

var utils = {};

utils.handleSrc = function( src ) {
  var glob = require("glob");
  var fileToTest;
  if ( typeof src === 'string' ) {
    src = glob.sync( src );
  }
  return src;
};

utils.handleOptions = function( options ) {
  if ( typeof options !== 'object' ) {
    options = {};
  }
  options.jsFile = options.jsFile;
  options.jsonFile = options.jsonFile;
  if ( typeof options.merge === 'undefined' ) {
    options.merge = true;
  }
  return options;
};

// The following function was referenced from:
// https://gist.github.com/cowboy/3749767
utils.stringify = function( obj, prop, whiteSpace ) {
  var placeholder = '____PLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify( obj, function( key, value ) {
    if ( typeof value === 'function' ) {
      fns.push( value );
      return placeholder;
    }
    return value;
  }, whiteSpace);
  json = json.replace( new RegExp( '"' + placeholder + '"', 'g' ), function(_) {
    return fns.shift();
  });
  return 'var ' + prop + ' = ' + json + ';';
};

module.exports = utils;

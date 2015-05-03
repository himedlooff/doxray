/* ==========================================================================
   Dox-ray
   Parse documentation from code comments
   ========================================================================== */

var Doxray = require('./doxray');

function doxray( src, options ) {
  var doxrayInstance = new Doxray();
  return doxrayInstance.run( src, options );
}

module.exports = doxray;

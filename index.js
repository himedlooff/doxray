/* ==========================================================================
   Dox-ray
   Parse documentation from code comments
   ========================================================================== */

var Doxray = require('./doxray');

function doxray( src, options, callback ) {
  var doxrayInstance = new Doxray();
  return doxrayInstance.run( src, options, callback );
}

module.exports = doxray;

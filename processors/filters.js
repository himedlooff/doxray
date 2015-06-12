module.exports = function( doxrayObject ) {

  // Returns an array of patterns with the presence of a specific property,
  // when passed a single argument.
  // Returns an array of patterns with the specific property matching a
  // specific value, when passed two arguments.
  doxrayObject.getByProperty = function( property, value ) {
    return this.patterns.filter(
      this.utils.hasProperty( property, value )
    );
  };

  doxrayObject.utils = {};

  // A function that can be passed to Array.prototype.filter().
  doxrayObject.utils.hasProperty = function( property, value ) {
    return function( pattern ) {
      if ( typeof value === 'undefined' ) {
        return pattern[ property ];
      } else {
        return pattern[ property ] && pattern[ property ].toLowerCase() === value.toLowerCase();
      }
    }
  }

  // Always return doxrayObject.
  return doxrayObject;

};

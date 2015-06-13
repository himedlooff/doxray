var Doxray = {
  "patterns": [
    {
      "prop1": "Comment one",
      "css": "",
      "filename": "test.css"
    }
  ],
  "getByProperty": function ( property, value ) {
    return this.patterns.filter(
      this.utils.hasProperty( property, value )
    );
  },
  "utils": {
    "hasProperty": function ( property, value ) {
    return function( pattern ) {
      if ( typeof value === 'undefined' ) {
        return pattern[ property ];
      } else {
        return pattern[ property ] && pattern[ property ].toLowerCase() === value.toLowerCase();
      }
    }
  }
  }
};
/* ==========================================================================
   Doxray
   Parse documentation from code comments
   ========================================================================== */

var Doxray = function() {};

/* ==========================================================================
   Properties
   ========================================================================== */

Doxray.prototype.regex = {
  html: {
    opening: /<!--\s*doxray[^\n]*\n/m,
    closing: /-->/,
    comment: /<!--\s*doxray(?:[^-]|[\r\n]|-[^-]|--[^>])*-->/gm,
    ignore: /<!--\s*ignore-doxray[\s\S]*/gm
  },
  css: {
    opening: /\/\*\s*doxray[^\n]*\n/m,
    closing: /\*\//,
    comment: /\/\*\s*doxray[^*]*\*+(?:[^/*][^*]*\*+)*\//gm,
    ignore: /\/\*\s*ignore-doxray[\s\S]*/gm
  }
};

Doxray.prototype.processors = [
  require('./processors/filters.js'),
  require('./processors/slugify.js'),
  require('./processors/color-palette.js')
];

Doxray.prototype.jsonWhiteSpace = 2;

Doxray.prototype.logging = false;

Doxray.prototype.logMessages = {
  noDoxrayCommentsFound: 'Doxray did not find any Doxray comments in this file.'
}

/* ==========================================================================
   Methods
   ========================================================================== */

Doxray.prototype.run = function( src, options, callback ) {
  var parsed;
  src = require('./utils.js').handleSrc( src );
  options = require('./utils.js').handleOptions( options );
  parsed = this.parse( src, options );
  if ( options.processors ) {
    parsed = this.postParseProcessing( parsed, options.processors );
  }
  if ( options.jsonFile ) {
    this.writeJSON( parsed, options.jsonFile, callback );
  }
  if ( options.jsFile ) {
    this.writeJS( parsed, options.jsFile, callback );
  }
  return parsed;
};

Doxray.prototype.parse = function( src, options ) {
  var parsed = [];
  src.forEach(function( singleSrc ) {
    var fileContents, docs, code, convertedDocs, ext, regex;
    // Get the file extension for src so we know which regex to use.
    ext = require('./utils.js').getCommentType( singleSrc );
    // get the regex for that extension, or fallback to CSS regex.
    regex = options.regex[ ext ] || options.regex.css;
    fileContents = require('./utils.js').getFileContents( singleSrc, regex );
    docs = require('./utils.js').parseOutDocs( fileContents, regex );
    code = require('./utils.js').parseOutCode( fileContents, regex );
    if ( docs.length === 0 ) {
      convertedDocs = [];
    } else {
      // Join the docs and code back together as structured objects.
      convertedDocs = require('./utils.js').joinDocsAndCode( docs, code, singleSrc );
    }
    parsed = parsed.concat( convertedDocs );
  }, this);
  return parsed;
};

Doxray.prototype.postParseProcessing = function( parsed, processors ) {
  var processedDocs = {
      patterns: parsed
  };
  processors.forEach(function( processor ){
    processedDocs = processor( processedDocs );
  });
  return processedDocs;
};

Doxray.prototype.writeJSON = function( convertedDocs, dest, callback ) {
  var fs = require('fs');
  var convertedDocsAsString = JSON.stringify( convertedDocs.patterns, null, this.jsonWhiteSpace );
  fs.writeFile( dest, convertedDocsAsString, function( err ) {
    if ( err ) {
      throw err;
    }
    if ( this.logging ) console.log( dest, 'was created.' );
    if ( typeof callback === 'undefined' ) return;
    callback( convertedDocs );
  }.bind( this ));
};

Doxray.prototype.writeJS = function( convertedDocs, dest, callback ) {
  var fs = require('fs');
  var stringify = require('./utils.js').stringify;
  var convertedDocsAsString = stringify( convertedDocs, 'Doxray', this.jsonWhiteSpace );
  fs.writeFile( dest, convertedDocsAsString, 'utf-8', function( err ) {
    if ( err ) {
      throw err;
    }
    if ( this.logging ) console.log( dest, 'was created.' );
    if ( typeof callback === 'undefined' ) return;
    callback( convertedDocs );
  }.bind( this ));
};

module.exports = Doxray;

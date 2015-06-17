/* ==========================================================================
   Dox-ray
   Parse documentation from code comments
   ========================================================================== */

var Doxray = function() {};

/* ==========================================================================
   Properties
   ========================================================================== */

Doxray.prototype.regex = {
  html: {
    opening: /^<!--\s*doxray[^\n]*\n/m,
    closing: /-->/,
    comment: /^<!--\s*doxray(?:[^-]|[\r\n]|-[^-])*-->/gm
  },
  css: {
    opening: /^\/\*\s*doxray[^\n]*\n/m,
    closing: /\*\//,
    comment: /^\/\*\s*doxray[^*]*\*+(?:[^/*][^*]*\*+)*\//gm
  }
};

Doxray.prototype.processors = [
  require('./processors/filters.js'),
  require('./processors/slugify.js'),
  require('./processors/color-palette.js')
];

Doxray.prototype.jsonWhiteSpace = 2;

Doxray.prototype.logMessages = {
  wrongType: 'Doxray expected a String or an Array as the first argument.',
  noDoxrayCommentsFound: 'Doxray did not find any Doxray comments in this file.'
}

/* ==========================================================================
   Methods
   ========================================================================== */

Doxray.prototype.run = function( src, options, callback ) {
  var parsed, processed;
  src = require('./utils.js').handleSrc( src );
  options = require('./utils.js').handleOptions( options );
  parsed = this.parse( src, options.merge );
  processed = this.postParseProcessing( parsed );
  if ( options.jsonFile ) {
    this.writeJSON( processed, options.jsonFile, callback );
  }
  if ( options.jsFile ) {
    this.writeJS( processed, options.jsFile, callback );
  }
  return processed;
};

Doxray.prototype.writeJSON = function( convertedDocs, dest, callback ) {
  var fs = require('fs');
  var convertedDocsAsString = JSON.stringify( convertedDocs.patterns, null, this.jsonWhiteSpace );
  fs.writeFile( dest, convertedDocsAsString, function( err ) {
    if ( err ) {
      throw err;
    }
    console.log( dest, 'was created.' );
    if ( typeof callback === 'undefined' ) return;
    callback();
  });
};

Doxray.prototype.writeJS = function( convertedDocs, dest, callback ) {
  var fs = require('fs');
  var stringify = require('./utils.js').stringify;
  var convertedDocsAsString = stringify( convertedDocs, 'Doxray', this.jsonWhiteSpace );
  fs.writeFile( dest, convertedDocsAsString, 'utf-8', function( err ) {
    if ( err ) {
      throw err;
    }
    console.log( dest, 'was created.' );
    if ( typeof callback === 'undefined' ) return;
    callback();
  });
};

Doxray.prototype.postParseProcessing = function( parsed ) {
  var processedDocs = {
      patterns: parsed
  };
  if ( typeof this.processors !== 'undefined' ) {
    this.processors.forEach(function( processor ){
      processedDocs = processor( processedDocs );
    });
  }
  return processedDocs;
};

Doxray.prototype.parse = function( src, merge ) {
  var parsed = [];
  // For consistency let's always use an Array, even if the user passed
  // a string.
  if ( typeof src == 'string' ) {
    src = [ src ];
  }
  if ( Array.isArray( src ) ) {
    src.forEach(function( singleSrc ) {
      parsed = parsed.concat( this.parseOneFile( singleSrc ) );
    }, this);
    // Removing the merge option for now for simplicity.
    // if ( typeof merge === 'undefined' || merge === true ) {
    //   parsed = [ this.mergeParsedSources( parsed ) ];
    // }
  } else {
    throw new Error( this.logMessages.wrongType );
  }
  return parsed;
};

Doxray.prototype.parseOneFile = function( src ) {
  var fileContents, docs, code, convertedDocs, ext;
  // Get the file extension for src so we know which regex to use.
  ext = require('./utils.js').getCommentType( src );
  fileContents = require('./utils.js').getFileContents( src, this.regex[ ext ] );
  docs = require('./utils.js').parseOutDocs( fileContents, this.regex[ ext ] );
  code = require('./utils.js').parseOutCode( fileContents, this.regex[ ext ] );
  if ( docs.length === 0 ) {
    convertedDocs = [];
  } else {
    // Join the docs and code back together as structured objects.
    convertedDocs = require('./utils.js').joinDocsAndCode( docs, code, src );
  }
  return convertedDocs;
};

module.exports = Doxray;

// Doxray.prototype.mergeParsedSources = function( sources ) {
//   var equal, first, theRest, nonMatches;
//   equal = require('deep-equal');
//   // The first parsed source will be our "master" source.
//   first = sources[ 0 ];
//   // The rest of the sources are saved to their own array.
//   theRest = sources.slice( 1 );
//   // We'll need this later for doc sets that don't match anything.
//   uniqueSets = [];
//   // Compare each doc set from the master source to the doc sets of the rest of
//   // the sources. If both sets of docs are exactly the same then merge them
//   // together. "Merging" is done by taking the code from the second doc set and
//   // adding to the code array of the master doc set.
//   theRest.forEach( function( src ) {
//     src.forEach( function( secondDocSet ) {
//       var matchesSomethingInFirst = false;
//       first.forEach( function( firstDocSet ) {
//         if ( equal( firstDocSet.docs, secondDocSet.docs ) ) {
//           // If this doc set has docs that match another doc sets docs,
//           // then take only its code and move it to the matching set.
//           firstDocSet.code = firstDocSet.code.concat( secondDocSet.code );
//           matchesSomethingInFirst = true;
//         }
//       }, this );
//       if ( matchesSomethingInFirst === false ) {
//         // If this doc set has docs that do not match any other doc sets docs,
//         // then move this whole doc set into uniqueSets. uniqueSets will be
//         // added to first after we finish looping through it.
//         uniqueSets.push( secondDocSet );
//       }
//     }, this );
//   }, this );
//   // Add all the unique doc sets that couldn't get merged.
//   first = first.concat( uniqueSets );
//   return first;
// };

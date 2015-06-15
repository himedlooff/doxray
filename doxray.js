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
  ext = this.getCommentType( src );
  fileContents = this.getFileContents( src, this.regex[ ext ] );
  docs = this.parseOutDocs( fileContents, this.regex[ ext ] );
  code = this.parseOutCode( fileContents, this.regex[ ext ] );
  if ( docs.length === 0 ) {
    convertedDocs = [];
  } else {
    // Join the docs and code back together as structured objects.
    convertedDocs = this.joinDocsAndCode( docs, code, src );
  }
  return convertedDocs;
};

Doxray.prototype.joinDocsAndCode = function( docs, code, src ) {
  var path, convertedDocs;
  path = require('path');
  patterns = [];
  docs.forEach(function( doc, docIndex ) {
    // For each item in docs add its corresponding code item using the code
    // filetype as the key.
    doc[ path.extname(src).replace('.', '') ] = code[ docIndex ];
    // Also add the filename.
    doc.filename = path.basename( src );
    patterns.push( doc );
  });
  return patterns;
};

Doxray.prototype.parseOutCode = function( fileContents, regex ) {
  var code;
  // The "code" is everything betwixt the regex.
  code = fileContents.split( regex.comment );
  // Removes the first item in the array since it will always be empty.
  code.shift();
  // Clean each item in the array.
  code.forEach(function( item, index ){
    code[ index ] = code[ index ].trim();
  });
  return code;
};

Doxray.prototype.parseOutDocs = function( fileContents, regex ) {
  var docs;
  // "docs" are anything that matches the regex.
  docs = fileContents.match( regex.comment );
  if ( !docs ) {
    return [];
  }
  docs.forEach(function( item, index ){
    // Grab the doc text from the comments.
    docs[ index ] = this.removeDoxrayCommentTokens( item, regex );
    // Conver it from YAML into a JavaScript object.
    docs[ index ] = this.convertYaml( docs[ index ], index );
  }, this );
  return docs;
};

Doxray.prototype.convertYaml = function( yamlString, index ) {
  var yaml, convertedYaml, yamlError;
  yaml = require('js-yaml');
  // Try converting the doc to YAML and warn if it fails.
  try {
    convertedYaml = yaml.safeLoad( yamlString );
  } catch ( err ) {
    yamlError = 'Error converting comment # to YAML. Please check for formatting errors.';
    if ( index !== undefined ) {
      yamlError = yamlError.replace( '#', '#' + (index+1) );
    } else {
      yamlError = yamlError.replace( '# ', '' );
    }
    throw new Error( yamlError );
  }
  return convertedYaml;
};

Doxray.prototype.removeDoxrayCommentTokens = function( item, regex ) {
  // Remove the opening and closing comments.
  return item.replace( regex.opening, '' ).replace( regex.closing, '' );
};

Doxray.prototype.getFileContents = function( src, regex ) {
  var fs, data;
  fs = require('fs');
  data = fs.readFileSync( src, 'utf-8' );
  // Trim everything before the first regex because it's not associated with
  // any comment.
  data = data.slice( data.search( regex.comment ) );
  return data;
};

Doxray.prototype.getCommentType = function( src ) {
  var path = require('path');
  var ext = path.extname( src ).substring( 1 );
  switch ( ext ) {
    case 'css':
    case 'less':
      ext = 'css';
      break;
    case 'html':
      ext = 'html';
      break;
    default:
      ext = 'css';
  }
  return ext;
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

/* ==========================================================================
   Dox-ray
   Parse documentation from code comments
   ========================================================================== */

var Doxray = function() {};

Doxray.prototype.run = function( src, options ) {
  var parsed, processed;
  src = this.handleSrc( src );
  options = this.handleOptions( options );
  parsed = this.parse( src, options.merge );
  processed = this.postParseProcessing( parsed );
  if ( options.jsonFile ) {
    this.writeJSON( processed, options.jsonFile );
  }
  if ( options.jsFile ) {
    this.writeJS( processed, options.jsFile );
  }
  return processed;
};

Doxray.prototype.handleSrc = function( src ) {
  var glob = require("glob");
  var fileToTest;
  if ( typeof src === 'string' ) {
    src = glob.sync( src );
  }
  return src;
};

Doxray.prototype.handleOptions = function( options ) {
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

Doxray.prototype.jsonWhiteSpace = 2;

// The following function was referenced from:
// https://gist.github.com/cowboy/3749767
Doxray.prototype.stringify = function( obj, prop ) {
  var placeholder = '____PLACEHOLDER____';
  var fns = [];
  var json = JSON.stringify( obj, function( key, value ) {
    if ( typeof value === 'function' ) {
      fns.push( value );
      return placeholder;
    }
    return value;
  }, this.jsonWhiteSpace);
  json = json.replace( new RegExp( '"' + placeholder + '"', 'g' ), function(_) {
    return fns.shift();
  });
  return 'var ' + prop + ' = ' + json + ';';
};

Doxray.prototype.writeJS = function( convertedDocs, dest ) {
  var fs = require('fs');
  var convertedDocsAsString = this.stringify( convertedDocs, 'Doxray' );
  fs.writeFile( dest, convertedDocsAsString, 'utf-8', function( err ) {
    if ( err ) {
      throw err;
      // TODO: A node.js equivalent to Grunts this.async( err );
    }
    console.log( dest, 'was created.' );
    // TODO: A node.js equivalent to Grunts this.async();
  });
};

Doxray.prototype.writeJSON = function( convertedDocs, dest ) {
  var fs = require('fs');
  var convertedDocsAsString = JSON.stringify( convertedDocs, null, this.jsonWhiteSpace );
  fs.writeFile( dest, convertedDocsAsString, function( err ) {
    if ( err ) {
      throw err;
      // TODO: A node.js equivalent to Grunts this.async( err );
    }
    console.log( dest, 'was created.' );
    // TODO: A node.js equivalent to Grunts this.async();
  });
};

Doxray.prototype.processors = [
  require('./processors/filemap.js'),
  require('./processors/slugify.js'),
  require('./processors/slugmap.js'),
  require('./processors/color-palette.js')
];

Doxray.prototype.postParseProcessing = function( parsed ) {
  var processedDocs = {
      files: parsed
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
  if ( typeof src == 'string' ) {
    parsed.push( this.parseOneFile( src ) );
  } else if ( Array.isArray( src ) ) {
    src.forEach(function( singleSrc ) {
      parsed.push( this.parseOneFile( singleSrc ) );
    }, this);
    if ( typeof merge === 'undefined' || merge === true ) {
      parsed = [ this.mergeParsedSources( parsed ) ];
    }
  } else {
    throw new Error('parse() expected a String or Array.');
  }
  return parsed;
};

Doxray.prototype.mergeParsedSources = function( sources ) {
  var equal, first, theRest, nonMatches;
  equal = require('deep-equal');
  // The first parsed source will be our "master" source.
  first = sources[ 0 ];
  // The rest of the sources are saved to their own array.
  theRest = sources.slice( 1 );
  // We'll need this later for doc sets that don't match anything.
  uniqueSets = [];
  // Compare each doc set from the master source to the doc sets of the rest of
  // the sources. If both sets of docs are exactly the same then merge them
  // together. "Merging" is done by taking the code from the second doc set and
  // adding to the code array of the master doc set.
  theRest.forEach( function( src ) {
    src.forEach( function( secondDocSet ) {
      var matchesSomethingInFirst = false;
      first.forEach( function( firstDocSet ) {
        if ( equal( firstDocSet.docs, secondDocSet.docs ) ) {
          // If this doc set has docs that match another doc sets docs,
          // then take only its code and move it to the matching set.
          firstDocSet.code = firstDocSet.code.concat( secondDocSet.code );
          matchesSomethingInFirst = true;
        }
      }, this );
      if ( matchesSomethingInFirst === false ) {
        // If this doc set has docs that do not match any other doc sets docs,
        // then move this whole doc set into uniqueSets. uniqueSets will be
        // added to first after we finish looping through it.
        uniqueSets.push( secondDocSet );
      }
    }, this );
  }, this );
  // Add all the unique doc sets that couldn't get merged.
  first = first.concat( uniqueSets );
  return first;
};

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

Doxray.prototype.parseOneFile = function( src ) {
  var fileContents, docs, code, convertedDocs, ext;
  // Get the file extension for src so we know which regex to use.
  ext = this.getCommentType( src );
  fileContents = this.getFileContents( src, this.regex[ ext ] );
  docs = this.parseOutDocs( fileContents, this.regex[ ext ] );
  code = this.parseOutCode( fileContents, this.regex[ ext ] );
  if ( this.parsingIsValid( docs, code ) ) {
    // Join the docs and code back together as structured objects.
    convertedDocs = this.joinDocsAndCode( docs, code, src );
  }
  return convertedDocs;
};

Doxray.prototype.joinDocsAndCode = function( docs, code, src ) {
  var path, convertedDocs;
  path = require('path');
  convertedDocs = [];
  // Create an array of objects. Each object contains a docs and code property
  // which represent the parsed doc comment object and the code that follows it
  // in the source.
  docs.forEach(function( item, index ) {
    convertedDocs.push({
      docs: docs[ index ],
      code: [{
        filename: path.basename( src ),
        type: path.extname( src ),
        code: code[ index ]
      }]
    });
  });
  return convertedDocs;
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
  docs.forEach(function( item, index ){
    // Grab the doc text from the comments.
    docs[ index ] = this.getTextFromDocComment( item, regex );
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
    // TODO: A node.js equivalent to Grunts this.async();
    throw new Error( yamlError );
  }
  return convertedYaml;
};

Doxray.prototype.parsingIsValid = function( docs, code ) {
  // For each doc comment ther should be one correcsponding code snippet.
  // This checks to make sure the doc and code arrays have the same length.
  if ( docs.length !== code.length ) {
    // TODO: A node.js equivalent to Grunts this.async();
    throw new Error('Parsing failed because the number of parsed doc comments does not match the number of parsed code snippets.');
  } else {
    return true;
  }
};

Doxray.prototype.getTextFromDocComment = function( item, regex ) {
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
  var ext;
  ext = path.extname( src ).substring( 1 );
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

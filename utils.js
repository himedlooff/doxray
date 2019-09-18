/* ==========================================================================
   Doxray utility methods
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
  return {
    jsFile: options.jsFile,
    jsonFile: options.jsonFile,
    processors: options.processors || require('./doxray.js').prototype.processors,
    regex: options.regex || require('./doxray.js').prototype.regex
  };
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

utils.parseOutDocs = function( fileContents, regex ) {
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

utils.joinDocsAndCode = function( docs, code, src ) {
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

utils.parseOutCode = function( fileContents, regex ) {
  var code;
  // The "code" is everything betwixt the regex.
  code = fileContents.split( regex.comment );
  // Removes the first item in the array since it will always be empty.
  code.shift();
  // Clean each item in the array.
  code = code.map((item) => item.replace(regex.ignore, '').trim());
  return code;
};

utils.removeDoxrayCommentTokens = function( item, regex ) {
  // Remove the opening and closing comments.
  return item.replace( regex.opening, '' ).replace( regex.closing, '' );
};

utils.getFileContents = function( src, regex ) {
  var fs, data;
  fs = require('fs');
  data = fs.readFileSync( src, 'utf-8' );
  // Trim everything before the first regex because it's not associated with
  // any comment.
  data = data.slice( data.search( regex.comment ) );
  return data;
};

utils.getCommentType = function( src ) {
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

utils.convertYaml = function( yamlString, index ) {
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

module.exports = utils;

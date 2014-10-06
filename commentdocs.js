/* ==========================================================================
   Parse documentation from code comments.
   ========================================================================== */

var CommentDocs = function( src, dest ) {
  try {
    CommentDocs.prototype.verifyArgs( src, dest );
  } catch ( err ) {
    console.error( err );
    return;
  }
  CommentDocs.prototype.parseSourceFile( src );
};

CommentDocs.regex = {
  html: {
    opening: /<!--\s*topdoc[^\n]*\n/,
    closing: /-->/,
    comment: /<!--\s*topdoc(?:[^-]|[\r\n]|-[^-])*-->/g
  },
  css: {
    opening: /\/\*\s*topdoc[^\n]*\n/,
    closing: /\*\//,
    comment: /\/\*\s*topdoc[^*]*\*+(?:[^/*][^*]*\*+)*\//g
  }
};

CommentDocs.prototype.parseSourceFile = function( src ) {
  var data, docs, code, convertedDocs, ext;
  // Get the file extension for src so we know which regex to use.
  ext = CommentDocs.prototype.getCommentType( src );
  fileContents = CommentDocs.prototype.getFileContents( src, CommentDocs.regex[ ext ] );
  docs = CommentDocs.prototype.parseOutDocs( fileContents, CommentDocs.regex[ ext ] );
  code = CommentDocs.prototype.parseOutCode( fileContents, CommentDocs.regex[ ext ] );
  console.log( code );
  return code;
  // // Validate the parsing before
  // if ( parsingIsValid(docs, code) ) {
  //   grunt.log.ok('Parsing was successful.');
  //   grunt.verbose.writeln( 'docs:\n', docs );
  //   grunt.verbose.writeln( 'code:\n', code );

  //   // Join the docs and code back together as structured objects.
  //   convertedDocs = joinDocsAndCode( docs, code );
  // }
  // return convertedDocs;
};

CommentDocs.prototype.parseOutCode = function( fileContents, regex ) {
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

CommentDocs.prototype.parseOutDocs = function( fileContents, regex ) {
  var docs;
  // "docs" are anything that matches the regex.
  docs = fileContents.match( regex.comment );
  // Grab the doc text from the comments.
  docs.forEach(function( item, index ){
    docs[ index ] = CommentDocs.prototype.getTextFromDocComment( item, regex );
  });
  return docs;
};

CommentDocs.prototype.parsingIsValid = function( docs, code ) {
  // For each doc comment ther should be one correcsponding code snippet.
  // This checks to make sure the doc and code arrays have the same length.
  if ( docs.length !== code.length ) {
    throw new Error('Parsing failed because the number of parsed doc comments does not match the number of parsed code snippets.');
    // TODO: A node.js equivalent to Grunts this.async();
    return false;
  } else {
    return true;
  }
};

CommentDocs.prototype.getTextFromDocComment = function( item, regex ) {
  // Remove the opening and closing comments.
  return item.replace( regex.opening, '' ).replace( regex.closing, '' );
};

CommentDocs.prototype.getFileContents = function( src, regex ) {
  var fs, data;
  fs = require('fs-extra');
  data = fs.readFileSync( src, 'utf-8' );
  // Trim everything before the first regex because it's not associated with
  // any comment.
  data = data.slice( data.search( regex.comment ) );
  return data;
};

CommentDocs.prototype.getCommentType = function( src ) {
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

CommentDocs.prototype.verifyArgs = function( src, dest ) {
  if ( src === undefined || dest === undefined ) {
    throw new Error('The src and dest arguments are required.');
  }
};

module.exports = CommentDocs;

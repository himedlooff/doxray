var should = require('chai').should(),
  assert = require('chai').assert,
  CommentDocs = require('../commentdocs'),
  verifySrcArg = CommentDocs.prototype.verifySrcArg,
  getCommentType = CommentDocs.prototype.getCommentType,
  regex = CommentDocs.regex,
  getFileContents = CommentDocs.prototype.getFileContents,
  getTextFromDocComment = CommentDocs.prototype.getTextFromDocComment,
  convertYaml = CommentDocs.prototype.convertYaml,
  parseOutDocs = CommentDocs.prototype.parseOutDocs,
  parseOutCode = CommentDocs.prototype.parseOutCode,
  parsingIsValid = CommentDocs.prototype.parsingIsValid,
  joinDocsAndCode = CommentDocs.prototype.joinDocsAndCode,
  parseSourceFile = CommentDocs.prototype.parseSourceFile;

// describe('#parseSourceFile', function() {
//   it('converts a file into an array of objects', function() {
//     assert.deepEqual(
//       parseSourceFile( 'test/getfilecontents.css' ),
//       // [{ prop1: "Comment 1" }]
//       [ '    prop1: Comment one\n' ]
//     );
//   });
// });

describe('#joinDocsAndCode', function() {
  it('takes an array of doc comments and an array of code snippets and merges them into one object, converting the docs from yaml into an object', function() {
    var docs = [ { prop1: 'Comment one' } ];
    var code = [ '.test{\n    content:\"Hello\";\n}' ];
    assert.deepEqual(
      joinDocsAndCode( docs, code ),
      [{
        docs: docs[0],
        code: code[0]
      }]
    );
  });
});

describe('#parsingIsValid', function() {
  it('validates that their is one code snippet (even if it\'s an empty string) for each doc comment', function() {
    var fileContents = '/* topdoc\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}';
    var docs = CommentDocs.prototype.parseOutDocs( fileContents, regex.css );
    var code = CommentDocs.prototype.parseOutCode( fileContents, regex.css );
    assert.equal( parsingIsValid( docs, code ), true );
  });
});

describe('#parseOutCode', function() {
  it('build an array from the code after each doc comment', function() {
    assert.deepEqual(
      parseOutCode( '/* topdoc\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}', regex.css ),
      [ '.test{\n    content:\"Hello\";\n}' ]
    );
  });
});

describe('#getTextFromDocComment', function() {
  it('removes the opening and closing comments from a doc comment', function() {
    assert.equal(
      getTextFromDocComment( '/* topdoc\n    prop1: Comment one\n*/\n', regex.css ),
      '    prop1: Comment one\n\n'
    );
  });
});

describe('#parseOutDocs', function() {
  it('build an array from the text of each doc comment', function() {
    assert.deepEqual(
      parseOutDocs( '/* topdoc\n    prop1: Comment one\n*/\n', regex.css ),
      [ { prop1: 'Comment one' } ]
    );
  });
});

describe('#convertYaml', function() {
  it('converts a yaml string into an object and identifies the comment number if the conversion fails', function() {
    var yamlString = 'prop1: Comment one';
    assert.deepEqual( convertYaml( yamlString ), { prop1: 'Comment one' } );
    assert.throws(
      function() { convertYaml( 'prop1: prop1:' ); },
      Error,
      'Error converting comment to YAML. Please check for formatting errors.'
    );
    assert.throws(
      function() { convertYaml( 'prop1: prop1:', 0 ); },
      Error,
      'Error converting comment #1 to YAML. Please check for formatting errors.'
    );
  });
});

describe('#getFileContents', function() {
  it('returns the contents of a file, trimming everything before the first doc comment', function() {
    assert.equal(
      getFileContents( 'test/getfilecontents.css', regex.css ),
      '/* topdoc\n    prop1: Comment one\n*/\n'
    );
  });
});

describe('#getCommentType', function() {
  it('returns the correct comment type based on the file extension', function() {
    assert.equal( getCommentType('test.css'), 'css' );
    assert.equal( getCommentType('test.less'), 'css' );
    assert.equal( getCommentType('test.less'), 'css' );
    assert.equal( getCommentType('test.html'), 'html' );
  });
});

describe('#verifySrcArg', function() {
  it('throws an error if the src or dest arguments are not defined', function() {
    assert.throws( function(){ verifySrcArg(); }, Error );
    assert.throws( function(){ verifySrcArg('test.css'); }, Error );
  });
});

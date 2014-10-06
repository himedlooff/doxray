var should = require('chai').should(),
  assert = require('chai').assert,
  CommentDocs = require('../commentdocs'),
  verifySrcArg = CommentDocs.prototype.verifySrcArg,
  getCommentType = CommentDocs.prototype.getCommentType,
  regex = CommentDocs.regex,
  getFileContents = CommentDocs.prototype.getFileContents,
  getTextFromDocComment = CommentDocs.prototype.getTextFromDocComment,
  parseOutDocs = CommentDocs.prototype.parseOutDocs,
  parseOutCode = CommentDocs.prototype.parseOutCode,
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

describe('#parseOutCode', function() {
  it('build an array from the code after each doc comment', function() {
    assert.deepEqual(
      parseOutCode( '/* topdoc\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}', regex.css ),
      [ '.test{\n    content:\"Hello\";\n}' ]
    );
  });
});

describe('#parseOutDocs', function() {
  it('build an array from the text of each doc comment', function() {
    assert.deepEqual(
      parseOutDocs( '/* topdoc\n    prop1: Comment one\n*/\n', regex.css ),
      [ '    prop1: Comment one\n' ]
    );
  });
});

describe('#getTextFromDocComment', function() {
  it('removes the opening and closing comments for a doc comment', function() {
    assert.equal(
      getTextFromDocComment( '/* topdoc\n    prop1: Comment one\n*/\n', regex.css ),
      '    prop1: Comment one\n\n'
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

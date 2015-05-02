var chai, assert, CommentDocs, commentDocs;

chai = require('chai');
assert = chai.assert;
chai.use( require('chai-fs') );

CommentDocs = require('../index');
commentDocs = new CommentDocs();

describe('#getCommentType', function() {
  it('returns the correct comment type based on the file extension', function() {
    assert.equal( commentDocs.getCommentType('test.css'), 'css' );
    assert.equal( commentDocs.getCommentType('test.less'), 'css' );
    assert.equal( commentDocs.getCommentType('test.less'), 'css' );
    assert.equal( commentDocs.getCommentType('test.html'), 'html' );
  });
});

describe('#getFileContents', function() {
  it('returns the contents of a file, trimming everything before the first doc comment', function() {
    assert.equal(
      commentDocs.getFileContents( 'test/test.css', commentDocs.regex.css ),
      '/* doxray\n    prop1: Comment one\n*/\n'
    );
  });
});

describe('#convertYaml', function() {
  it('converts a yaml string into an object and identifies the comment number if the conversion fails', function() {
    var yamlString = 'prop1: Comment one';
    assert.deepEqual( commentDocs.convertYaml( yamlString ), { prop1: 'Comment one' } );
    assert.throws(
      function() { commentDocs.convertYaml( 'prop1: prop1:' ); },
      Error,
      'Error converting comment to YAML. Please check for formatting errors.'
    );
    assert.throws(
      function() { commentDocs.convertYaml( 'prop1: prop1:', 0 ); },
      Error,
      'Error converting comment #1 to YAML. Please check for formatting errors.'
    );
  });
});

describe('#getTextFromDocComment', function() {
  it('removes the opening and closing comments from a doc comment', function() {
    assert.equal(
      commentDocs.getTextFromDocComment(
        '/* doxray\n    prop1: Comment one\n*/\n',
        commentDocs.regex.css
      ),
      '    prop1: Comment one\n\n'
    );
  });
});

describe('#parseOutDocs', function() {
  it('build an array from the text of each doc comment', function() {
    assert.deepEqual(
      commentDocs.parseOutDocs(
        '/* doxray\n    prop1: Comment one\n*/\n',
        commentDocs.regex.css
      ),
      [ { prop1: 'Comment one' } ]
    );
  });
});

describe('#parseOutCode', function() {
  it('build an array from the code after each doc comment', function() {
    assert.deepEqual(
      commentDocs.parseOutCode(
        '/* doxray\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}',
        commentDocs.regex.css
      ),
      [ '.test{\n    content:\"Hello\";\n}' ]
    );
  });
});

describe('#parsingIsValid', function() {
  it('validates that their is one code snippet (even if it\'s an empty string) for each doc comment', function() {
    var fileContents = '/* doxray\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}';
    var docs = commentDocs.parseOutDocs( fileContents, commentDocs.regex.css );
    var code = commentDocs.parseOutCode( fileContents, commentDocs.regex.css );
    assert.equal( commentDocs.parsingIsValid( docs, code ), true );
  });
});

describe('#joinDocsAndCode', function() {
  it('takes an array of doc comments and an array of code snippets and merges them into one object', function() {
    var docs = [ { prop1: 'Comment one' } ];
    var code = [ '.test{\n    content:\"Hello\";\n}' ];
    assert.deepEqual(
      commentDocs.joinDocsAndCode( docs, code, 'test.css' ),
      [{
        docs: docs[0],
        code: [{
          filename: 'test.css',
          type: '.css',
          code: code[0]
        }]
      }]
    );
  });
});

describe('#parseOneFile', function() {
  it('parses a single file into an array of objects', function() {
    assert.deepEqual(
      commentDocs.parseOneFile( 'test/test.css' ),
      [{
        docs: { prop1: 'Comment one' },
        code: [{
          filename: 'test.css',
          type: '.css',
          code: ''
        }]
      }]
    );
  });
});

describe('#parse', function() {
  it('parses a single file when the first argument is a string that is a path to an existing file', function() {
    assert.deepEqual(
      commentDocs.parse( 'test/test.css' ),
      [
        [{
          docs: { prop1: 'Comment one' },
          code: [{
            filename: 'test.css',
            type: '.css',
            code: ''
          }]
        }]
      ]
    );
  });
});

describe('#parse', function() {
  it('parses an array of files when the first argument is an array of strings that are paths to existing files', function() {
    assert.deepEqual(
      commentDocs.parse( [ 'test/test.css', 'test/test.less' ], false ),
      [
        [{
          docs: { prop1: 'Comment one' },
          code: [
            {
              filename: 'test.css',
              type: '.css',
              code: ''
            }
          ]
        }],
        [{
          docs: { prop1: 'Comment one' },
          code: [
            {
              filename: 'test.less',
              type: '.less',
              code: ''
            }
          ]
        }]
      ]
    );
  });
});

describe('#parse', function() {
  it('throws an error when the first argument is not a string or an array', function() {
    assert.throws(
      function() { commentDocs.parse( {} ); },
      Error,
      'parse() expected a String or Array.'
    );
    assert.throws(
      function() { commentDocs.parse( 123 ); },
      Error,
      'parse() expected a String or Array.'
    );
  });
});

describe('#mergeParsedSources', function() {
  it('merges two objects if their docs are identical', function() {
    assert.deepEqual(
      commentDocs.parse( [ 'test/test.css', 'test/test.less' ], true ),
      [
        {
          docs: { prop1: 'Comment one' },
          code: [
            {
              filename: 'test.css',
              type: '.css',
              code: ''
            },
            {
              filename: 'test.less',
              type: '.less',
              code: ''
            }
          ]
        },
      ]
    );
    assert.deepEqual(
      commentDocs.mergeParsedSources(
        [
          [
            {
              docs: { name: 'pattern one' },
              code: [
                { code: 'test.css code', filename: 'test.css' }
              ]
            },
            {
              docs: { name: 'pattern two' },
              code: [
                { code: 'test.css code', filename: 'test.css' }
              ]
            }
          ],
          [
            {
              docs: { name: 'pattern one' },
              code: [
                { code: 'test.less code', filename: 'test.less' }
              ]
            },
            {
              docs: { name: 'pattern two' },
              code: [
                { code: 'test.less code', filename: 'test.less' }
              ]
            }
          ]
        ]
      ),
      [
        {
          docs: { name: 'pattern one' },
          code: [
            { code: 'test.css code', filename: 'test.css' },
            { code: 'test.less code', filename: 'test.less' }
          ]
        },
        {
          docs: { name: 'pattern two' },
          code: [
            { code: 'test.css code', filename: 'test.css' },
            { code: 'test.less code', filename: 'test.less' }
          ]
        }
      ]
    );
  });
});

describe('#mergeParsedSources', function() {
  it('when attempting to merge two', function() {
    assert.deepEqual(
      commentDocs.mergeParsedSources(
        [
          [
            {
              docs: { name: 'pattern name' },
              code: [
                { code: 'test.css code', filename: 'test.css' },
                { code: 'test.less code', filename: 'test.less' }
              ]
            }
          ],
          [
            {
              docs: { name: 'a different pattern name' },
              code: [
                { code: 'test.less code', filename: 'test.less' }
              ]
            }
          ]
        ]
      ),
      [
        {
          docs: { name: 'pattern name' },
          code: [
            { code: 'test.css code', filename: 'test.css' },
            { code: 'test.less code', filename: 'test.less' }
          ]
        },
        {
          docs: { name: 'a different pattern name' },
          code: [
            { code: 'test.less code', filename: 'test.less' }
          ]
        }
      ]
    );
  });
});

describe('#writeJSON', function() {
  it('creates a .json file out of an object', function() {
    commentDocs.writeJSON( [{}], 'test/test.json' );
    assert.isFile( 'test/test.json' );
  });
});

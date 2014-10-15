var should = require('chai').should(),
  assert = require('chai').assert,
  CommentDocs = require('../commentdocs'),
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
      commentDocs.getFileContents( 'test/getfilecontents.css', commentDocs.regex.css ),
      '/* topdoc\n    prop1: Comment one\n*/\n'
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
        '/* topdoc\n    prop1: Comment one\n*/\n',
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
        '/* topdoc\n    prop1: Comment one\n*/\n',
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
        '/* topdoc\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}',
        commentDocs.regex.css
      ),
      [ '.test{\n    content:\"Hello\";\n}' ]
    );
  });
});

describe('#parsingIsValid', function() {
  it('validates that their is one code snippet (even if it\'s an empty string) for each doc comment', function() {
    var fileContents = '/* topdoc\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}';
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
      commentDocs.joinDocsAndCode( docs, code ),
      [{
        docs: docs[0],
        code: code[0]
      }]
    );
  });
});

describe('#parseOneFile', function() {
  it('parses a single file into an array of objects', function() {
    assert.deepEqual(
      commentDocs.parseOneFile( 'test/getfilecontents.css' ),
      [{
        docs: { prop1: 'Comment one' },
        code: ''
      }]
    );
  });
});

describe('#parse', function() {
  it('parses a file or an array of files', function() {
    assert.deepEqual(
      commentDocs.parseOneFile( 'test/getfilecontents.css' ),
      [{
        docs: { prop1: 'Comment one' },
        code: ''
      }]
    );
    assert.deepEqual(
      commentDocs.parse( [ 'test/getfilecontents.css', 'test/getfilecontents.css' ] ),
      [
        [{
          docs: { prop1: 'Comment one' },
          code: ''
        }],
        [{
          docs: { prop1: 'Comment one' },
          code: ''
        }]
      ]
    );
  });
});

describe('#hasMatchingValues', function() {
  it('...', function() {
    assert.equal(
      commentDocs.hasMatchingValues(
        { foo: 'bar' },
        { foo: 'bar' },
        'foo',
        'bar'
      ),
      true
    );
    assert.equal(
      commentDocs.hasMatchingValues(
        { foo: 'bar' },
        { baz: 'bar' },
        'foo',
        'bar'
      ),
      false
    );
    assert.equal(
      commentDocs.hasMatchingValues(
        { foo: 'bar' },
        { foo: 'baz' },
        'foo',
        'bar'
      ),
      false
    );
  });
});

describe('#addAltCodeToDocSet', function() {
  it('when given two objects, take the code property from the second object and add or append it to the code_alt property of the first object', function() {
    assert.deepEqual(
      commentDocs.addAltCodeToDocSet(
        { code: 'first obj code' },
        { code: 'second obj code' }
      ),
      { code: 'first obj code', code_alt: 'second obj code' }
    );
    assert.deepEqual(
      commentDocs.addAltCodeToDocSet(
        { code: 'first obj code', code_alt: 'existing alt_code' },
        { code: 'additional alt_code' }
      ),
      { code: 'first obj code', code_alt: 'existing alt_code\n\nadditional alt_code' }
    );
  });
});

describe('#mergeParsedSources', function() {
  it('merges two objects if their docs share the same property and value', function() {
    assert.deepEqual(
      commentDocs.mergeParsedSources(
        [
          [
            { docs: { name: 'pattern name' }, code: 'first obj code' }
          ],
          [
            { docs: { name: 'pattern name' }, code: 'second obj code' }
          ]
        ],
        'name'
      ),
      [
        {
          docs: { name: 'pattern name' },
          code: 'first obj code',
          code_alt: 'second obj code'
        }
      ]
    );
  });
});

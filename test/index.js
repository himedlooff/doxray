var chai = require('chai');
var assert = chai.assert;
var Doxray = require('../doxray');
var doxray = new Doxray();
var doxraySimple = require('../index');

chai.use( require('chai-fs') );

describe('#getCommentType', function() {
  it('returns the correct comment type based on the file extension', function() {
    assert.equal( doxray.getCommentType('test.css'), 'css' );
    assert.equal( doxray.getCommentType('test.less'), 'css' );
    assert.equal( doxray.getCommentType('test.less'), 'css' );
    assert.equal( doxray.getCommentType('test.html'), 'html' );
  });
});

describe('#getFileContents', function() {
  it('returns the contents of a file, trimming everything before the first doc comment', function() {
    assert.equal(
      doxray.getFileContents( 'test/test.css', doxray.regex.css ),
      '/* doxray\n    prop1: Comment one\n*/\n'
    );
  });
});

describe('#convertYaml', function() {
  it('converts a yaml string into an object and identifies the comment number if the conversion fails', function() {
    var yamlString = 'prop1: Comment one';
    assert.deepEqual( doxray.convertYaml( yamlString ), { prop1: 'Comment one' } );
    assert.throws(
      function() { doxray.convertYaml( 'prop1: prop1:' ); },
      Error,
      'Error converting comment to YAML. Please check for formatting errors.'
    );
    assert.throws(
      function() { doxray.convertYaml( 'prop1: prop1:', 0 ); },
      Error,
      'Error converting comment #1 to YAML. Please check for formatting errors.'
    );
  });
});

describe('#getTextFromDocComment', function() {
  it('removes the opening and closing comments from a doc comment', function() {
    assert.equal(
      doxray.getTextFromDocComment(
        '/* doxray\n    prop1: Comment one\n*/\n',
        doxray.regex.css
      ),
      '    prop1: Comment one\n\n'
    );
  });
});

describe('#parseOutDocs', function() {
  it('build an array from the text of each doc comment', function() {
    assert.deepEqual(
      doxray.parseOutDocs(
        '/* doxray\n    prop1: Comment one\n*/\n',
        doxray.regex.css
      ),
      [ { prop1: 'Comment one' } ]
    );
  });
});

describe('#parseOutCode', function() {
  it('build an array from the code after each doc comment', function() {
    assert.deepEqual(
      doxray.parseOutCode(
        '/* doxray\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}',
        doxray.regex.css
      ),
      [ '.test{\n    content:\"Hello\";\n}' ]
    );
  });
});

describe('#parsingIsValid', function() {
  it('validates that their is one code snippet (even if it\'s an empty string) for each doc comment', function() {
    var fileContents = '/* doxray\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}';
    var docs = doxray.parseOutDocs( fileContents, doxray.regex.css );
    var code = doxray.parseOutCode( fileContents, doxray.regex.css );
    assert.equal( doxray.parsingIsValid( docs, code ), true );
  });
});

describe('#joinDocsAndCode', function() {
  it('takes an array of doc comments and an array of code snippets and merges them into one object', function() {
    var docs = [ { prop1: 'Comment one' } ];
    var code = [ '.test{\n    content:\"Hello\";\n}' ];
    var filename = 'test.css';
    assert.deepEqual(
      doxray.joinDocsAndCode( docs, code, filename ),
      [{
        prop1: docs[ 0 ].prop1,
        filename: filename,
        css: code[ 0 ]
      }]
    );
  });
});

describe('#parseOneFile', function() {
  it('parses a single file into an array of objects', function() {
    assert.deepEqual(
      doxray.parseOneFile( 'test/test.css' ),
      [{
        prop1: 'Comment one',
        filename: 'test.css',
        css: ''
      }]
    );
  });
});

describe('#parse', function() {
  it('parses a single file when the first argument is a string that is a path to an existing file', function() {
    assert.deepEqual(
      doxray.parse( 'test/test.css' ),
      [{
        prop1: 'Comment one',
        filename: 'test.css',
        css: ''
      }]
    );
  });

  it('parses an array of files when the first argument is an array of strings that are paths to existing files', function() {
    assert.deepEqual(
      doxray.parse( [ 'test/test.css', 'test/test.less' ], false ),
      [{
        prop1: 'Comment one',
        filename: 'test.css',
        css: ''
      },{
        prop1: 'Comment one',
        filename: 'test.less',
        less: ''
      }]
    );
  });

  it('throws an error when the first argument is not a string or an array', function() {
    assert.throws(
      function() { doxray.parse( {} ); },
      Error,
      doxray.parseGotWrongType
    );
    assert.throws(
      function() { doxray.parse( 123 ); },
      Error,
      doxray.parseGotWrongType
    );
  });
});

// describe('#mergeParsedSources', function() {
//   it('merges two objects if their docs are identical', function() {
//     assert.deepEqual(
//       doxray.parse( [ 'test/test.css', 'test/test.less' ], true ),
//       [
//         [
//           {
//             docs: { prop1: 'Comment one' },
//             code: [
//               {
//                 filename: 'test.css',
//                 type: '.css',
//                 code: ''
//               },
//               {
//                 filename: 'test.less',
//                 type: '.less',
//                 code: ''
//               }
//             ]
//           },
//         ]
//       ]
//     );
//     assert.deepEqual(
//       doxray.mergeParsedSources(
//         [
//           [
//             {
//               docs: { name: 'pattern one' },
//               code: [
//                 { code: 'test.css code', filename: 'test.css' }
//               ]
//             },
//             {
//               docs: { name: 'pattern two' },
//               code: [
//                 { code: 'test.css code', filename: 'test.css' }
//               ]
//             }
//           ],
//           [
//             {
//               docs: { name: 'pattern one' },
//               code: [
//                 { code: 'test.less code', filename: 'test.less' }
//               ]
//             },
//             {
//               docs: { name: 'pattern two' },
//               code: [
//                 { code: 'test.less code', filename: 'test.less' }
//               ]
//             }
//           ]
//         ]
//       ),
//       [
//         {
//           docs: { name: 'pattern one' },
//           code: [
//             { code: 'test.css code', filename: 'test.css' },
//             { code: 'test.less code', filename: 'test.less' }
//           ]
//         },
//         {
//           docs: { name: 'pattern two' },
//           code: [
//             { code: 'test.css code', filename: 'test.css' },
//             { code: 'test.less code', filename: 'test.less' }
//           ]
//         }
//       ]
//     );
//   });

//   it('when attempting to merge two', function() {
//     assert.deepEqual(
//       doxray.mergeParsedSources(
//         [
//           [
//             {
//               docs: { name: 'pattern name' },
//               code: [
//                 { code: 'test.css code', filename: 'test.css' },
//                 { code: 'test.less code', filename: 'test.less' }
//               ]
//             }
//           ],
//           [
//             {
//               docs: { name: 'a different pattern name' },
//               code: [
//                 { code: 'test.less code', filename: 'test.less' }
//               ]
//             }
//           ]
//         ]
//       ),
//       [
//         {
//           docs: { name: 'pattern name' },
//           code: [
//             { code: 'test.css code', filename: 'test.css' },
//             { code: 'test.less code', filename: 'test.less' }
//           ]
//         },
//         {
//           docs: { name: 'a different pattern name' },
//           code: [
//             { code: 'test.less code', filename: 'test.less' }
//           ]
//         }
//       ]
//     );
//   });
// });

describe('#postParseProcessing', function() {
  it('slugifys the label property in a doc via the slugify processor', function() {
    function run() {
      var parsed = doxray.postParseProcessing(
            doxray.parse( ['test/slugify-test.css', 'test/test.css'], false )
          );
      return parsed.patterns[0].slug + ' ' +
             parsed.patterns[1].slug + ' ' +
             parsed.patterns[2].slug + ' ' +
             parsed.patterns[3].slug + ' ' +
             parsed.patterns[4].slug + ' ' +
             parsed.patterns[5].slug;
    }
    assert.equal(
      run(),
      'comment-one comment-two specialcharacters first-header second-header undefined'
    );
  });

  it('creates a color palette object when a colorPalette property specifies which file type in the code array to parse', function() {
    function run() {
      var parsed = doxray.postParseProcessing(
            doxray.parse( 'test/color-palette-test.scss' )
          );
      return [ parsed.patterns[0].colorPalette, parsed.patterns[1].colorPalette ];
    }
    assert.deepEqual(
      run(),
      [
        [ { variable: '$white', value: '#fff' }, { variable: '$black', value: '#000' } ],
        [ { variable: '$red', value: 'red' }, { variable: '$green', value: 'rgba(0,255,0,1)' } ]
      ]
    );
  });

  it('#getByProperty( property ) returns an array of patterns with the presence of a specific property', function() {
    function run() {
      var parsed = doxray.postParseProcessing(
            doxray.parse( ['test/slugify-test.css', 'test/test.css'], false )
          );
      return parsed.getByProperty( 'label' ).length;
    }
    assert.equal( run(), 5 );
  });

  it('#getByProperty( property, value ) returns an array of patterns with a specific property that matches a specific value', function() {
    function run() {
      var parsed = doxray.postParseProcessing(
            doxray.parse( ['test/slugify-test.css', 'test/test.css'], false )
          );
      return parsed.getByProperty( 'label', 'comment one' ).length;
    }
    assert.equal( run(), 1 );
  });

  it('runs an array of processing functions over a parsed set of docs', function() {
    doxray.processors = [
      function( parsed ) {
        return '';
      }
    ];
    assert.deepEqual(
      doxray.postParseProcessing( doxray.parse( 'test/test.css' ) ),
      ''
    );
    doxray.processors = [
      function( parsed ) {
        parsed.patterns = [];
        parsed.customData = 'my custom data';
        return parsed;
      }
    ];
    assert.deepEqual(
      doxray.postParseProcessing( doxray.parse( 'test/test.css' ) ),
      {
        patterns: [],
        customData: 'my custom data'
      }
    );
    // We need to refresh the Doxray object because we deleted the processors.
    doxray = new Doxray();
  });
});

describe('#writeJSON', function() {
  it('creates a .json file', function() {
    doxray.writeJSON( { patterns: [] }, 'test/test.json' );
    assert.isFile( 'test/test.json' );
  });
});

describe('#writeJS', function() {
  it('creates a .js file', function() {
    doxray.writeJS( [{}], 'test/test.js' );
    assert.isFile( 'test/test.js' );
  });
});

describe('#run', function() {
  it('uses the options argument to run the right tasks', function() {
    var docs = doxray.run( 'test/test.css', {
      jsFile: 'test/run-test.js',
      jsonFile: 'test/run-test.json'
    });
    assert.isFile( 'test/run-test.js' );
    assert.isFile( 'test/run-test.json' );
    assert.equal(
      docs.patterns[0].prop1,
      'Comment one'
    );
  });

  // it('uses the options argument to merge', function() {
  //   var docs = doxray.run( [ 'test/test.css', 'test/test.less' ], { merge: true } );
  //   assert.equal(
  //     docs.patterns[0].prop1,
  //     'Comment one'
  //   );
  // });

  it('throws an error if the src does not exist', function() {
    assert.throws(
      function() { doxray.run( [ 'non-existent-file.css' ] ); },
      Error
    );
  });
});

describe('#doxraySimple', function() {
  it('an easy way to use Doxray', function() {
    var docs = doxraySimple( 'test/test.css', {
      jsFile: 'test/run-test.js',
      jsonFile: 'test/run-test.json'
    });
    assert.isFile( 'test/run-test.js' );
    assert.isFile( 'test/run-test.json' );
    assert.deepEqual(
      docs.patterns[0].prop1,
      'Comment one'
    );
  });

  // it('uses the options argument to merge', function() {
  //   var docs = doxraySimple( [ 'test/test.css', 'test/test.less' ], { merge: true } );
  //   assert.deepEqual(
  //     docs.patterns[0].prop1,
  //     'Comment one'
  //   );
  // });

  it('throws an error if the src does not exist', function() {
    assert.throws(
      function() { doxraySimple( [ 'non-existent-file.css' ] ); },
      Error
    );
  });
});

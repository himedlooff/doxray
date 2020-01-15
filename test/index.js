var fs = require('fs');
var chai = require('chai');
var assert = chai.assert;
var Doxray = require('../doxray');
var doxray = new Doxray();
var doxrayDefaultOptions = require('../utils.js').handleOptions();

chai.use( require('chai-fs') );

// TODO: save temp files to a temp directory and set flag for deleting them in case you want to review them manually.
// TODO: make a function to create yaml errors so we can test the error strings here.
// TODO: write missing tests for util methods

console.log('The purpose of Doxray is to parse text files and convert special Doxray comments into structured objects that can be used to generate pattern libraries.');

describe('doxray.js, core methods', function() {

  describe('run()', function() {

    it('should parse the requested file into an array of pattern objects', function() {
      var docs;
      var file = 'test/run-test.js';
      docs = doxray.run( 'test/test.css', { jsFile: file }, function() {
        assert.deepEqual(
          docs.patterns[0].prop1,
          'Comment one'
        );
        assert.deepEqual(
          docs.patterns[1].prop1,
          'Comment two'
        );
      });
    });

    it('should write the parsed data to the .json file specified in the jsonFile option, and then run the provided callback function', function() {
      var docs;
      var file = 'test/run-test.json';
      if ( fs.existsSync( file ) ) {
        fs.unlinkSync( file );
      }
      docs = doxray.run( 'test/test.css', { jsonFile: file }, function() {
        assert.isFile( file );
      });
    });

    it('should write the parsed data to the .js file specified in the jsFile option, and then run the provided callback function', function() {
      var docs;
      var file = 'test/run-test.js';
      if ( fs.existsSync( file ) ) {
        fs.unlinkSync( file );
      }
      docs = doxray.run( 'test/test.css', { jsFile: file }, function() {
        assert.isFile( file );
      });
    });

    it('should throw an error if the first argument is a non existent file', function() {
      assert.throws(
        function() { doxray.run( [ 'non-existent-file.css' ] ); },
        Error
      );
    });

    it('should respect custom regex patterns in options while retaining defaults', function () {
      var options = {
        regex: {
          css: {
            opening: /^\/\*\s*@docs[^\n]*\n/m,
            closing: /\*\//,
            comment: /^\/\*\s*@docs[^*]*\*+(?:[^/*][^*]*\*+)*\//gm
          }
        }
      };
      var css = doxray.run('test/custom-comment-regex-test.css', options);
      assert.deepEqual(
        css.patterns[0].prop1,
        'Comment one'
      );
      var html = doxray.run('test/test.html', options);
      assert.deepEqual(
        html.patterns[0].label,
        'heading one'
      );
    });

    it('should respect custom processors in options', function () {
      var options = {
        processors: [
          function( doxrayObject ) {
            // Use the label property of each pattern to create a slug property.
            doxrayObject.patterns.forEach(function( pattern ){
              if ( pattern.label ) {
                pattern.slug = 'slug-' + pattern.label
                  .toLowerCase()
                  .replace( / /g, '-' )
                  .replace( /[^\w-]+/g, '' );
              }
            });
            // Always return doxrayObject.
            return doxrayObject;
          }
        ]
      };
      var docs = doxray.run('test/slugify-test.css', options);
      assert.deepEqual(
        docs.patterns[0].slug,
        'slug-comment-one'
      );

      // We need to refresh the Doxray object because we deleted the processors.
      doxray = new Doxray();
    });

  });

  describe('parse()', function() {

    it('should parse an array of files into an array of structured objects', function() {
      assert.deepEqual(
        doxray.parse( ['test/test.css'], doxrayDefaultOptions ),
        [{
          prop1: 'Comment one',
          filename: 'test.css',
          css: '.test1 {\n    color: red;\n}'
        },
        {
          prop1: 'Comment two',
          filename: 'test.css',
          css: '.test2 {\n    color: green;\n}'
        }]
      );
    });

    it('should return an empty array if no Doxray comments are found', function() {
      assert.deepEqual(
        doxray.parse( ['test/empty-file.css'], doxrayDefaultOptions ),
        []
      );
    });

  });

  describe('postParseProcessing()', function() {

    it('should send the parsed data through an array of processing functions', function() {
      assert.deepEqual(
        doxray.postParseProcessing(
          doxray.parse( ['test/test.css'], doxrayDefaultOptions ),
          [
            function( parsed ) {
              parsed.patterns = [];
              parsed.customData = 'my custom data';
              return parsed;
            }
          ]
        ),
        {
          patterns: [],
          customData: 'my custom data'
        }
      );
      // We need to refresh the Doxray object because we deleted the processors.
      doxray = new Doxray();
    });

    describe('processors/slugify', function() {

      it('should slugify the label property in each pattern', function() {
        function run() {
          var parsed = doxray.postParseProcessing(
                doxray.parse( ['test/slugify-test.css', 'test/test.css'], doxrayDefaultOptions ),
                doxray.processors
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

    });

    describe('processors/color-palette', function() {

      it('should replace the colorPalette property with an array of key value pairs', function() {
        function run() {
          var parsed = doxray.postParseProcessing(
                doxray.parse( ['test/color-palette-test.scss'], doxrayDefaultOptions ),
                doxray.processors
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

    });

    describe('getByProperty()', function() {

      it('passing one argument should return an array of patterns with the presence of a specific property', function() {
        function run() {
          var parsed = doxray.postParseProcessing(
                doxray.parse( ['test/slugify-test.css', 'test/test.css'], doxrayDefaultOptions ),
                doxray.processors
              );
          return parsed.getByProperty( 'label' ).length;
        }
        assert.equal( run(), 5 );
      });

      it('passing two arguments should return an array of patterns with a specific property that matches a specific value', function() {
        function run() {
          var parsed = doxray.postParseProcessing(
                doxray.parse( ['test/slugify-test.css', 'test/test.css'], doxrayDefaultOptions ),
                doxray.processors
              );
          return parsed.getByProperty( 'label', 'comment one' ).length;
        }
        assert.equal( run(), 1 );
      });

    });

  });

  describe('writeJSON()', function() {

    it('should write a .json file', function() {
      var file = 'test/test.json';
      if ( fs.existsSync( file ) ) {
        fs.unlinkSync( file );
      }
      doxray.writeJSON( { patterns: [] }, file, function() {
        assert.isFile( file );
      });
    });

  });

  describe('writeJS()', function() {

    it('should write a .js file', function() {
      var file = 'test/test.js';
      if ( fs.existsSync( file ) ) {
        fs.unlinkSync( file );
      }
      doxray.writeJS( {}, file, function() {
        assert.isFile( file );
      });
    });

  });

});

describe('index.js, a simple alias that creates an instance of Doxray() for you', function() {

  describe('var doxray = require("doxray")', function() {

    it('should parse the requested file into an array of pattern objects (this is a duplicate of the test used for the run() method)', function() {
      var doxray = require('../index');
      var docs;
      var file = 'test/run-test.js';
      if ( fs.existsSync( file ) ) {
        fs.unlinkSync( file );
      }
      docs = doxray( 'test/test.css', { jsFile: file }, function() {
        assert.isFile( file );
        assert.deepEqual(
          docs.patterns[0].prop1,
          'Comment one'
        );
      });
    });

  });

});

describe('utils.js', function() {

  describe('handleOptions()', function () {

    it('should return an options object', function () {
      var options = {
        regex: {
          css: {
            opening: /^\/\*\s*@docs[^\n]*\n/m,
            closing: /\*\//,
            comment: /^\/\*\s*@docs[^*]*\*+(?:[^/*][^*]*\*+)*\//gm
          }
        }
      };
      var expected =  {
        regex: {
          html: {
            opening: /<!--\s*doxray[^\n]*\n/m,
            closing: /-->/,
            comment: /<!--\s*doxray(?:[^-]|[\r\n]|-[^-]|--[^>])*-->/gm,
            ignore: /<!--\s*ignore-doxray[\s\S]*/gm
          },
          css: {
            opening: /^\/\*\s*@docs[^\n]*\n/m,
            closing: /\*\//,
            comment: /^\/\*\s*@docs[^*]*\*+(?:[^/*][^*]*\*+)*\//gm
          }
        }
      }
      var transformedOptions = require('../utils.js').handleOptions(options);
      assert.deepEqual(
        transformedOptions,
        {
          jsFile: undefined,
          jsonFile: undefined,
          processors: doxray.processors,
          regex: expected.regex
        }
      );
    });

  });

  describe('parseOutDocs()', function() {

    it('should build an array of structured objects from the contents of a file', function() {
      assert.deepEqual(
        require('../utils.js').parseOutDocs(
          '/* doxray\n    prop1: Comment one\n*/\n',
          doxray.regex.css
        ),
        [ { prop1: 'Comment one' } ]
      );
    });

    it('should return an empty array if the file has no Doxray comments', function() {
      assert.deepEqual(
        require('../utils.js').parseOutDocs( '', doxray.regex.css ),
        []
      );
    });

  });

  describe('parseOutCode()', function() {

    it('should build an array of text blocks that come after each Doxray comment', function () {
      assert.deepEqual(
        require('../utils.js').parseOutCode(
          '/* doxray\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}',
          doxray.regex.css
        ),
        [ '.test{\n    content:\"Hello\";\n}' ]
      );
    });

    it('should ignore anything after and including the doxray ignore comment', function () {
      assert.deepEqual(
        require('../utils.js').parseOutCode(
          '/* doxray\n    prop1: Comment one\n*/\n.test{\n    content:\"Hello\";\n}\n\n/* ignore-doxray */\n.unrelated-class{}',
          doxray.regex.css
        ),
        [ '.test{\n    content:\"Hello\";\n}' ]
      );
    });

  });

  describe('joinDocsAndCode()', function() {

    it('should merge an array of converted Doxray comments with an array of the text that follows each comment', function() {
      var docs = [ { prop1: 'Comment one' } ];
      var code = [ '.test{\n    content:\"Hello\";\n}' ];
      var filename = 'test.css';
      assert.deepEqual(
        require('../utils.js').joinDocsAndCode( docs, code, filename ),
        [{
          prop1: docs[ 0 ].prop1,
          filename: filename,
          css: code[ 0 ]
        }]
      );
    });

  });

  describe('getCommentType()', function() {

    it('should return the correct comment type based on the file extension', function() {
      assert.equal( require('../utils.js').getCommentType('test.css'), 'css' );
      assert.equal( require('../utils.js').getCommentType('test.less'), 'less' );
      assert.equal( require('../utils.js').getCommentType('test.njk'), 'njk' );
      assert.equal( require('../utils.js').getCommentType('test.html'), 'html' );
    });

  });

  describe('getFileContents()', function() {

    it('should return the contents of a file, trimming everything before the first doc comment', function() {
      assert.equal(
        require('../utils.js').getFileContents( 'test/trim-test.css', doxray.regex.css ),
        '/* doxray\n    prop1: Comment one\n*/\n\n.test1 {\n    color: red;\n}\n'
      );
    });

  });

  describe('removeDoxrayCommentTokens()', function() {

    it('should remove the opening and closing comments from a doc comment', function() {
      assert.equal(
        require('../utils.js').removeDoxrayCommentTokens(
          '/* doxray\n    prop1: Comment one\n*/\n',
          doxray.regex.css
        ),
        '    prop1: Comment one\n\n'
      );
    });

  });

  describe('convertYaml()', function() {

    it('should convert a yaml string into an object', function() {
      var yamlString = 'prop1: Comment one';
      assert.deepEqual( require('../utils.js').convertYaml( yamlString ), { prop1: 'Comment one' } );
    });

    it('identifies the comment number if the conversion fails', function() {
      assert.throws(
        function() { require('../utils.js').convertYaml( 'prop1: prop1:' ); },
        Error,
        'Error converting comment to YAML. Please check for formatting errors.'
      );
      assert.throws(
        function() { require('../utils.js').convertYaml( 'prop1: prop1:', 0 ); },
        Error,
        'Error converting comment #1 to YAML. Please check for formatting errors.'
      );
    });

  });

});

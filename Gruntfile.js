module.exports = function(grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var path = require('path');
  var config = {};

  grunt.initConfig(config);

  grunt.registerTask('docs', 'A new documentation generator.', function( file ){
    
    var fs, yaml;

    if ( argsAreValid(arguments, this.name) ) {
      init();
      parseFile( file );
    }

    function init() {
      grunt.verbose.writeln('init(): Setting up vars.');

      fs = require('fs-extra');
      yaml = require('js-yaml');
    }

    function parseFile( file ) {
      var data, regex, docs, code, convertedDocs;

      grunt.verbose.writeln( 'parseFile(): Parsing', file );

      regex = {
        css: {
          opening: /\/\*\s*topdoc[^\n]*\n/,
          closing: /\*\//,
          comment: /\/\*\s*topdoc[^*]*\*+(?:[^/*][^*]*\*+)*\//g
        }
      };
      data = getData( file, regex.css );
      docs = parseOutDocs( data, regex.css );
      code = parseOutCode( data, regex.css );

      if ( parsingIsValid( docs, code ) ) {
        grunt.log.ok('Parsing was validated.');
        grunt.verbose.writeln( 'docs:\n', docs );
        grunt.verbose.writeln( 'code:\n', code );

        // Join the docs and code back together as structured objects.
        convertedDocs = joinDocsAndCode( docs, code );
      }

    }

    function joinDocsAndCode( docs, code ) {
      var convertedDocs, i;
      convertedDocs = [];
      i = 0;
      // Loop through each doc and:
      // 1. Convert the YAML into a structured object.
      // 2. Add the converted doc and the code to an object so they can be
      //    accessed together.
      // 3. Return all of the new objects.
      for ( i; i < docs.length; i++ ) {
        // Add the converted docs and the code to the same object.
        convertedDocs.push({
          docs: convertYaml( docs[ i ], i ),
          code: code[i]
        });

        grunt.verbose.writeln( 'convertedDocs['+i+']:\n', convertedDocs[ i ] );
      }
      return convertedDocs;
    }

    function convertYaml( yamlString, index ) {
      var convertedYaml;
      // Try converting the doc to YAML and warn if it fails.
      try {
        convertedYaml = yaml.safeLoad( yamlString );
      } catch ( e ) {
        grunt.log.error('Error converting comment #'+(index+1)+' to YAML. Please check for formatting errors.');
      }
      return convertedYaml;
    }

    function parsingIsValid( docs, code ) {
      // Check to see if the docs and code array lengths match.
      // If they don't then something went wrong as they should match
      // one for one.
      grunt.verbose.writeln( '\tdocs.length:', docs.length );
      grunt.verbose.writeln( '\tcode.length:', code.length );
      if ( docs.length !== code.length ) {
        grunt.log.error('Parsing failed because the parsed docs did not match the parsed code.');
        return false;
      } else {
        return true;
      }
    }

    function getData( file, regex ) {
      var data;
      // Read the file.
      data = fs.readFileSync( file, 'utf-8' );
      // Trim everything before the first regex because it's not associated with
      // any comment.
      data = data.slice( data.search(regex.comment) );
      return data;
    }

    function parseOutDocs( data, regex ) {
      var docs;
      // "docs" are anything that matches the regex.
      docs = data.match( regex.comment );
      // Clean each item in the array.
      // NEEDS REFACTORING to fix the second thisArg argument.
      // It probably shouldn't be `regex`? Not sure.
      docs.forEach( scrubDocComments, regex );
      return docs;
    }

    function scrubDocComments( element, index, array ) {
      // Remove the opening and closing comments.
      array[ index ] = array[ index ].replace( this.opening, '' );
      array[ index ] = array[ index ].replace( this.closing, '' );
    }

    function parseOutCode( data, regex ) {
      var code;
      // The "code" is everything betwixt the regex.
      code = data.split( regex.comment );
      // Removes the first item in the array since it will always be empty.
      code.shift();
      // Clean each item in the array.
      code.forEach( trimArrayElement );
      return code;
    }

    function trimArrayElement( element, index, array ) {
      array[ index ] = array[ index ].trim();
    }

    function argsAreValid( args, name ) {
      // Check to see if we have the required file argument.
      if ( args.length === 0 ) {
        grunt.log.error('Please provide a file as the first argument.');
        return false;
      } else {
        return true;
      }
    }

  });

};

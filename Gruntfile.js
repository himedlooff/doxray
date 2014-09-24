module.exports = function(grunt) {

  'use strict';

  require('load-grunt-tasks')(grunt);
  require('time-grunt')(grunt);

  var path = require('path');
  var config = {};

  grunt.initConfig(config);

  grunt.registerTask('docs', 'A new documentation generator.', function( file ) {
    
    var fs;

    if ( argsAreValid( arguments, this.name ) ) {
      init();
      parseFile( file );
    }

    function init() {
      grunt.verbose.writeln('init(): Setting up vars.');

      fs = require('fs-extra');
    }

    function parseFile( file ) {
      var data, regex, docs, code;

      grunt.verbose.writeln( 'parseFile(): Parsing', file );

      regex = /\/\*\s*topdoc[^*]*\*+(?:[^/*][^*]*\*+)*\//g;
      data = getData( file, regex );
      docs = parseOutDocs( data, regex );
      code = parseOutCode( data, regex );

      if ( parsingIsValid( docs, code ) ) {
        grunt.log.ok('Parsing was validated.');
        grunt.verbose.writeln( 'docs:\n', docs );
        grunt.verbose.writeln( 'code:\n', code );
      }

    }

    function parsingIsValid( docs, code ) {
      // Check to see if the docs and code array lengths match.
      // If they don't then something went wrong as they should match
      // one for one.
      grunt.verbose.writeln( '\tdocs.length:', docs.length );
      grunt.verbose.writeln( '\tcode.length:', code.length );
      if ( docs.length !== code.length ) {
        grunt.log.error( 'Parsing failed because the parsed docs did not match the parsed code.' );
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
      data = data.slice( data.search(regex) );
      return data;
    }

    function parseOutDocs( data, regex ) {
      var docs;
      // "docs" are anything that matches the regex.
      docs = data.match( regex );
      return docs;
    }

    function parseOutCode( data, regex ) {
      var code;
      // The "code" is everything betwixt the regex.
      code = data.split( regex );
      // Removes the first item in the array since it will always be empty.
      code.shift();
      // Clean each item in the array.
      code.forEach( trimArrayElement );
      return code;
    }

    function trimArrayElement( element, index, array ) {
      array[index] = array[index].trim();
    }

    function argsAreValid( args, name ) {
      // Check to see if we have the required file argument.
      if ( args.length === 0 ) {
        grunt.log.error( 'Please provide a file as the first argument.' );
        return false;
      } else {
        return true;
      }
    }

  });

};

/* ==========================================================================
   Parse documentation from code comments.
   ========================================================================== */

var CommentDocs = require('./commentdocs');
var docMaker = new CommentDocs();
var docs = docMaker.parse(
  ['test.css', 'test.less', 'test-2.less'],
  'prop1'
);

try {
  docMaker.writeJSON( docs, 'config-test.json' );
} catch ( e ) {
  console.log( e );
}

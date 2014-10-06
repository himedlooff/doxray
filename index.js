/* ==========================================================================
   Parse documentation from code comments.
   ========================================================================== */

var CommentDocs = require('./commentdocs');
var docs = new CommentDocs(
  //['test.css', 'test.less', 'test-2.less'],
  'test/getfilecontents.css',
  'config-test.json',
  { mergeProp: 'prop1' }
);
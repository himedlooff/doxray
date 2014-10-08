/* ==========================================================================
   Parse documentation from code comments.
   ========================================================================== */

var CommentDocs = require('./commentdocs');
var docs = new CommentDocs;
console.log(docs.parseSourceFile(
  //['test.css', 'test.less', 'test-2.less'],
  'test/getfilecontents.css',
  'config-test.json',
  { mergeProp: 'prop1' }
));

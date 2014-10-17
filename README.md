# Comment Docs

Comment Docs is a node module which can parse special code comments and return
an array of objects containing document/code pairs. Comments are written in YAML
and parsed into structured objects. The YAML structure is up to you. You define
the documentation properties that's right for your code. Comment Docs can also
write to a JSON file which you can use to build completely client-side
documentation sites that won't slow down your task runner.

Note that this project is currently in Beta.

## Getting started

### Install

```bash
npm install https://github.com/cfpb/comment-docs/archive/0.1.0.tar.gz
```

### Usage

_Example files to come shortly._

```js
// Create an instance of CommentDocs.
var CommentDocs = require('comment-docs');
var docMaker = new CommentDocs();

// Parse a file and get back an array of document/code pairs.
var docs = docMaker.parse( 'styles.css' );

// Write it to a JSON file.
docMaker.writeJSON( docs, 'styles.json' );

// You can "merge" files as well. This is handy when you have a source file like
// a Less file that gets compiled into a CSS file and you want access to both
// the Less and CSS for your documentation. The second parameter is the
// top-level property to match in the YAML comments.
var docs = docMaker.parse( ['styles.css', 'styles.less'], 'name' );
```

## Getting involved

We welcome your feedback and contributions.
Please see [CONTRIBUTING](CONTRIBUTING.md).

When submitting a pull request that changes or adds functionality please update
the tests and run:

```bash
npm test
```

To file a bug please us this handy [template](https://github.com/cfpb/comment-docs/issues/new?body=%23%23%20URL%0D%0D%0D%23%23%20Actual%20Behavior%0D%0D%0D%23%23%20Expected%20Behavior%0D%0D%0D%23%23%20Steps%20to%20Reproduce%0D%0D%0D%23%23%20Screenshot&labels=bug).


----

## Open source licensing info
1. [TERMS](TERMS.md)
2. [LICENSE](LICENSE)
3. [CFPB Source Code Policy](https://github.com/cfpb/source-code-policy/)


----

## Credits and references

This project was inspired by [topdoc](https://github.com/topcoat/topdoc/).

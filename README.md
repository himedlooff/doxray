# Dox-ray

Dox-ray is a node module that can parse special code comments and return
an array of objects containing document/code pairs. Comments are written in YAML
and parsed into structured objects. The YAML structure is up to you. You define
the documentation properties that's right for your code. Dox-ray can also
write to a JSON file which you can use to build completely client-side
documentation sites that won't slow down your task runner.

Note that this project is currently in Beta.


## Getting started

### Install

```bash
$ npm install dox-ray
```

### Usage (as a node module)

#### First, you'll need some source files to parse, for example

_styles.less:_

```css
/* doxray
    name: Button
    markup: <button class="btn">Button</button>
    notes:
      - "Don't use anchor elements as buttons unless they actually link to
         another page."
*/
.btn {
    font-size: unit(14px / 16px, em);
}
```

_styles.css:_

```css
/* doxray
    name: Button
    markup: <button class="btn">Button</button>
    notes:
      - "Don't use anchor elements as buttons unless they actually link to
         another page."
*/
.btn {
    font-size: 0.875em;
}
```

#### Now set up Dox-ray to parse stuff

```js
// Create an instance of Doxray.
var Doxray = require('dox-ray');
var doxray = new Doxray();

// Parse a file and get back an array of document/code pairs.
var docs = doxray.parse( 'styles.less' );
```

_In the above example, `docs` is equal to the following:_

```js
[{
  docs: {
    name: "Button",
    markup: "<button class=\"btn\">Button</button>,"
    notes: [ "Don't use anchor elements as buttons unless they actually link to another page." ]
  },
  code: '.btn {\nfont-size: 0.875em;\n}'
}]
```

##### Now write it to a JSON file

```js
doxray.writeJSON( docs, 'styles.json' );
```

_styles.json:_

```json
[{
  "docs": {
    "name": "Button",
    "markup": "<button class=\"btn\">Button</button>",
    "notes": [ "Don't use anchor elements as buttons unless they actually link to another page." ]
  },
  "code": ".btn {\nfont-size: 0.875em;\n}"
}]
```

##### An example of merging

You can "merge" files as well. This is handy when you have a source file like
a Less file that gets compiled into a CSS file and you want access to both the
Less and CSS for your documentation. To trigger a merge pass `true` as the
second argument to the `parse` function:

```js
var docs = doxray.parse( ['styles.css', 'styles.less'], true );
doxray.writeJSON( docs, 'styles.json' );
```

_styles.json:_

```json
[{
  "docs": {
    "name": "Button",
    "markup": "<button class=\"btn\">Button</button>",
    "notes": [ "Don't use anchor elements as buttons unless they actually link to another page." ]
  },
  "code": ".btn {\nfont-size: 0.875em;\n}",
  "code_alt": ".btn {\nfont-size: unit(14px / 16px, em);\n}"
}]
```

### Angular demo

The following repository demonstrates how to build a JSON file through Grunt and
consume it with Angular: <https://github.com/himedlooff/dox-ray-angular-demo>


## Getting involved

I welcome your feedback and contributions.
Please read [CONTRIBUTING](CONTRIBUTING.md).

When submitting a pull request that changes or adds functionality please update
the tests and run:

```bash
$ npm test
```

To file a bug please us this handy [template](https://github.com/himedlooff/dox-ray/issues/new?body=%23%23%20URL%0D%0D%0D%23%23%20Actual%20Behavior%0D%0D%0D%23%23%20Expected%20Behavior%0D%0D%0D%23%23%20Steps%20to%20Reproduce%0D%0D%0D%23%23%20Screenshot&labels=bug).


----


## Open source licensing info

This projected is licensed under the terms of the [MIT license](LICENSE).


----


## Credits and references

This project was inspired by [topdoc](https://github.com/topcoat/topdoc/).
:smile:

# Dox-ray

Dox-ray is a node module that can parse special code comments and return
an array of objects containing document/code pairs. Comments are written in YAML
and parsed into structured objects. The YAML structure is up to you. You define
the documentation properties that's right for your code. Dox-ray can also
write to a JS or JSON file which you can use to build completely client-side
documentation sites that won't slow down your task runner.

Note that this project is currently in Beta.


## Getting started

### Install

```bash
$ npm install dox-ray
```

### Usage (as a node module)

#### First, you'll need a file to parse

Here's how you write a Dox-ray comment:

_styles.less:_

```css
/* doxray
    label: Button
    markup: <button class="btn">Button</button>
    notes:
      - "Don't use anchor elements as buttons unless they actually link to
         another page."
*/
.btn {
    font-size: unit(14px / 16px, em);
}
```

#### Now set up Dox-ray to parse stuff

```js
var doxray = require('dox-ray');
var docs = doxray('styles.less');
```

_In the above example, `docs` is equal to the following:_

```js
{
  files: [
    [{
      docs: {
        label: "Button",
        markup: "<button class=\"btn\">Button</button>,"
        notes: [ "Don't use anchor elements as buttons unless they actually link to another page." ]
      },
      code: [
        {
          filename: "styles.less",
          type: ".less",
          code: ".btn {\nfont-size: unit(14px / 16px, em);\n}"
        }
      ]
    }]
  ]
}
```

##### You can also save it to a JS or JSON file

```js
var docs = doxray('styles.less', {
  jsFile: 'styles.js',
  jsonFile: 'styles.json'
});
```

_styles.js:_

```js
Doxray = {
  files: [
    [{
      docs: {
        label: "Button",
        markup: "<button class=\"btn\">Button</button>",
        notes: [ "Don't use anchor elements as buttons unless they actually link to another page." ]
      },
      code: [
        {
          filename: "styles.less",
          type: ".less",
          code: ".btn {\nfont-size: unit(14px / 16px, em);\n}"
        }
      ]
    }]
  ]
}
```

_styles.json:_

```json
{
  "files": [
    [{
      "docs": {
        "name": "Button",
        "markup": "<button class=\"btn\">Button</button>",
        "notes": [ "Don't use anchor elements as buttons unless they actually link to another page." ]
      },
      "code": [
        {
          "filename": "styles.less",
          "type": ".less",
          "code": ".btn {\nfont-size: unit(14px / 16px, em);\n}"
        }
      ]
    }]
  ]
}
```

##### Merging

With Dox-ray you can parse a compiled CSS file and a bunch of Less source files
all at once. Dox-ray will automatically try to match the comments from the
compiled CSS to the comments from the Less files. This is handy when you want
access to both the Less and CSS from the same object. If you want you can
disable this feature with `merge: false` in the options.

To utilize this feature pass an array to Dox-ray, making usre that the first
item is the compiled CSS file.

```js
var docs = doxray(['styles.css', 'styles.less'], {
  jsonFile: 'styles.json'
});
```

_styles.json:_  
Notice how the `code` property now has a code object for the CSS file and for
the Less file.

```json
{
  "files": [
    [{
      "docs": {
        "name": "Button",
        "markup": "<button class=\"btn\">Button</button>",
        "notes": [ "Don't use anchor elements as buttons unless they actually link to another page." ]
      },
      "code": [
        {
          "filename": "styles.less",
          "type": ".css",
          "code": ".btn {\nfont-size: 0.875em;\n}"
        },
        {
          "filename": "styles.less",
          "type": ".less",
          "code": ".btn {\nfont-size: unit(14px / 16px, em);\n}"
        }
      ]
    }]
  ]
}
```

### Dox-ray comment formatting

In order to make the regex simple, Dox-ray comments must start with an opening
comment, a space, then the word "doxray". The closing comment must be on a new
line.

```html
<!-- doxray
    label: my pattern
    description: this is how you structure my pattern
-->
```

#### Supported comments

| Style | Example |
| ----- | ------- |
| CSS/JS | `/* */` |
| HTML | `<!-- -->` |

You can easily add more by extending `Doxray.prototype.regex`.
See https://github.com/himedlooff/dox-ray/blob/master/doxray.js#L144-L155

#### YAML structure

There are two YAML structures that will help you get the most out of Dox-ray.
Using them will allow you to take advantage of the slugify and color palette
processors.

The first supported structure is to add properties directly to the Dox-ray
comment:

```css
/* doxray
    label: Button
    markup: <button class="btn">Button</button>
*/
```

Which can be represented like this:

```js
{
  label: "Button",
  markup: "<button class=\"btn\">Button</button>"
}
```

The second supported structure is to create a list and then add properties to
each item:

```css
/* doxray
    - label: Button
      markup: <button class="btn">Button</button>
    - label: Secondary Button
      markup: <button class="btn btn__secondary">Secondary Button</button>
*/
```

Which can be represented like this:

```js
[
  {
    label: "Button",
    markup: "<button class=\"btn\">Button</button>"
  },
  {
    label: "Secondary Button",
    markup: "<button class=\"btn btn__secondary\">Secondary Button</button>"
  }
]
```

If these structures don't suit your needs you can use whatever works best. Just
be aware that the processors won't work.

### Processors

Once Dox-ray parses the data it can run processing functions to manipulate the
data. Dox-ray runs two processors out of the box.

#### Slugify

If you use the `label` property in your Dox-ray comment the Slugify processor
will use that value to create a `slug` property. Slugs are useful for creating
HTML id's so you can link to specific sections of a page.

For example, this comment:

```css
/* doxray
    label: Primary Button
*/
```

Will automatically parse to this:

```js
{
  label: "Primary Button",
  slug: "primary-button"
}
```

#### Color Palette

Dox-ray will generate color palette data automatically if you specify a
`colorPalette` property in your Dox-ray comment. All you need to do is set the
value of the `colorPalette` property to the file type that contains
variable/color pairs. _Note that this only works when using a preprocessor like
SASS or Less.__

For example, this comment:

```scss
/* doxray
    colorPalette: less
*/
$white: #fff;
$black: #000;
```

Will automatically parse to this:

```js
{
  colorPalette: [
    { variable: "$white", value: "#fff" },
    { variable: "$black", value: "#000" }
  ]
}
```


## Getting involved

Feedback and contributions are welcome.
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

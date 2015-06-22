var Doxray = {
  "patterns": [
    {
      "header": true,
      "label": "Variables",
      "less": "",
      "filename": "variables.less",
      "slug": "variables"
    },
    {
      "label": "Fonts",
      "category": "helper",
      "notes": [
        "`Open Sans` is a Google font.\n",
        "`<link rel=\"stylesheet\" href=\"https://fonts.googleapis.com/css?family=Open+Sans:300,400,600\">`\n"
      ],
      "less": "@doxray-font-family-default:    \"Open Sans\", \"Segoe UI\", \"Helvetica Neue\", Helvetica, Arial;\n@doxray-font-family-code:       \"Lucida Sans Typewriter\", \"Lucida Console\", monaco, \"Bitstream Vera Sans Mono\", monospace;\n\n@doxray-font-weight-light:      300;\n@doxray-font-weight-normal:     400;\n@doxray-font-weight-demi:       600;\n\n@doxray-font-size-sm:           12px;\n@doxray-font-size-md:           18px;\n@doxray-font-size-lg:           30px;\n@doxray-font-size-xlg:          42px;",
      "filename": "variables.less",
      "slug": "fonts"
    },
    {
      "label": "Colors",
      "colorPalette": [
        {
          "variable": "@doxray-color-clean-white",
          "value": "#ffffff"
        },
        {
          "variable": "@doxray-color-paper-white",
          "value": "#fdfdfd"
        },
        {
          "variable": "@doxray-color-dirty-white",
          "value": "#f8f8f8"
        },
        {
          "variable": "@doxray-color-dirtier-white",
          "value": "#f0f0f0"
        },
        {
          "variable": "@doxray-color-shadow",
          "value": "#6e6c6c"
        },
        {
          "variable": "@doxray-color-gray",
          "value": "#474646"
        },
        {
          "variable": "@doxray-color-blue",
          "value": "#5b7489"
        }
      ],
      "less": "@doxray-color-clean-white:      #ffffff;\n@doxray-color-paper-white:      #fdfdfd;\n@doxray-color-dirty-white:      #f8f8f8;\n@doxray-color-dirtier-white:    #f0f0f0;\n@doxray-color-shadow:           #6e6c6c;\n@doxray-color-gray:             #474646;\n@doxray-color-blue:             #5b7489;",
      "filename": "variables.less",
      "slug": "colors"
    },
    {
      "label": "Dimension and spacing",
      "less": "@doxray-nav-width:      220px;\n\n@doxray-margin:         18px;\n@doxray-margin-large:   72px;",
      "filename": "variables.less",
      "slug": "dimension-and-spacing"
    },
    {
      "header": true,
      "label": "Styles",
      "less": "",
      "filename": "styles.less",
      "slug": "styles"
    },
    {
      "label": ".doxray",
      "less": ".doxray {\n    margin: 0;\n    padding: 0;\n}",
      "filename": "styles.less",
      "slug": "doxray"
    },
    {
      "label": ".doxray_nav",
      "less": ".doxray_nav {\n    box-sizing: border-box;\n    position: fixed;\n    top: 0;\n    bottom: 0;\n    left: 0;\n    width: @doxray-nav-width;\n    padding: 0 0 60px 20px;\n    background: @doxray-color-paper-white;\n    overflow-y: auto;\n    z-index: 0;\n}\n\n.doxray_patterns {\n    position: relative;\n    margin-left: @doxray-nav-width;\n    background: @doxray-color-clean-white;\n    box-shadow: 0 0 4px @doxray-color-shadow;\n    z-index: 1;\n}",
      "filename": "styles.less",
      "slug": "doxray_nav"
    },
    {
      "label": ".doxray-icon-file",
      "markup": "<i class=\"doxray-icon-file\"></i>\n",
      "less": ".doxray-icon-file {\n    &:before {\n        content: \"ƒ\";\n        font-family: @doxray-font-family-default;\n        font-weight: @doxray-font-weight-normal;\n    }\n\n    &:after {\n        content: \" \";\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-icon-file"
    },
    {
      "label": ".doxray-icon-pattern",
      "markup": "<i class=\"doxray-icon-pattern\"></i>\n",
      "less": ".doxray-icon-pattern {\n    &:before {\n        content: \"⁋\";\n        font-family: @doxray-font-family-default;\n        font-weight: @doxray-font-weight-normal;\n    }\n\n    &:after {\n        content: \" \";\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-icon-pattern"
    },
    {
      "label": ".doxray-toc_masthead",
      "markup": "<h1 class=\"doxray-toc_masthead\">\n    Masthead\n</h1>\n",
      "less": ".doxray-toc_masthead {\n    margin: 0;\n    padding: @doxray-margin-large;\n    background: @doxray-color-paper-white;\n    font-family: @doxray-font-family-default;\n    font-size: @doxray-font-size-xlg;\n    font-weight: @doxray-font-weight-light;\n    text-align: center;\n}",
      "filename": "styles.less",
      "slug": "doxray-toc_masthead"
    },
    {
      "label": ".doxray-toc_body",
      "less": ".doxray-toc_body {\n    position: relative;\n    padding: @doxray-margin-large;\n    box-shadow: 0 0 2px @doxray-color-shadow;\n}",
      "filename": "styles.less",
      "slug": "doxray-toc_body"
    },
    {
      "label": ".doxray-toc_collapsed-view-btn",
      "less": ".doxray-toc_collapsed-view-btn {\n    position: absolute;\n    bottom: @doxray-margin-large / 3;\n    left: @doxray-margin-large;\n    font-family: @doxray-font-family-default;\n    font-size: 12px;\n}",
      "filename": "styles.less",
      "slug": "doxray-toc_collapsed-view-btn"
    },
    {
      "label": ".doxray-toc_file-list",
      "less": ".doxray-toc_file-list {\n    display: -webkit-box;\n    display: -moz-box;\n    display: -ms-flexbox;\n    display: -webkit-flex;\n    display: flex;\n    -webkit-flex-wrap: wrap;\n        -ms-flex-wrap: wrap;\n            flex-wrap: wrap;\n    margin: 0;\n    padding: 0;\n    list-style-type: none;\n}",
      "filename": "styles.less",
      "slug": "doxray-toc_file-list"
    },
    {
      "label": ".doxray-toc_file-list",
      "less": ".doxray-toc_file-list-item {\n    width: 200px;\n    min-width: 200px;\n    margin: 0 1em 4em 0;\n\n    &.is-collapsed {\n        margin-bottom: 1em;\n    }\n\n    &.is-collapsed .doxray-link__file {\n        margin-bottom: 0;\n    }\n\n    &.is-collapsed .doxray-link__pattern-header,\n    &.is-collapsed .doxray-link__pattern {\n        display: none;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-toc_file-list"
    },
    {
      "label": ".doxray-header-link",
      "markup": "<a class=\"doxray-header-link\" href=\"#0\">\n    <i class=\"doxray-icon-file\"></i>\n    <span class=\"doxray-header-link_info\">\n        filename.ext\n    </span>\n</a>\n",
      "less": ".doxray-header-link {\n    &,\n    &:link,\n    &:visited {\n        box-sizing: border-box;\n        display: block;\n        width: @doxray-nav-width;\n        min-height: 40px;\n        padding: 0 20px;\n        background: @doxray-color-dirty-white;\n        color: @doxray-color-gray;\n        font-size: @doxray-font-size-md;\n        line-height: 38px;\n        text-decoration: none;\n    }\n\n    &:hover,\n    &:focus {\n        background: @doxray-color-dirtier-white;\n        outline: 0;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-header-link"
    },
    {
      "label": ".doxray-header-link_info",
      "less": ".doxray-header-link_info {\n    margin-left: .75em;\n    font-family: @doxray-font-family-default;\n    font-size: @doxray-font-size-sm;\n}",
      "filename": "styles.less",
      "slug": "doxray-header-link_info"
    },
    {
      "label": ".doxray-header-link__file",
      "less": ".doxray-header-link__file {\n    margin-left: -20px;\n    margin-bottom: 20px;\n}",
      "filename": "styles.less",
      "slug": "doxray-header-link__file"
    },
    {
      "label": ".doxray-header-link__toc",
      "less": ".doxray-header-link__toc {\n    position: fixed;\n    left: 0;\n    bottom: 0;\n}",
      "filename": "styles.less",
      "slug": "doxray-header-link__toc"
    },
    {
      "label": ".doxray-link",
      "markup": "<a class=\"doxray-link\" href=\"#0\">\n    filename.ext\n</a>\n",
      "less": ".doxray-link {\n    &,\n    &:link,\n    &:visited {\n        position: relative;\n        display: block;\n        margin: 0;\n        padding: .5em .75em;\n        border: 0;\n        background: transparent;\n        font-family: @doxray-font-family-default;\n        font-size: @doxray-font-size-sm;\n        color: @doxray-color-gray;\n        text-decoration: none;\n    }\n\n    &:hover,\n    &:focus {\n        background: @doxray-color-dirty-white;\n    }\n\n    &:focus {\n        outline: 0;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-link"
    },
    {
      "label": ".doxray-link__file",
      "markup": "<a class=\"doxray-link doxray-link__file\" href=\"#0\">\n    filename.ext\n</a>\n",
      "less": ".doxray-link__file {\n    &,\n    &:link,\n    &:visited {\n        margin: 0 0 .5em;\n        background: @doxray-color-dirty-white;\n        font-family: @doxray-font-family-code;\n        font-size: @doxray-font-size-sm;\n    }\n\n    &:hover,\n    &:focus {\n        background: @doxray-color-dirtier-white;\n    }\n\n    .doxray-icon-file {\n        opacity: .75;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-link__file"
    },
    {
      "label": ".doxray-link__pattern-header",
      "markup": "<a class=\"doxray-link doxray-link__pattern-header\" href=\"#0\">\n    Pattern header\n</a>\n",
      "less": ".doxray-link__pattern-header {\n    &,\n    &:link,\n    &:visited {\n        font-size: @doxray-font-size-sm;\n        font-weight: @doxray-font-weight-demi;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-link__pattern-header"
    },
    {
      "label": ".doxray-link__pattern",
      "markup": "<a class=\"doxray-link doxray-link__pattern\" href=\"#0\">\n    Pattern label\n</a>\n",
      "less": ".doxray-link__pattern {\n    &,\n    &:link,\n    &:visited {\n        padding: .5em .75em .5em 1.85em;\n    }\n\n    .doxray-icon-pattern {\n        position: absolute;\n        left: .75em;\n        width: 1.75em;\n        opacity: .15;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-link__pattern"
    },
    {
      "label": ".doxray-link-hr",
      "markup": "<a class=\"doxray-link doxray-link__pattern\" href=\"#0\">\n    Pattern label\n</a>\n<hr class=\"doxray-link-hr\">\n<a class=\"doxray-link doxray-link__pattern\" href=\"#0\">\n    Pattern label\n</a>\n",
      "less": ".doxray-link-hr {\n    display: block;\n    height: 1px;\n    margin: 20px 0 20px -20px;\n    border: 0;\n    background: @doxray-color-dirty-white;\n}",
      "filename": "styles.less",
      "slug": "doxray-link-hr"
    },
    {
      "label": ".doxray-doc",
      "less": ".doxray-doc {\n    padding: @doxray-margin-large;\n}\n\n.doxray-doc + .doxray-doc {\n    border-top: 1px solid @doxray-color-dirtier-white;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc"
    },
    {
      "label": ".doxray-doc-label",
      "markup": "<h1 class=\"doxray-doc-label\">\n    <a class=\"doxray-doc-label_link\" href=\"#0\">\n        Label\n    </a>\n</h1>\n",
      "less": ".doxray-doc-label {\n    margin: 0 0 @doxray-margin;\n    font-size: @doxray-font-size-lg;\n    font-weight: @doxray-font-weight-demi;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-label"
    },
    {
      "label": ".doxray-doc-label_link",
      "markup": "<h1 class=\"doxray-doc-label\">\n    <a class=\"doxray-doc-label_link\" href=\"#0\">\n        Doc Label Link\n    </a>\n</h1>\n",
      "less": ".doxray-doc-label_link {\n    &,\n    &:link,\n    &:visited,\n    &:hover,\n    &:focus {\n        color: @doxray-color-gray;\n        font-family: @doxray-font-family-default;\n        text-decoration: none;\n        outline: 0;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-label_link"
    },
    {
      "label": ".doxray-doc-label__header",
      "markup": "<h1 class=\"doxray-doc-label doxray-doc-label__header\">\n    <a class=\"doxray-doc-label_link\" href=\"#0\">\n        Header label\n    </a>\n</h1>\n",
      "less": ".doxray-doc-label__header {\n    font-size: @doxray-font-size-xlg;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-label__header"
    },
    {
      "label": ".doxray-doc-tag",
      "markup": "<small class=\"doxray-doc-tag\">Tag</small>\n",
      "less": ".doxray-doc-tag {\n    display: inline-block;\n    margin: 0 0 0 .5em;\n    padding: .2em .8em;\n    border-radius: @doxray-font-size-sm;\n    font-family: @doxray-font-family-default;\n    font-size: @doxray-font-size-sm;\n    font-weight: @doxray-font-weight-normal;\n    background: @doxray-color-dirtier-white;\n    color: @doxray-color-gray;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-tag"
    },
    {
      "label": ".doxray-doc-description",
      "markup": "<div class=\"doxray-doc-description\">\n    <p>A description</p>\n</div>\n",
      "less": ".doxray-doc-description {\n    max-width: 50em;\n    margin: @doxray-margin 0;\n    font-family: @doxray-font-family-default;\n    font-size: @doxray-font-size-lg - 4px;\n    font-weight: @doxray-font-weight-normal;\n\n    p {\n        margin: @doxray-margin 0 0;\n    }\n\n    code {\n        display: inline-block;\n        padding: 2px 5px;\n        border-radius: 3px;\n        background: @doxray-color-dirty-white;\n        color: @doxray-color-gray;\n        font-family: @doxray-font-family-code;\n        font-size: .8em;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-description"
    },
    {
      "label": ".doxray-doc-note",
      "markup": "<div class=\"doxray-doc-note\">\n    <p>A note</p>\n</div>\n",
      "less": ".doxray-doc-note {\n    position: relative;\n    max-width: 50em;\n    margin: @doxray-margin 0;\n    padding-left: 1.3em;\n    font-family: @doxray-font-family-default;\n    font-size: @doxray-font-size-md;\n    font-weight: @doxray-font-weight-normal;\n\n    &:before {\n        content: \"●\";\n        position: absolute;\n        left: 0;\n        display: inline-block;\n        margin-right: .25em;\n        color: @doxray-color-dirtier-white;\n    }\n\n    p {\n        margin: @doxray-margin 0 0;\n    }\n\n    code {\n        display: inline-block;\n        padding: 2px 5px;\n        border-radius: 3px;\n        background: @doxray-color-dirty-white;\n        color: @doxray-color-gray;\n        font-family: @doxray-font-family-code;\n        font-size: .8em;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-note"
    },
    {
      "label": ".doxray-doc-reference",
      "markup": "<a class=\"doxray-doc-reference\" href=\"#0\" target=\"_blank\">\n    A reference link\n</a>\n",
      "less": ".doxray-doc-reference {\n    &,\n    &:active,\n    &:link,\n    &:focus,\n    &:hover,\n    &:visited {\n        margin: @doxray-margin 0;\n        font-family: @doxray-font-family-default;\n        font-size: @doxray-font-size-md;\n        color: @doxray-color-blue;\n        text-decoration: none;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-reference"
    },
    {
      "label": ".doxray-doc-markup",
      "description": "Contains both the rendered and raw markup.\n",
      "markup": "<div class=\"doxray-doc-markup\">\n    <div class=\"doxray-doc-markup_rendered\">\n        Markup is rendered here\n    </div>\n</div>\n",
      "less": ".doxray-doc-markup {\n    margin: (@doxray-margin-large / 2) (@doxray-margin-large / 2 * -1);\n    box-shadow: 0 0 6px @doxray-color-shadow;\n    overflow: hidden;\n\n    &:after {\n        display: table;\n        clear: both;\n        content: \"\";\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-markup"
    },
    {
      "label": ".doxray-doc-markup_rendered",
      "description": "Contains both the rendered markup.\n",
      "notes": [
        "By default this container uses `display: inline-block;`. This is beneficial when using themes, since they will stack horizontally instead of vertically.\n"
      ],
      "markup": "<div class=\"doxray-doc-markup\">\n    <div class=\"doxray-doc-markup_rendered\">\n        Markup is rendered here\n    </div>\n</div>\n",
      "less": ".doxray-doc-markup_rendered {\n    display: inline-block;\n    padding: @doxray-margin-large;\n    margin-right: -3.75px;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-markup_rendered"
    },
    {
      "label": ".doxray-doc-markup_rendered__block",
      "notes": [
        "Converts this container to `display: block;`, allowing space for wider patterns.\n"
      ],
      "markup": "<div class=\"doxray-doc-markup\">\n    <div class=\"doxray-doc-markup_rendered doxray-doc-markup_rendered__block\">\n        Markup is rendered here\n    </div>\n</div>\n",
      "less": ".doxray-doc-markup_rendered__block {\n    display: block;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-markup_rendered__block"
    },
    {
      "label": ".doxray-doc-markup-theme",
      "less": ".doxray-doc-markup-theme {\n    position: relative;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-markup-theme"
    },
    {
      "label": ".doxray-doc-markup-theme_label",
      "less": ".doxray-doc-markup-theme_label {\n    position: absolute;\n    top: 2.5em;\n    font-family: @doxray-font-family-default;\n    font-size: @doxray-font-size-sm;\n    line-height: 1;\n    text-transform: capitalize;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-markup-theme_label"
    },
    {
      "label": ".doxray-doc-code",
      "less": ".doxray-doc-code {\n    position: relative;\n    margin: @doxray-margin 0 0;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-code"
    },
    {
      "label": ".doxray-doc-code_text",
      "less": ".doxray-doc-code_text {\n    display: block;\n    margin: 0;\n    padding: @doxray-margin-large / 2;\n    background: @doxray-color-dirty-white;\n    font-size: @doxray-font-size-md;\n    line-height: 1.5;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-code_text"
    },
    {
      "label": ".doxray-doc-code-expander",
      "less": ".doxray-doc-code-expander {\n    position: relative;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-code-expander"
    },
    {
      "label": ".doxray-doc-code-expander_body",
      "less": ".doxray-doc-code-expander_body {\n    height: 160px;\n    overflow: hidden;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-code-expander_body"
    },
    {
      "label": ".doxray-doc-code-expander_btn",
      "less": ".doxray-doc-code-expander_btn {\n    &,\n    &:active,\n    &:link,\n    &:focus,\n    &:hover,\n    &:visited {\n        display: block;\n        width: 100%;\n        padding: .5em .75em;\n        border: 0;\n        background: @doxray-color-dirtier-white;\n        color: @doxray-color-gray;\n        font-size: @doxray-font-size-sm;\n        line-height: 1;\n        text-align: center;\n        text-decoration: none;\n        outline: 0;\n        cursor: pointer;\n    }\n\n    &:hover,\n    &:focus {\n        background: darken(@doxray-color-dirtier-white, 2%);\n    }\n\n    &:before {\n        content: \"⇣\";\n    }\n\n    &__flipped:before {\n        content: \"⇡\";\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-code-expander_btn"
    },
    {
      "label": ".doxray-doc-color-palette",
      "less": ".doxray-doc-palette {\n    width: 96px;\n    display: inline-block;\n    margin-top: 16px;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-color-palette"
    },
    {
      "label": ".doxray-doc-color-palette_color",
      "less": ".doxray-doc-palette_color {\n    display: block;\n    height: 96px;\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-color-palette_color"
    },
    {
      "label": ".doxray-doc-color-palette_input",
      "less": ".doxray-doc-palette_input {\n    position: relative;\n    z-index: 1;\n    box-sizing: border-box;\n    width: 100%;\n    margin-top: 4px;\n    padding: 8px 10px 10px;\n    border: 1px solid @doxray-color-dirtier-white;\n    border-radius: 0;\n    background: @doxray-color-clean-white;\n    color: @doxray-color-shadow;\n    font-family: @doxray-font-family-default;\n    font-size: 14px;\n    font-weight: @doxray-font-weight-normal;\n\n    &:hover,\n    &:focus {\n        width: 150px;\n        z-index: 2;\n        border-color: @doxray-color-gray;\n        box-shadow: 0 0 4px @doxray-color-shadow;\n    }\n\n    &:focus {\n        outline: 0;\n    }\n\n    & + & {\n        margin-top: -1px;\n    }\n}",
      "filename": "styles.less",
      "slug": "doxray-doc-color-palette_input"
    }
  ],
  "getByProperty": function ( property, value ) {
    return this.patterns.filter(
      this.utils.hasProperty( property, value )
    );
  },
  "utils": {
    "hasProperty": function ( property, value ) {
    return function( pattern ) {
      if ( typeof value === 'undefined' ) {
        return pattern[ property ];
      } else {
        return pattern[ property ] && pattern[ property ].toLowerCase() === value.toLowerCase();
      }
    }
  }
  }
};
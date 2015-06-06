var Doxray = {
  "files": [
    [
      {
        "docs": {
          "prop1": "Comment one"
        },
        "code": [
          {
            "filename": "test.css",
            "type": ".css",
            "code": ""
          }
        ]
      }
    ]
  ],
  "filemap": {
    "test.css": 0
  },
  "getFile": function (file) {
    var map = this.filemap[file];
    return this.files[map];
  },
  "slugmap": {},
  "getSlug": function (slug) {
    var map = this.slugmap[slug];
    if (map && map.length === 2) {
      return this.files[map[0]][map[1]].docs;
    } else if (map && map.length === 3) {
      return this.files[map[0]][map[1]].docs[map[2]];
    }
    return undefined;
  }
};
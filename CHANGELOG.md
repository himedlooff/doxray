All notable changes to this project will be documented in this file.
I follow the [Semantic Versioning 2.0.0](http://semver.org/) format.


## 0.5.1 - 2015-06-06

### Fixed
- Processor methods no longer get stringified as `[Function]`.


## 0.5.0 - 2015-06-06

### Added
- Adds `filemap` and `slugmap` processors which allows you to target objects by
  filename or slug via `getFile()` and `getSlug()`.


## 0.4.3 - 2015-06-05

### Added
- Updated the syntax of the global variable to use `var Doxray` instead of just
  `Doxray`.


## 0.4.2 - 2015-06-05

### Added
- Updated the `files` property in `package.json` to fix a problem with the
  following error: './processors/color-palette.js'.


## 0.4.1 - 2015-06-05

### Added
- Updated the `files` property in `package.json` to fix a problem with the
  following error: `Cannot find module './doxray'`.


## 0.4.0 - 2015-05-04

### Added
- Simplified require usage, you no longer need to use `new Doxray()`.
- Normalized schema, now they are all Arrays of files with arrays of doc/code
  pairs, even if it's just one file.
- `writeJS()` function, which is sometimes easier than having to decode a JSON
  file.
- Support for post parse processors.
- Post parse processors for adding slugs and color palette data.


## 0.3.2 - 2014-11-09

### Fixed
- Small fix to the writeJSON test.


## 0.3.1 - 2014-11-09

### Fixed
- Fixes an issue where the wrong type was added to the code object.


## 0.3.0 - 2014-11-09

### Added
- If merging doesn't find a match it no longer ignores it and instead adds it
  to the array of doc sets.


## 0.2.0 - 2014-11-06

### Added
- Merging is now done by a deep comparison of two docs objects. If they are both
  the same then they will be merged. You can tell `parse` to merge by passing
  `true` as the second argument: `parse( ['styles.css', 'styles.less'], true )`.


## 0.1.1 - 2014-11-04

### Deprecated
- Stop ignoring the test folder with `.npmignore`.


## 0.1.0 - 2014-11-04

### Added
- ALL THE THINGS!

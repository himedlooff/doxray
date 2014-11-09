All notable changes to this project will be documented in this file.
I follow the [Semantic Versioning 2.0.0](http://semver.org/) format.


## 0.3.1 - 2014-11-09

### Added
- Nothing.

### Deprecated
- Nothing.

### Removed
- Nothing.

### Fixed
- Fixes an issue where the wrong type was added to the code object.


## 0.3.0 - 2014-11-09

### Added
- If merging doesn't find a match it no longer ignores it and instead adds it
  to the array of doc sets.

### Deprecated
- Nothing.

### Removed
- Nothing.

### Fixed
- Nothing.


## 0.2.0 - 2014-11-06

### Added
- Merging is now done by a deep comparison of two docs objects. If they are both
  the same then they will be merged. You can tell `parse` to merge by passing
  `true` as the second argument: `parse( ['styles.css', 'styles.less'], true )`.

### Deprecated
- Nothing.

### Removed
- Nothing.

### Fixed
- Nothing.


## 0.1.1 - 2014-11-04

### Added
- Nothing.

### Deprecated
- Stop ignoring the test folder with `.npmignore`.

### Removed
- Nothing.

### Fixed
- Nothing.


## 0.1.0 - 2014-11-04

### Added
- ALL THE THINGS!

### Deprecated
- Nothing.

### Removed
- Nothing.

### Fixed
- Nothing.

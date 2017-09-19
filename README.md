# [jQuery asBgPicker](https://github.com/amazingSurge/jquery-asBgPicker) ![bower][bower-image] [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url] [![prs-welcome]](#contributing)

> A jquery plugin that do amazing things.

## Table of contents
- [Main files](#main-files)
- [Quick start](#quick-start)
- [Requirements](#requirements)
- [Usage](#usage)
- [Examples](#examples)
- [Options](#options)
- [Methods](#methods)
- [Events](#events)
- [No conflict](#no-conflict)
- [Browser support](#browser-support)
- [Contributing](#contributing)
- [Development](#development)
- [Changelog](#changelog)
- [Copyright and license](#copyright-and-license)

## Main files
```
dist/
├── jquery-asBgPicker.js
├── jquery-asBgPicker.es.js
├── jquery-asBgPicker.min.js
└── css/
    ├── asBgPicker.css
    └── asBgPicker.min.css
```

## Quick start
Several quick start options are available:
#### Download the latest build

 * [Development](https://raw.githubusercontent.com/amazingSurge/jquery-asBgPicker/master/dist/jquery-asBgPicker.js) - unminified
 * [Production](https://raw.githubusercontent.com/amazingSurge/jquery-asBgPicker/master/dist/jquery-asBgPicker.min.js) - minified

#### Install From Bower
```sh
bower install jquery-asBgPicker --save
```

#### Install From Npm
```sh
npm install jquery-asBgPicker --save
```

#### Install From Yarn
```sh
yarn add jquery-asBgPicker
```

#### Build From Source
If you want build from source:

```sh
git clone git@github.com:amazingSurge/jquery-asBgPicker.git
cd jquery-asBgPicker
npm install
npm install -g gulp-cli babel-cli
gulp build
```

Done!

## Requirements
`jquery-asBgPicker` requires the latest version of [`jQuery`](https://jquery.com/download/).

## Usage
#### Including files:

```html
<link rel="stylesheet" href="/path/to/asBgPicker.css">
<script src="/path/to/jquery.js"></script>
<script src="/path/to/jquery-asBgPicker.js"></script>
```

#### Required HTML structure

```html
<div class="example"></div>
```

#### Initialization
All you need to do is call the plugin on the element:

```javascript
jQuery(function($) {
  $('.example').asBgPicker(); 
});
```

## Examples
There are some example usages that you can look at to get started. They can be found in the
[examples folder](https://github.com/amazingSurge/jquery-asBgPicker/tree/master/examples).

## Options
`jquery-asBgPicker` can accept an options object to alter the way it behaves. You can see the default options by call `$.asBgPicker.setDefaults()`. The structure of an options object is as follows:

```
  namespace: 'asBgPicker',
  skin: null,
  image: 'images/defaults.png',
  lang: 'en',
}
```

## Methods
Methods are called on asBgPicker instances through the asBgPicker method itself.
You can also save the instances to variable for further use.

```javascript
// call directly
$().asBgPicker('destroy');

// or
var api = $().data('asBgPicker');
api.destroy();
```

#### enable()
Enable the scrollbar functions.
```javascript
$().asBgPicker('enable');
```

#### disable()
Disable the scrollbar functions.
```javascript
$().asBgPicker('disable');
```

#### destroy()
Destroy the scrollbar instance.
```javascript
$().asBgPicker('destroy');
```

## Events
`jquery-asBgPicker` provides custom events for the plugin’s unique actions. 

```javascript
$('.the-element').on('asBgPicker::ready', function (e) {
  // on instance ready
});

```

Event   | Description
------- | -----------
ready   | Fires when the instance is ready for API use.
enable  | Fired when the `enable` instance method has been called.
disable | Fired when the `disable` instance method has been called.
destroy | Fires when an instance is destroyed. 

## No conflict
If you have to use other plugin with the same namespace, just call the `$.asBgPicker.noConflict` method to revert to it.

```html
<script src="other-plugin.js"></script>
<script src="jquery-asBgPicker.js"></script>
<script>
  $.asBgPicker.noConflict();
  // Code that uses other plugin's "$().asBgPicker" can follow here.
</script>
```

## Browser support

Tested on all major browsers.

| <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/safari/safari_32x32.png" alt="Safari"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/chrome/chrome_32x32.png" alt="Chrome"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/firefox/firefox_32x32.png" alt="Firefox"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/edge/edge_32x32.png" alt="Edge"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/internet-explorer/internet-explorer_32x32.png" alt="IE"> | <img src="https://raw.githubusercontent.com/alrra/browser-logos/master/opera/opera_32x32.png" alt="Opera"> |
|:--:|:--:|:--:|:--:|:--:|:--:|
| Latest ✓ | Latest ✓ | Latest ✓ | Latest ✓ | 9-11 ✓ | Latest ✓ |

As a jQuery plugin, you also need to see the [jQuery Browser Support](http://jquery.com/browser-support/).

## Contributing
Anyone and everyone is welcome to contribute. Please take a moment to
review the [guidelines for contributing](CONTRIBUTING.md). Make sure you're using the latest version of `jquery-asBgPicker` before submitting an issue. There are several ways to help out:

* [Bug reports](CONTRIBUTING.md#bug-reports)
* [Feature requests](CONTRIBUTING.md#feature-requests)
* [Pull requests](CONTRIBUTING.md#pull-requests)
* Write test cases for open bug issues
* Contribute to the documentation

## Development
`jquery-asBgPicker` is built modularly and uses Gulp as a build system to build its distributable files. To install the necessary dependencies for the build system, please run:

```sh
npm install -g gulp
npm install -g babel-cli
npm install
```

Then you can generate new distributable files from the sources, using:
```
gulp build
```

More gulp tasks can be found [here](CONTRIBUTING.md#available-tasks).

## Changelog
To see the list of recent changes, see [Releases section](https://github.com/amazingSurge/jquery-asBgPicker/releases).

## Copyright and license
Copyright (C) 2016 amazingSurge.

Licensed under [the LGPL license](LICENSE).

[⬆ back to top](#table-of-contents)

[bower-image]: https://img.shields.io/bower/v/jquery-asBgPicker.svg?style=flat
[bower-link]: https://david-dm.org/amazingSurge/jquery-asBgPicker/dev-status.svg
[npm-image]: https://badge.fury.io/js/jquery-asBgPicker.svg?style=flat
[npm-url]: https://npmjs.org/package/jquery-asBgPicker
[license]: https://img.shields.io/npm/l/jquery-asBgPicker.svg?style=flat
[prs-welcome]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg
[daviddm-image]: https://david-dm.org/amazingSurge/jquery-asBgPicker.svg?style=flat
[daviddm-url]: https://david-dm.org/amazingSurge/jquery-asBgPicker
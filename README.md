<!--@h1([pkg.name])-->
# mocha-per-file
<!--/@-->

<!--@shields('npm', 'travis', 'coveralls', 'deps')-->
[![npm version](https://img.shields.io/npm/v/mocha-per-file.svg)](https://www.npmjs.com/package/mocha-per-file) [![Build Status](https://img.shields.io/travis/dword-design/mocha-per-file/master.svg)](https://travis-ci.org/dword-design/mocha-per-file) [![Coverage Status](https://img.shields.io/coveralls/dword-design/mocha-per-file/master.svg)](https://coveralls.io/r/dword-design/mocha-per-file?branch=master) [![dependency status](https://img.shields.io/david/dword-design/mocha-per-file.svg)](https://david-dm.org/dword-design/mocha-per-file)
<!--/@-->

<!--@pkg.description-->
This CLI tool allows to organize mocha tests in files and directories. It works by traversing the test directory recursively, creating describe blocks per directory and tests per \*.test.js file.
<!--/@-->

<!--@installation()-->
## Installation

```sh
# via NPM
npm install --save mocha-per-file

# via Yarn
yarn add mocha-per-file
```
<!--/@-->

## Usage

Setup the directory structure:

```bash
|- src
|- test
   |- api
   |  |- empty-input.test.js
   |  |- array.test.js
   |  |- exception.test.js
   |- cli
      |- args.test.js
      |- options.test.js
```

Write some tests:

```js
// empty-input.test.js

const expect = require('expect')

// simple test
module.exports = () => expect(1).toEqual(1)

// test with timeout
module.exports = {
  it: expect(1).toEqual(2),
  timeout: 5000,
}
```

Call `mocha-per-file` in `npm test` in `package.json`:

```json
{
  "scripts": {
    "test": "mocha-per-file"
  }
}
```

Run the tests:

```bash
$ npm test

api
  ✓ empty-input
  ✓ array
  ✓ exception

cli
  ✓ args
  ✓ options
```

<!--@license()-->
## License

MIT © Sebastian Landwehr
<!--/@-->

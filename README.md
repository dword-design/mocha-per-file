<!-- TITLE/ -->
# mocha-per-file
<!-- /TITLE -->

<!-- BADGES/ -->
[![npm version](https://img.shields.io/npm/v/mocha-per-file.svg)](https://npmjs.org/package/mocha-per-file)
![Linux macOS Windows compatible](https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue)
[![Build status](https://github.com/dword-design/mocha-per-file/workflows/build/badge.svg)](https://github.com/dword-design/mocha-per-file/actions)
[![Coverage status](https://img.shields.io/coveralls/dword-design/mocha-per-file)](https://coveralls.io/github/dword-design/mocha-per-file)
[![Dependency status](https://img.shields.io/david/dword-design/mocha-per-file)](https://david-dm.org/dword-design/mocha-per-file)
![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen)

<a href="https://gitpod.io/#https://github.com/dword-design/bar">
  <img src="https://gitpod.io/button/open-in-gitpod.svg" alt="Open in Gitpod">
</a><a href="https://www.buymeacoffee.com/dword">
  <img
    src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
    alt="Buy Me a Coffee"
    height="32"
  >
</a><a href="https://paypal.me/SebastianLandwehr">
  <img
    src="https://dword-design.de/images/paypal.svg"
    alt="PayPal"
    height="32"
  >
</a><a href="https://www.patreon.com/dworddesign">
  <img
    src="https://dword-design.de/images/patreon.svg"
    alt="Patreon"
    height="32"
  >
</a>
<!-- /BADGES -->

<!-- DESCRIPTION/ -->
This CLI tool allows to organize mocha tests in files and directories. It works by traversing the test directory recursively, creating describe blocks per directory and tests per *.test.js file.
<!-- /DESCRIPTION -->

<!-- INSTALL/ -->
## Install

```bash
# npm
$ npm install mocha-per-file

# Yarn
$ yarn add mocha-per-file
```
<!-- /INSTALL -->

## Usage

### Setup the directory structure

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

### Writing the tests

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

// test only this file
module.exports = {
  it: expect(1).toEqual(2),
  only: true,
}
```

### Calling mocha-per-file
In `npm test` in `package.json`:
```json
{
  "scripts": {
    "test": "mocha-per-file"
  }
}
```

Via bash:
```bash
$ npx mocha-per-file

api
  ✓ empty-input
  ✓ array
  ✓ exception

cli
  ✓ args
  ✓ options
```

### Specifying the root directory to search for tests:

```bash
$ npx mocha-per-file --path special-tests
```

### Passing parameters to mocha
Some mocha parameters are also supported and can be passed through. For information on this, check out `mocha-per-file --help`.

```bash
$ npx mocha-per-file --require @babel/register

```

If more are needed feel free to open an issue or a PR! 😃

### Execute only some tests
You can execute only some of the tests by providing a filename or glob. Please mind that the path has to be relative to the specified test folder.
```bash
$ npx mocha-per-file empty-input.test.js
$ npx mocha-per-file api/*
```

### Changing directories
It is possible to tell `mocha-per-file` to `chdir` into the directory of each test file when running the tests via the `--chdir` parameter:

```bash
$ npx mocha-per-file --chdir
```

This makes it much easier to work with local fixtures:

```js
// files.test.js

const expect = require('expect')
const { readFile } = require('fs-extra')

// process.cwd() is now in the test directory
module.exports = async () => expect(await readFile('foo.txt', 'utf8')).toEqual('foo')
```

### Using with-local-tmp-dir
[with-local-tmp-dir](https://www.npmjs.com/package/with-local-tmp-dir) is a package that allows us to create a temporary folder inside a given directory and remove it after having finished a callback. This makes it the perfect tool to run file-based tests. The following snippet illustrates this:

```js
// files.test.js

const expect = require('expect')
const { writeFile, readFile } = require('fs-extra')

module.exports = () => withLocalTmpDir(async () => {
  await writeFile('foo.txt', 'foo')
  expect(await readFile('foo.txt', 'utf8')).toEqual('foo')
})
```

<!-- LICENSE/ -->
## License

Unless stated otherwise all works are:

Copyright &copy; Sebastian Landwehr <info@dword-design.de>

and licensed under:

[MIT License](https://opensource.org/licenses/MIT)
<!-- /LICENSE -->

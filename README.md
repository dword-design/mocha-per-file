<!-- TITLE/ -->
# mocha-per-file
<!-- /TITLE -->

<!-- BADGES/ -->
  <p>
    <a href="https://npmjs.org/package/mocha-per-file">
      <img
        src="https://img.shields.io/npm/v/mocha-per-file.svg"
        alt="npm version"
      >
    </a><img src="https://img.shields.io/badge/os-linux%20%7C%C2%A0macos%20%7C%C2%A0windows-blue" alt="Linux macOS Windows compatible"><a href="https://github.com/dword-design/mocha-per-file/actions">
      <img
        src="https://github.com/dword-design/mocha-per-file/workflows/build/badge.svg"
        alt="Build status"
      >
    </a><a href="https://codecov.io/gh/dword-design/mocha-per-file">
      <img
        src="https://codecov.io/gh/dword-design/mocha-per-file/branch/master/graph/badge.svg"
        alt="Coverage status"
      >
    </a><a href="https://david-dm.org/dword-design/mocha-per-file">
      <img src="https://img.shields.io/david/dword-design/mocha-per-file" alt="Dependency status">
    </a><img src="https://img.shields.io/badge/renovate-enabled-brightgreen" alt="Renovate enabled"><br/><a href="https://gitpod.io/#https://github.com/dword-design/mocha-per-file">
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
</p>
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
## Contributing

Are you missing something or want to contribute? Feel free to file an [issue](https://github.com/dword-design/mocha-per-file/issues) or [pull request](https://github.com/dword-design/mocha-per-file/pulls)! ⚙️

## Support Me

Hey, I am Sebastian Landwehr, a freelance web developer, and I love developing web apps and open source packages. If you want to support me so that I can keep packages up to date and build more helpful tools, you can donate here:

<p>
  <a href="https://www.buymeacoffee.com/dword">
    <img
      src="https://www.buymeacoffee.com/assets/img/guidelines/download-assets-sm-2.svg"
      alt="Buy Me a Coffee"
      height="32"
    >
  </a>&nbsp;If you want to send me a one time donation. The coffee is pretty good 😊.<br/>
  <a href="https://paypal.me/SebastianLandwehr">
    <img
      src="https://dword-design.de/images/paypal.svg"
      alt="PayPal"
      height="32"
    >
  </a>&nbsp;Also for one time donations if you like PayPal.<br/>
  <a href="https://www.patreon.com/dworddesign">
    <img
      src="https://dword-design.de/images/patreon.svg"
      alt="Patreon"
      height="32"
    >
  </a>&nbsp;Here you can support me regularly, which is great so I can steadily work on projects.
</p>

Thanks a lot for your support! ❤️

## License

[MIT License](https://opensource.org/licenses/MIT) © [Sebastian Landwehr](https://dword-design.de)
<!-- /LICENSE -->

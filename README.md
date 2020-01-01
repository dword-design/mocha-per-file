<!-- TITLE/ -->

<h1>mocha-per-file</h1>

<!-- /TITLE -->


<!-- BADGES/ -->

<span class="badge-npmversion"><a href="https://npmjs.org/package/mocha-per-file" title="View this project on NPM"><img src="https://img.shields.io/npm/v/mocha-per-file.svg" alt="NPM version" /></a></span>
<span class="badge-travisci"><a href="http://travis-ci.org/dword-design/mocha-per-file" title="Check this project's build status on TravisCI"><img src="https://img.shields.io/travis/dword-design/mocha-per-file/master.svg" alt="Travis CI Build Status" /></a></span>
<span class="badge-coveralls"><a href="https://coveralls.io/r/dword-design/mocha-per-file" title="View this project's coverage on Coveralls"><img src="https://img.shields.io/coveralls/dword-design/mocha-per-file.svg" alt="Coveralls Coverage Status" /></a></span>
<span class="badge-daviddm"><a href="https://david-dm.org/dword-design/mocha-per-file" title="View the status of this project's dependencies on DavidDM"><img src="https://img.shields.io/david/dword-design/mocha-per-file.svg" alt="Dependency Status" /></a></span>
<span class="badge-shields"><a href="https://img.shields.io/badge/renovate-enabled-brightgreen.svg"><img src="https://img.shields.io/badge/renovate-enabled-brightgreen.svg" /></a></span>

<!-- /BADGES -->


<!-- DESCRIPTION/ -->

This CLI tool allows to organize mocha tests in files and directories. It works by traversing the test directory recursively, creating describe blocks per directory and tests per *.test.js file.

<!-- /DESCRIPTION -->


<!-- INSTALL/ -->

<h2>Install</h2>

<a href="https://npmjs.com" title="npm is a package manager for javascript"><h3>npm</h3></a>
<h4>Install Globally</h4>
<ul>
<li>Install: <code>npm install --global mocha-per-file</code></li>
<li>Executable: <code>mocha-per-file</code></li>
</ul>
<h4>Install Locally</h4>
<ul>
<li>Install: <code>npm install --save mocha-per-file</code></li>
<li>Executable: <code>npx mocha-per-file</code></li>
<li>Import: <code>import * as pkg from ('mocha-per-file')</code></li>
<li>Require: <code>const pkg = require('mocha-per-file')</code></li>
</ul>

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

<h2>License</h2>

Unless stated otherwise all works are:

<ul><li>Copyright &copy; Sebastian Landwehr</li></ul>

and licensed under:

<ul><li><a href="http://spdx.org/licenses/MIT.html">MIT License</a></li></ul>

<!-- /LICENSE -->

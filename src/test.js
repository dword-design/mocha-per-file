import glob from 'glob'
import { lstatSync } from 'fs-extra'
import { join, resolve, dirname, basename, relative } from 'path'
import chdir from 'chdir'
import minimatch from 'minimatch'

const globalPath = process.env.MOCHA_PER_FILE_PATH
const pattern = process.env.MOCHA_PER_FILE_PATTERN

const rec = (path = globalPath) => glob.sync('*', { cwd: path })
  .forEach(subpath => {

    const absolutePath = join(path, subpath)
    const relativePath = relative(globalPath, absolutePath)

    if (lstatSync(absolutePath).isDirectory()) {

      global.describe(subpath, () => rec(absolutePath))

    } else if (subpath.endsWith('.test.js') && minimatch(relativePath, pattern)) {
      const testModule = require(resolve(absolutePath))
      const handler = typeof testModule === 'function' ? testModule : testModule.it
      const timeout = typeof testModule === 'function' ? undefined : testModule.timeout
      const only = typeof testModule === 'function' ? false : testModule.only
      const itOrOnly = only ? global.it.only : global.it
      const test = itOrOnly(
        basename(subpath, '.test.js'),
        process.env.MOCHA_PER_FILE_IS_CHDIR === 'true' ? () => chdir(dirname(absolutePath), handler) : handler,
      )
      if (timeout !== undefined) {
        test.timeout(timeout)
      }
    }
  })


rec()

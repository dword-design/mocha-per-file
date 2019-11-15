const glob = require('glob')
const { lstatSync } = require('fs')
const P = require('path')
const chdir = require('chdir')

const rec = async (path = process.env.TEST_FOLDER_NAME) => {
  (glob.sync('*', { cwd: path })).forEach(subpath => {
    const absolutePath = P.join(path, subpath)
    if (lstatSync(absolutePath).isDirectory()) {
      describe(subpath, () => rec(absolutePath))
    } else if (subpath.endsWith('.test.js')) {
      const testModule = require(P.resolve(absolutePath))
      const handler = typeof testModule === 'function' ? testModule : testModule.it
      const timeout = typeof testModule === 'function' ? undefined : testModule.timeout
      const only = typeof testModule === 'function' ? false : testModule.only
      const itOrOnly = only ? it.only : it
      const test = itOrOnly(
        P.basename(subpath, '.test.js'),
        process.env.IS_CHDIR === 'true' ? () => chdir(P.dirname(absolutePath), handler) : handler
      )
      if (timeout !== undefined) {
        test.timeout(timeout)
      }
    }
  })
}

rec()

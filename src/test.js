const glob = require('glob')
const { lstatSync } = require('fs')
const P = require('path')
const chdir = require('chdir')

const rec = async (path = 'test') => {
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
        () => process.env.IS_CHDIR
          ? chdir(P.dirname(absolutePath), handler.length > 0 ? () => new Promise(resolve => handler(resolve)) : handler)
          : handler,

      )
      if (timeout !== undefined) {
        test.timeout(timeout)
      }
    }
  })
}

rec()

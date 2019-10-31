const glob = require('glob')
const { lstatSync } = require('fs')
const P = require('path')

const rec = async (path = 'test') => {
  (glob.sync('*', { cwd: path })).forEach(subpath => {
    const absolutePath = P.join(path, subpath)
    if (lstatSync(absolutePath).isDirectory()) {
      describe(subpath, () => rec(absolutePath))
    } else if (subpath.endsWith('.test.js')) {
      const testModule = require(P.resolve(absolutePath))
      const handler = typeof testModule === 'function' ? testModule : testModule.it
      const timeout = typeof testModule === 'function' ? undefined : testModule.timeout
      const test = it(P.basename(subpath, '.test.js'), handler)
      if (timeout !== undefined) {
        test.timeout(timeout)
      }
    }
  })
}

rec()

const glob = require('glob')
const { lstatSync } = require('fs')
const P = require('path')

const rec = async (path = 'test') => {
  (glob.sync('*', { cwd: path })).forEach(subpath => {
    const absolutePath = P.join(path, subpath)
    if (lstatSync(absolutePath).isDirectory()) {
      describe(subpath, () => rec(absolutePath))
    } else if (subpath.endsWith('.test.js')) {
      it(P.basename(subpath, '.test.js'), require(P.resolve(absolutePath)))
    }
  })
}

rec()

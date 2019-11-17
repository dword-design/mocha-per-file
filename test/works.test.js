import { spawn } from 'child_process'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import resolveBin from 'resolve-bin'
import { endent } from '@functions'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    test: {
      a: {
        'bar.test.js': 'module.exports = () => {}',
        'foo.test.js': endent`
          const expect = require('expect')

          module.exports = () => expect(process.cwd().endsWith('/test/works/test/a')).toBeFalsy()
        `,
      },
      'b/baz.test.js': 'module.exports = () => {}',
    },
  })
  const { stdout } = await spawn(resolveBin.sync('mocha-per-file'), [], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n    ✓ bar\n    ✓ foo\n\n  b\n    ✓ baz\n\n\n  3 passing \(.*?\)\n\n$/)
})

export const timeout = 5000

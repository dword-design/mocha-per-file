import { spawn } from 'child_process'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { endent } from '@functions'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    test: {
      'bar.test.js': 'module.exports = () => {}',
      'foo.test.js': endent`
        module.exports = {
          only: true,
          it: () => {},
        }
      `,
    },
  })
  const { stdout } = await spawn('mocha-per-file', [], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  ✓ foo\n\n  1 passing \(.*?\)\n\n$/)
})

export const timeout = 5000

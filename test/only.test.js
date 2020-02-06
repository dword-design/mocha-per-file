import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'
import { endent } from '@dword-design/functions'

export default () => withLocalTmpDir(__dirname, async () => {
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


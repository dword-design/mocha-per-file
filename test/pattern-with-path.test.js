import { spawn } from 'child-process-promise'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'

export default async () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    'test2/a': {
      'foo.test.js': 'module.exports = () => {}',
      'bar.test.js': 'module.exports = () => {}',
    },
  })
  const { stdout } = await spawn('mocha-per-file', ['--path', 'test2', 'a/foo.test.js'], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n    ✓ foo.*?\n\n\n  1 passing \(.*?\)\n\n$/)
})

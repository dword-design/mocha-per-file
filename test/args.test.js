import { spawn } from 'child_process'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import outputFiles from 'output-files'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFiles({
    'test/foo.test.js': 'module.exports = () => {}',
    'setup.js': 'console.log(\'test\')',
  })
  const { stdout } = await spawn('mocha-per-file', ['--require', 'setup.js'], { capture: ['stdout'] })
  expect(stdout).toMatch(/^test\n\n\n  ✓ foo.*?\n\n  1 passing \(.*?\)\n\n$/)
})

export const timeout = 5000

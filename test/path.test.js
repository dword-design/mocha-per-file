import { spawn } from 'child-process-promise'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import { outputFile } from 'fs-extra'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFile('test2/a/foo.test.js', 'module.exports = () => {}')
  const { stdout } = await spawn('mocha-per-file', ['--path', 'test2'], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n    ✓ foo.*?\n\n\n  1 passing \(.*?\)\n\n$/)
})

export const timeout = 5000

import { spawn } from 'child-process-promise'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import { outputFile } from 'fs-extra'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFile('test/a/foo.test.js', 'module.exports = done => setTimeout(done, 100)')
  const { stdout } = await spawn('mocha-per-file', [], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n    ✓ foo.*?\n\n\n  1 passing \(.*?\)\n\n$/)
})

export const timeout = 5000

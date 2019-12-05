import { spawn } from 'child_process'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import { outputFile } from 'fs'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFile('test/a/foo.test.js', 'module.exports = () => console.log(process.cwd())')
  const { stdout } = await spawn('mocha-per-file', ['--chdir'], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n.*?\/test\/a\n    ✓ foo.*?\n\n\n  1 passing \(.*?\)\n\n$/)
})

export const timeout = 5000

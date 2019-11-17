import { spawn } from 'child_process'
import expect from 'expect'
import withLocalTmpDir from 'with-local-tmp-dir'
import { outputFile } from 'fs'
import resolveBin from 'resolve-bin'

export const it = () => withLocalTmpDir(__dirname, async () => {
  await outputFile('test/a/foo.test.js', 'module.exports = () => console.log(process.cwd())')
  const { stdout } = await spawn(resolveBin.sync('mocha-per-file'), ['--chdir'], { capture: ['stdout'] })
  expect(stdout).toMatch(/^\n\n  a\n.*?cwd\/test\/a\n    ✓ foo.*?\n\n\n  1 passing \(.*?\)\n\n$/)
})

export const timeout = 5000
